import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HIGHCHARTS_ROOT_MODULES, HIGHCHARTS_LOADER, HIGHCHARTS_OPTIONS } from './highcharts-chart.token';
import { Chart, ModuleFactoryFunction, PartialHighchartsConfig, ModuleFactory } from './types';

@Injectable({providedIn: 'root'})
export class HighchartsChartService {
  private loader: BehaviorSubject<Chart['highcharts'] | undefined> = new BehaviorSubject(undefined);
  loaderChanges$ = this.loader.asObservable();

  private source: Promise<Chart['highcharts']> = inject(HIGHCHARTS_LOADER);
  private globalOptions: Chart['options'] = inject(HIGHCHARTS_OPTIONS, { optional: true });
  private globalModules: ModuleFactoryFunction = inject(HIGHCHARTS_ROOT_MODULES, { optional: true });

  private async loadHighchartsWithModules(partialConfig?: PartialHighchartsConfig): Promise<Chart['highcharts']> {
    const Highcharts: Chart['highcharts'] = await this.source; // Ensure Highcharts core is loaded
    const version: number = Number(Highcharts['version'].split('.').map((v: string) => v.padStart(2, '0')).join(''));
    const results: ModuleFactory[] = await Promise.all(
      partialConfig?.modules ? [...this.globalModules(), ...partialConfig.modules()] : this.globalModules()
    );
    if (version < 120000) {
      results.forEach(module => module.default(Highcharts));
    }
    // Return the Highcharts instance
    return Highcharts;
  }


  load(partialConfig?: PartialHighchartsConfig) {
    this.loadHighchartsWithModules(partialConfig).then((source: Chart['highcharts']) => {
      if (this.globalOptions) {
        source.setOptions(this.globalOptions);
      }
      // add timeout to make sure the loader has attached all modules
      setTimeout(() => this.loader.next(source), 500);
    });
  }
}
