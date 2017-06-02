# Highcharts Angular
Official minimal Highcharts wrapper for Angular

## Getting started




### General prerequisites

Make sure you have **node**, **NPM** and **Angular** up to date.
Tested and required versions:

* node 6.10.2+
* npm 4.6.1+
* @angular/cli 1.0.1+

### Installing

Get package from NPM in your Angular app:

```cli
npm install blacklabel/highcharts-angular
```

In your app.module.ts add the HighchartsChartComponent:

```ts
...
import { HighchartsChartComponent } from 'blacklabel/highcharts-angular';

@NgModule({
  declarations: [
    HighchartsChartComponent,
    ...
```

In a component that will be building your Highcharts charts you will need to [import Highcharts](https://www.highcharts.com/docs/getting-started/install-from-npm) first.

```ts
import * as Highcharts from 'highcharts';
```

Next, in the app.component's template add Highcharts-angular component selector `highcharts-chart`

```html
<highcharts-chart 
  [Highcharts]="Highcharts"

  [constructorType]="chartConstructor"
  [options]="chartOptions"
  [callbackFunction]="chartCallback"

  [(update)]="updateFlag"

  style="width: 100%; height: 400px; display: block;"
></highcharts-chart>
```




### Options details

1. `[Highcharts]="Highcharts"`

`[Highcharts]` is a required variable that must be passed to Highcharts-angular component. It's Highcharts instance optionally with initialized **modules**, **plugin**, **maps**, **wrappers** and set global options using **[`setOptions`](https://www.highcharts.com/docs/getting-started/how-to-set-options#2)**. 


#### Core

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


#### To load a **module** 

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


#### To load a **plugin**

A plugin is a third party/community made Highcharts addon (plugins are listed in the [Highcharts plugin registry](https://www.highcharts.com/plugin-registry)). First, make sure that a plugin support loading over NPM and load the required files. In example [Custom-Events](https://www.highcharts.com/plugin-registry/single/15/Custom-Events) supports NPM loading, so after installing the package you could initialize it like:

```ts
import * as Highcharts from 'highcharts';
import * as HC_customEvents from 'highcharts-custom-events';
HC_customEvents(Highcharts);
```

If a plugin doesn't support loading through NPM you could treat it as a wrapper - see instructions below.


#### To load a **map** for Highmaps

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

The map is ready to be imported to your app.

```ts
import * as Highcharts from 'highcharts/highmaps';
import * as HC_myMap from './relative-path-to-the-map-file/map-file-name';
HC_myMap(Highcharts);
```

Where `relative-path-to-the-map-file` should be relative (for the module importing the map) path to the map file and `map-file-name` should be the name of the map file.


#### To load a **wrapper**

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

The wrapper is ready to be imported to your app.

```ts
import * as Highcharts from 'highcharts';
import * as HC_myWrapper from './relative-path-to-the-wrapper-file/wrapper-file-name';
HC_myWrapper(Highcharts);
```

Where `relative-path-to-the-wrapper-file` should be relative (for the module importing the wrapper) path to the wrapper file and `wrapper-file-name` should be the name of the wrapper file.


#### To to use **[`setOptions`](https://www.highcharts.com/docs/getting-started/how-to-set-options#2)**

The best place to use `setOptions` is afer your Highcharts instance is ready and before Highcharts variable is set in the main component. Example:

```
import * as Highcharts from 'highcharts/highstock';
import * as HC_map from 'highcharts/modules/map';
import * as HC_myMap from './worldmap.js';

HC_map(Highcharts);
HC_myMap(Highcharts);

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


2. `[constructorType]="chartConstructor"`

A string for [constructor method](https://www.highcharts.com/docs/getting-started/your-first-chart). The option is optional and defaults to `'chart'`. Possible values:

* `'chart'` - for standard Highcharts constructor - for any Highcharts instance

* `'stockChart'` - for Highstock constructor - Highstock is required

* `'mapChart'` - for Highmaps constructor - Highmaps or map module is required



3. `[options]="chartOptions"`

`[options]` is a required variable that must be passed to Highcharts-angular component. Possible chart options could be found in [Highcharts API reference](http://api.highcharts.com/highcharts).



4. `[callbackFunction]="chartCallback"`

A callback function for the created chart. First argument for the function will hold the created chart and default `this` in the function points to the chart. The option is optional.



5. `[(update)]="updateFlag"`

A boolean to trigger update on a chart as Angular is not detecting nested changes in a object passed to a component. Set corresponding variable to true and after update on a chart is done it will be changed asynchronously to false by Highcharts-angular component.




### After Highcharts instance is ready

It's ready when you import core and initialize all optional files that you want to add.

In the component that will be using creating charts via Highcharts-angular component set local variable Highcharts and assign to it the Highcharts instance. This will be passed later (on `[Highcharts]="Highcharts"`) to Highcharts-angular component when creating a chart.

```ts
...
export class AppComponent {
  Highcharts = Highcharts;
  ...
```
