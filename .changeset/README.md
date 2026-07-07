# Changesets

This folder is managed by [changesets](https://github.com/changesets/changesets).

To record a change for release, run:

```bash
pnpm changeset
```

Pick the affected packages and a semver bump (patch/minor/major) and write a short summary. Commit the
generated markdown file with your PR. On merge to `main`, the release workflow opens a "Version
Packages" PR; merging that publishes to npm.
