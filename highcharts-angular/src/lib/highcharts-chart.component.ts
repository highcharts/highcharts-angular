import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HighchartsChartDirective } from './highcharts-chart.directive';

@Component({
  selector: 'highcharts-chart',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: HighchartsChartDirective,
      inputs: ['constructorType', 'oneToOne', 'options', 'update'],
      outputs: ['chartInstance', 'updateChange'],
    },
  ],
})
export class HighchartsChartComponent {}
