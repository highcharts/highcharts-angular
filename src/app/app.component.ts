import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LineChartComponent } from './line-chart/line-chart.component';
import { StockChartComponent } from './stock-chart/stock-chart.component';
import { MapChartComponent } from './map-chart/map-chart.component';
import { GanttChartComponent } from './gantt-chart/gantt-chart.component';
import { LazyLoadingChartComponent } from './lazy-loading-chart/lazy-loading-chart.component';
import { TilemapChartComponent } from './tilemap-chart/tilemap-chart.component';
import { DumbbellChartComponent } from './dumbbell-chart/dumbbell-chart.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    LineChartComponent,
    StockChartComponent,
    MapChartComponent,
    GanttChartComponent,
    LazyLoadingChartComponent,
    TilemapChartComponent,
    DumbbellChartComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
