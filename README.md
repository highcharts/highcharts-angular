# Highcharts Angular
Official minimal Highcharts wrapper for Angular

## Table of Contents
1. [Getting started](#getting-started)
    1. [General prerequisites](#general-prerequisites)
    2. [Installing](#installing)
    3. [Hello world demo](#hello-world-demo)
2. [Options details](#options-details)
3. [Chart instance](#chart-instance)
4. [Highcharts instance details](#highcharts-instance-details)
    1. [Core](#core)
    2. [To load a module](#to-load-a-module)
    3. [To load a plugin](#to-load-a-plugin)
    4. [To load a map for Highmaps](#to-load-a-map-for-highmaps)
    5. [To load a wrapper](#to-load-a-wrapper)
    6. [To use setOptions](#to-use-setoptions)
5. [Demo app](#demo-app)
    1. [Play with the app](#play-with-the-app)
    2. [Files to play with](#files-to-play-with)
6. [Changing the Component](#changing-the-component)
7. [Help and FAQ](#help-and-faq)



## Getting started

### General prerequisites

Make sure you have **node**, **NPM** and **Angular** up to date.
Tested and required versions:

* node 6.10.2+
* npm 4.6.1+
* @angular/cli 6.0.0+

### Installing

Get package from NPM in your Angular app:

```cli
npm install highcharts-angular --save
```

In your app.module.ts add the HighchartsChartModule:

```ts
...
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  imports: [
    ...
    HighchartsChartModule
```

In a component that will be building your Highcharts charts you will need to [import Highcharts](https://www.highcharts.com/docs/getting-started/install-from-npm) first, so in system console, while in your Angular app:

```cli
npm install highcharts --save
```

Next, in the app.component.ts, in top lines where other `import`s are add another one for Highcharts:

```ts
import * as Highcharts from 'highcharts';
```

In the same file (app.component.ts) add to the **template** Highcharts-angular component selector `highcharts-chart`:

```html
<highcharts-chart 
  [Highcharts]="Highcharts"

  [constructorType]="chartConstructor"
  [options]="chartOptions"
  [callbackFunction]="chartCallback"

  [(update)]="updateFlag"
  [oneToOne]="oneToOneFlag"
  [runOutsideAngular]="runOutsideAngularFlag"

  style="width: 100%; height: 400px; display: block;"
></highcharts-chart>
```

Right side names, in double quotes, are just names of variables you are going to set next, so you could name then whatever you like. Style at the bottom of the selector is optional, but browsers do not know how to display `<highcharts-chart>`, so you should set some styles.

In the same file (app.component.ts) all variables should be set in `export class AppComponent {` like:

```ts
export class AppComponent {
  Highcharts = Highcharts; // required
  chartConstructor = 'chart'; // optional string, defaults to 'chart'
  chartOptions = { ... }; // required
  chartCallback = function (chart) { ... } // optional function, defaults to null
  updateFlag = false; // optional boolean
  oneToOneFlag = true; // optional boolean, defaults to false
  runOutsideAngular = false; // optional boolean, defaults to false
  ...
```

Used options are explained [below](#options-details).


### Hello world demo

To create a simple demo start with [installing](#installing).

Next for `app.component.ts`'s HTML template use:

```html
<highcharts-chart 
  [Highcharts]="Highcharts"
  [options]="chartOptions"

  style="width: 100%; height: 400px; display: block;"
></highcharts-chart>
```

and export variables:

```ts
export class AppComponent {
  Highcharts = Highcharts;
  chartOptions = {
    series: [{
      data: [1, 2, 3]
    }]
  };
  ...
```

Build and run your Angular app to see a basic line chart.



## Options details

1. `[Highcharts]="Highcharts"`

The option is **required**. This is a Highcharts instance with **required core** and optional **modules**, **plugin**, **maps**, **wrappers** and set global options using **[`setOptions`](https://www.highcharts.com/docs/getting-started/how-to-set-options#2)**. More detail for the option in [the next documentation section](#highcharts-instance-details).

2. `[constructorType]="chartConstructor"`

The option is **optional**. This is a string for [constructor method](https://www.highcharts.com/docs/getting-started/your-first-chart). Possible values:

* `'chart'` - for standard Highcharts constructor - for any Highcharts instance, this is **default value**

* `'stockChart'` - for Highstock constructor - Highstock is required

* `'mapChart'` - for Highmaps constructor - Highmaps or map module is required

3. `[options]="chartOptions"`

The option is **required**. Possible chart options could be found in [Highcharts API reference](http://api.highcharts.com/highcharts). Minimal working object that could be set for basic testing is `{ series:[{ data:[1, 2] }] }`.

4. `[callbackFunction]="chartCallback"`

The option is **optional**. A callback function for the created chart. First argument for the function will hold the created **chart**. Default `this` in the function points to the **chart**.

5. `[(update)]="updateFlag"`

The option is **optional**. A boolean to trigger update on a chart as Angular is not detecting nested changes in a object passed to a component. Set corresponding variable (`updateFlag` in the example) to `true` and after update on a chart is done it will be changed asynchronously to `false` by Highcharts-angular component.

6. `[oneToOne]="oneToOneFlag"`

The option is **optional**, defaults to `false`. The `oneToOne` parameter for [updates](https://api.highcharts.com/class-reference/Highcharts.Chart#update). When true, the `series`, `xAxis` and `yAxis` collections will be updated one to one, and items will be either added or removed to match the new updated options. For example, if the chart has **two** series and we call `chart.update` (and this is called on each chart's data change or if `updateFlag` is set to true) with a configuration containing **three** series, **one** will be added. If we call `chart.update` with **one** series, **one** will be removed. Setting an empty series array will remove all series, but leaving out the series property will leave all series untouched. If the series have id's, the new series options will be matched by id, and the remaining ones removed.

The options is presented in [the demo](#demo-app) in the first chart - try setting new chart options with different amounts of series in [the textarea input](https://github.com/highcharts/highcharts-angular/blob/36e158e684b5823e1b1bd1cedf75548022eba1a9/src/app/app.component.html#L7) to see this options in action.

7. `[runOutsideAngular]="runOutsideAngularFlag"`

The option is **optional**, defaults to `false`. When this option is set to `true` chart is created and updated outside of Angular's zone and Highcharts events do not trigger Angular change-detection. Details about `runOutsideAngular` are available in [Angular documentation](https://angular.io/api/core/NgZone#runoutsideangular). This options is more useful for bigger, more complex application (see [discussion](https://github.com/highcharts/highcharts-angular/pull/73)).

The option is presented in [this demo](https://codesandbox.io/s/k24qxvzlk7).



## Chart instance

A chart instance could be obtained using:

* **chart's callback function** - `chart` is provided as first argument (see [demo app](#demo-app) and first `hcCallback` function)
* **chart's events** - context of all [chart's events](https://api.highcharts.com/highcharts/chart.events) functions is the chart instance
* **component output `chartInstance`** - emitted after chart is created (see [demo app](#demo-app) and `logChartInstance` function)

**Notice:** If you are getting chart instance from **[chart's load event](https://api.highcharts.com/highcharts/chart.events.load)** or **chart's callback funciton** and will be supporting exporting, then this function runs again when the chart is exported, because a chart for export is being created. To distinguish when the function is called for the chart and when it's called for the for-export chart you could check `chart.renderer.forExport`. If will be set to `true` for the for-export chart and `undefined` for the main chart.



## Highcharts instance details

This is a Highcharts instance optionally with initialized **[modules](#to-load-a-module)**, **[plugins](#to-load-a-plugin)**, **[maps](#to-load-a-map-for-highmaps)**, **[wrappers](#to-load-a-wrapper)** and set **[global options](#to-use-setoptions)** using **[`setOptions`](https://www.highcharts.com/docs/getting-started/how-to-set-options#2)**. **The core is required.**

_Notice:_ The Highcharts instance is shared through components in an Angular app, so loaded modules will affect all charts.

### Core

As core you could load **Highcharts**, **Highstock** or **Highmaps**.

* For **Highcharts**:

```ts
import * as Highcharts from 'highcharts';
```

* For **Highstock**:

```ts
import * as Highcharts from 'highcharts/highstock';
```

* For **Highmaps**:

```ts
import * as Highcharts from 'highcharts/highmaps';
```
or as Highcharts with map module:
```ts
import * as Highcharts from 'highcharts';
import HC_map from 'highcharts/modules/map';
HC_map(Highcharts);
```

### To load a module

A module is a Highcharts official addon - including Highstock [Technical Indicators](https://www.highcharts.com/docs/stock/technical-indicator-series), style [themes](https://www.highcharts.com/docs/chart-design-and-style/themes), specialized series types (e.g. [Bullet](https://www.highcharts.com/docs/chart-and-series-types/bullet-chart), [Venn](https://www.highcharts.com/docs/chart-and-series-types/venn-series)). After Highcharts is imported using Highcharts, Highstock or Highmaps use `import` and initialize each module on the Highcharts variable.

```ts
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);
```

Alternatively, this could be done with `require`, but usually (depends on your app configuration) additional declaration `declare var require: any;` is needed at the top of the TypeScript file in which the modules are loaded.

```ts
import * as Highcharts from 'highcharts';
require('highcharts/modules/exporting')(Highcharts);
```

### To load a plugin

A plugin is a third party/community made Highcharts addon (plugins are listed in the [Highcharts plugin registry](https://www.highcharts.com/products/plugin-registry)). First, make sure that a plugin support loading over NPM and load the required files. In example [Custom-Events](https://www.highcharts.com/plugin-registry/single/15/Custom-Events) supports NPM loading, so after installing the package you could initialize it like:

```ts
import * as Highcharts from 'highcharts';
import * as HC_customEvents from 'highcharts-custom-events';
HC_customEvents(Highcharts);
```

If a plugin doesn't support loading through NPM you could treat it as a wrapper - see instructions below.

If a lack of TypeScirpt definitions `d.ts` is showing as an error - see [Solving problems](https://www.highcharts.com/docs/advanced-chart-features/typescript) section of Highcharts documentation for Typescript usage.

### To load a map for Highmaps

Official map collection is published and [here](https://www.npmjs.com/package/@highcharts/map-collection#install-from-npm) are basic instructions for loading a map.
An example can also be found in the [demo app](#demo-app).

### To load a wrapper

A wrapper is a [custom extension](https://www.highcharts.com/docs/extending-highcharts/extending-highcharts) for Highcharts. To load a wrapper the same way as a module you could save it as a Javascript file and edit it by adding below code to beginning and end of a file:

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

Next, you will be loading a local .js file, so you should add in `tsconfig.json` in your app `allowJs: true`:

```js
...
"compilerOptions": {
    "allowJs": true,
    ...
```

The wrapper is ready to be imported to your app. Use `require` instead of import to prevent TS5055 errors.

```ts
import * as Highcharts from 'highcharts';
require('./relative-path-to-the-wrapper-file/wrapper-file-name')(Highcharts);
```

Where `relative-path-to-the-wrapper-file` should be relative (for the module importing the wrapper) path to the wrapper file and `wrapper-file-name` should be the name of the wrapper file.

If a lack of TypeScirpt definitions `d.ts` is showing as an error - see [Solving problems](https://www.highcharts.com/docs/advanced-chart-features/typescript) section of Highcharts documentation for Typescript usage.

### To use [`setOptions`](https://www.highcharts.com/docs/getting-started/how-to-set-options#2)

The best place to use `setOptions` is afer your Highcharts instance is ready and before Highcharts variable is set in the main component. Example:

```ts
import * as Highcharts from 'highcharts/highstock';

...

Highcharts.setOptions({
  title: {
    style: {
      color: 'orange'
    }
  }
});

...

export class AppComponent {
  Highcharts = Highcharts;
``` 



## Demo app

Download (or clone) the contents of the **[highcharts-angular](https://github.com/highcharts/highcharts-angular)** GitHub repository.

In system console, in main repo folder run:

```cli
npm install
npm start
```

This opens [http://localhost:4200/](http://localhost:4200/) in your default browser with the app.

To open on a different port, for example `12345`, use:

```cli
npm start -- --port 12345
```

### Play with the app

Keep the console running and change some files - after a save the app will rebuild and refresh the localhost preview.

### Files to play with

* **app.component.ts** (in `src\app`)

Contains Angular main component that uses the *chart* component.

* **chart.component.ts** (in `src\app\chart`)

Contains the chart component that creates Highcharts chart.



## Changing the Component

Using Angular CLI v6, the library must be manually rebuilt on each change 
in order to reflect in the demo app. 

Run the following command on each change to the `highcharts-chart.component.ts` file:

```cli
npm run build
``` 

If you are running the demo app in another terminal window when you rebuild the
library, the changes should be reflected in your browser (note: you may need to 
refresh the browser a second time after the live reload in order to see the change).

See [https://github.com/angular/angular-cli/wiki/stories-create-library](https://github.com/angular/angular-cli/wiki/stories-create-library)
for details on library builds.

For CHANGELOG.md update use `npm run release`.



## Help and FAQ

For technical support please contact [Highcharts technical support](https://www.highcharts.com/support).

For TypeScript problems with Highcharts first see [Highcharts documentation for TypeScript usage](https://www.highcharts.com/docs/advanced-chart-features/typescript).

### FAQ:

#### How to add and use indicators?

Add [indicators](https://www.highcharts.com/docs/chart-and-series-types/technical-indicator-series) as any other module.
[Live demo](https://codesandbox.io/s/lpn3yvv3zl)

#### How to add and use themes?

Add [themes](https://www.highcharts.com/docs/chart-design-and-style/themes) as any other module.
See the [demo app](#demo-app) in this repository for an example.

More info about custom themes in [Highcharts general documentation](https://www.highcharts.com/docs/chart-design-and-style/custom-themes-in-styled-mode).

#### I have a general issue with Highcharts and TypeScript

The correct repository to report such issues is [main Highcharts repository](https://github.com/highcharts/highcharts/issues).

#### Synchronized Charts Angular demo

Based on original Highcharts demo for [Synchronized charts](https://www.highcharts.com/demo/synchronized-charts).
Additionally added class based sync between charts - [demo](https://codesandbox.io/s/5wwz8qy1l4).