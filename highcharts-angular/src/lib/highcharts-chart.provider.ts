import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';
import { HIGHCHARTS_LOADER, HIGHCHARTS_MODULES, HIGHCHARTS_ROOT_MODULES, HIGHCHARTS_OPTIONS } from './highcharts-chart.token';
import { Chart, moduleFactory, HighchartsConfig } from './types';


export function provideHighChartInstance(instance: Promise<Chart['highcharts']>) {
  return makeEnvironmentProviders([
    {
      provide: HIGHCHARTS_LOADER,
      useValue: instance || import('highcharts').then(m => m.default),
    },
  ]);
}

export function providePartialHighChart(config: Pick<HighchartsConfig, 'instance' | 'modules'>): Provider[] {
  const providers: Provider[] = [];
  if (config.modules) {
    const modules = config.modules.map((module) => ({
      provide: HIGHCHARTS_MODULES,
      useValue: module,
      multi: true,
    }))
    providers.push(...modules);
  }
  if (config.instance) {
    providers.push({provide: HIGHCHARTS_LOADER, useValue: config.instance});
  }
  return providers;
}


export function provideHighChartOptions(options: Chart['options']) {
  return makeEnvironmentProviders([{provide: HIGHCHARTS_OPTIONS, useValue: options || {}}]);
}

export function provideHighChartRootModules(...modules: moduleFactory[]) {
  return makeEnvironmentProviders([{provide: HIGHCHARTS_ROOT_MODULES, useValue: modules}]);
}

export function provideHighCharts(config: HighchartsConfig) {
  const providers: EnvironmentProviders[] = [provideHighChartInstance(config.instance)];
  if (config.options) {
    providers.push(provideHighChartOptions(config.options));
  }
  if (config.modules) {
    providers.push(provideHighChartRootModules(...config.modules));
  }
  return providers;
}
