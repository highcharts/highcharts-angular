import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import type Highcharts from 'highcharts/esm/highcharts';
import { AppleDataService } from '../apple-data.service';
import { Observable } from 'rxjs';
import { HighchartsChartComponent, providePartialHighcharts } from 'highcharts-angular';

type ExtendedPlotCandlestickDataGroupingOptions = {
  enabled: boolean;
} & Highcharts.DataGroupingOptionsObject;

@Component({
  selector: 'app-lazy-loading-chart',
  templateUrl: './lazy-loading-chart.component.html',
  styleUrl: './lazy-loading-chart.component.css',
  imports: [HighchartsChartComponent],
  providers: [
    providePartialHighcharts({
      modules: () => [import('highcharts/esm/modules/stock')],
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyLoadingChartComponent {
  private readonly appleDataService = inject(AppleDataService);

  private chartRef: Highcharts.Chart | null = null;

  public chartInstance(chart: Highcharts.Chart): void {
    this.chartRef = chart;
  }

  private fetchData(): Observable<[][]> {
    return this.appleDataService.fetchData();
  }

  private fetchSqlData(min: number, max: number): Observable<[][]> {
    return this.appleDataService.fetchSqlData(min, max);
  }

  public chartLazyLoading: Highcharts.Options = {
    chart: {
      type: 'candlestick',
      zooming: {
        type: 'x',
      },
      events: {
        load: () => {
          const chart = this.chartRef;
          this.fetchData().subscribe(data => {
            if (!chart) {
              return;
            }

            // Add a null value for the end date
            const chartData = [...data, [Date.UTC(2011, 9, 14, 19, 59), null, null, null, null]];

            chart.addSeries(
              {
                type: 'candlestick',
                data: chartData,
                dataGrouping: {
                  enabled: false,
                } as ExtendedPlotCandlestickDataGroupingOptions,
              },
              false,
            );

            chart.update({
              navigator: {
                series: {
                  data: chartData,
                },
              },
            });
          });
        },
      },
    },

    navigator: {
      adaptToUpdatedData: false,
    },

    scrollbar: {
      liveRedraw: false,
    },

    title: {
      text: 'AAPL history by the minute from 1998 to 2011',
    },

    subtitle: {
      text: 'Displaying 1.7 million data points in Highcharts Stock by async server loading',
    },

    rangeSelector: {
      buttons: [
        {
          type: 'hour',
          count: 1,
          text: '1h',
        },
        {
          type: 'day',
          count: 1,
          text: '1d',
        },
        {
          type: 'month',
          count: 1,
          text: '1m',
        },
        {
          type: 'year',
          count: 1,
          text: '1y',
        },
        {
          type: 'all',
          text: 'All',
        },
      ],
      inputEnabled: false, // it supports only days
      selected: 4, // all
    },

    xAxis: {
      events: {
        afterSetExtremes: event => {
          const chart = this.chartRef;
          if (!chart) {
            return;
          }

          chart.showLoading('Loading data from server...');

          // Load new data depending on the selected min and max
          this.fetchSqlData(event.min, event.max).subscribe(data => {
            chart.series[0].setData(data);
            chart.hideLoading();
          });
        },
      },
      minRange: 3600 * 1000, // one hour
    },

    yAxis: {
      floor: 0,
    },
  };
}
