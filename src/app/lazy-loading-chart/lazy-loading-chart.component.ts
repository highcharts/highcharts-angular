import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_stock from 'highcharts/modules/stock';
import { AppleDataService } from '../apple-data.service'
import $ from 'jquery';
import { Observable } from 'rxjs';

HC_stock(Highcharts);

@Component({
  selector: 'app-lazy-loading-chart',
  templateUrl: './lazy-loading-chart.component.html',
  styleUrls: ['./lazy-loading-chart.component.css']
})
export class LazyLoadingChartComponent {

  constructor(private appleDataService: AppleDataService) { }

  Highcharts: typeof Highcharts = Highcharts;

  chartRef: Highcharts.Chart;

  chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    this.chartRef = chart;
  };

  fetchData(): Observable<Object> {
    return this.appleDataService.fetchData();
  }

  fetchSqlData(min: number, max: number): Observable<Object> {
    return this.appleDataService.fetchSqlData(min, max);
  }

  chartLazyLoading: Highcharts.Options = {
    chart: {
      type: 'candlestick',
      zoomType: 'x',
      events: {
        load: () => {
          const chart = this.chartRef;
          const data = this.fetchData()
            .subscribe((data: Array<[]>) => {
              // Add a null value for the end date
              const chartData = [...data, [Date.UTC(2011, 9, 14, 19, 59), null, null, null, null]];

              chart.addSeries({
                type: 'candlestick',
                data: chartData,
                dataGrouping: {
                  enabled: false
                }
              }, false);

              chart.update({
                navigator: {
                  series: {
                    data: chartData
                  }
                }
              });
            });
        }
      }
    },

    navigator: {
      adaptToUpdatedData: false
    },

    scrollbar: {
      liveRedraw: false
    },

    title: {
      text: 'AAPL history by the minute from 1998 to 2011'
    },

    subtitle: {
      text: 'Displaying 1.7 million data points in Highcharts Stock by async server loading'
    },

    rangeSelector: {
      buttons: [{
        type: 'hour',
        count: 1,
        text: '1h'
      }, {
        type: 'day',
        count: 1,
        text: '1d'
      }, {
        type: 'month',
        count: 1,
        text: '1m'
      }, {
        type: 'year',
        count: 1,
        text: '1y'
      }, {
        type: 'all',
        text: 'All'
      }],
      inputEnabled: false, // it supports only days
      selected: 4 // all
    },

    xAxis: {
      events: {
        afterSetExtremes: (event) => {
          const chart = this.chartRef;

          chart.showLoading('Loading data from server...');

          // Load new data depending on the selected min and max
          this.fetchSqlData(event.min, event.max).subscribe((data: Array<[]>) => {
            chart.series[0].setData(data);
            chart.hideLoading();
          })
        }
      },
      minRange: 3600 * 1000 // one hour
    },

    yAxis: {
      floor: 0
    }
  };

}
