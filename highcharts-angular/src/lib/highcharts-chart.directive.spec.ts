/// <reference types="jasmine" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
  let fixture: ComponentFixture<TestHostComponent>;
  let debugElement: DebugElement;
  let directive: HighchartsChartDirective;
  let loadSpy: Spy;
  let chartFactorySpy: Spy;

  beforeEach(() => {
    chartFactorySpy = jasmine.createSpy('chart').and.returnValue({
      destroy: jasmine.createSpy('destroy'),
      renderer: {
        forExport: false,
      },
      update: jasmine.createSpy('update'),
    } as unknown as Partial<Highcharts.Chart>);

    const mockHighcharts = {
      chart: chartFactorySpy,
    } as unknown as typeof Highcharts;

    loadSpy = jasmine.createSpy('load').and.resolveTo(mockHighcharts);

    TestBed.configureTestingModule({
      imports: [TestHostComponent, HighchartsChartDirective],
      providers: [
        {
          provide: HIGHCHARTS_CONFIG,
          useValue: {},
        },
        {
          provide: HighchartsChartService,
          useValue: {
            load: loadSpy,
          },
        },
      ],
    });

    fixture = TestBed.createComponent(TestHostComponent);
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

  it('should create the chart as soon as Highcharts is loaded', async () => {
    expect(chartFactorySpy).not.toHaveBeenCalled();

    await fixture.whenStable();
    fixture.detectChanges();

    expect(chartFactorySpy).toHaveBeenCalled();
  });
});
