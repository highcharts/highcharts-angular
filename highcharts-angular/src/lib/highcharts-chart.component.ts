import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, NgZone } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'highcharts-chart',
  template: ''
})
export class HighchartsChartComponent implements OnDestroy {
  @Input() Highcharts: typeof Highcharts;
  @Input() constructorType: string;
  @Input() callbackFunction: Highcharts.ChartCallbackFunction;
  @Input() oneToOne: boolean; // #20
  @Input() runOutsideAngular: boolean; // #75

  @Input() set options(val: Highcharts.Options) {
    this.optionsValue = val;
    this.wrappedUpdateOrCreateChart();
  }
  @Input() set update(val: boolean) {
    if (val) {
      this.wrappedUpdateOrCreateChart();
      this.updateChange.emit(false); // clear the flag after update
    }
  }

  @Output() updateChange = new EventEmitter<boolean>(true);
  @Output() chartInstance = new EventEmitter<Highcharts.Chart>(); // #26

  private chart: Highcharts.Chart;
  private optionsValue: Highcharts.Options;

  constructor(
    private el: ElementRef,
    private _zone: NgZone // #75
  ) {}

  wrappedUpdateOrCreateChart() { // #75
    if (this.runOutsideAngular) {
      this._zone.runOutsideAngular(() => {
        this.updateOrCreateChart()
      });
    } else {
      this.updateOrCreateChart();
    }
  }

  updateOrCreateChart() {
    if (this.chart && this.chart.update) {
      this.chart.update(this.optionsValue, true, this.oneToOne || false);
    } else {
      this.chart = (this.Highcharts as any)[this.constructorType || 'chart'](
        this.el.nativeElement,
        this.optionsValue,
        this.callbackFunction || null
      );

      // emit chart instance on init
      this.chartInstance.emit(this.chart);
    }
  }

  ngOnDestroy() { // #44
    if (this.chart) {  // #56
      this.chart.destroy();
      this.chart = null;
    }
  }
}
