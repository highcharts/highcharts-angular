import { inject, Injectable, signal } from '@angular/core';
import {
  HIGHCHARTS_ROOT_MODULES,
  HIGHCHARTS_LOADER,
  HIGHCHARTS_OPTIONS,
  HIGHCHARTS_TIMEOUT,
} from './highcharts-chart.token';
import { PartialHighchartsConfig } from './types';
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
  private readonly timeout = inject(HIGHCHARTS_TIMEOUT, {
    optional: true,
  });

  private async loadHighchartsWithModules(partialConfig: PartialHighchartsConfig | null): Promise<typeof Highcharts> {
    const highcharts = await this.loader(); // Ensure Highcharts core is loaded

    await Promise.allSettled([...(this.globalModules?.() ?? []), ...(partialConfig?.modules?.() ?? [])]);

    // Return the Highcharts instance
    return highcharts;
  }

  public load(partialConfig: PartialHighchartsConfig | null): void {
    this.loadHighchartsWithModules(partialConfig).then(highcharts => {
      if (this.globalOptions) {
        highcharts.setOptions(this.globalOptions);
      }
      setTimeout(() => this.highcharts.set(highcharts), this.timeout ?? 100);
    });
  }
}
