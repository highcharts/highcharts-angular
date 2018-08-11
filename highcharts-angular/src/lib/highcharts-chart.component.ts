import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

@Component({
  selector: 'highcharts-chart',
  template: ''
})
export class HighchartsChartComponent implements OnDestroy {
  @Input() Highcharts: any;
  @Input() constructorType: string;
  @Input() callbackFunction: any;
  @Input() set options(val: any) {
    this.optionsValue = val;
    this.updateOrCreateChart();
  }
  @Input() set update(val: boolean) {
    if (val) {
      this.updateOrCreateChart();
      this.updateChange.emit(false); // clear the flag after update
    }
  }
  @Input() oneToOne: boolean; // #20

  @Output() updateChange = new EventEmitter<boolean>(true);

  private chart: any;
  private optionsValue: any;

  constructor(
    private el: ElementRef
  ) {}

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
    }
  }

  ngOnDestroy() { // #44
    if (this.chart) {  // #56
      this.chart.destroy();
      this.chart = null;
    }
  }
}
