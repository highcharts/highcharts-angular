/**
 * Prepare for release.
 * Copy CHANGELOG.md up into the main dir.
 */

const fs = require('fs'),
      path = require('path');

const rootDir = path.normalize(__dirname + '/..'),
      codeDir = `${rootDir}/highcharts-angular`;

// Copy CHANGELOG.md to the main folder for GitHub
console.log('Copying ./highcharts-angular/CHANGELOG.md to the main directory');
fs.copyFileSync(`${codeDir}/CHANGELOG.md`, `${rootDir}/CHANGELOG.md`);

// Further instructions
console.log('-------------------------------------------------------');
console.log('Add moved CHANGELOG.md and `git commit --amend` it');
console.log('Push as `git push --follow-tags origin master`');
console.log('Publish in `./dist/highcharts-angular` as `npm publish`');