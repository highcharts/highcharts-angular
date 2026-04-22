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

describe('HighchartsChartDirective', () => {
  let debugElement: DebugElement;
  let directive: HighchartsChartDirective;
  let loadSpy: Spy;

  beforeEach(() => {
    loadSpy = jasmine.createSpy('load');
    TestBed.configureTestingModule({
      imports: [TestHostComponent, HighchartsChartDirective],
      providers: [
        {
          provide: HIGHCHARTS_CONFIG,
          useValue: { timeout: 500 }, // Ensure a predictable 500ms timeout for tests
        },
        {
          provide: HighchartsChartService,
          useValue: {
            load: loadSpy,
            highcharts: () => null,
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges(); // Triggers the first chart rendering
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
    // Spy on the global setTimeout function to see what delays the directive is requesting
    // eslint-disable-next-line no-restricted-globals
    const setTimeoutSpy = spyOn(window, 'setTimeout').and.callThrough();

    // Create two MORE charts rapidly (simulating a complex dashboard)
    const fixture2 = TestBed.createComponent(TestHostComponent);
    const fixture3 = TestBed.createComponent(TestHostComponent);

    // Trigger their effects synchronously
    fixture2.detectChanges();
    fixture3.detectChanges();

    // Look at all the milliseconds passed to setTimeout during those detectChanges
    const allTimeouts = setTimeoutSpy.calls.allArgs().map(args => args[1]);

    // Filter out the 0ms resets, we only care about the actual chart delays (>= 500)
    const chartDelays = allTimeouts.filter(ms => typeof ms === 'number' && ms >= 500);

    // Because the `beforeEach` chart finished in a previous event loop, the stagger count reset.
    // Therefore, fixture2 gets 500ms, and fixture3 gets staggered by 16ms (516ms)!
    expect(chartDelays).toContain(500);
    expect(chartDelays).toContain(516);
  });
});
