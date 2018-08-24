/**
 * Prepare for release.
 * Copy CHANGELOG.md up into the main dir.
 */

const child_process = require( 'child_process' ),
      fs = require( 'fs' ),
      path = require( 'path' );

const rootDir = path.normalize( __dirname + '/..' ),
      distDir = `${rootDir}/dist/highcharts-angular`;

// Copy CHANGELOG.md to the main folder for GitHub
console.log( 'Copying dist/highcharts-angular/CHANGELOG.md to the main directory' );
fs.copyFileSync( `${distDir}/CHANGELOG.md`, `${rootDir}/CHANGELOG.md` );

// Further instructions
console.log( '-------------------------------------------------------' );
console.log( 'Push as `git push --follow-tags origin master`' );
console.log( 'Publish in `./dist/highcharts-angular` as `npm publish`' );