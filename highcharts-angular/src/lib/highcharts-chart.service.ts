import { inject, Injectable, signal } from '@angular/core';
import { HIGHCHARTS_ROOT_MODULES, HIGHCHARTS_LOADER, HIGHCHARTS_OPTIONS } from './highcharts-chart.token';
import { ModuleFactoryFunction, PartialHighchartsConfig } from './types';
import type Highcharts from 'highcharts/esm/highcharts';

@Injectable({ providedIn: 'root' })
export class HighchartsChartService {
  public readonly highcharts = signal<typeof Highcharts | null>(null);

  private readonly loader = inject(HIGHCHARTS_LOADER);
  private readonly globalOptions = inject(HIGHCHARTS_OPTIONS, {
    optional: true,
  });
  private readonly globalModules = inject(HIGHCHARTS_ROOT_MODULES, {
    optional: true,
  });

  private sharedHighchartsPromise: Promise<typeof Highcharts> | null = null;
  private readonly moduleLoadCache = new WeakMap<ModuleFactoryFunction, Promise<void>>();
  private globalOptionsApplied = false;

  private async loadModules(modulesFactory?: ModuleFactoryFunction | null): Promise<void> {
    if (!modulesFactory) {
      return;
    }

    const cachedLoad = this.moduleLoadCache.get(modulesFactory);
    if (cachedLoad) {
      return cachedLoad;
    }

    const moduleLoad = Promise.allSettled(modulesFactory()).then(moduleResults => {
      const rejectedModules = moduleResults.filter(
        (result): result is PromiseRejectedResult => result.status === 'rejected',
      );

      if (rejectedModules.length) {
        const reasons = rejectedModules.map(({ reason }) =>
          reason instanceof Error ? reason.message : String(reason),
        );

        throw new Error(`Failed to load Highcharts modules: ${reasons.join('; ')}`);
      }
    });

    this.moduleLoadCache.set(modulesFactory, moduleLoad);

    return moduleLoad;
  }

  private async ensureSharedHighcharts(): Promise<typeof Highcharts> {
    if (!this.sharedHighchartsPromise) {
      this.sharedHighchartsPromise = (async () => {
        const highcharts = await this.loader();

        // Root-level modules and options mutate a shared Highcharts singleton,
        // so initialize them once and reuse the same ready instance afterwards.
        await this.loadModules(this.globalModules);

        if (this.globalOptions && !this.globalOptionsApplied) {
          highcharts.setOptions(this.globalOptions);
          this.globalOptionsApplied = true;
        }

        return highcharts;
      })();
    }

    return this.sharedHighchartsPromise;
  }

  public async load(partialConfig: PartialHighchartsConfig | null): Promise<typeof Highcharts> {
    const highcharts = await this.ensureSharedHighcharts();

    // Component-level modules are still loaded per config, but cached by the
    // factory function so identical providers do not repeat the same work.
    await this.loadModules(partialConfig?.modules);

    this.highcharts.set(highcharts);
    return highcharts;
  }
}
