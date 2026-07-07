# Viber Connect

[![npm version](https://img.shields.io/npm/v/@puralex/viber-connect?logo=npm&label=npm&color=7360F2)](https://www.npmjs.com/package/@puralex/viber-connect)
[![npm downloads](https://img.shields.io/npm/dm/@puralex/viber-connect?color=7360F2)](https://www.npmjs.com/package/@puralex/viber-connect)
[![CI](https://github.com/magnifito/viber-connect/actions/workflows/ci.yml/badge.svg)](https://github.com/magnifito/viber-connect/actions/workflows/ci.yml)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@puralex/viber-connect?color=7360F2)](https://bundlephobia.com/package/@puralex/viber-connect)
[![license](https://img.shields.io/npm/l/@puralex/viber-connect?color=7360F2)](LICENSE)

**Free, open-source toolkit for adding [Viber Click-to-Chat](https://www.viber.com/) buttons to any store, directory, or listing.**
One click takes a visitor from a product page straight into a Viber chat with the seller — no
"Add contact", no copy-pasting numbers.

🔗 **[Live builder & docs →](https://magnifito.github.io/viber-connect/)** · generate a button, copy, paste.

<a href="https://magnifito.github.io/viber-connect/"><img src="assets/badges/chat-on-viber.svg" alt="Chat on Viber" height="30"></a>
&nbsp;
<a href="https://magnifito.github.io/viber-connect/"><img src="assets/badges/chat-on-viber-outline.svg" alt="Chat on Viber" height="30"></a>
&nbsp;
<img src="assets/badges/viber-verified.svg" alt="Viber Business" height="30">

---

## Why

| | |
| --- | --- |
| **Zero friction** | One tap → Viber chat. No manual number saving. |
| **Local trust** | In Viber-heavy markets (≈94% reach in Bulgaria) a native button beats a generic widget. |
| **Contextual leads** | A pre-filled message shows the seller exactly which product the buyer viewed. |
| **Measurable ROI** | Every click carries UTM params → trackable inquiries. |

## Packages

| Package | What it is |
| --- | --- |
| [`@puralex/viber-connect`](packages/core) | Zero-dep link builder: sanitize number, interpolate draft, UTM, `viber.me` + `viber://`. |
| [`@puralex/viber-connect-react`](packages/react) | `<ViberButton />` component (full / icon / link / FAB variants). |
| [`@puralex/viber-connect-web-component`](packages/web-component) | `<viber-button>` custom element — drop into plain HTML via CDN. |
| [`@puralex/viber-connect-server`](packages/server) | Backend handler to validate a Viber Business account (avoid dead buttons). |
| [`site/`](site) | The GitHub Pages generator + docs. |

## Quick start

**Plain HTML — no build:**
```html
<script type="module"
  src="https://cdn.jsdelivr.net/npm/@puralex/viber-connect-web-component/dist/viber-button.global.js"></script>

<viber-button phone="+359 88 123 4567" label="Chat on Viber"></viber-button>
```

**React:**
```tsx
import { ViberButton } from "@puralex/viber-connect-react";
import "@puralex/viber-connect-react/styles.css";

<ViberButton
  phone="+359 88 123 4567"
  text="Hi! Interested in {product} — {url}"
  vars={{ product: "Red Shoes", url: location.href }}
  utm={{ source: "shoply", medium: "directory" }}
/>
```

**Just the link (any language / server):**
```ts
import { buildViberLink } from "@puralex/viber-connect";

buildViberLink({ phone: "0888123456", text: "Hi!", utm: { source: "site" } });
// → https://viber.me/888123456?utm_source=site&text=Hi!
```

## Link format

```
https://viber.me/<intl-number>?utm_source=<platform>&text=<url-encoded-draft>
```
- Number must be **full international format** — leading zeros, `+`, spaces, dashes, brackets stripped automatically.
- The number must belong to an **active Viber Business account**, or the link shows "Page Not Found".
  Use [`@puralex/viber-connect-server`](packages/server) + `validateViberNumber()` to check before rendering.

## Develop

```bash
pnpm install
pnpm build        # build all packages
pnpm test         # run tests
pnpm dev:site     # run the generator site locally
```

Monorepo: pnpm workspaces · TypeScript · tsup (packages) · Vite (site) · Vitest · oxlint.

## License

MIT · Not affiliated with Rakuten Viber.
