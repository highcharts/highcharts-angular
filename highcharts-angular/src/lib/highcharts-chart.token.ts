import { InjectionToken } from '@angular/core';
import { InstanceFactoryFunction, ModuleFactoryFunction, PartialHighchartsConfig } from './types'
import type Highcharts from 'highcharts/esm/highcharts';

export const HIGHCHARTS_LOADER = new InjectionToken<InstanceFactoryFunction>('HIGHCHARTS_LOADER');
export const HIGHCHARTS_ROOT_MODULES = new InjectionToken<ModuleFactoryFunction>('HIGHCHARTS_ROOT_MODULES');
export const HIGHCHARTS_OPTIONS = new InjectionToken<Highcharts.Options>('HIGHCHARTS_OPTIONS');
export const HIGHCHARTS_CONFIG = new InjectionToken<PartialHighchartsConfig>('HIGHCHARTS_CONFIG');
