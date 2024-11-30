import {
  Directive,
  DestroyRef,
  afterRenderEffect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  model,
  output,
  OutputEmitterRef,
  untracked,
  computed
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HighchartsChartService } from './highcharts-chart.service';
import { HIGHCHARTS_CONFIG } from './highcharts-chart.token';
import { Chart } from './types';


@Directive({
  selector: '[highcharts-chart]',
})
export class HighchartsChartDirective {
  /**
   * Highcharts library or Highcharts ESM module.
   * @deprecated
   */
  Highcharts = input<Chart['highcharts']>();

  /**
   * Type of the chart constructor.
   */
  constructorType = input<string>('chart');

  /**
   * Callback function for the chart.
   */
  callbackFunction = input<Highcharts.ChartCallbackFunction>(null);

  /**
   * Whether to update the chart one-to-one.
   */
  oneToOne = input<boolean>();

  /**
   * Whether to run the chart outside Angular.
   * @deprecated
   */
  runOutsideAngular = input<boolean>();

  /**
   * Options for the Highcharts chart.
   */
  options = input<Chart['options']>();

  /**
   * Whether to rerender the chart.
   */
  update = model<boolean>();

  chartInstance: OutputEmitterRef<Highcharts.Chart | null> = output<Highcharts.Chart | null>();  // #26

  private destroyRef = inject(DestroyRef);

  private el = inject(ElementRef);

  private relativeConfig = inject(HIGHCHARTS_CONFIG, { optional: true });

  private highchartsChartService = inject(HighchartsChartService);

  private highCharts = toSignal(this.highchartsChartService.loaderChanges$);

  private constructorChart = computed<Function>(() => {
    const constructorType = untracked(this.constructorType);
    const highCharts = this.highCharts() || this.Highcharts();
    if (constructorType && highCharts) {
      return highCharts[constructorType];
    }
    return undefined;
  });

  private chart = linkedSignal<Chart, Highcharts.Chart | null>({
    source: () => ({options: this.options(), update: this.update(), constructorChart: this.constructorChart()}),
    computation: (source, previous) => {
      return untracked(() => this.createOrUpdateChart(source, previous?.value, this.oneToOne(), this.callbackFunction()));
    }
  });

  private createOrUpdateChart(
    source: Chart,
    chart: Highcharts.Chart,
    oneToOne: boolean,
    callbackFunction: Highcharts.ChartCallbackFunction
  ): Highcharts.Chart | null {
    if (chart) {
      chart.update(source.options, true, oneToOne || false);
      return chart;
    }
    if (source.constructorChart) {
      return source.constructorChart(this.el.nativeElement, source.options, callbackFunction);
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
