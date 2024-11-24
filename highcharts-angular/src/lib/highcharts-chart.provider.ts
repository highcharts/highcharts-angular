import { Provider } from '@angular/core';
import { HIGHCHARTS_MODULE, HIGHCHARTS_ES_MODULE } from './highcharts-chart.token';
import { Chart, moduleFactory } from './types';

export const provideHighChartsModuleFactory = (...modules: moduleFactory[]): Provider[] => {
  return [
    {
      provide: HIGHCHARTS_MODULE,
      useFactory: () => import('highcharts').then(m => m.default),
    },
    {
      provide: HIGHCHARTS_ES_MODULE,
      useFactory: async (Highcharts: Promise<Chart['highcharts']>) => {
        const value = await Highcharts;
        modules.forEach(module => module(value));
        return value;
      },
      deps: [HIGHCHARTS_MODULE],
    }
  ]
}
