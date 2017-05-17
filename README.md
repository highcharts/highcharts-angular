# Highcharts component for Angular

## How to start:

Make sure you have node and npm up to date. Tested and required versions:
* node 6.10.2+
* npm 4.6.1+

```
npm install
npm start
```

This opens [http://localhost:4200/](http://localhost:4200/) in your default browser with the app.

To open in different port, for example `12345`, use:

```
npm start -- --port 12345
```

## Play with the app:

Keep the console running and change some files - after a save the app will rebuild and refresh the localhost preview in the browser.

## Files to play with:

* **app.component.ts** (in `src\app`)

Contains Angular main component that uses the *chart* component.

* **chart.component.ts** (in `src\app\chart`)

Contains the chart component that creates Highcharts chart.



# Angular app info:

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).