import { Component } from '@angular/core';
import {GanttChartComponent} from './gantt-chart/gantt-chart.component';
import {LazyLoadingChartComponent} from './lazy-loading-chart/lazy-loading-chart.component';
import {LineChartComponent} from './line-chart/line-chart.component';
// import {MapChartComponent} from './map-chart/map-chart.component';
import {StockChartComponent} from './stock-chart/stock-chart.component';

@Component({
  selector: 'app-root',
  imports: [GanttChartComponent, LineChartComponent, StockChartComponent, LazyLoadingChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-ssr-app';
}
