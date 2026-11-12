/**
 * Build script to create the library package, and then copy over
 * the LICENSE, README.md and CODE_OF_CONDUCT.md files in a cross-platform manner.
 */

const child_process = require('child_process'),
  fs = require('fs'),
  path = require('path');

const rootDir = path.normalize(__dirname + '/..'),
  distDir = `${rootDir}/dist/highcharts-angular`,
  ngLocation = `${rootDir}/node_modules/@angular/cli/bin/ng`.replace(/\//g, path.sep);

// Build the package
child_process.spawnSync('node', [ngLocation, 'build', 'highcharts-angular', '--configuration=production'], {
  cwd: rootDir,
  stdio: 'inherit',
});

// Copy License and Readme to package
console.log('Copying ./LICENSE to dist/highcharts-angular/LICENSE');
fs.copyFileSync(`${rootDir}/LICENSE.txt`, `${distDir}/LICENSE.txt`);

console.log('Copying ./README.md to dist/highcharts-angular/README.md');
fs.copyFileSync(`${rootDir}/README.md`, `${distDir}/README.md`);

console.log('Copying ./CODE_OF_CONDUCT.md to dist/highcharts-angular/CODE_OF_CONDUCT.md');
fs.copyFileSync(`${rootDir}/CODE_OF_CONDUCT.md`, `${distDir}/CODE_OF_CONDUCT.md`);
