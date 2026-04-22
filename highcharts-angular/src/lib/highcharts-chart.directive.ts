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

// Module-level counter to stagger parallel chart initializations across multiple directives
let staggerCount = 0;

@Directive({
  selector: '[highchartsChart]',
})
export class HighchartsChartDirective {
  /**
   * Type of the chart constructor.
   */
  public readonly constructorType = input<ChartConstructorType>('chart');

  /**
   * @deprecated Will be removed in a future release.
   * When enabled, Updates `series`, `xAxis`, `yAxis`, and `annotations` to match new options.
   * Items are added/removed as needed. Series with `id`s are matched by `id`;
   * unmatched items are removed. Omitted `series` leaves existing ones unchanged.
   */
  public readonly oneToOne = input<boolean>(false);

  /**
   * Options for the Highcharts chart.
   */
  public readonly options = input.required<Highcharts.Options>();

  /**
   * @deprecated Will be removed in a future release.
   * Whether to redraw the chart.
   * Check how update works in Highcharts
   * API doc here: https://api.highcharts.com/class-reference/Highcharts.Chart#update
   */
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

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Create the chart as soon as we can
  private readonly chart = computed(async () => {
    const highCharts = this.highchartsChartService.highcharts();
    const constructorType = this.constructorType();

    // Group simultaneous chart initializations
    const currentStaggerDelay = staggerCount * 16; // Stagger by 16ms (~1 frame) per chart
    staggerCount++;

    // Reset the count at the end of the microtask queue.
    // This ensures independent charts rendered later start back at 0 delay.
    Promise.resolve().then(() => {
      staggerCount = 0;
    });

    const baseTimeout = this.relativeConfig?.timeout ?? this.timeout ?? 500;

    // The native Angular/browser setTimeout natively staggers the macrotasks!
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

    // Because the promises resolve synchronously at staggered intervals,
    // N N charts no longer hit the main thread at the exact same time.
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
    // should stop loading on the server side for SSR
    if (this.platformId && isPlatformServer(this.platformId)) {
      return;
    }
    // make sure to load global config + modules on demand
    this.highchartsChartService.load(this.relativeConfig);
    // destroy the chart when the directive is destroyed
    this.destroyRef.onDestroy(() => {
      this._chartInstance?.destroy();
      this._chartInstance = undefined;
      this.isDestroyed = true;
    }); // #44

    // Keep the chart up to date whenever options change or the update special input is set to true
    this.keepChartUpToDate();
  }
}
