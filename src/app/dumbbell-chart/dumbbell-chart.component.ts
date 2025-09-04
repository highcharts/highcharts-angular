import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HighchartsChartComponent } from 'highcharts-angular';
import { providePartialHighcharts } from 'highcharts-angular';

@Component({
  selector: 'app-dumbbell-chart',
  imports: [HighchartsChartComponent],
  templateUrl: './dumbbell-chart.component.html',
  styleUrl: './dumbbell-chart.component.css',
  providers: [
    providePartialHighcharts({
      modules: () => {
        return [
          import('highcharts/esm/highcharts-more'),
          import('highcharts/esm/modules/dumbbell'),
          import('highcharts/esm/modules/pattern-fill'),
        ];
      },
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DumbbellChartComponent {
  public options: Highcharts.Options = {
    chart: {
      plotBorderWidth: 1,
      zooming: {
        type: 'y',
        resetButton: {
          theme: { style: { display: 'none' } },
        },
      },
      spacingLeft: 1,
      spacingRight: 1,
      spacingTop: 7,
      spacingBottom: 0,
      animation: false,
      panning: {
        enabled: true,
        type: 'y',
      },
      panKey: 'shift',
    },
    plotOptions: {
      columnrange: {
        grouping: false,
      },
    },
    legend: { enabled: false },
    credits: { enabled: false },
    title: { text: '' },
    yAxis: {
      reversed: true,
      title: { text: '' },
      startOnTick: false,
      endOnTick: false,
      gridLineWidth: 1,
      tickPixelInterval: 72,
      minPadding: 0.1,
      minRange: 0.1,
      crosshair: {
        color: 'red',
        snap: false,
        zIndex: 4,
      },
      labels: {
        enabled: true,
        style: { fontSize: '11px' },
        x: -7,
      },
    },
    xAxis: {
      startOnTick: false,
      endOnTick: false,
      lineWidth: 0,
      tickWidth: 0,
      minRange: 0.1,
      gridLineWidth: 1,
      labels: { style: { fontSize: '11px' }, y: 14 },
    },
    series: [
      {
        data: [['', 2060, 2000]],
        type: 'dumbbell',
        name: 'Surface_26: Cement',
        color: 'lightgray',
        groupPadding: 0.7,
        connectorWidth: 14,
        marker: {
          radius: 0,
        },
      },
      {
        data: [['', 2060, 2000]],
        type: 'dumbbell',
        name: 'Surface_26: Tubular',
        color: 'black',
        zIndex: 1,
        groupPadding: 0.7,
        connectorWidth: 3,
        marker: {
          radius: 0,
        },
        lowMarker: {
          radius: 5,
          fillColor: 'black',
          symbol: 'flag',
        },
      },
      {
        data: [['', 2791.96, 2000]],
        type: 'dumbbell',
        name: 'Phase_16: Cement',
        color: 'lightgray',
        groupPadding: 0.7,
        connectorWidth: 14,
        marker: {
          radius: 0,
        },
      },
      {
        data: [['', 2791.96, 2000]],
        type: 'dumbbell',
        name: 'Phase_16: Tubular',
        color: 'black',
        zIndex: 1,
        groupPadding: 0.7,
        connectorWidth: 3,
        marker: {
          radius: 0,
        },
        lowMarker: {
          radius: 5,
          fillColor: 'black',
          symbol: 'flag',
        },
      },
      {
        data: [['', 4500, 4000]],
        type: 'dumbbell',
        name: 'Phase_13_375: Cement',
        color: 'lightgray',
        groupPadding: 0.7,
        connectorWidth: 14,
        marker: {
          radius: 0,
        },
      },
      {
        data: [['', 4500, 2000]],
        type: 'dumbbell',
        name: 'Phase_13_375: Tubular',
        color: 'black',
        zIndex: 1,
        groupPadding: 0.7,
        connectorWidth: 3,
        marker: {
          radius: 0,
        },
        lowMarker: {
          radius: 5,
          fillColor: 'black',
          symbol: 'flag',
        },
      },
      {
        data: [['', 5250, 4650]],
        type: 'dumbbell',
        name: 'Phase_10_74: Cement',
        color: 'lightgray',
        groupPadding: 0.7,
        connectorWidth: 14,
        marker: {
          radius: 0,
        },
      },
      {
        data: [['', 5250, 4400]],
        type: 'dumbbell',
        name: 'Phase_10_74: Tubular',
        color: 'black',
        zIndex: 1,
        groupPadding: 0.7,
        connectorWidth: 3,
        marker: {
          radius: 0,
        },
        lowMarker: {
          radius: 5,
          fillColor: 'black',
          symbol: 'flag',
        },
      },
    ],
  };

}
