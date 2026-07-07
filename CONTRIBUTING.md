# Contributing

Thanks for helping improve **Viber Button**! 🎉

## Setup

```bash
pnpm install
pnpm build        # build all packages
pnpm test         # run tests
pnpm exec oxlint .  # lint (oxlint — do not add ESLint)
pnpm dev:site     # run the generator site locally
```

Requires Node ≥ 18 and pnpm.

## Layout

- `packages/core` — link builder (zero deps). Add tests in `packages/core/test`.
- `packages/react` — React component.
- `packages/web-component` — `<viber-button>` custom element.
- `packages/server` — validation handler.
- `site` — the GitHub Pages generator.
- `assets/badges` — static SVG badges.

## Pull requests

1. Fork & branch from `main` (`feat/…`, `fix/…`).
2. Keep the change focused. Add/adjust tests.
3. `pnpm build && pnpm test && pnpm exec oxlint .` must pass — CI runs the same.
4. Use [Conventional Commits](https://www.conventionalcommits.org/) for PR titles (`feat:`, `fix:`, `docs:`).
5. Describe the change and, for UI, include a screenshot.

## Guidelines

- **Linter is oxlint**, never ESLint. Use `// oxlint-disable-*` only if truly needed.
- Keep `@puralex/viber-connect` dependency-free.
- Don't hardcode a real merchant's number in examples — use the docs placeholder.
- New button/badge variants: add to both React and the web component, plus the site gallery.

By contributing you agree your work is licensed under the [MIT License](LICENSE).
