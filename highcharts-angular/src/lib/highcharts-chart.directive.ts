import {
  computed,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  untracked,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { HighchartsChartService } from './highcharts-chart.service';
import { HIGHCHARTS_CONFIG, HIGHCHARTS_TIMEOUT } from './highcharts-chart.token';
import { ChartConstructorType, ConstructorChart } from './types';
import type Highcharts from 'highcharts/esm/highcharts';

@Directive({
  selector: '[highchartsChart]',
})
export class HighchartsChartDirective {
  /**
   * Type of the chart constructor.
   */
  public readonly constructorType = input<ChartConstructorType>('chart');

  public readonly oneToOne = input<boolean>(false);

  public readonly options = input.required<Highcharts.Options>();

  public readonly update = model<boolean>(true);

  public readonly chartInstance = output<Highcharts.Chart>(); // #26

  private readonly destroyRef = inject(DestroyRef);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  private readonly platformId = inject(PLATFORM_ID);

  private readonly relativeConfig = inject(HIGHCHARTS_CONFIG, {
    optional: true,
  });

  private readonly timeout = inject(HIGHCHARTS_TIMEOUT, {
    optional: true,
  });

  private readonly highchartsChartService = inject(HighchartsChartService);

  private chartCreated = false;

  private _chartInstance: Highcharts.Chart | undefined;

  private isDestroyed = false;

  private static staggerCount = 0;
  private static resetStaggerTimer: NodeJS.Timeout | undefined;

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Create the chart as soon as we can
  private readonly chart = computed(async () => {
    const highCharts = this.highchartsChartService.highcharts();
    const constructorType = this.constructorType();

    // Calculate stagger to prevent main thread blocking when rendering many charts
    const currentStaggerDelay = HighchartsChartDirective.staggerCount * 16;
    HighchartsChartDirective.staggerCount++;

    // Debounce the reset so all charts initialized in this macro-task get uniquely staggered.
    // This naturally cleans up state so tests do not leak.
    clearTimeout(HighchartsChartDirective.resetStaggerTimer);
    HighchartsChartDirective.resetStaggerTimer = setTimeout(() => {
      HighchartsChartDirective.staggerCount = 0;
    }, 0);

    const baseTimeout = this.relativeConfig?.timeout ?? this.timeout ?? 500;

    // Add the computed stagger incrementally to the base timeout
    await this.delay(baseTimeout + currentStaggerDelay);

    if (!highCharts) return;

    const callback: Highcharts.ChartCallbackFunction = (chart: Highcharts.Chart) => {
      if (chart.renderer.forExport || this.isDestroyed) return;
      return this.chartInstance.emit(chart);
    };

    const chartFactories: Record<ChartConstructorType, ConstructorChart> = {
      chart: highCharts.chart,
      ganttChart: (highCharts as any).ganttChart,
      mapChart: (highCharts as any).mapChart,
      stockChart: (highCharts as any).stockChart,
    };

    const createdChart = chartFactories[constructorType](
      this.el.nativeElement,
      untracked(() => this.options()),
      callback,
    );

    return createdChart as Highcharts.Chart;
  });

  private keepChartUpToDate(): void {
    effect(async () => {
      const update = this.update();
      const oneToOne = this.oneToOne();
      const options = this.options();
      this._chartInstance = await this.chart();
      if (!this.chartCreated) {
        if (this._chartInstance) {
          this.chartCreated = true;
        }
      } else {
        if (update) {
          this._chartInstance?.update(options, true, oneToOne);
        }
      }
    });
  }

  public constructor() {
    if (this.platformId && isPlatformServer(this.platformId)) {
      return;
    }
    this.highchartsChartService.load(this.relativeConfig);
    this.destroyRef.onDestroy(() => {
      this._chartInstance?.destroy();
      this._chartInstance = undefined;
      this.isDestroyed = true;
    });

    this.keepChartUpToDate();
  }
}
