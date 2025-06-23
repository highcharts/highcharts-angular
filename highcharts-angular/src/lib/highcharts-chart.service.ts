import { inject, Injectable, signal } from '@angular/core';
import { HIGHCHARTS_ROOT_MODULES, HIGHCHARTS_LOADER, HIGHCHARTS_OPTIONS } from './highcharts-chart.token';
import { PartialHighchartsConfig } from './types';
import type Highcharts from 'highcharts/esm/highcharts';

@Injectable({ providedIn: 'root' })
export class HighchartsChartService {
  private readonly writableHighcharts = signal<typeof Highcharts | null>(null);
  public readonly highcharts = this.writableHighcharts.asReadonly();

  private readonly loader = inject(HIGHCHARTS_LOADER);
  private readonly globalOptions = inject(HIGHCHARTS_OPTIONS, {
    optional: true,
  });
  private readonly globalModules = inject(HIGHCHARTS_ROOT_MODULES, {
    optional: true,
  });

  private async loadHighchartsWithModules(partialConfig: PartialHighchartsConfig | null): Promise<typeof Highcharts> {
    const highcharts = await this.loader(); // Ensure Highcharts core is loaded

    await Promise.all([...(this.globalModules?.() ?? []), ...(partialConfig?.modules?.() ?? [])]);

    // Return the Highcharts instance
    return highcharts;
  }

  public load(partialConfig: PartialHighchartsConfig | null): void {
    this.loadHighchartsWithModules(partialConfig).then(highcharts => {
      if (this.globalOptions) {
        highcharts.setOptions(this.globalOptions);
      }
      // add timeout to make sure the loader has attached all modules
      setTimeout(() => this.writableHighcharts.set(highcharts), 100);
    });
  }
}
