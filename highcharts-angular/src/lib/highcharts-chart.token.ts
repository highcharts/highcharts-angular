import { InjectionToken } from '@angular/core';
import { Chart, InstanceFactoryFunction, ModuleFactoryFunction, PartialHighchartsConfig } from './types'

export const HIGHCHARTS_LOADER = new InjectionToken<InstanceFactoryFunction>('HIGHCHARTS_LOADER');
export const HIGHCHARTS_ROOT_MODULES = new InjectionToken<ModuleFactoryFunction>('HIGHCHARTS_ROOT_MODULES');
export const HIGHCHARTS_OPTIONS = new InjectionToken<Chart['options']>('HIGHCHARTS_OPTIONS');
export const HIGHCHARTS_CONFIG = new InjectionToken<PartialHighchartsConfig>('HIGHCHARTS_CONFIG');
