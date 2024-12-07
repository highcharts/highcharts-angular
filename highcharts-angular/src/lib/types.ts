import type Highcharts from 'highcharts';
import type HighchartsESM from 'highcharts/es-modules/masters/highcharts.src';

export interface Chart {
  options: Highcharts.Options | HighchartsESM.Options,
  update: boolean,
  highcharts?: typeof Highcharts | typeof HighchartsESM
  constructorChart?: Function;
}

export type ChartType = 'chart' | 'ganttChart' | 'stockChart' | 'mapChart';
export type moduleFactory = (highcharts: Chart['highcharts']) => void;

export interface PartialHighchartsConfig {
  modules?: moduleFactory[];
}

export interface HighchartsConfig {
  instance?: Promise<Chart['highcharts']>;
  options?: Chart['options'];
  modules?: moduleFactory[];
}
