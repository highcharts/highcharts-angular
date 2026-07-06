# Release

Using Angular CLI v19, the library must be manually rebuilt on each change in
order to reflect in the demo app.

Run the following command on each change to the `highcharts-chart.directive.ts`
file:

```cli
npm run build
```

If you are running the demo app in another terminal window when you rebuild the
library, the changes should be reflected in your browser (note: you may need to
refresh the browser a second time after the live reload in order to see the
change).

For CHANGELOG.md update use :

```cli
npm run release
```

Verify CHANGELOG.md in the main folder and in the `highcharts-angular` folder.
If changes are needed, added them via `git add *` & `git commit --amend`.

Next, run `git push --follow-tags origin master` and `npm publish` in the
`highcharts-angular` folder - you'll need to be logged into npm with an account
that has write access for publish.

Finally, use `git push --tags` and mark a new release on GitHub - the same as
older tags are done there.
