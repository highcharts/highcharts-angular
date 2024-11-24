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
  untracked
} from '@angular/core';
import type * as Highcharts from 'highcharts';
import type HighchartsESM from 'highcharts/es-modules/masters/highcharts.src';

@Directive({
  selector: 'highcharts-chart',
})
export class HighchartsChartDirective {
  /**
   * Highcharts library or Highcharts ESM module.
   */
  Highcharts = input<typeof Highcharts | typeof HighchartsESM>();

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
  options = input<Highcharts.Options | HighchartsESM.Options>();

  /**
   * Whether to rerender the chart.
   */
  update = model<boolean>();

  chartInstance: OutputEmitterRef<Highcharts.Chart | null> = output<Highcharts.Chart | null>();  // #26

  private chart = linkedSignal<{ options: Highcharts.Options | HighchartsESM.Options, update: boolean }, Highcharts.Chart | null>({
    source: () => ({options: this.options(), update: this.update()}),
    computation: (source, previous) => {
      return untracked(() => {
        if (previous && previous.value) {
          previous.value.update(source.options, true, this.oneToOne() || false);
          return previous.value;
        }
        return this.Highcharts()[this.constructorType()](this.el.nativeElement, source.options, this.callbackFunction());
      })
    }
  });

  private destroyRef = inject(DestroyRef);

  private el = inject(ElementRef);

  constructor() {
    this.destroyRef.onDestroy(() => { // #44
      if (this.chart()) {  // #56
        this.chart().destroy();
        this.chart.set(null);

        // emit chart instance on destroy
        this.chartInstance.emit(this.chart());
      }
    });

    afterRenderEffect(() => this.chartInstance.emit(this.chart()));
    afterRenderEffect(() => {
      if (this.update()) {
        this.update.set(false);  // clear the flag after update
      }
    });
  }
}
