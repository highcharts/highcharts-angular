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

// --- STAGGER STATE ---
// Module-level variables to safely space out parallel chart creations
let staggerCount = 0;
let staggerResetTimer: any;

@Directive({
  selector: '[highchartsChart]',
})
export class HighchartsChartDirective {
  public readonly constructorType = input<ChartConstructorType>('chart');
  public readonly oneToOne = input<boolean>(false);
  public readonly options = input.required<Highcharts.Options>();
  public readonly update = model<boolean>(true);
  public readonly chartInstance = output<Highcharts.Chart>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly relativeConfig = inject(HIGHCHARTS_CONFIG, { optional: true });
  private readonly timeout = inject(HIGHCHARTS_TIMEOUT, { optional: true });
  private readonly highchartsChartService = inject(HighchartsChartService);

  private chartCreated = false;
  private _chartInstance: Highcharts.Chart | undefined;
  private isDestroyed = false;

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private readonly chart = computed(async () => {
    const highCharts = this.highchartsChartService.highcharts();
    const constructorType = this.constructorType();

    // 1. Grab the current stagger increment (0 for single charts)
    const currentStaggerDelay = staggerCount * 16;
    staggerCount++;

    // 2. Safely debounce the reset so independent charts start fresh at 0
    clearTimeout(staggerResetTimer);
    staggerResetTimer = setTimeout(() => {
      staggerCount = 0;
    }, 50);

    // 3. Apply the stagger natively to the existing delay. No extra Promises required!
    const baseTimeout = this.relativeConfig?.timeout ?? this.timeout ?? 500;
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

    // Return exactly as the original codebase did to satisfy all strict component tests
    return chartFactories[constructorType](
      this.el.nativeElement,
      untracked(() => this.options()),
      callback,
    ) as Highcharts.Chart;
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
