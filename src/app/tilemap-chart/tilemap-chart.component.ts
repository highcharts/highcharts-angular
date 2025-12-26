import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HighchartsChartComponent, providePartialHighcharts, ChartConstructorType } from '@highcharts-angular';

@Component({
  selector: 'app-tilemap-chart',
  imports: [HighchartsChartComponent],
  templateUrl: './tilemap-chart.component.html',
  styleUrl: './tilemap-chart.component.css',
  providers: [
    providePartialHighcharts({
      modules: () => [import('highcharts/esm/modules/map'), import('highcharts/esm/modules/tilemap')],
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TilemapChartComponent {
  public get chartOptions(): Highcharts.Options {
    return {
      chart: {
        type: 'tilemap',
        inverted: true,
        height: '80%',
      },
      title: {
        text: 'My Title',
      },
      xAxis: {
        visible: false,
      },
      yAxis: {
        visible: false,
      },
      colorAxis: {
        dataClasses: [
          {
            from: 0,
            to: 1000000,
            color: '#3b528b',
            name: '< 1M',
          },
          {
            from: 1000000,
            to: 5000000,
            color: '#21918c',
            name: '1M - 5M',
          },
          {
            from: 5000000,
            to: 20000000,
            color: '#5ec962',
            name: '5M - 20M',
          },
          {
            from: 20000000,
            color: '#fde725',
            name: '> 20M',
          },
        ],
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        headerFormat: '',
        pointFormat: 'Population de <b>{point.name}</b>: <b>{point.value}</b>',
      },
      plotOptions: {
        tilemap: {
          tileShape: 'hexagon',
          dataLabels: {
            enabled: true,
            format: '{point.hc-a2}',
            style: {
              textOutline: 'none',
            },
          },
        },
      },
      series: [
        {
          type: 'tilemap',
          name: 'Population',
          data: this.getTilemapData(),
        },
      ],
    };
  }

  private getTilemapData(): any[] {
    return [
      { 'hc-a2': 'CA', name: 'California', x: 5, y: 2, value: 38965193 },
      { 'hc-a2': 'TX', name: 'Texas', x: 7, y: 4, value: 30503301 },
      { 'hc-a2': 'FL', name: 'Florida', x: 8, y: 8, value: 22610726 },
      { 'hc-a2': 'NY', name: 'New York', x: 2, y: 9, value: 19571216 },
      { 'hc-a2': 'IL', name: 'Illinois', x: 3, y: 6, value: 12882135 },
      { 'hc-a2': 'PA', name: 'Pennsylvania', x: 3, y: 8, value: 12801989 },
    ];
  }

  public chartConstructor: ChartConstructorType = 'chart';
  public updateFlag = false;
  public oneToOneFlag = true;
}
