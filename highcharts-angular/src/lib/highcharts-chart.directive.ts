import { DestroyRef, Directive, effect, ElementRef, inject, input, model, output, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { HighchartsChartService } from './highcharts-chart.service';
import { HIGHCHARTS_CONFIG, HIGHCHARTS_TIMEOUT } from './highcharts-chart.token';
import { ChartConstructorType } from './types';
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

  private _chartInstance: Highcharts.Chart | undefined;

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private keepChartUpToDate(): void {
    effect(async () => {
      await this.delay(this.relativeConfig?.timeout ?? this.timeout ?? 500);
      const highCharts = this.highchartsChartService.highcharts();
      const options = this.options();
      const constructorType = this.constructorType();
      if (!highCharts) return;
      if (this._chartInstance) {
        this._chartInstance.destroy();
        this._chartInstance = undefined;
      }
      const instance: Highcharts.Chart = (highCharts as any)[constructorType](
        this.el.nativeElement,
        // Use untracked, so we don't re-create new chart everytime options change
        options,
        // Use Highcharts callback to emit chart instance, so it is available as early
        // as possible. So that Angular is already aware of the instance if Highcharts raise
        // events during the initialization that happens before coming back to Angular
        (createdChart: Highcharts.Chart) => this.chartInstance.emit(createdChart),
      );
      if (!this._chartInstance) this._chartInstance = instance;
    });
  }

  public constructor() {
    // should stop loading on the server side for SSR
    if (this.platformId && isPlatformServer(this.platformId)) {
      return;
    }
    // make sure to load global config + modules on demand
    this.highchartsChartService.load(this.relativeConfig);
    this.destroyRef.onDestroy(() => this._chartInstance?.destroy()); // #44

    // Keep the chart up to date whenever options change or the update special input is set to true
    this.keepChartUpToDate();
  }
}
