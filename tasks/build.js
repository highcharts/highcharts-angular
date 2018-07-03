/**
 * Build script to create the library package, and then copy over
 * the LICENSE and README.md files in a cross-platform manner.
 */

const child_process = require( 'child_process' ),
      fs = require( 'fs' ),
      path = require( 'path' );

const rootDir = path.normalize( __dirname + '/..' ),
      distDir = `${rootDir}/dist/highcharts-angular`,
      ngLocation = `${rootDir}/node_modules/@angular/cli/bin/ng`.replace( /\//g, path.sep );


// Build the package
child_process.spawnSync( 'node', [ ngLocation, 'build', 'highcharts-angular' ], { cwd: rootDir, stdio: 'inherit' } );

// Copy License and Readme to package
console.log( 'Copying ./LICENSE to dist/highcharts-angular/LICENSE' );
fs.copyFileSync( `${rootDir}/LICENSE`, `${distDir}/LICENSE` );

console.log( 'Copying ./README.md to dist/highcharts-angular/README.md' );
fs.copyFileSync( `${rootDir}/README.md`, `${distDir}/README.md` );
