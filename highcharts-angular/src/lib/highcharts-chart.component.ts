import { ChangeDetectionStrategy, Component} from '@angular/core';
import { HighchartsChartDirective } from './highcharts-chart.directive';

@Component({
  selector: 'highcharts-chart',
  template: '',
  hostDirectives: [
    {
      directive: HighchartsChartDirective,
      inputs: ['constructorType', 'oneToOne', 'options', 'update'],
      outputs: ['chartInstance', 'updateChange']
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HighchartsChartComponent {}
