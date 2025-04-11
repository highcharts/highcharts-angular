import type Highcharts from 'highcharts/esm/highcharts';

export type ChartConstructorType = 'chart' | 'ganttChart' | 'stockChart' | 'mapChart';

export type ModuleFactoryFunction = () => Promise<ModuleFactory>[];
export type InstanceFactoryFunction = () => Promise<typeof Highcharts>;

export type ModuleFactory = {
  Highcharts?: Chart['highcharts'],
  default?: unknown,
}

export type ConstructorChart = (element: HTMLElement, options: Highcharts.Options, callback: (chart: Highcharts.Chart) => void) => Highcharts.Chart;
export type Chart = {
  options: Highcharts.Options,
  update?: boolean,
  highcharts?: typeof Highcharts
  constructorChart?: ConstructorChart;
}

export type PartialHighchartsConfig = {
  /**
   * Include Highcharts additional modules (e.g., exporting, accessibility) or custom themes
   */
  modules?: ModuleFactoryFunction;
}

export type HighchartsConfig = {
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
