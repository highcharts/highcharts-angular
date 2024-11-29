import { enableProdMode, importProvidersFrom } from '@angular/core';
import ExportingModule from 'highcharts/modules/exporting';
import SunsetTheme from 'highcharts/themes/sunset.js';
import { provideHighCharts } from '../highcharts-angular/src/public_api';
import { environment } from './environments/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideHttpClient(withInterceptorsFromDi()),
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
      modules: [ExportingModule, SunsetTheme]
    })
  ]
})
  .catch(err => console.log(err));
