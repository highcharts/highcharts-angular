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

let isRendering = false;
const renderingQueue: (() => void)[] = [];

const processQueue = () => {
  if (renderingQueue.length > 0) {
    isRendering = true;
    const next = renderingQueue.shift();
    // Stagger the next queued chart by ~1 frame to allow DOM paint
    setTimeout(() => {
      if (next) next();
      processQueue(); // Process the next one in line
    }, 16);
  } else {
    isRendering = false; // Queue is empty, reset state
  }
};

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

    await this.delay(this.relativeConfig?.timeout ?? this.timeout ?? 500);

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

    // --- UPDATED SYNCHRONOUS/ASYNCHRONOUS HYBRID QUEUE ---
    return new Promise<Highcharts.Chart | undefined>(resolve => {
      const renderTask = () => {
        if (this.isDestroyed) {
          resolve(undefined);
          return;
        }
        try {
          const createdChart = chartFactories[constructorType](
            this.el.nativeElement,
            untracked(() => this.options()),
            callback,
          );
          resolve(createdChart as Highcharts.Chart);
        } catch (error) {
          console.error('Highcharts-Angular: Error initializing chart', error);
          resolve(undefined);
        }
      };

      if (!isRendering && renderingQueue.length === 0) {
        // FAST PATH: First chart in the batch renders SYNCHRONOUSLY.
        // This guarantees 100% backward compatibility for single-chart legacy tests.
        isRendering = true;
        renderTask();

        // Schedule the queue processor for any OTHER charts that wake up in this microtask
        Promise.resolve().then(() => {
          processQueue();
        });
      } else {
        // SLOW PATH: If a chart is currently rendering, queue this one up to be staggered.
        renderingQueue.push(renderTask);
      }
    });
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
