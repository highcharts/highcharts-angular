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
  Injector
} from '@angular/core';
import { Chart } from './types';
import { promiseToSignal } from './utils';
import { loadHighcharts } from './highcharts-chart.token';


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

  private injector = inject(Injector);

  private highCharts = promiseToSignal(loadHighcharts(this.injector))

  private chart = linkedSignal<Chart, Highcharts.Chart | null>({
    source: () => ({options: this.options(), update: this.update(), highcharts: this.highCharts()}),
    computation: (source, previous) => {
      const highcharts = source.highcharts || this.Highcharts();
      if (highcharts) {
        return untracked(() => {
          if (previous && previous.value) {
            previous.value.update(source.options, true, this.oneToOne() || false);
            return previous.value;
          }
          return highcharts[this.constructorType()](this.el.nativeElement, source.options, this.callbackFunction());
        })
      }
      return undefined;
    }
  });


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
