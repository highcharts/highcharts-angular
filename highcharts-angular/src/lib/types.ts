import type Highcharts from 'highcharts/esm/highcharts';

export type ChartConstructorType = 'chart' | 'ganttChart' | 'stockChart' | 'mapChart';

export type ModuleFactoryFunction = () => Promise<ModuleFactory>[];
export type InstanceFactoryFunction = () => Promise<Chart['highcharts']>;

export interface ModuleFactory {
  Highcharts?: Chart['highcharts'],
  default?: unknown,
}

export interface Chart {
  options: Highcharts.Options,
  update?: boolean,
  highcharts?: typeof Highcharts
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
