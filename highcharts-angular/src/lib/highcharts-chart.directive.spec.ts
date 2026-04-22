/// <reference types="jasmine" />
import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
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

// Added to simulate the #437 performance issue scenario
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
  let mockHighcharts: any;

  beforeEach(() => {
    loadSpy = jasmine.createSpy('load');

    // Mock the chart factory to return a dummy chart instance
    chartSpy = jasmine.createSpy('chart').and.returnValue({
      renderer: { forExport: false },
      destroy: jasmine.createSpy('destroy'),
      update: jasmine.createSpy('update'),
    });

    mockHighcharts = {
      chart: chartSpy,
    };

    TestBed.configureTestingModule({
      imports: [TestHostComponent, MultiTestHostComponent, HighchartsChartDirective],
      providers: [
        {
          provide: HIGHCHARTS_CONFIG,
          useValue: { timeout: 500 }, // Explicitly set the timeout for predictable ticking
        },
        {
          provide: HighchartsChartService,
          useValue: {
            load: loadSpy,
            // Return our mocked Highcharts object instead of null
            highcharts: () => mockHighcharts,
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
    expect(loadSpy).toHaveBeenCalled();
  });

  it('should stagger multiple chart initializations to prevent main thread blocking', fakeAsync(() => {
    const multiFixture = TestBed.createComponent(MultiTestHostComponent);
    multiFixture.detectChanges(); // Triggers initialization for 3 charts synchronously

    expect(chartSpy).not.toHaveBeenCalled();

    // First chart renders at baseTimeout (500ms) + 0ms stagger
    tick(500);
    expect(chartSpy).toHaveBeenCalledTimes(1);

    // Second chart renders 16ms later
    tick(16);
    expect(chartSpy).toHaveBeenCalledTimes(2);

    // Third chart renders another 16ms later
    tick(16);
    expect(chartSpy).toHaveBeenCalledTimes(3);

    flush(); // Clear out any remaining tasks
  }));
});
