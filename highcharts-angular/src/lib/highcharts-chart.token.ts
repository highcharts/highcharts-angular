import {InjectionToken} from '@angular/core';
import {Chart, moduleFactory} from './types'

export const HIGHCHARTS_LOADER = new InjectionToken<Promise<Chart['highcharts']>>('HIGHCHARTS_MODULE');
export const HIGHCHARTS_ROOT_MODULES = new InjectionToken<moduleFactory[]>('HIGHCHARTS_ROOT_MODULES');
export const HIGHCHARTS_MODULES = new InjectionToken<moduleFactory[]>('HIGHCHARTS_MODULES');
export const HIGHCHARTS_OPTIONS = new InjectionToken<Chart['options']>('HIGHCHARTS_OPTIONS', {providedIn: 'root', factory: () => ({})});
