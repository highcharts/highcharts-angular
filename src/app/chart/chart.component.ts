declare var require: any

import { Component, Input } from '@angular/core';

import * as Highcharts from 'highcharts/highstock';
require('highcharts/modules/map')(Highcharts);

@Component({
  selector: 'app-chart',
  template: '<div [id]="hcChart.hcOptions.chart.renderTo">Chart placeholder</div>'
})
export class ChartComponent {
  @Input() hcChart: any;

  chart: any;
  
  ngAfterViewInit() {
    // store in window for reference
    Highcharts.win.Highcharts = Highcharts;

    this.chart = Highcharts[this.hcChart.hcConstructor || 'chart'](
      this.hcChart.hcOptions,
      this.hcChart.hcCallback || null
    );
  }

  // big change is found
  ngOnChanges(SimpleChanges) {
     // a first change is on init
    if (SimpleChanges.hcChart && !SimpleChanges.hcChart.firstChange) {
      this.chart.update(this.hcChart.hcOptions);
    }
  }

  // small change needs to be triggered manually
  ngDoCheck() {
    if (this.hcChart.update) {
      this.hcChart.update = false;
      this.chart.update(this.hcChart.hcOptions);
    }
  }
}
