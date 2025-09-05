import type Highcharts from 'highcharts/esm/highcharts';

export type ChartConstructorType = 'chart' | 'ganttChart' | 'stockChart' | 'mapChart';

export type ModuleFactoryFunction = () => Promise<ModuleFactory>[];
export type InstanceFactoryFunction = () => Promise<typeof Highcharts>;

type ModuleFactory = {
  Highcharts?: typeof Highcharts;
  default?: unknown;
};

export type ConstructorChart = (
  element: HTMLElement,
  options: Highcharts.Options,
  callback: (chart: Highcharts.Chart) => void,
) => Highcharts.Chart;

export type PartialHighchartsConfig = {
  /**
   * Include Highcharts additional modules (e.g., exporting, accessibility) or custom themes
   */
  modules?: ModuleFactoryFunction;
  /**
   * Timeout in milliseconds to wait for the Highcharts library to load
   * Default is 500ms
   */
  timeout?: number;
};

export type HighchartsConfig = {
  /**
   * Define the Highcharts instance dynamically
   */
  instance?: InstanceFactoryFunction;

  /**
   * Global chart options applied across all charts
   */
  options?: Highcharts.Options;
} & PartialHighchartsConfig;
