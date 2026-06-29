import {
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  PendingTasks,
  PLATFORM_ID,
  signal,
  untracked,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { HighchartsChartService } from './highcharts-chart.service';
import { HIGHCHARTS_CONFIG, HIGHCHARTS_TIMEOUT } from './highcharts-chart.token';
import { ChartConstructorType, ConstructorChart, HighchartsWithModuleConstructors } from './types';
import type Highcharts from 'highcharts/esm/highcharts';

@Directive({
  selector: '[highchartsChart]',
})
export class HighchartsChartDirective {
  /**
   * Type of the chart constructor.
   * Changing it recreates the chart because Highcharts constructors are not update-compatible.
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

  public readonly chartInstance = output<Highcharts.Chart>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly relativeConfig = inject(HIGHCHARTS_CONFIG, { optional: true });
  private readonly timeout = inject(HIGHCHARTS_TIMEOUT, { optional: true });
  private readonly highchartsChartService = inject(HighchartsChartService);
  private readonly pendingTasks = inject(PendingTasks);

  private readonly loadedHighcharts = signal<typeof Highcharts | null>(null);
  private readonly chart = signal<Highcharts.Chart | null>(null);
  private isDestroyed = false;

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getChartFactory(highcharts: typeof Highcharts, constructorType: ChartConstructorType): ConstructorChart {
    if (constructorType === 'chart') {
      return highcharts.chart;
    }

    const highchartsWithModuleConstructors: HighchartsWithModuleConstructors = highcharts;
    const chartFactory = highchartsWithModuleConstructors[constructorType];

    if (!chartFactory) {
      throw new Error(
        `Highcharts constructor "${constructorType}" is not available. Did you load the required module?`,
      );
    }

    return chartFactory;
  }

  private createChart(): void {
    effect(onCleanup => {
      const highcharts = this.loadedHighcharts();
      const constructorType = this.constructorType();

      if (!highcharts || this.isDestroyed) {
        return;
      }

      const callback: Highcharts.ChartCallbackFunction = (chart: Highcharts.Chart) => {
        if (chart.renderer.forExport || this.isDestroyed) return;
        return this.chartInstance.emit(chart);
      };

      const chart = this.getChartFactory(highcharts, constructorType)(
        this.el.nativeElement,
        // Read options without tracking them here: option changes should update
        // the existing chart, not tear it down and create a new one.
        untracked(() => this.options()),
        callback,
      );

      this.chart.set(chart);

      onCleanup(() => {
        if (this.chart() === chart) {
          this.chart.set(null);
        }

        chart.destroy();
      });
    });
  }

  private keepChartUpToDate(): void {
    let lastChart: Highcharts.Chart | null = null;

    effect(() => {
      const chart = this.chart();
      // Deprecated inputs remain supported internally until they are removed.
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      const update = this.update();
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      const oneToOne = this.oneToOne();
      const options = this.options();

      if (!chart) {
        return;
      }

      // Skip the first pass after creation. The constructor already consumed
      // the initial options, so calling `update` immediately would duplicate work.
      if (chart !== lastChart) {
        lastChart = chart;
        return;
      }

      if (update) {
        chart.update(options, true, oneToOne);
      }
    });
  }

  private async initializeHighcharts(): Promise<void> {
    await this.pendingTasks.run(async () => {
      try {
        const highcharts = await this.highchartsChartService.load(this.relativeConfig);
        const delayMs = this.relativeConfig?.timeout ?? this.timeout ?? 0;

        // Keep a timer boundary even at 0ms so Angular test stability and
        // component timing stay aligned with the directive's async setup.
        await this.delay(delayMs);

        if (!this.isDestroyed) {
          this.loadedHighcharts.set(highcharts);
        }
      } catch (error) {
        // Core/module loading failed: leave the chart uncreated and surface the
        // reason instead of letting it become an unhandled promise rejection.
        console.error('Highcharts failed to load; chart was not created.', error);
      }
    });
  }

  public constructor() {
    if (this.platformId && isPlatformServer(this.platformId)) {
      return;
    }

    this.destroyRef.onDestroy(() => {
      this.isDestroyed = true;
    });

    this.createChart();
    this.keepChartUpToDate();
    void this.initializeHighcharts();
  }
}
