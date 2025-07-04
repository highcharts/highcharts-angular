import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HighchartsChartComponent, providePartialHighcharts } from 'highcharts-angular';
import type Highcharts from 'highcharts/esm/highcharts';

@Component({
  selector: 'app-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrl: './gantt-chart.component.css',
  imports: [HighchartsChartComponent],
  providers: [
    providePartialHighcharts({
      modules: () => [import('highcharts/esm/modules/gantt')],
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttChartComponent {
  public chartGantt: Highcharts.Options = {
    title: {
      text: 'Highcharts Gantt with Progress Indicators',
    },
    xAxis: {
      min: Date.UTC(2014, 10, 17),
      max: Date.UTC(2014, 10, 30),
    },

    series: [
      {
        name: 'Project 1',
        type: 'gantt',
        data: [
          {
            name: 'Start prototype',
            start: Date.UTC(2014, 10, 18),
            end: Date.UTC(2014, 10, 25),
            completed: 0.25,
          },
          {
            name: 'Test prototype',
            start: Date.UTC(2014, 10, 27),
            end: Date.UTC(2014, 10, 29),
          },
          {
            name: 'Develop',
            start: Date.UTC(2014, 10, 20),
            end: Date.UTC(2014, 10, 25),
            completed: {
              amount: 0.12,
              fill: '#fa0',
            },
          },
          {
            name: 'Run acceptance tests',
            start: Date.UTC(2014, 10, 23),
            end: Date.UTC(2014, 10, 26),
          },
        ],
      },
    ],
  };
}
