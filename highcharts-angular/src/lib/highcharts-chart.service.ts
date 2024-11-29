import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HIGHCHARTS_ROOT_MODULES, HIGHCHARTS_LOADER, HIGHCHARTS_OPTIONS } from './highcharts-chart.token';
import { Chart, moduleFactory } from './types';

@Injectable({providedIn: 'root'})
export class HighchartsChartService {
  private loader: BehaviorSubject<Chart['highcharts'] | undefined> = new BehaviorSubject(undefined);
  loaderChanges$ = this.loader.asObservable();

  private source: Promise<Chart['highcharts']> = inject(HIGHCHARTS_LOADER);
  private globalOptions: Chart['options'] = inject(HIGHCHARTS_OPTIONS, { optional: true });
  private globalModules: moduleFactory[] = inject(HIGHCHARTS_ROOT_MODULES, { optional: true });

  load(modules?: moduleFactory[]) {
    this.source.then(source => {
      source.setOptions(this.globalOptions);
      if (this.globalModules) {
        this.globalModules.forEach(module => module(source));
      }
      if (modules) {
        modules.forEach(module => module(source));
      }
      this.loader.next(source);
    });
  }
}
