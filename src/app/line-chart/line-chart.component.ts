import { ChangeDetectionStrategy, Component } from '@angular/core';
import HC_customEvents from 'highcharts-custom-events';
import { FormsModule } from '@angular/forms';
import { HighchartsChartComponent, provideHighChartModules } from 'highcharts-angular';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
  imports: [FormsModule, HighchartsChartComponent],
  providers: [provideHighChartModules(HC_customEvents)],
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
  public logChartInstance(chart: Highcharts.Chart) {
    if (chart) {
      console.log('Chart instance received:', chart);
    } else {
      console.log('Chart instance destroyed');
    }
  }

  public updateInputChart() {
    this.optFromInput = JSON.parse(this.optFromInputString);
  }

  public toggleSeriesType(index = 0) {
    this.optFromInput.series[index].type = this.seriesTypes[
    this.optFromInput.series[index].type || 'line'] as keyof typeof this.seriesTypes;
    // nested change - must trigger update
    this.updateFromInput = true;
  }

  public toggleChart() {
    this.showChart = !this.showChart;
    this.toggleButtonTitle = this.showChart ? 'Destroy chart' : 'Recreate chart';
  }
}
