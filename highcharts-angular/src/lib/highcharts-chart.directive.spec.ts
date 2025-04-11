import {TestBed} from '@angular/core/testing';
import {ChangeDetectionStrategy, Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {HighchartsChartDirective} from './highcharts-chart.directive';
import {HIGHCHARTS_CONFIG} from './highcharts-chart.token';
import {HighchartsChartService} from './highcharts-chart.service';
import type {Chart} from './types';
import Spy = jasmine.Spy;

@Component({
  selector: 'highcharts-test-host',
  template: `
    <div highchartsChart [options]="options"></div>`,
  imports: [HighchartsChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestHostComponent {
  public options: Chart['options'] = {};
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
          useValue: {}
        },
        {
          provide: HighchartsChartService,
          useValue: {
            load: loadSpy,
            highcharts: () => null,
          }
        }
      ]
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
    expect(loadSpy).toHaveBeenCalledWith({});
  });
});
