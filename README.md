# Highcharts Angular
Official minimal Highcharts wrapper for Angular

## Table of Contents
1. [Getting started](#getting-started)
    1. [General prerequisites](#general-prerequisites)
    2. [Installing](#installing)
    3. [Hello world demo](#hello-world-demo)
2. [Options details](#options-details)
3. [Highcharts instance details](#highcharts-instance-details)
    1. [Core](#core)
    2. [To load a module](#to-load-a-module)
    3. [To load a plugin](#to-load-a-plugin)
    4. [To load a map for Highmaps](#to-load-a-map-for-highmaps)
    5. [To load a wrapper](#to-load-a-wrapper)
    6. [To use setOptions](#to-use-setoptions)
4. [Demo app](#demo-app)
    1. [Play with the app](#play-with-the-app)
    2. [Files to play with](#files-to-play-with)
5. [Changing the Component](#changing-the-component)



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



## Highcharts instance details

This is a Highcharts instance optionally with initialized **[modules](#to-load-a-module)**, **[plugins](#to-load-a-plugin)**, **[maps](#to-load-a-map-for-highmaps)**, **[wrappers](#to-load-a-wrapper)** and set **[global options](#to-use-setoptions)** using **[`setOptions`](https://www.highcharts.com/docs/getting-started/how-to-set-options#2)**. **The core is required.**

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
import * as HC_map from 'highcharts/modules/map';
HC_map(Highcharts);
```

### To load a module

A module is a Highcharts official addon. After Highcharts is imported using Highcharts, Highstock or Highmaps use `require` and initialize each module on the Highcharts variable.

```ts
import * as Highcharts from 'highcharts';
require('highcharts/modules/exporting')(Highcharts);
```

This could be [done without `require`](https://github.com/highcharts/highcharts/issues/4994#issuecomment-305113651), but the initialization is still needed.
```ts
import * as Highcharts from 'highcharts';
import * as HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);
```

### To load a plugin

A plugin is a third party/community made Highcharts addon (plugins are listed in the [Highcharts plugin registry](https://www.highcharts.com/plugin-registry)). First, make sure that a plugin support loading over NPM and load the required files. In example [Custom-Events](https://www.highcharts.com/plugin-registry/single/15/Custom-Events) supports NPM loading, so after installing the package you could initialize it like:

```ts
import * as Highcharts from 'highcharts';
import * as HC_customEvents from 'highcharts-custom-events';
HC_customEvents(Highcharts);
```

If a plugin doesn't support loading through NPM you could treat it as a wrapper - see instructions below.

### To load a map for Highmaps

A map is JSON type file containing mapData code used when a chart is created. Download a map from [official Highcharts map collection](http://code.highcharts.com/mapdata/) in Javascript format or use a [custom map](https://www.highcharts.com/docs/maps/custom-maps) and add it to your app. Edit the map file, so it could be loaded like a module by adding to beginning and end of a file code below:

```js
(function (factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory;
  } else {
    factory(Highcharts);
  }
}(function (Highcharts) {

...
/* map file data */
...

}));
```

In case of using a GeoJSON map file format you should add the above code and additionally, between the added beginning and the map file data, the below code:

```js
Highcharts.maps["myMapName"] =
```
Where `"myMapName"` is yours map name that will be used when creating charts. Next, you will be loading a local .js file, so you should add in `tsconfig.json` in your app `allowJs: true`:

```js
...
"compilerOptions": {
    "allowJs": true,
    ...
```
__Notice: this is not required for all Typescript / Angular versions - you can build the demo app with `allowJs` set to `false` for some cases. This part of the documentation will be revisited after Typescript / Angular further changes regarding this issue.__

The map is ready to be imported to your app. Use `require` instead of import to prevent TS5055 errors.

```ts
import * as Highcharts from 'highcharts/highmaps';
require('./relative-path-to-the-map-file/map-file-name')(Highcharts);
```

Where `relative-path-to-the-map-file` should be relative (for the module importing the map) path to the map file and `map-file-name` should be the name of the map file.

The file should be placed in a directory that is not checked by typeScript. See example in this repository:
- config in 'tsconfig.json'
- map file in 'js' directory

### To load a wrapper

A wrapper is a [custom extension](https://www.highcharts.com/docs/extending-highcharts/extending-highcharts) for Highcharts. To load a wrapper the same way as a module you could save it as a Javascript file and edit it by adding to beginning and end of a file same code as for a map:

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

The file should be placed in a directory that is not checked by typeScript. See example in this repository:
- configuration in `tsconfig.json`
- a map file in `js` directory

### To use [`setOptions`](https://www.highcharts.com/docs/getting-started/how-to-set-options#2)

The best place to use `setOptions` is afer your Highcharts instance is ready and before Highcharts variable is set in the main component. Example:

```
import * as Highcharts from 'highcharts/highstock';
import * as HC_map from 'highcharts/modules/map';

HC_map(Highcharts);

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

```
npm install
npm start
```

This opens [http://localhost:4200/](http://localhost:4200/) in your default browser with the app.

To open on a different port, for example `12345`, use:

```
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

```
npm run build
``` 

If you are running the demo app in another terminal window when you rebuild the
library, the changes should be reflected in your browser (note: you may need to 
refresh the browser a second time after the live reload in order to see the change).

See [https://github.com/angular/angular-cli/wiki/stories-create-library](https://github.com/angular/angular-cli/wiki/stories-create-library)
for details on library builds.

For CHANGELOG.md update use `npm run release`.
