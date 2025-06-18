import {
  EnvironmentProviders,
  makeEnvironmentProviders,
  Provider,
} from '@angular/core';
import {
  HIGHCHARTS_LOADER,
  HIGHCHARTS_CONFIG,
  HIGHCHARTS_ROOT_MODULES,
  HIGHCHARTS_OPTIONS,
} from './highcharts-chart.token';
import {
  ModuleFactoryFunction,
  HighchartsConfig,
  PartialHighchartsConfig,
  InstanceFactoryFunction,
} from './types';
import type Highcharts from 'highcharts/esm/highcharts';

const emptyModuleFactoryFunction: ModuleFactoryFunction = () => [];
const defaultInstanceFactoryFunction: InstanceFactoryFunction = () =>
  import('highcharts/esm/highcharts').then(m => m.default);

function provideHighchartsInstance(
  instance: InstanceFactoryFunction | undefined,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: HIGHCHARTS_LOADER,
      useValue: instance ?? defaultInstanceFactoryFunction,
    },
  ]);
}

function provideHighchartsOptions(
  options: Highcharts.Options,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: HIGHCHARTS_OPTIONS, useValue: options },
  ]);
}

function provideHighchartsRootModules(
  modules: ModuleFactoryFunction,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: HIGHCHARTS_ROOT_MODULES, useValue: modules },
  ]);
}

export function providePartialHighcharts(
  config: PartialHighchartsConfig,
): Provider {
  return { provide: HIGHCHARTS_CONFIG, useValue: config };
}

export function provideHighcharts(
  config: HighchartsConfig = {},
): EnvironmentProviders {
  const providers: EnvironmentProviders[] = [
    provideHighchartsInstance(config.instance),
    provideHighchartsRootModules(config.modules ?? emptyModuleFactoryFunction),
  ];
  if (config.options) {
    providers.push(provideHighchartsOptions(config.options));
  }
  return makeEnvironmentProviders(providers);
}
