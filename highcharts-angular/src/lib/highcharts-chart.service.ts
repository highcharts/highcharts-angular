import { inject, Injectable, signal } from '@angular/core';
import { HIGHCHARTS_ROOT_MODULES, HIGHCHARTS_LOADER, HIGHCHARTS_OPTIONS } from './highcharts-chart.token';
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

  private async loadHighchartsWithModules(partialConfig: PartialHighchartsConfig | null): Promise<typeof Highcharts> {
    const highcharts = await this.loader(); // Ensure Highcharts core is loaded

    const moduleResults = await Promise.allSettled([
      ...(this.globalModules?.() ?? []),
      ...(partialConfig?.modules?.() ?? []),
    ]);
    const rejectedModules = moduleResults.filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected',
    );

    if (rejectedModules.length) {
      const reasons = rejectedModules.map(({ reason }) => (reason instanceof Error ? reason.message : String(reason)));

      throw new Error(`Failed to load Highcharts modules: ${reasons.join('; ')}`);
    }

    // Return the Highcharts instance
    return highcharts;
  }

  public load(partialConfig: PartialHighchartsConfig | null): void {
    this.loadHighchartsWithModules(partialConfig).then(highcharts => {
      if (this.globalOptions) {
        highcharts.setOptions(this.globalOptions);
      }
      this.highcharts.set(highcharts);
    });
  }
}
