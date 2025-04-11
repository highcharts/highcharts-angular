import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HighchartsChartComponent, providePartialHighcharts } from 'highcharts-angular';
import type Highcharts from 'highcharts/esm/highcharts';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css',
  imports: [FormsModule, HighchartsChartComponent],
  providers: [providePartialHighcharts({ modules: () => [] })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent {
  public updateFromInput = false;
  public showChart = true;
  public toggleButtonTitle = 'Destroy chart';

  public optFromInputString = `
    {
      "title": { "text": "Highcharts chart" },
      "series": [{
        "data": [11,2,3],
        "zones": [{
          "value": 7.2,
          "dashStyle": "dot",
          "color": "red"
        }]
      }, {
        "data": [5,6,7]
      }]
    }
  `;
  public optFromInput: Highcharts.Options = JSON.parse(this.optFromInputString);
  private seriesTypes = {
    line: 'column',
    column: 'scatter',
    scatter: 'spline',
    spline: 'line',
  };

  // Demonstrate chart instance
  public logChartInstance(chart: Highcharts.Chart): void {
    if (chart) {
      console.log('Chart instance received:', chart);
    } else {
      console.log('Chart instance destroyed');
    }
  }

  public updateInputChart(): void {
    this.optFromInput = JSON.parse(this.optFromInputString);
  }

  public toggleSeriesType(index = 0): void {
    const key: keyof typeof this.seriesTypes = (this.optFromInput.series as any)[index].type ?? 'line';
    (this.optFromInput.series as any)[index].type = this.seriesTypes[key];
    // nested change - must trigger update
    this.updateFromInput = true;
  }

  public toggleChart(): void {
    this.showChart = !this.showChart;
    this.toggleButtonTitle = this.showChart ? 'Destroy chart' : 'Recreate chart';
  }
}
