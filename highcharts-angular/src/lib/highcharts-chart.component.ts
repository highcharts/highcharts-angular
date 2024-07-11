import type { OnChanges, OnDestroy } from '@angular/core';
import { Component, ElementRef, EventEmitter, Input, Output, NgZone, SimpleChanges } from '@angular/core';
import type * as Highcharts from 'highcharts';
import type HighchartsESM from 'highcharts/es-modules/masters/highcharts.src';

@Component({
  selector: 'highcharts-chart',
  template: ''
})
export class HighchartsChartComponent implements OnDestroy, OnChanges {
  @Input() Highcharts: typeof Highcharts | typeof HighchartsESM;
  @Input() constructorType: string;
  @Input() callbackFunction: Highcharts.ChartCallbackFunction;
  @Input() oneToOne: boolean; // #20
  @Input() runOutsideAngular: boolean; // #75
  @Input() options: Highcharts.Options | HighchartsESM.Options;
  @Input() update: boolean;

  @Output() updateChange = new EventEmitter<boolean>(true);
  @Output() chartInstance = new EventEmitter<Highcharts.Chart | null>(); // #26

  private chart: Highcharts.Chart | null;

  constructor(
    private el: ElementRef,
    private _zone: NgZone // #75
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const update = changes.update?.currentValue;
    if (changes.options || update) {
      this.wrappedUpdateOrCreateChart();
      if (update) {
        this.updateChange.emit(false); // clear the flag after update
      }
    }
  }

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
    if (this.chart?.update) {
      this.chart.update(this.options, true, this.oneToOne || false);
    } else {
      this.chart = this.Highcharts[this.constructorType || 'chart'](
        this.el.nativeElement,
        this.options,
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

      // emit chart instance on destroy
      this.chartInstance.emit(this.chart);
    }
  }
}
