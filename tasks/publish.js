/**
 * Publishes the package from the dist/highcharts-angular directory.
 * Note: publishing manually, but keeping the file just in case.
 */

const child_process = require( 'child_process' ),
      path = require( 'path' );

const rootDir = path.normalize( __dirname + '/..' ),
      distDir = `${rootDir}/dist/highcharts-angular`;

// Publish
child_process.spawnSync( 'npm', [ 'publish' ], { cwd: distDir, stdio: 'inherit' } );
