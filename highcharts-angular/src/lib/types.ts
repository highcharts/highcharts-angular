import type Highcharts from 'highcharts';
import type HighchartsESM from 'highcharts/es-modules/masters/highcharts.src';

export type ChartConstructorType = 'chart' | 'ganttChart' | 'stockChart' | 'mapChart';

export type ModuleFactoryFunction = () => Promise<ModuleFactory>[];
export type InstanceFactoryFunction = () => Promise<Chart['highcharts']>;

export interface ModuleFactory {
  Highcharts?: Chart['highcharts'],
  default?: (highcharts: Chart['highcharts']) => void
}

export interface Chart {
  options: Highcharts.Options | HighchartsESM.Options,
  update?: boolean,
  highcharts?: typeof Highcharts | typeof HighchartsESM
  constructorChart?: Function;
}

export interface PartialHighchartsConfig {
  modules?: ModuleFactoryFunction;
}

export interface HighchartsConfig {
  instance?: InstanceFactoryFunction;
  options?: Chart['options'];
  modules?: ModuleFactoryFunction;
}
