import {
  afterRenderEffect,
  computed,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  PLATFORM_ID,
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
  public readonly options = input.required<Highcharts.Options>();

  /**
   * Whether to redraw the chart.
   * Check how update works in Highcharts
   * API doc here: https://api.highcharts.com/class-reference/Highcharts.Chart#update
   */
  public readonly update = model<boolean>();

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

  private readonly constructorChart = computed<ConstructorChart | undefined>(() => {
    const highCharts = this.highchartsChartService.highcharts();
    if (highCharts) {
      return (highCharts as any)[this.constructorType()];
    }
    return undefined;
  });

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Create the chart as soon as we can
  private readonly chart = computed(async () => {
    await this.delay(this.timeout ?? 500);
    return this.constructorChart()?.(
      this.el.nativeElement,
      // Use untracked, so we don't re-create new chart everytime options change
      untracked(() => this.options()),
      // Use Highcharts callback to emit chart instance, so it is available as early
      // as possible. So that Angular is already aware of the instance if Highcharts raise
      // events during the initialization that happens before coming back to Angular
      createdChart => this.chartInstance.emit(createdChart),
    );
  });

  private keepChartUpToDate(): void {
    effect(async () => {
      // Wait for the chart to be created
      this.update();
      const chart = await this.chart();
      chart?.update(this.options(), true, this.oneToOne());
    });
  }

  private async destroyChart(): Promise<void> {
    const chart = await this.chart();
    if (chart) {
      // #56
      chart.destroy();
    }
  }

  public constructor() {
    // should stop loading on the server side for SSR
    if (this.platformId && isPlatformServer(this.platformId)) {
      return;
    }
    // make sure to load global config + modules on demand
    this.highchartsChartService.load(this.relativeConfig);
    this.destroyRef.onDestroy(() => this.destroyChart()); // #44
    afterRenderEffect(() => {
      if (this.update()) {
        this.update.set(false); // clear the flag after update
      }
    });

    // Keep the chart up to date whenever options change or the update special input is set to true
    this.keepChartUpToDate();
  }
}
