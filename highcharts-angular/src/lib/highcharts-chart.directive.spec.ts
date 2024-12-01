import { TestBed } from '@angular/core/testing';
import { Component, ComponentRef, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { HighchartsChartDirective } from './highcharts-chart.directive';
import { HIGHCHARTS_CONFIG } from './highcharts-chart.token';
import { HighchartsChartService } from './highcharts-chart.service';

@Component({
  template: `<div highcharts-chart [options]="options"></div>`,
  imports: [HighchartsChartDirective],
})
class TestHostComponent {
  options = {};
}

describe('HighchartsChartDirective', () => {
  let debugElement: DebugElement;
  let directive: HighchartsChartDirective;

  beforeEach(() => {
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
            loaderChanges$: of(null),
            load: jasmine.createSpy('load'),
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
    const highchartsChartService = TestBed.inject(HighchartsChartService);
    expect(highchartsChartService.load).toHaveBeenCalledWith({});
  });
});
