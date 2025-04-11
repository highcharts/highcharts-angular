import {
  afterRenderEffect,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  linkedSignal,
  model,
  output,
  PLATFORM_ID,
  untracked,
} from '@angular/core';
import {isPlatformServer} from '@angular/common';
import {toSignal} from '@angular/core/rxjs-interop';
import {HighchartsChartService} from './highcharts-chart.service';
import {HIGHCHARTS_CONFIG} from './highcharts-chart.token';
import type {Chart, ChartConstructorType} from './types';
import type Highcharts from 'highcharts/esm/highcharts';


@Directive({
  selector: '[highcharts-chart]',
})
export class HighchartsChartDirective {
  /**
   * Type of the chart constructor.
   */
  public readonly constructorType = input<ChartConstructorType>('chart');

  /**
   * When enabled, Updates `series`, `xAxis`, `yAxis`, and `annotations` to match new options.
   * Items are added/removed as needed. Series with `id`s are matched by `id`;
   * unmatched items are removed. Omitted `series` leaves existing ones unchanged.
   */
  public readonly oneToOne = input<boolean>(false);

  /**
   * Options for the Highcharts chart.
   */
  public readonly options = input.required<Chart['options']>();

  /**
   * Whether to redraw the chart.
   * Check how update works in Highcharts
   * API doc here: https://api.highcharts.com/class-reference/Highcharts.Chart#update
   */
  public readonly update = model<boolean>();

  public readonly chartInstance = output<Highcharts.Chart | null>();  // #26

  private readonly destroyRef = inject(DestroyRef);

  private readonly el = inject(ElementRef);

  private readonly platformId = inject(PLATFORM_ID);

  private readonly relativeConfig = inject(HIGHCHARTS_CONFIG, {optional: true});

  private readonly highchartsChartService = inject(HighchartsChartService);

  private readonly highCharts = toSignal(this.highchartsChartService.loaderChanges$);

  private readonly constructorChart = computed<Function>(() => {
    const constructorType = untracked(this.constructorType);
    const highCharts = this.highCharts();
    if (constructorType && highCharts) {
      return highCharts[constructorType];
    }
    return undefined;
  });

  private readonly chart = linkedSignal<Chart, Highcharts.Chart | null>({
    source: () => ({options: this.options(), update: this.update(), constructorChart: this.constructorChart()}),
    computation: (source, previous) => {
      return untracked(() => this.createOrUpdateChart(source, previous?.value, this.oneToOne()));
    }
  });

  private createOrUpdateChart(
    source: Chart,
    chart: Highcharts.Chart,
    oneToOne: boolean,
  ): Highcharts.Chart | null {
    if (chart) {
      chart.update(source.options, true, oneToOne);
      return chart;
    }
    if (source.constructorChart) {
      return source.constructorChart(this.el.nativeElement, source.options);
    }
    return undefined;
  }

  private destroyChart() {
    if (this.chart()) {  // #56
      this.chart().destroy();
      this.chart.set(null);
      // emit chart instance on destroy
      this.chartInstance.emit(this.chart());
    }
  }


  constructor() {
    // should stop loading on the server side for SSR
    if (this.platformId && isPlatformServer(this.platformId)) {
      return;
    }
    // make sure to load global config + modules on demand
    this.highchartsChartService.load(this.relativeConfig);
    this.destroyRef.onDestroy(() => this.destroyChart()); // #44
    afterRenderEffect(() => this.chartInstance.emit(this.chart()));
    afterRenderEffect(() => {
      if (this.update()) {
        this.update.set(false);  // clear the flag after update
      }
    });
  }
}
