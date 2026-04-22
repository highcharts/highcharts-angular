/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HighchartsChartDirective } from './highcharts-chart.directive';
import { HIGHCHARTS_CONFIG } from './highcharts-chart.token';
import { HighchartsChartService } from './highcharts-chart.service';
import Spy = jasmine.Spy;
import type Highcharts from 'highcharts/esm/highcharts';

@Component({
  selector: 'highcharts-test-host',
  template: ` <div highchartsChart [options]="options"></div>`,
  imports: [HighchartsChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestHostComponent {
  public options: Highcharts.Options = {};
}

// Added to test batch rendering logic perfectly
@Component({
  selector: 'highcharts-multi-test-host',
  template: `
    <div highchartsChart [options]="options"></div>
    <div highchartsChart [options]="options"></div>
    <div highchartsChart [options]="options"></div>
  `,
  imports: [HighchartsChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class MultiTestHostComponent {
  public options: Highcharts.Options = {};
}

describe('HighchartsChartDirective', () => {
  let debugElement: DebugElement;
  let directive: HighchartsChartDirective;
  let loadSpy: Spy;
  let chartSpy: Spy;

  beforeEach(() => {
    loadSpy = jasmine.createSpy('load');
    chartSpy = jasmine.createSpy('chart').and.returnValue({
      renderer: { forExport: false },
      destroy: jasmine.createSpy('destroy'),
      update: jasmine.createSpy('update'),
    });

    TestBed.configureTestingModule({
      imports: [TestHostComponent, MultiTestHostComponent, HighchartsChartDirective],
      providers: [
        {
          provide: HIGHCHARTS_CONFIG,
          useValue: { timeout: 500 },
        },
        {
          provide: HighchartsChartService,
          useValue: {
            load: loadSpy,
            highcharts: () => ({ chart: chartSpy }),
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.directive(HighchartsChartDirective));
    directive = debugElement.injector.get(HighchartsChartDirective);
  });

  it('should create the directive', () => {
    expect(directive).toBeTruthy();
  });

  it('should initialize with default constructorType as "chart"', () => {
    expect(directive.constructorType()).toBe('chart');
  });

  it('should load global config on initialization', () => {
    expect(loadSpy).toHaveBeenCalledWith({ timeout: 500 });
  });

  it('should stagger multiple chart initializations via setTimeout to prevent main thread blocking', () => {
    // eslint-disable-next-line no-restricted-globals
    const setTimeoutSpy = spyOn(window, 'setTimeout').and.callThrough();

    // Create a multi-chart host so they batch in the exact same synchronous execution
    const multiFixture = TestBed.createComponent(MultiTestHostComponent);
    multiFixture.detectChanges();

    const allTimeouts = setTimeoutSpy.calls.allArgs().map(args => args[1]);
    const chartDelays = allTimeouts.filter(ms => typeof ms === 'number' && ms >= 500);

    // 3 charts in the component should get staggering of +0, +16, and +32ms
    expect(chartDelays).toContain(500);
    expect(chartDelays).toContain(516);
    expect(chartDelays).toContain(532);
  });
});
