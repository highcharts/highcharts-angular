import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HighchartsChartDirective } from './highcharts-chart.directive';
import { HighchartsChartService } from './highcharts-chart.service';
import {
  HIGHCHARTS_CONFIG,
  HIGHCHARTS_LOADER,
  HIGHCHARTS_OPTIONS,
  HIGHCHARTS_ROOT_MODULES,
} from './highcharts-chart.token';
import { InstanceFactoryFunction, ModuleFactoryFunction } from './types';
import Spy = jasmine.Spy;
import type Highcharts from 'highcharts/esm/highcharts';

/**
 * Scaling guard for the #437 performance fix.
 *
 * The regression was structural — the library was loaded and initialized per
 * chart instead of once — so this test renders N charts against the real
 * {@link HighchartsChartService} and asserts that shared initialization stays
 * O(1) (loader, global modules and setOptions each run exactly once) while
 * per-chart work stays O(N) (one factory call per chart, no redundant
 * re-creations). It fails loudly if per-chart loading or a fixed delay is
 * reintroduced.
 */
@Component({
  selector: 'highcharts-perf-host',
  template: `
    @for (i of charts(); track i) {
      <div highchartsChart [options]="{}"></div>
    }
  `,
  imports: [HighchartsChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class PerfHostComponent {
  public readonly count = input(0);
  protected readonly charts = (): number[] => Array.from({ length: this.count() }, (_, i) => i);
}

describe('HighchartsChartDirective performance scaling', () => {
  let fixture: ComponentFixture<PerfHostComponent>;
  let loaderSpy: Spy<InstanceFactoryFunction>;
  let globalModulesSpy: Spy<ModuleFactoryFunction>;
  let setOptionsSpy: Spy;
  let chartFactorySpy: Spy;

  async function renderCharts(count: number): Promise<void> {
    fixture.componentRef.setInput('count', count);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(() => {
    setOptionsSpy = jasmine.createSpy('setOptions');
    chartFactorySpy = jasmine.createSpy('chart').and.callFake(
      () =>
        ({
          destroy: jasmine.createSpy('destroy'),
          renderer: { forExport: false },
          update: jasmine.createSpy('update'),
        }) as unknown as Highcharts.Chart,
    );

    const mockHighcharts = {
      chart: chartFactorySpy,
      setOptions: setOptionsSpy,
    } as unknown as typeof Highcharts;

    loaderSpy = jasmine.createSpy<InstanceFactoryFunction>('loader').and.resolveTo(mockHighcharts);
    globalModulesSpy = jasmine.createSpy<ModuleFactoryFunction>('globalModules').and.returnValue([]);

    TestBed.configureTestingModule({
      imports: [PerfHostComponent, HighchartsChartDirective],
      providers: [
        HighchartsChartService,
        { provide: HIGHCHARTS_LOADER, useValue: loaderSpy },
        { provide: HIGHCHARTS_ROOT_MODULES, useValue: globalModulesSpy },
        { provide: HIGHCHARTS_OPTIONS, useValue: { lang: { thousandsSep: ',' } } },
        { provide: HIGHCHARTS_CONFIG, useValue: {} },
      ],
    });

    fixture = TestBed.createComponent(PerfHostComponent);
  });

  it('shares Highcharts initialization across many charts (init once, one factory call per chart)', async () => {
    const chartCount = 25;

    await renderCharts(chartCount);

    // Shared initialization must not scale with the number of charts.
    expect(loaderSpy).toHaveBeenCalledTimes(1);
    expect(globalModulesSpy).toHaveBeenCalledTimes(1);
    expect(setOptionsSpy).toHaveBeenCalledTimes(1);

    // Per-chart work scales linearly: exactly one factory call per chart.
    expect(chartFactorySpy).toHaveBeenCalledTimes(chartCount);
  });

  it('keeps shared initialization constant as the chart count grows', async () => {
    await renderCharts(5);
    await renderCharts(40);

    // Adding more charts does not re-run the one-time shared setup...
    expect(loaderSpy).toHaveBeenCalledTimes(1);
    expect(globalModulesSpy).toHaveBeenCalledTimes(1);
    expect(setOptionsSpy).toHaveBeenCalledTimes(1);

    // ...and the original 5 charts are reused rather than recreated, so the
    // factory runs once per distinct chart (40), not once per render pass (45).
    expect(chartFactorySpy).toHaveBeenCalledTimes(40);
  });
});
