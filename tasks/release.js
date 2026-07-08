/**
 * Prepare for release.
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.normalize(__dirname + '/..');
const codeDir = path.normalize(rootDir + '/highcharts-angular');
const changelogSource = path.normalize(codeDir + '/CHANGELOG.md');
const changelogTarget = path.normalize(rootDir + '/CHANGELOG.md');
const packageJsonPath = path.normalize(codeDir + '/package.json');

const runGit = (args, options = {}) => {
  const result = execFileSync('git', args, { encoding: 'utf8', cwd: rootDir, ...options });
  return result ? result.trim() : '';
};

console.log('Copying ./highcharts-angular/CHANGELOG.md to the main directory');
fs.copyFileSync(changelogSource, changelogTarget);

const version = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')).version;

if (!/^\d+\.\d+\.\d+(-[\w.+-]+)?(\+[\w.+-]+)?$/.test(version)) {
  console.error(`Error: version "${version}" is not a valid semver string. Aborting.`);
  process.exit(1);
}

console.log(`Releasing version ${version}`);

runGit(['add', '--', 'highcharts-angular/package.json', 'highcharts-angular/CHANGELOG.md', 'CHANGELOG.md']);
runGit(['commit', '-m', `chore(release): v${version}`], { stdio: 'inherit' });

let tagExists = true;
let tagCommit = '';

try {
  tagCommit = runGit(['rev-parse', `v${version}`]);
} catch (error) {
  tagExists = false;
}

const headCommit = runGit(['rev-parse', 'HEAD']);

if (tagExists) {
  if (tagCommit === headCommit) {
    console.log(`Tag v${version} already points to HEAD, skipping`);
  } else {
    console.error(`Error: Tag v${version} already exists and points to a different commit. Delete it first with: git tag -d v${version}`);
    process.exit(1);
  }
} else {
  runGit(['tag', '-a', `v${version}`, '-m', `chore(release): v${version}`]);
}

console.log('-------------------------------------------------------');
console.log(`Release v${version} ready.`);
console.log('Push:    git push --follow-tags origin master');
console.log('Publish: automated via CI on push to master');
console.log('-------------------------------------------------------');
