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
  /**
   * Include Highcharts additional modules (e.g., exporting, accessibility) or custom themes
   */
  modules?: ModuleFactoryFunction;
}

export interface HighchartsConfig {
  /**
   * Define the Highcharts instance dynamically
   */
  instance?: InstanceFactoryFunction;

  /**
   * Global chart options applied across all charts
   */
  options?: Chart['options'];

  /**
   * Include Highcharts additional modules (e.g., exporting, accessibility) or custom themes
   */
  modules?: ModuleFactoryFunction;
}
