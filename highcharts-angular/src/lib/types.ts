import type Highcharts from 'highcharts';
import type HighchartsESM from 'highcharts/es-modules/masters/highcharts.src';

export interface Chart {
  options: Highcharts.Options | HighchartsESM.Options,
  update: boolean,
  highcharts: typeof Highcharts | typeof HighchartsESM
}

export type moduleFactory = (highcharts: Chart['highcharts']) => void;
