import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';
import { HIGHCHARTS_LOADER, HIGHCHARTS_CONFIG, HIGHCHARTS_ROOT_MODULES, HIGHCHARTS_OPTIONS } from './highcharts-chart.token';
import { Chart, ModuleFactoryFunction, HighchartsConfig, PartialHighchartsConfig, InstanceFactoryFunction } from './types';

const emptyModuleFactoryFunction: ModuleFactoryFunction = () => [];
// tslint:disable-next-line:max-line-length
const defaultInstanceFactoryFunction: InstanceFactoryFunction = () => import('highcharts/esm/highcharts').then(m => m.default);

function provideHighChartInstance(instance: InstanceFactoryFunction) {
  return makeEnvironmentProviders([{ provide: HIGHCHARTS_LOADER, useValue: instance || defaultInstanceFactoryFunction }]);
}

function provideHighChartOptions(options: Chart['options']) {
  return makeEnvironmentProviders([{ provide: HIGHCHARTS_OPTIONS, useValue: options } ]);
}

function provideHighChartRootModules(modules: ModuleFactoryFunction) {
  return makeEnvironmentProviders([{ provide: HIGHCHARTS_ROOT_MODULES, useValue: modules }]);
}

export function providePartialHighChart(config: PartialHighchartsConfig): Provider {
  return { provide: HIGHCHARTS_CONFIG, useValue: config };
}

export function provideHighCharts(config: HighchartsConfig) {
  const providers: EnvironmentProviders[] = [
    provideHighChartInstance(config.instance),
    provideHighChartRootModules(config.modules || emptyModuleFactoryFunction)
  ];
  if (config.options) {
    providers.push(provideHighChartOptions(config.options));
  }
  return providers;
}
