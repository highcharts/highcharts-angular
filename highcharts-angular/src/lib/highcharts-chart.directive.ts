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
import { ChartConstructorType, ConstructorChart } from './types';
import type Highcharts from 'highcharts/esm/highcharts';

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
  private readonly pendingTasks = inject(PendingTasks);

  private readonly loadedHighcharts = signal<typeof Highcharts | null>(null);
  private readonly chart = signal<Highcharts.Chart | null>(null);
  private isDestroyed = false;

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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

      const chartFactories: Record<ChartConstructorType, ConstructorChart> = {
        chart: highcharts.chart,
        ganttChart: (highcharts as any).ganttChart,
        mapChart: (highcharts as any).mapChart,
        stockChart: (highcharts as any).stockChart,
      };

      const chart = chartFactories[constructorType](
        this.el.nativeElement,
        untracked(() => this.options()),
        callback,
      ) as Highcharts.Chart;

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
      const update = this.update();
      const oneToOne = this.oneToOne();
      const options = this.options();

      if (!chart) {
        return;
      }

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
      const highcharts = await this.highchartsChartService.load(this.relativeConfig);
      const delayMs = this.relativeConfig?.timeout ?? this.timeout ?? 0;

      await this.delay(delayMs);

      if (!this.isDestroyed) {
        this.loadedHighcharts.set(highcharts);
      }

      return highcharts;
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
