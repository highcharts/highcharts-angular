import { Inject, Injectable, Optional } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HIGHCHARTS_ROOT_MODULES, HIGHCHARTS_LOADER, HIGHCHARTS_OPTIONS } from './highcharts-chart.token';
import { Chart, moduleFactory } from './types';

@Injectable({providedIn: 'root'})
export class HighchartsChartService {
  private loader: BehaviorSubject<Chart['highcharts'] | undefined> = new BehaviorSubject(undefined);
  loaderChanges$ = this.loader.asObservable();

  constructor(
    @Inject(HIGHCHARTS_LOADER) private source: Promise<Chart['highcharts']>,
    @Optional() @Inject(HIGHCHARTS_OPTIONS) private globalOptions: Chart['options'],
    @Optional() @Inject(HIGHCHARTS_ROOT_MODULES) private globalModules: moduleFactory[],
  ) {
  }

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
