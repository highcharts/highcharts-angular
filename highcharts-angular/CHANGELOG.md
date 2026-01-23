# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [5.3.0](https://github.com/highcharts/highcharts-angular/compare/v3.0.0...v5.3.0) (2026-01-23)


### Features

* add configurable timeout for Highcharts module loading ([0382051](https://github.com/highcharts/highcharts-angular/commit/0382051d14061be0a3556f3bdccc40e8d4a878c6))
* add timeout configuration for Highcharts loading ([034b9e3](https://github.com/highcharts/highcharts-angular/commit/034b9e3fac06f90e593019a026e3f988cddbd981))
* add timeout handling for Highcharts chart creation and updates ([599056c](https://github.com/highcharts/highcharts-angular/commit/599056caf00b149ceb069a067f149768697210e0))


### Bug Fixes

* add missing comma for timeout configuration in module loading ([35fb36b](https://github.com/highcharts/highcharts-angular/commit/35fb36bef4b08609de5c6efe6bb0bf5be9465b9d))
* add path mapping for [@highcharts-angular](https://github.com/highcharts-angular) in tsconfig.json ([f71ee56](https://github.com/highcharts/highcharts-angular/commit/f71ee568cc0315a1962fcb2b7d3217b10360396d))
* adjust timeout configuration in test setup for highcharts-chart component ([b311c6f](https://github.com/highcharts/highcharts-angular/commit/b311c6f41c3db43085090ef5f3cb1c361e132266))
* clean up highcharts-chart.directive.ts by removing unused imports and simplifying chart creation logic ([04b661c](https://github.com/highcharts/highcharts-angular/commit/04b661ca4f308db9748c7cafe6500d1457903e9e))
* enable warning for deprecated TypeScript rules in ESLint configuration ([c2e8dbf](https://github.com/highcharts/highcharts-angular/commit/c2e8dbf680d97040a2ff99c841e51cc890f18d86))
* enhance chart initialization logic by using a callback for emitting chart instance ([25f3099](https://github.com/highcharts/highcharts-angular/commit/25f3099c74fbaa64b54a56854057b719be5ccd5b))
* enhance stock chart component by removing update flag and adding redraw functionality ([00cf587](https://github.com/highcharts/highcharts-angular/commit/00cf58777b2e00404d81fd6f9c02cad6b7aeecf6))
* ensure chart instance is destroyed when directive is destroyed ([9a703a2](https://github.com/highcharts/highcharts-angular/commit/9a703a23152557b23985fa824a55aaafce73b5e0))
* increase timeout configuration in highcharts-chart component tests ([890f9d1](https://github.com/highcharts/highcharts-angular/commit/890f9d10035edeb704c8be4833165ae1517b5371))
* refactor chart creation and update logic in highcharts-chart directive ([9c17178](https://github.com/highcharts/highcharts-angular/commit/9c1717819adfc9546d85d6d2f6807d5579b10648))
* refactor keepChartUpToDate to use setTimeout for chart initialization delay ([6f04802](https://github.com/highcharts/highcharts-angular/commit/6f04802edc638c73d743566b3d647719acd0dc84))
* refactor timeout handling and chart creation logic in highcharts components ([c0096de](https://github.com/highcharts/highcharts-angular/commit/c0096de6766c8c6a9ba411f98543ce439263ab05))
* remove unnecessary update flag and streamline chart color update logic ([ef7f417](https://github.com/highcharts/highcharts-angular/commit/ef7f417f73ec4b0f4564e28c513368a4de86f138))
* remove unused timeout logic and streamline chart instance management ([7b402f5](https://github.com/highcharts/highcharts-angular/commit/7b402f548a5d75f48a718b8d5e3ef1fef4c66234))
* remove update flag and one-to-one binding from chart component ([bd09203](https://github.com/highcharts/highcharts-angular/commit/bd092037cc3d5e1e4de68a5027b28b9ef1031345))
* remove update flag and one-to-one binding from tilemap chart component ([3c7bd46](https://github.com/highcharts/highcharts-angular/commit/3c7bd4638981db7ac059dce8b61115d485ee392a))
* simplify chart update logic by removing unnecessary bindings and storing chart instance ([c07ba05](https://github.com/highcharts/highcharts-angular/commit/c07ba05bd397df1294843433d9dc61f9fd99ed9f))
* simplify options table in README for clarity ([93f732a](https://github.com/highcharts/highcharts-angular/commit/93f732a08b90aa27a4312f2d9bd79f0b2b6bb8b1))
* update bootstrap function to accept BootstrapContext parameter ([046ed5e](https://github.com/highcharts/highcharts-angular/commit/046ed5ef23c517cc9940c072c1c0db06b8587696))
* update CHANGELOG for version 5.2.0 release notes ([8cf09ef](https://github.com/highcharts/highcharts-angular/commit/8cf09efd23bdf6377dcdcd65cf5559223658cee7))
* update dumbbell chart module imports to use promise chaining for better loading sequence ([d860397](https://github.com/highcharts/highcharts-angular/commit/d860397c12308754f9da0e71e47f2ddd9c2e6a1c))
* update import path for provideHighcharts to use [@highcharts-angular](https://github.com/highcharts-angular) ([5bd920d](https://github.com/highcharts/highcharts-angular/commit/5bd920da633b6fd4d307b22007279ee35f7f26cd))
* update import paths for Highcharts components to use [@highcharts-angular](https://github.com/highcharts-angular) ([bcb4787](https://github.com/highcharts/highcharts-angular/commit/bcb4787c2bd1fc083333deeabf35982c13dcfff7))
* update module import logic for highcharts-chart component ([7f1add0](https://github.com/highcharts/highcharts-angular/commit/7f1add08f7e5cae18c1cbc4439e4fbf60dca9f6f))
* update module import logic for tilemap-chart component ([9f0e83d](https://github.com/highcharts/highcharts-angular/commit/9f0e83d416ba769ec468cafe22f5f49a898d2e01))
* update README to reflect deprecation of oneToOne parameter in chart options ([b64f985](https://github.com/highcharts/highcharts-angular/commit/b64f985bc93a4c361ef25fb5395e2fd0720db9f4))
* update README to reflect deprecation of update and oneToOne parameters in chart options ([1a2382e](https://github.com/highcharts/highcharts-angular/commit/1a2382e306a0e75631085cc6bcdbacc8cbc70d9d))

## [5.2.0](https://github.com/highcharts/highcharts-angular/compare/v3.0.0...v5.2.0) (2025-11-05)

### Features

- Introduce an optional timeout in the loading pipeline to accommodate modules that need a few extra milliseconds before augmenting the Highcharts namespace. ([4486b78](https://github.com/highcharts/highcharts-angular/commit/4486b787270d75ae928ab0c61cae6bef01d8d9b7))

### Bug Fixes

- Fixed #421, prevent chart updates before creation in highcharts-chart.directive.ts. ([e999063](https://github.com/highcharts/highcharts-angular/commit/e999063fa98d8ef1f1319a910af8fb5d44ba7af5))

## [5.1.0](https://github.com/highcharts/highcharts-angular/compare/v3.0.0...v5.1.0) (2025-06-23)

## [5.0.0](https://github.com/highcharts/highcharts-angular/compare/v3.0.0...v5.0.0) (2025-06-13)

### [4.0.1](https://github.com/highcharts/highcharts-angular/compare/v3.0.0...v4.0.1) (2024-07-23)

### Bug Fixes

- Fixed #380, improved typing of the chartInstance emitter. ([b4751e5](https://github.com/highcharts/highcharts-angular/commit/b4751e5f915692f13a61f8b0fa8c4b428cdc9f30))
- Fixed #385, error when importing ESM module. ([832ca80](https://github.com/highcharts/highcharts-angular/commit/832ca80cf20ed5f9c18a992b2ac8e12040fbd708))

## [4.0.0](https://github.com/highcharts/highcharts-angular/compare/v3.0.0...v4.0.0) (2023-11-07)

### Bug Fixes

- Fix #365, the chat instance was not emitted on the `ngOnDestroy`.([344deb7](https://github.com/highcharts/highcharts-angular/pull/366/commits/344deb72b9dfbaefa6e14129bf5600920b582b3f))

## [3.1.2](https://github.com/highcharts/highcharts-angular/compare/v3.0.0...v3.1.2) (2023-02-02)

## [3.1.0](https://github.com/highcharts/highcharts-angular/compare/v3.0.0...v3.1.0) (2023-02-02)

## [3.0.0](https://github.com/highcharts/highcharts-angular/compare/v2.10.0...v3.0.0) (2021-12-01)

### Features

- Updated to Angular 13 ([aa202ec](https://github.com/highcharts/highcharts-angular/pull/305/commits/aa202ec98bb41bc85eb74229059adcc6398e3cc6)

## [2.10.0](https://github.com/highcharts/highcharts-angular/compare/v2.8.1...v2.10.0) (2021-02-09)

### Features

- Updated Highcharts to 9.0.0 version. ([e23e896](https://github.com/highcharts/highcharts-angular/pull/267/commits/e23e896b8ff0ac49f8756b5e343ad4c39305c216))

### Bug Fixes

- fixed incorrect link ([c274d5e](https://github.com/highcharts/highcharts-angular/commit/c274d5edc5457f09f1e0631ea29c0f88a0145726))

## [2.9.0](https://github.com/highcharts/highcharts-angular/compare/v2.8.1...v2.9.0) (2021-01-04)

### Features

- Added common TS error example to the online examples, and the FAQ section. ([6c13fdd](https://github.com/highcharts/highcharts-angular/commit/6c13fdd21ac524140046f3a81fcedf24b2fae608))
- Added how to use proj4 to the online examples, and the FAQ section. ([7f02d4e](https://github.com/highcharts/highcharts-angular/commit/7f02d4e887cc8d36b6adbac5f5e9bef3d8991358))
- Added portals demo to the online examples, and the FAQ section. ([5e166bf](https://github.com/highcharts/highcharts-angular/commit/5e166bfba22ed9038b0bbd564ec7524025ae2cec))
- Updated Highcharts products names in the README file. ([4831134](https://github.com/highcharts/highcharts-angular/commit/4831134e2e0a7f1a6295e0cb891850f38703157d))
- Updated Angular to version 11. ([594c411](https://github.com/highcharts/highcharts-angular/pull/257/commits/594c4112eb30b093649fe8ee0a36abc0642c589b))

## [2.8.2](https://github.com/highcharts/highcharts-angular/compare/v2.8.1...v2.8.2) (2020-11-02)

### Bug Fixes

- Changed peer dependencies. ([07e6209](https://github.com/highcharts/highcharts-angular/pull/228/commits/07e6209e594e6026faae394a7b9b3edd5fdcc4b5))

## [2.8.0](https://github.com/highcharts/highcharts-angular/compare/v2.4.0...v2.8.0) (2020-08-31)

### Features

- Updated Angular to version 10. ([a28190c](https://github.com/highcharts/highcharts-angular/pull/219/commits/a28190cd6a14be4d74c57868eaaba49c137700c7))
- Added Tests for creating a simple component. ([d6107dd](https://github.com/highcharts/highcharts-angular/pull/219/commits/d6107dd4b75d87add8c7213356bf2f383bd79b85))
- Added a paragraph about SSR in the README. ([9269c55](https://github.com/highcharts/highcharts-angular/pull/219/commits/9269c55f993b234284a01e11eaa439c9cf206050))

### Bug Fixes

- Fixed lazy-loading demo. ([de88e2a](https://github.com/highcharts/highcharts-angular/pull/219/commits/de88e2a54b9060b87ee458048943b8dfb2db5956))

## [2.7.0](https://github.com/highcharts/highcharts-angular/compare/v2.4.0...v2.7.0) (2020-07-24)

### Features

- Add issue templates. Closes [#100](https://github.com/highcharts/highcharts-angular/issues/100). ([1fcbb42](https://github.com/highcharts/highcharts-angular/commit/1fcbb428772897df0fc978c1a40aa69a0687d704))
- Added online examples in the README. ([fe78157](https://github.com/highcharts/highcharts-angular/commit/fe7815770dc2eab7191e2d1cea589b93b17fd2e7))
- Disabled ivy in tsconfig ([0f97065](https://github.com/highcharts/highcharts-angular/commit/0f970651cb6e5f53737b13d950a5ffcc4600a353))
- Extracted charts to separate components for the demo project. ([e8d401b](https://github.com/highcharts/highcharts-angular/commit/e8d401b9b785116ac551a21373aa5fddd994fdcf))
- Updated Angular to version 9. ([5832ff1](https://github.com/highcharts/highcharts-angular/commit/5832ff1532f54f87a7fa2f81282de67583909d38))
- Updated Highcharts version. ([dd9740f](https://github.com/highcharts/highcharts-angular/commit/dd9740f4b5e8677f89765dfa0ff179aeb6e5adb4))
- Updated the README. ([f54ec96](https://github.com/highcharts/highcharts-angular/commit/f54ec960473aabf27936d3b282e16ba3e01aeec7))
- Updated styles of the demo project. ([d56354a](https://github.com/highcharts/highcharts-angular/commit/d56354ab9c9134364b95a245e7393a15123c42b2))

### Bug Fixes

- Disabled aot and related dependency. ([19ff85d](https://github.com/highcharts/highcharts-angular/commit/19ff85d54ff3016caea66c390445f0c10ade2cfe))

\_\_

## 2.5.0 - 2.6.0 (2020-07-23)

Due to problems with publishing the package, redundant versions have been released. Please do not use these versions.

\_\_
<a name="2.4.0"></a>

## [2.4.0](https://github.com/highcharts/highcharts-angular/compare/v2.1.3...v2.4.0) (2018-12-27)

### Features

- Added chart instance as the component's output. Closes [#26](https://github.com/highcharts/highcharts-angular/issues/26). ([04c2bd8](https://github.com/highcharts/highcharts-angular/commit/04c2bd8))
- Added demo for FAQ's about Synchronized charts. Closes [#93](https://github.com/highcharts/highcharts-angular/issues/93). ([1362608](https://github.com/highcharts/highcharts-angular/commit/1362608))
- Added reference to [@highcharts](https://github.com/highcharts)/map-collection and updated documentation. Closes [#89](https://github.com/highcharts/highcharts-angular/issues/89), closes [#104](https://github.com/highcharts/highcharts-angular/issues/104). ([c5081f0](https://github.com/highcharts/highcharts-angular/commit/c5081f0))
- Added support for optional running Highcharts outside of Angular. Closes [#75](https://github.com/highcharts/highcharts-angular/issues/75). ([2ebcb07](https://github.com/highcharts/highcharts-angular/commit/2ebcb07))
- Added TS definitions from Highcharts into the wrapper for types reference. ([56d93fa](https://github.com/highcharts/highcharts-angular/commit/56d93fa))
- Closes [#84](https://github.com/highcharts/highcharts-angular/issues/84), added info about Highcharts instance being shared in an Angular app. ([7aa3b32](https://github.com/highcharts/highcharts-angular/commit/7aa3b32))
- Refreshed and updated demo with some CSS and TS definitions. ([acc13b2](https://github.com/highcharts/highcharts-angular/commit/acc13b2))
- Update tslint rules. See PR [#98](https://github.com/highcharts/highcharts-angular/issues/98). ([4dc85da](https://github.com/highcharts/highcharts-angular/commit/4dc85da))
- Updated demo to version 7 for Highcharts and Angular. ([85151bf](https://github.com/highcharts/highcharts-angular/commit/85151bf))

<a name="2.3.1"></a>

## [2.3.1](https://github.com/highcharts/highcharts-angular/compare/v2.3.0...v2.3.1) (2018-10-05)

<a name="2.3.0"></a>

## [2.3.0](https://github.com/highcharts/highcharts-angular/compare/v2.2.0...v2.3.0) (2018-10-04)

### Features

- Added chart instance as the component's output. Closes [#26](https://github.com/highcharts/highcharts-angular/issues/26). ([04c2bd8](https://github.com/highcharts/highcharts-angular/commit/04c2bd8))

<a name="2.2.0"></a>

## [2.2.0](https://github.com/highcharts/highcharts-angular/compare/v2.1.3...v2.2.0) (2018-09-28)

### Features

- Added support for optional running Highcharts outside of Angular. Closes [#75](https://github.com/highcharts/highcharts-angular/issues/75). ([2ebcb07](https://github.com/highcharts/highcharts-angular/commit/2ebcb07))

<a name="2.1.3"></a>

## [2.1.3](https://github.com/highcharts/highcharts-angular/compare/v2.1.2...v2.1.3) (2018-08-27)

<a name="2.1.2"></a>

## [2.1.2](https://github.com/highcharts/highcharts-angular/compare/v2.1.1...v2.1.2) (2018-08-24)

<a name="2.1.1"></a>

## [2.1.1](https://github.com/highcharts/highcharts-angular/compare/v2.1.0...v2.1.1) (2018-08-24)

<a name="2.1.0"></a>

## [2.1.0](https://github.com/highcharts/highcharts-angular/compare/v2.0.3...v2.1.0) (2018-08-24)

### Features

- Added CHANGELOG.md and updated related documentation. ([8452557](https://github.com/highcharts/highcharts-angular/commit/8452557))
