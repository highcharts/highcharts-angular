import {provideHttpClient, withFetch, withInterceptorsFromDi} from '@angular/common/http';
import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { provideHighCharts } from 'highcharts-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // provideClientHydration(withEventReplay()),
    importProvidersFrom(BrowserModule),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    provideHighCharts({
      options: {
        title: {
          style: {
            color: 'tomato'
          }
        },
        legend: {
          enabled: false
        }
      },
      // The modules will work for all charts.
      modules: () => {
        return [
          import('highcharts/modules/accessibility'),
          import('highcharts/modules/exporting'),
          import('highcharts/themes/sunset')
        ]
      }
    })
  ]
};
