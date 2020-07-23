import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_stock from 'highcharts/modules/stock';
import HC_customEvents from 'highcharts-custom-events';

HC_stock(Highcharts);
HC_customEvents(Highcharts);


// Alternative way of a plugin loading:
// const HC_ce = require('highcharts-custom-events');
// HC_ce(Highcharts);

@Component({
  selector: 'app-stock-chart',
  templateUrl: './stock-chart.component.html',
  styleUrls: ['./stock-chart.component.css']
})
export class StockChartComponent {

  Highcharts: typeof Highcharts = Highcharts;

  // starting values
  updateDemo2: boolean = false;
  usedIndex: number = 0;
  chartTitle: string = 'My chart'; // for init - change through titleChange

  // change in all places
  titleChange(event: any) {
    var v = event;
    this.chartTitle = v;

    this.charts.forEach((el) => {
      el.hcOptions.title.text = v;
    });

    // trigger ngOnChanges
    this.updateDemo2 = true;
  };

  charts = [{
    hcOptions: {
      title: { text: this.chartTitle },
      subtitle: { text: '1st data set' },
      plotOptions: {
        series: {
           pointStart: Date.now(),
           pointInterval: 86400000 // 1 day
        }
      },
      series: [{
        type: 'line',
        data: [11, 2, 3],
        threshold: 5,
        negativeColor: 'red',
        events: {
          dblclick: function () {
            console.log('dblclick - thanks to the Custom Events plugin');
          }
        }
      }, {
        type: 'candlestick',

        data: [
          [0, 15, -6, 7],
          [7, 12, -1, 3],
          [3, 10, -3, 3]
        ]
      }]
    } as Highcharts.Options,
    hcCallback: (chart: Highcharts.Chart) => {
      console.log('some variables: ', Highcharts, chart, this.charts);
    }
  }, {
    hcOptions: {
      title: { text: this.chartTitle },
      subtitle: { text: '2nd data set' },
      series: [{
        type: 'column',
        data: [4, 3, -12],
        threshold: -10
      }, {
        type: 'ohlc',
        data: [
          [0, 15, -6, 7],
          [7, 12, -1, 3],
          [3, 10, -3, 3]
        ]
      }]
    } as Highcharts.Options,
    hcCallback: () => {}
  }, {
    hcOptions: {
      title: { text: this.chartTitle },
      subtitle: { text: '3rd data set' },
      series: [{
        type: 'scatter',
        data: [1, 2, 3, 4, 5]
      }, {
        type: 'areaspline',
        data: [
          5,
          11,
          3,
          6,
          0
        ]
      }]
    } as Highcharts.Options,
    hcCallback: () => {}
  }];


}
