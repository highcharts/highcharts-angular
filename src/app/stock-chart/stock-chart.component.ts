import {ChangeDetectionStrategy, Component} from '@angular/core';
import type Highcharts from 'highcharts/esm/highcharts';
import {FormsModule} from '@angular/forms';
import {HighchartsChartComponent, providePartialHighcharts} from 'highcharts-angular';


@Component({
  selector: 'app-stock-chart',
  templateUrl: './stock-chart.component.html',
  styleUrl: './stock-chart.component.css',
  imports: [FormsModule, HighchartsChartComponent],
  providers: [
    providePartialHighcharts({
      modules: () => [
        import('highcharts/esm/modules/stock'),
      ]
    })
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockChartComponent {

  // starting values
  public updateDemo2 = false;
  public usedIndex = 0;
  public chartTitle = 'My chart'; // for init - change through titleChange

  // change in all places
  public titleChange(event: string): void {
    const v = event;
    this.chartTitle = v;

    this.charts.forEach((el) => {
      el.title!.text = v;
    });

    // trigger ngOnChanges
    this.updateDemo2 = true;
  };

  public charts: Highcharts.Options[] = [{
    title: {text: this.chartTitle},
    subtitle: {text: '1st data set'},
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
    }, {
      type: 'candlestick',

      data: [
        [0, 15, -6, 7],
        [7, 12, -1, 3],
        [3, 10, -3, 3]
      ]
    }]
  }, {
    title: {text: this.chartTitle},
    subtitle: {text: '2nd data set'},
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
  }, {
    title: {text: this.chartTitle},
    subtitle: {text: '3rd data set'},
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
  }];

  public chartInstance(chart: Highcharts.Chart | null): void {
    console.log('some variables: ', chart, this.charts);
  }

}
