/// <reference types="jasmine" />
import { TestBed, fakeAsync, tick, flush, flushMicrotasks } from '@angular/core/testing';
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
    // Reset spy to ensure a clean slate
    chartSpy.calls.reset();

    const multiFixture = TestBed.createComponent(MultiTestHostComponent);
    multiFixture.detectChanges(); // Triggers the effect for 3 charts

    tick(0);
    expect(chartSpy).not.toHaveBeenCalled();

    // The initial delay() resolves for all 3 charts simultaneously.
    // Chart 1 takes the "Fast Path" and renders synchronously.
    // Charts 2 and 3 are pushed to the renderingQueue.
    tick(500);
    expect(chartSpy).toHaveBeenCalledTimes(1);

    // Chart 2 is processed from the queue with a 16ms setTimeout
    tick(16);
    expect(chartSpy).toHaveBeenCalledTimes(2);

    // Chart 3 is processed from the queue with a 16ms setTimeout
    tick(16);
    expect(chartSpy).toHaveBeenCalledTimes(3);

    flush(); // Clear out any remaining asynchronous tasks
  }));
});
