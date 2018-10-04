import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, NgZone } from '@angular/core';

@Component({
  selector: 'highcharts-chart',
  template: ''
})
export class HighchartsChartComponent implements OnDestroy {
  @Input() Highcharts: any;
  @Input() constructorType: string;
  @Input() callbackFunction: any;
  @Input() oneToOne: boolean; // #20
  @Input() runOutsideAngular: boolean; // #75

  @Input() set options(val: any) {
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
  @Output() chartInstance = new EventEmitter<any>(); // #26

  private chart: any;
  private optionsValue: any;

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
      this.chart = this.Highcharts[this.constructorType || 'chart'](
        this.el.nativeElement,
        this.optionsValue,
        this.callbackFunction || null
      );
      this.optionsValue.series = this.chart.userOptions.series;

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
