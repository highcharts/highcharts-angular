import type { OnChanges } from '@angular/core';
import { Component, ElementRef, OutputEmitterRef, Input, output, model, NgZone, SimpleChanges, DestroyRef, inject } from '@angular/core';
import type * as Highcharts from 'highcharts';
import type HighchartsESM from 'highcharts/es-modules/masters/highcharts.src';

@Component({
  selector: 'highcharts-chart',
  template: '',
  standalone: true
})
export class HighchartsChartComponent implements OnChanges {
  @Input() Highcharts: typeof Highcharts | typeof HighchartsESM;
  @Input() constructorType: string;
  @Input() callbackFunction: Highcharts.ChartCallbackFunction;
  @Input() oneToOne: boolean; // #20
  @Input() runOutsideAngular: boolean; // #75
  @Input() options: Highcharts.Options | HighchartsESM.Options;
  update = model<boolean>();

  chartInstance: OutputEmitterRef<Highcharts.Chart | null> = output<Highcharts.Chart | null>();  // #26

  private chart: Highcharts.Chart | null;

  destroyRef = inject(DestroyRef);

  constructor(
    private el: ElementRef,
    private _zone: NgZone // #75
  ) {
    this.destroyRef.onDestroy(() => { // #44
      if (this.chart) {  // #56
        this.chart.destroy();
        this.chart = null;

        // emit chart instance on destroy
        this.chartInstance.emit(this.chart);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const update = changes.update?.currentValue;
    if (changes.options || update) {
      this.wrappedUpdateOrCreateChart();
      if (update) {
        this.update.set(false);  // clear the flag after update
      }
    }
  }

  wrappedUpdateOrCreateChart() { // #75
    if (this.runOutsideAngular) {
      this._zone.runOutsideAngular(() => {
        this.updateOrCreateChart()
      });
    } else {
      this.updateOrCreateChart();
    }
  }

  updateOrCreateChart() {
    if (this.chart?.update) {
      this.chart.update(this.options, true, this.oneToOne || false);
    } else {
      this.chart = this.Highcharts[this.constructorType || 'chart'](
        this.el.nativeElement,
        this.options,
        this.callbackFunction || null
      );

      // emit chart instance on init
      this.chartInstance.emit(this.chart);
    }
  }
}
