import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_stock from 'highcharts/modules/stock';
import $ from 'jquery';

HC_stock(Highcharts);

@Component({
  selector: 'app-lazy-loading-chart',
  templateUrl: './lazy-loading-chart.component.html',
  styleUrls: ['./lazy-loading-chart.component.css']
})
export class LazyLoadingChartComponent {

  Highcharts: typeof Highcharts = Highcharts;

  chartLazyLoading: Highcharts.Options = {
    chart: {
      type: 'candlestick',
      zoomType: 'x',
      events: {
        load: function() {
          var chart = this;

          $.getJSON('https://www.highcharts.com/samples/data/from-sql.php?callback=?', function(data) {
            // Add a null value for the end date
            data = [].concat(data, [
              [Date.UTC(2011, 9, 14, 19, 59), null, null, null, null]
            ]);

            chart.addSeries({
              data: data,
              dataGrouping: {
                enabled: false
              }
            } as Highcharts.SeriesOptionsType, false);

            chart.update({
              navigator: {
                series: {
                  data: data
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
        afterSetExtremes: function(e) {
          var chart = this.chart;
          /**
           * Load new data depending on the selected min and max
           */
          chart.showLoading('Loading data from server...');
          $.getJSON('https://www.highcharts.com/samples/data/from-sql.php?start=' + Math.round(e.min) +
            '&end=' + Math.round(e.max) + '&callback=?',
            function(data) {
              chart.series[0].setData(data);
              chart.hideLoading();
            });
        }
      },
      minRange: 3600 * 1000 // one hour
    },

    yAxis: {
      floor: 0
    }
  };

}
