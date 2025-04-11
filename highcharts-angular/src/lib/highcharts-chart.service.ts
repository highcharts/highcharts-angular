import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HIGHCHARTS_ROOT_MODULES, HIGHCHARTS_LOADER, HIGHCHARTS_OPTIONS } from './highcharts-chart.token';
import { Chart, PartialHighchartsConfig } from './types';

@Injectable({providedIn: 'root'})
export class HighchartsChartService {
  private readonly loader = new BehaviorSubject<Chart['highcharts'] | undefined>(undefined);
  public readonly loaderChanges$ = this.loader.asObservable();

  private readonly source = inject(HIGHCHARTS_LOADER);
  private readonly globalOptions = inject(HIGHCHARTS_OPTIONS, { optional: true });
  private readonly globalModules = inject(HIGHCHARTS_ROOT_MODULES, { optional: true });

  private async loadHighchartsWithModules(partialConfig?: PartialHighchartsConfig): Promise<Chart['highcharts']> {
    const Highcharts = await this.source(); // Ensure Highcharts core is loaded

    await Promise.all([...this.globalModules(), ...(partialConfig?.modules?.() ?? [])]);

    // Return the Highcharts instance
    return Highcharts;
  }


 public load(partialConfig?: PartialHighchartsConfig): void {
    this.loadHighchartsWithModules(partialConfig).then(source => {
      if (this.globalOptions) {
        source.setOptions(this.globalOptions);
      }
      // add timeout to make sure the loader has attached all modules
      setTimeout(() => this.loader.next(source), 100);
    });
  }
}
