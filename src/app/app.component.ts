import { Component } from '@angular/core';
import ExportingModule from 'highcharts/modules/exporting';
import SunsetTheme from 'highcharts/themes/sunset.js';
import * as Highcharts from 'highcharts';
import { LineChartComponent } from './line-chart/line-chart.component';
import { StockChartComponent } from './stock-chart/stock-chart.component';
import { MapChartComponent } from './map-chart/map-chart.component';
import { GanttChartComponent } from './gantt-chart/gantt-chart.component';
import { LazyLoadingChartComponent } from './lazy-loading-chart/lazy-loading-chart.component';

// The modules will work for all charts.
ExportingModule(Highcharts);
SunsetTheme(Highcharts);

Highcharts.setOptions({
  title: {
    style: {
      color: 'tomato'
    }
  },
  legend: {
    enabled: false
  }
});

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [LineChartComponent, StockChartComponent, MapChartComponent, GanttChartComponent, LazyLoadingChartComponent]
})

export class AppComponent {

}
