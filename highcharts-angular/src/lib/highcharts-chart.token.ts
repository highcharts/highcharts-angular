import { InjectionToken } from '@angular/core';
import { Chart, ModuleFactory, PartialHighchartsConfig } from './types'

export const HIGHCHARTS_LOADER = new InjectionToken<Promise<Chart['highcharts']>>('HIGHCHARTS_LOADER');
export const HIGHCHARTS_ROOT_MODULES = new InjectionToken<ModuleFactory[]>('HIGHCHARTS_ROOT_MODULES');
export const HIGHCHARTS_OPTIONS = new InjectionToken<Chart['options']>('HIGHCHARTS_OPTIONS');
export const HIGHCHARTS_CONFIG = new InjectionToken<PartialHighchartsConfig>('HIGHCHARTS_CONFIG');
