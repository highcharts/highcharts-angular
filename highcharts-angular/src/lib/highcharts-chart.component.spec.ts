import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type Highcharts from 'highcharts/esm/highcharts';
import { HighchartsChartComponent } from './highcharts-chart.component';
import { HighchartsChartService } from './highcharts-chart.service';
import { provideHighcharts, providePartialHighcharts } from './highcharts-chart.provider';
import { ModuleFactoryFunction } from './types';

/**
 * Minimal host component to attach per-test module providers via TestBed.overrideComponent.
 * We keep it simple to focus on DI and async loading behavior.
 */
@Component({
  selector: 'highcharts-test',
  template: `<highcharts-chart [options]="{}" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HighchartsChartComponent],
  standalone: true,
})
class TestComponent {}

describe('TestComponent / HighchartsChartService (load module)', () => {
  beforeEach(async () => {
    // 1) Register the standalone host + core Highcharts provider.
    //    - provideHighcharts(): should wire up HIGHCHARTS_LOADER, etc., so the service can load core Highcharts.
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideHighcharts({ timeout: 1 })],
    }).compileComponents();
  });

  it('resolves HighchartsChartService from the component injector', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    // 2) Resolve the service from the component’s injector to honor component-level provider overrides.
    const service = fixture.debugElement.injector.get(HighchartsChartService);
    expect(service).toBeTruthy();
  });

  // ---------------------------------------------------------------------------
  // Parameterized checks for different Highcharts modules.
  //
  // For each case, we:
  //  - override the component’s providers to supply the module list
  //  - create the fixture (activates providers)
  //  - wait for the microtasks/imports to settle (fixture.whenStable)
  //  - assert that the Highcharts instance contains the expected augmented APIs
  // ---------------------------------------------------------------------------

  type Case = {
    title: string;
    modules: ModuleFactoryFunction;
    assert(hc: any): void;
    timeout?: number;
  };

  const CASES: Case[] = [
    {
      title: 'map → exposes Highcharts.MapChart',
      modules: () => [import('highcharts/esm/modules/map')],
      assert: (hc: typeof Highcharts) => {
        expect(hc.MapChart).toBeDefined();
        expect(typeof hc.MapChart).toBe('function');
      },
    },
    {
      title: 'tilemap → exposes Highcharts.seriesTypes.tilemap',
      modules: () => [import('highcharts/esm/modules/tilemap')],
      assert: hc => {
        expect(hc.seriesTypes?.tilemap).toBeDefined();
      },
    },
    {
      title: 'highcharts-more → exposes arearange series + dumbbell → exposes Highcharts.seriesTypes.dumbbell',
      modules: () => [import('highcharts/esm/highcharts-more').then(() => import('highcharts/esm/modules/dumbbell'))],
      assert: hc => {
        expect(hc.seriesTypes?.arearange).toBeDefined();
        expect(hc.seriesTypes?.dumbbell).toBeDefined();
      },
    },
    {
      title: 'pattern-fill → adds SVGRenderer.addPattern',
      modules: () => [import('highcharts/esm/modules/pattern-fill')],
      assert: hc => {
        // pattern-fill augments the renderer with addPattern utility
        expect(typeof hc.SVGRenderer?.prototype?.addPattern).toBe('function');
      },
    },
    {
      title: 'gantt → exposes Highcharts.ganttChart or Highcharts.GanttChart',
      modules: () => [import('highcharts/esm/modules/gantt')],
      assert: hc => {
        // Some versions expose both; at least one must exist.
        const ok = typeof hc.ganttChart === 'function' || typeof hc.GanttChart === 'function';
        expect(ok).toBeTrue();
      },
    },
  ];

  for (const c of CASES) {
    it(`attaches expected API when module is provided: ${c.title}`, async () => {
      // 3) Provide the module(s) at the component level. This mirrors your real component’s
      //    `providers: [providePartialHighcharts({ modules: () => [...] })]`.
      TestBed.overrideComponent(TestComponent, {
        set: { providers: [providePartialHighcharts({ modules: c.modules, timeout: c.timeout })] },
      });

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      // 4) Get the service from this component’s injector scope
      const service = fixture.debugElement.injector.get(HighchartsChartService);
      expect(service).toBeTruthy();

      // 5) Wait for all async work to stabilize:
      //    - dynamic imports for modules
      //    - the service’s microtasks and internal timers (your working test already relies on whenStable)
      await fixture.whenStable();

      // 6) Read the Highcharts instance from the signal
      const hc = service.highcharts();
      expect(hc).toBeTruthy();

      // 7) Case-specific assertions for the module’s side effects
      c.assert(hc);
    });
  }

  it('can load multiple modules together (map + tilemap + more + dumbbell + pattern-fill + gantt)', async () => {
    TestBed.overrideComponent(TestComponent, {
      set: {
        providers: [
          providePartialHighcharts({
            modules: () => [
              import('highcharts/esm/modules/map').then(() => import('highcharts/esm/modules/tilemap')),
              import('highcharts/esm/modules/gantt'),
              import('highcharts/esm/highcharts-more').then(() => import('highcharts/esm/modules/dumbbell')),
              import('highcharts/esm/modules/pattern-fill'),
            ],
          }),
        ],
      },
    });

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const service = fixture.debugElement.injector.get(HighchartsChartService);
    expect(service).toBeTruthy();

    await fixture.whenStable();

    const hc: any = service.highcharts();
    expect(hc).toBeTruthy();

    // Consolidated assertions (quick smoke for “all together”)
    expect(typeof hc.MapChart).toBe('function'); // map
    expect(hc.seriesTypes?.tilemap).toBeDefined(); // tilemap
    expect(hc.seriesTypes?.arearange).toBeDefined(); // highcharts-more
    expect(hc.seriesTypes?.dumbbell).toBeDefined(); // dumbbell
    expect(typeof hc.SVGRenderer?.prototype?.addPattern).toBe('function'); // pattern-fill
    expect(typeof hc.ganttChart === 'function' || typeof hc.GanttChart === 'function').toBeTrue(); // gantt
  });
});
