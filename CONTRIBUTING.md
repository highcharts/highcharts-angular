# Release

Run one of the release scripts:
```bash
npm run release          # patch (default)
npm run release-minor    # minor
npm run release-major    # major
```

The script will:
1. Bump the version and update `CHANGELOG.md` (via `standard-version`)
2. Build the library
3. Copy the changelog to the root directory
4. Create a release commit and annotated tag

After the script completes:
```bash
git push --follow-tags origin master
```

Publishing to npm is automated via CI — when the push lands on `master` with a version change in `highcharts-angular/package.json`, the `npm-publish` workflow stages the package for approval.

Mark a new release on GitHub.

**Rollback** (if push or publish fails):
```bash
git tag -d vX.Y.Z && git reset --soft HEAD~1
```
