# Highcharts Angular

Official minimal Highcharts integration for Angular.

## Table of Contents
1. [Getting Started](#getting-started)
   1. [General Prerequisites](#general-prerequisites)
   2. [Installing](#installing)
   3. [Upgrade to v5](#upgrade-to-v5)
   4. [Usage](#usage)
   5. [SSR Support](#ssr-support)
   6. [Angular Elements and `useHTML`](#angular-elements-and-usehtml)
2. [Options Details](#options-details)
3. [Chart Instance](#chart-instance)
4. [Highcharts Partial Loading on the Component Level](#highcharts-partial-loading-on-the-component-level)
   1. [Loading a Module & Plugin](#to-load-a-module--plugins)
   2. [Loading a Map for Highcharts Maps](#to-load-a-map-for-highcharts-maps)
   3. [Loading a Map for Highcharts Stock](#to-load-a-stock-for-highcharts)
   4. [Loading a Wrapper](#to-load-a-wrapper)
5. [Demo App](#demo-app)
   1. [Play with the App](#play-with-the-app)
   2. [Files to Modify](#files-to-play-with)
6. [Online Examples](#online-examples)
7. [Release](#release)
8. [Help and FAQ](#help-and-faq)

---

## Getting Started

### General Prerequisites

Ensure that **Node.js**, **npm**, and **Angular** are installed and up to date. Refer to the compatibility table below for the required versions:

| Highcharts Angular Version | Node.js   | Angular   | Highcharts   |
|----------------------------|-----------|-----------|--------------|
| 5.0.0                      | >=18.19   | >=19.0.0  | >=11.0.0     |
| 4.0.0                      | >=16.14   | >=16.0.0  | >=11.0.0     |
| 3.1.2                      | >=14.13   | >=15.0.0  | >=10.3.3     |
| 3.0.0                      | >=14.13   | >=9.0.0   | >=8.0.0      |
| <2.10.0                    | >=6.10.2  | >=6.0.0   | >=6.0.0      |

---

### Installing

Install the `highcharts-angular` package along with the [highcharts](https://www.highcharts.com/docs/getting-started/install-from-npm) dependency:

```bash
npm install highcharts-angular highcharts --save
```

Then, configure the Highcharts provider in your app.config.ts file:

```ts
import { provideHighCharts } from 'highcharts-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    // Other providers
    provideHighCharts({
      // Optional: Define the Highcharts instance
      // instance: () => import('highcharts'),

      // Global options for all charts
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

      // Modules for additional functionality
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
```

The `provideHighCharts` function allows you to define global settings for all charts within your project.

Here is the configuration interface for reference:

```ts
export interface HighchartsConfig {
  instance?: Promise<typeof Highcharts>;
  options?: Highcharts.Options;
  modules?: ModuleFactoryFunction;
}
```

### Key Notes:
- The `instance` property allows you to specify the Highcharts instance dynamically.
- The `options` property is used to define global chart configurations applied across all charts.
- The `modules` a callback with an array enables you to include Highcharts modules (e.g., exporting, accessibility) or custom themes.

### Upgrade to v5

Version 5 introduces significant improvements and changes to align with modern Angular practices. **Please review the following breaking changes before upgrading:**

#### Breaking Changes

1. **Dropped Support for `HighchartsChartModule`:**
  - In v5, the package no longer requires `HighchartsChartModule`. This change leverages Angular's standalone component model for a more streamlined development experience.
  - **Action Required:** Migrate your components to standalone by importing necessary dependencies directly into the component or directive.

### Usage

You can use Highcharts in your Angular application either as a **Component** or a **Directive**. Below are the usage examples for both approaches:

---

#### 1. Using the Component

In your `app.component.ts`, import the required `HighchartsChartComponent` and other relevant types at the top of the file:

```ts
import { Component } from '@angular/core';
import { HighchartsChartComponent, ChartConstructorType } from 'highcharts-angular';

@Component({
  template: `
    <highcharts-chart
      [constructorType]="chartConstructor"
      [options]="chartOptions"
      [callbackFunction]="chartCallback"
      [(update)]="updateFlag"
      [oneToOne]="oneToOneFlag"
      class="chart"
    ></highcharts-chart>
  `,
  styles: [`.chart { width: 100%; height: 400px; display: block; }`],
  imports: [HighchartsChartComponent]
})
export class AppComponent {
  chartOptions: Highcharts.Options = { ... }; // Required
  chartConstructor: ChartConstructorType = 'chart'; // Optional, defaults to 'chart'
  chartCallback: Highcharts.ChartCallbackFunction = function (chart) { ... }; // Optional, defaults to null
  updateFlag: boolean = false; // Optional
  oneToOneFlag: boolean = true; // Optional, defaults to false
}
```

#### 2. Using the Directive

In your `app.component.ts`, import the `HighchartsChartDirective` and other relevant types at the top of the file:


```ts
import {Component} from '@angular/core';
import { HighchartsChartDirective, ChartConstructorType } from 'highcharts-angular';

@Component({
  template: `
    <div
      highcharts-chart
      [constructorType]="chartConstructor"
      [options]="chartOptions"
      [callbackFunction]="chartCallback"
      [(update)]="updateFlag"
      [oneToOne]="oneToOneFlag"
      class="chart"
    ></div>
  `,
  styles: [`.chart { width: 100%; height: 400px; display: block; }`],
  imports: [HighchartsChartDirective]
})
export class AppComponent {
  chartOptions: Highcharts.Options = { ... }; // Required
  chartConstructor: ChartConstructorType = 'chart'; // Optional, defaults to 'chart'
  chartCallback: Highcharts.ChartCallbackFunction = function (chart) { ... }; // Optional, defaults to null
  updateFlag: boolean = false; // Optional
  oneToOneFlag: boolean = true; // Optional, defaults to false
}
```

#### 3. Example

This is the minimum example you can start with:

```ts
import { Component } from '@angular/core';
import { HighchartsChartDirective } from 'highcharts-angular';

@Component({
  template: `
    <div  highcharts-chart [options]="chartOptions" class="chart"></div>
  `,
  styles: [`.chart { width: 100%; height: 400px; display: block; }`],
  imports: [HighchartsChartDirective]
})
export class AppComponent {
  chartOptions: Highcharts.Options = {
    series: [{
      data: [1, 2, 3],
      type: 'line'
    }]
  };
}
```

Build and run your Angular app to see a basic line chart.

Used options are explained [below](#options-details).

### SSR Support

Both the component and directive in this library are fully compatible with Angular Universal (SSR).

In SSR, the code runs twice: once on the server (in an environment without a window object) and once in the browser. Since Highcharts is tightly integrated with browser events, it should not run on the server-side. But don’t worry—we’ve already handled this case for you! 😉

Our showcase application includes an example of SSR integration. You can try it by running: 
``` cli 
ng serve my-ssr-app --open
```

### Angular Elements and useHTML

First, install angular elements:

```cli
npm install @angular/elements --save
```

Include in main.ts file your element tag inside allowedTags and [element properties](https://angular.io/guide/elements#mapping) inside allowedAttributes:

```ts
if (Highcharts && Highcharts.AST) {
  Highcharts.AST.allowedTags.push('translation-element');
  Highcharts.AST.allowedAttributes.push('translation-key');
}
```

Define your element in the constructor of the component that will use it:

```ts
private defineTranslationElement() {
  if (isNil(customElements.get('translation-element'))) {
    const translationElement = createCustomElement(TranslationComponent, {injector: this.injector});
    customElements.define('translation-element', translationElement);
  }
}
```

Then, create the element, set properties and use it in the chart:

```ts
const translationEl: NgElement & WithProperties<TranslationComponent> = document.createElement(translationElementTag);
translationEl.setAttribute('translation-key', 'shared.title');      

const chartOptions: Highcharts.Options = {
  title: {
    text: translationEl.outerHTML,
    useHTML: true,
  },
  ...
}
```

For a more detailed view take a look at the [Online Examples - Angular Elements and useHTML](#online-examples)

## Options details

| Parameter             | Type                 | Required | Defaults  | Description                                                                                                                                                                                                                                                                             |
| --------------------- | -------------------- | -------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[constructorType]`    | `ChartConstructorType` | No       | `'chart'` | A string for the [constructor method](https://www.highcharts.com/docs/getting-started/your-first-chart). Official constructors include: <br>- `'chart'` for Highcharts charts <br>- `'stockChart'` for Highcharts Stock <br>- `'mapChart'` for Highcharts Maps <br>- `'ganttChart'` for Highcharts Gantt <br><br> Note that `'stockChart'`, `'mapChart'`, and `'ganttChart'` require loading the appropriate package or module. |
| `[options]`            | `Object`              | Yes      | `-`       | The chart options as described in the [Highcharts API reference](http://api.highcharts.com/highcharts). A minimal working object for basic testing is `{ series:[{ data:[1, 2] }] }`.                                                                                                                                               |
| `[(update)]`           | `Boolean`             | No       | `-`       | A boolean to trigger a chart update. Angular does not detect nested changes in objects passed to a component. Set the corresponding variable (`updateFlag` in the example) to `true`, and after the update is done, it will asynchronously change back to `false` by the Highcharts Angular component. |
| `[oneToOne]`           | `Boolean`             | No       | `false`   | The `oneToOne` parameter for [updates](https://api.highcharts.com/class-reference/Highcharts.Chart#update). When `true`, the `series`, `xAxis`, and `yAxis` collections will be updated one to one, and items will be added or removed to match the updated options. For example, if a chart has **two** series, calling `chart.update` with a configuration containing **three** series will add **one**. Similarly, calling `chart.update` with **one** series will remove **one**. Setting an empty series array removes all series, while leaving out the `series` property leaves them untouched. If the series have `id`s, new series options will be matched by `id`, and the remaining ones will be removed. <br><br> This option is demonstrated in [the demo](#demo-app). Try setting new chart options with different numbers of series in the [textarea input](https://github.com/highcharts/highcharts-angular/blob/36e158e684b5823e1b1bd1cedf75548022eba1a9/src/app/app.component.html#L7) to see it in action. |
| `[callbackFunction]`   | `Function`            | No       | `-`       | A callback function that is triggered when the chart is created. The first argument will be the created **chart**. The default `this` inside the function will refer to the **chart**.                                                                                                                                              |

## Chart instance

A chart instance can be obtained using the following methods:

* **Chart's callback function** - The `chart` is provided as the first argument (see [demo app](#demo-app) and the first `hcCallback` function).
* **Chart's events** - The context of all [chart's events](https://api.highcharts.com/highcharts/chart.events) functions is the chart instance.
* **Component output `chartInstance`** - Emitted after the chart is created (see [demo app](#demo-app) and the `logChartInstance` function).

**Note:** If you are obtaining the chart instance from the **[chart's load event](https://api.highcharts.com/highcharts/chart.events.load)** or **chart's callback function**, and you plan to support exporting, the function will run again when the chart is exported. This is because a separate chart is created for export. To distinguish between the main chart and the export chart, you can check `chart.renderer.forExport`. It will be set to `true` for the export chart and `undefined` for the main chart.

# Highcharts Partial Loading on the Component Level

A Highcharts instance is optionally initialized with **[modules](#to-load-a-module)**, **[plugins](#to-load-a-plugin)**, **[maps](#to-load-a-map-for-Highcharts-Maps)**, **[wrappers](#to-load-a-wrapper)**, and set **[global options](#to-use-setoptions)** using **[`setOptions`](https://www.highcharts.com/docs/getting-started/how-to-set-options#2)**. **The core is required.**

**Note:** The Highcharts instance is shared across components in an Angular app, meaning that loaded modules will affect all charts.

With this v5, you can provide extra modules or plugins on demand to your chart at the component level:

## Example

### To load a module + plugins

A module is a Highcharts official addon - including Highcharts Stock [Technical Indicators](https://www.highcharts.com/docs/stock/technical-indicator-series), style [themes](https://www.highcharts.com/docs/chart-design-and-style/themes), specialized series types (e.g. [Bullet](https://www.highcharts.com/docs/chart-and-series-types/bullet-chart), [Venn](https://www.highcharts.com/docs/chart-and-series-types/venn-series)).

After importing Highcharts, Highcharts Stock, or Highcharts Maps, use `providePartialHighChart` and initialize modules with an array of Highcharts factory functions.

A plugin is a third-party/community-made Highcharts addon (plugins are listed in the [Highcharts plugin registry](https://www.highcharts.com/blog/add-ons/)). First, make sure that a plugin supports loading over NPM and load the required files. For example, [Custom-Events](https://www.npmjs.com/package/highcharts-custom-events) supports NPM loading, so after installing the package you can initialize it like:

If a plugin doesn't support loading through NPM, treat it as a wrapper - see instructions below.

If a lack of TypeScript definitions `d.ts` is showing as an error - see [Solving problems](https://www.highcharts.com/docs/advanced-chart-features/highcharts-typescript-declarations) section of Highcharts documentation for TypeScript usage.

```ts
import { Component } from '@angular/core';
import { HighchartsChartDirective } from 'highcharts-angular';

@Component({
  template: `
    <div highcharts-chart [options]="chartOptions" class="chart"></div>
  `,
  styles: [`.chart { width: 100%; height: 400px; display: block; }`],
  imports: [HighchartsChartDirective],
  providers: [
    providePartialHighChart({ 
      modules: () => {
        return [
          // Load Gantt Chart 
          import('highcharts/modules/gantt'),
          // Load core module
          import('highcharts/modules/exporting'),
          // Load plugins
          import('highcharts-custom-events'),
        ]
      }
    })
  ],
})
export class GanttComponent {
  chartOptions: Highcharts.Options = {
    series: [{
      data: [1, 2, 3],
      type: 'line'
    }]
  };
}
```

### To load a map for Highcharts Maps

Official map collection is published and [here](https://www.npmjs.com/package/@highcharts/map-collection#install-from-npm) are basic instructions for loading a map. A full example can also be found in the [demo app](#demo-app).

```ts
import { Component } from '@angular/core';
import { HighchartsChartDirective } from 'highcharts-angular';

@Component({
  template: `
    <div highcharts-chart [options]="chartOptions" class="chart"></div>
  `,
  styles: [`.chart { width: 100%; height: 400px; display: block; }`],
  imports: [HighchartsChartDirective],
  providers: [providePartialHighChart({ modules: () => [import('highcharts/modules/map')] })],
})
export class MapComponent {
  chartOptions: Highcharts.Options = {
    series: [{
      data: [1, 2, 3],
      type: 'line'
    }]
  };
}
```

### To load a stock for Highcharts

```ts
import { Component } from '@angular/core';
import { HighchartsChartDirective } from 'highcharts-angular';

@Component({
  template: `
    <div highcharts-chart [options]="chartOptions" class="chart"></div>
  `,
  styles: [`.chart { width: 100%; height: 400px; display: block; }`],
  imports: [HighchartsChartDirective],
  providers: [providePartialHighChart({ modules: () => [import('highcharts/modules/stock')] })],
})
export class StockComponent {
  chartOptions: Highcharts.Options = {
    series: [{
      data: [1, 2, 3],
      type: 'line'
    }]
  };
}
```

### To load a wrapper

A wrapper is a [custom extension](https://www.highcharts.com/docs/extending-highcharts/extending-highcharts) for Highcharts. To load a wrapper in the same way as a module, save it as a JavaScript file and add the following code to the beginning and end of the file:

```js
(function (factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory;
  } else {
    factory(Highcharts);
  }
}(function (Highcharts) {

...
/* wrapper code */
...

}));
```

Next, you will be loading a local `.js` file, so add `allowJs: true` to the `tsconfig.json` in your app:

```json
{
  "compilerOptions": {
    "allowJs": true
  }
}
```

The wrapper is now ready to be imported into your app. Use `require` instead of `import` to prevent TS5055 errors:

```ts
import { Component } from '@angular/core';
import { HighchartsChartDirective } from 'highcharts-angular';


@Component({
  template: `
    <div highcharts-chart [options]="chartOptions" class="chart"></div>
  `,
  styles: [`.chart { width: 100%; height: 400px; display: block; }`],
  imports: [HighchartsChartDirective],
  providers: [providePartialHighChart({ modules: () => [import('./relative-path-to-the-wrapper-file/wrapper-file-name')] })],
})
export class StockComponent {
  chartOptions: Highcharts.Options = {
    series: [{
      data: [1, 2, 3],
      type: 'line'
    }]
  };
}
```

Where `relative-path-to-the-wrapper-file` is the relative path (from the module importing the wrapper) to the wrapper file, and `wrapper-file-name` is the name of the wrapper file.

If TypeScript definitions (`d.ts`) are missing and causing errors, see the [Solving problems](https://www.highcharts.com/docs/advanced-chart-features/highcharts-typescript-declarations) section of the Highcharts documentation for TypeScript usage.

## Demo app

Download (or clone) the contents of the **[highcharts-angular](https://github.com/highcharts/highcharts-angular)** GitHub repository.  
The demo app does not rely on external dependencies but instead builds the `highcharts-angular` package, so it's necessary to run `npm start` to generate this package.

In your system console, in the main repo folder, run:

```cli
npm install
```

1. Start Default:
```cli
npm start
```

2. Start with SSR:
```cli
npm start:ssr
```

The command `npm start` will launch the default app, while `npm start:ssr` will start the server-side rendering (SSR) version. Both versions can be accessed at [http://localhost:4200/](http://localhost:4200/) in your default browser.

To open the app on a different port (e.g., `12345`), use:

```cli
npm start -- --port 12345
```

### Play with the app

Keep the console running, and modify files — after saving, the app will automatically rebuild and refresh in the localhost preview.

### Files to play with

* **app.component.ts** (located in `src\app`)

This file contains the main Angular component, which utilizes different components like *line-chart*, *gantt-chart*, *map-chart*, and *stock-chart*.


## Online examples

* [Basic line](https://stackblitz.com/edit/highcharts-angular-line)
* [Stock](https://stackblitz.com/edit/highcharts-angular-stock-chart)
* [Stock + indicators](https://stackblitz.com/edit/highcharts-angular-stock-with-indicators)
* [Stock + GUI](https://stackblitz.com/edit/highcharts-angular-stock-tools-gui)
* [Map](https://stackblitz.com/edit/highcharts-angular-world-map)
* [Gantt](https://stackblitz.com/edit/highcharts-angular-gantt-chart)
* [Map + mapppoints with lat/lon](https://stackblitz.com/edit/highcharts-angular-mappoint-lat-lon)
* [Map + mapppoints with proj4](https://stackblitz.com/edit/highcharts-angular-map-with-proj4)
* [Optimal way to update](https://stackblitz.com/edit/highcharts-angular-update-optimal-way)
* [Data from the service](https://stackblitz.com/edit/highcharts-angular-data-from-a-service)
* [Applying a custom plugin/wrap](https://stackblitz.com/edit/highcharts-angular-a-custom-plugin)
* [Property `XXX` does not exist on type `YYY`](https://stackblitz.com/edit/highcharts-angular-property-xxx-doesnt-exist)
* [Using portals to render an angular component within a chart](https://stackblitz.com/edit/highcharts-angular-portals)
* [Angular Elements and useHTML](https://stackblitz.com/~/github.com/karolkolodziej/highcharts-angular-elements)

## Release

Using Angular CLI v19, the library must be manually rebuilt on each change in order to reflect in the demo app.

Run the following command on each change to the `highcharts-chart.directive.ts` file:

```cli
npm run build
```

If you are running the demo app in another terminal window when you rebuild the
library, the changes should be reflected in your browser (note: you may need to
refresh the browser a second time after the live reload in order to see the change).

For CHANGELOG.md update use :
```cli
npm run release
```

## Help and FAQ

For technical support please contact [Highcharts technical support](https://www.highcharts.com/support).

For TypeScript problems with Highcharts first see [Highcharts documentation for TypeScript usage](https://www.highcharts.com/docs/advanced-chart-features/highcharts-typescript-declarations).

### FAQ:

#### How to add and use indicators?

Add [indicators](https://www.highcharts.com/docs/chart-and-series-types/technical-indicator-series) as any other module.
[Live demo](https://stackblitz.com/edit/highcharts-angular-stock-with-indicators)

#### How to add and use themes?

Add [themes](https://www.highcharts.com/docs/chart-design-and-style/themes) as any other module.
See the [demo app](#demo-app) in this repository for an example.

More info about custom themes in [Highcharts general documentation](https://www.highcharts.com/docs/chart-design-and-style/custom-themes-in-styled-mode).

#### I have a general issue with Highcharts and TypeScript

The correct repository to report such issues is [main Highcharts repository](https://github.com/highcharts/highcharts/issues).

#### Synchronized Charts Angular demo

Based on original Highcharts demo for [Synchronized charts](https://www.highcharts.com/demo/synchronized-charts).

Additionally added class based sync between charts - [demo](https://stackblitz.com/edit/highcharts-angular-synced-charts).

#### Property `XXX` does not exist on type `YYY`

It is happening when you are trying to use non-existing property or one of our internal properties that are not publicly available for example `axis.dataMin`. To fix that you need to create your own type that will extend the default Highcharts one with the new properties. Then all you need to do is to cast the selected option / to the extended type - [demo](https://stackblitz.com/edit/highcharts-angular-property-xxx-doesnt-exist).

#### How to use Highcharts Maps with the proj4?

Install the `proj4` library and its types `@types/proj4`. Then pass it to `chartOptions.chart.proj4` property. See the [demo app](#demo-app) in this repository or [live demo](https://stackblitz.com/edit/highcharts-angular-map-with-proj4) example.

#### I want to render angular component in the tooltip/axis formatter

To render angular component within the chart you can use the angular [portals](https://material.angular.io/cdk/portal/overview) - [demo](https://stackblitz.com/edit/highcharts-angular-portals)
