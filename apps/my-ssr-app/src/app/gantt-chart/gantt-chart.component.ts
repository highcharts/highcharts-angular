import { ChangeDetectionStrategy, Component } from '@angular/core';
import HC_gantt from 'highcharts/modules/gantt';
import { HighchartsChartComponent, providePartialHighChart } from 'highcharts-angular';


@Component({
  selector: 'app-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.css'],
  imports: [HighchartsChartComponent],
  providers: [providePartialHighChart({  modules: [HC_gantt] })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttChartComponent {
  chartGantt: Highcharts.Options = {
    title: {
      text: 'Highcharts Gantt with Progress Indicators'
    },
    xAxis: {
      min: Date.UTC(2014, 10, 17),
      max: Date.UTC(2014, 10, 30)
    },

    series: [{
      name: 'Project 1',
      type: 'gantt',
      data: [{
        name: 'Start prototype',
        start: Date.UTC(2014, 10, 18),
        end: Date.UTC(2014, 10, 25),
        completed: 0.25
      }, {
        name: 'Test prototype',
        start: Date.UTC(2014, 10, 27),
        end: Date.UTC(2014, 10, 29)
      }, {
        name: 'Develop',
        start: Date.UTC(2014, 10, 20),
        end: Date.UTC(2014, 10, 25),
        completed: {
          amount: 0.12,
          fill: '#fa0'
        }
      }, {
        name: 'Run acceptance tests',
        start: Date.UTC(2014, 10, 23),
        end: Date.UTC(2014, 10, 26)
      }]
    }]
  };

}
