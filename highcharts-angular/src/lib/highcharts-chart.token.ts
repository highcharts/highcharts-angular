import { InjectionToken, Injector } from '@angular/core';
import { Chart } from './types'

export const HIGHCHARTS_MODULE = new InjectionToken<Promise<Chart['highcharts']>>('HIGHCHARTS_MODULE');
export const HIGHCHARTS_ES_MODULE = new InjectionToken<any>('HIGHCHARTS_ES_MODULE');

export const loadHighcharts = (injector: Injector): Promise<Chart['highcharts']> => {
  const defaultHighcharts = import('highcharts').then(m => m.default);
  const Highcharts = injector.get<Promise<Chart['highcharts']>>(HIGHCHARTS_MODULE, defaultHighcharts);
  return injector.get<Promise<Chart['highcharts']>>(HIGHCHARTS_ES_MODULE, Highcharts);
}
