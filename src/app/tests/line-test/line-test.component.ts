import { ChangeDetectionStrategy, Component } from '@angular/core';
import type Highcharts from 'highcharts/esm/highcharts';
import { HighchartsChartComponent } from '../../../../highcharts-angular/src/public_api';

type ExtendedSeriesCandlestickOptions = {
  color: Highcharts.ColorType;
} & Highcharts.SeriesCandlestickOptions;

@Component({
  selector: 'app-line-test',
  templateUrl: './line-test.component.html',
  styleUrl: './line-test.component.css',
  imports: [HighchartsChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineTestComponent {
  public updateFlag = false;
  public chartInstance: Highcharts.Chart | null = null;
  public chartOptions: Highcharts.Options = {
    series: [
      {
        type: 'line',
        data: [1, 2, 3],
      },
    ],
  };

  public updateSeriesColor(): void {
    (
      (this.chartOptions.series as any)[0] as ExtendedSeriesCandlestickOptions
    ).color = 'hotpink';
    this.updateFlag = true;
  }
}
