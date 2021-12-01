import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';

interface ExtendedSeriesCandlestickOptions extends Highcharts.SeriesCandlestickOptions {
  color: Highcharts.ColorType;
}

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
    (this.chartOptions.series[0] as ExtendedSeriesCandlestickOptions).color = 'hotpink';
    this.updateFlag = true;
  }
}
