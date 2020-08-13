import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-line-test',
  templateUrl: './line-test.component.html',
  styleUrls: ['./line-test.component.css']
})
export class LineTestComponent {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;

  chartOptions: Highcharts.Options = {
    series: [
      {
        type: 'line',
        data: [1, 2, 3]
      }
    ]
  };

  updateSeriesColor() {
    this.chartOptions.series[0].color = 'hotpink';
    this.updateFlag = true;
  }
}
