# Viber Badges & CTA Kit

Ready-made **badges** and **call-to-action buttons** to promote a Viber Business account on any
website, README, storefront, or directory listing. Pick a static image badge (great for READMEs and
email signatures) or a live interactive button (great for websites).

> ⚠️ Only show these when the number has an **active Viber Business account** — otherwise the link
> lands on "Page Not Found". See [validation](#only-show-when-the-account-is-active).

- [1. Static image badges](#1-static-image-badges)
- [2. Live buttons (web component)](#2-live-buttons-web-component)
- [3. Live buttons (React)](#3-live-buttons-react)
- [4. Composite CTA blocks](#4-composite-cta-blocks)
- [5. Variant reference](#5-variant-reference)
- [6. Brand rules](#6-brand-rules)
- [Only show when the account is active](#only-show-when-the-account-is-active)

---

## 1. Static image badges

Self-hosted SVGs — no external service, no tracking. Wrap them in a link to the chat.

| Badge | Preview |
| --- | --- |
| `chat-on-viber.svg` | ![Chat on Viber](assets/badges/chat-on-viber.svg) |
| `chat-on-viber-outline.svg` | ![Chat on Viber](assets/badges/chat-on-viber-outline.svg) |
| `viber-verified.svg` | ![Viber Business](assets/badges/viber-verified.svg) |

**Markdown** (replace the number with the seller's international digits):
```md
[![Chat on Viber](https://cdn.jsdelivr.net/gh/magnifito/viber-connect/assets/badges/chat-on-viber.svg)](https://viber.me/359881234567)
```

**HTML:**
```html
<a href="https://viber.me/359881234567?utm_source=website">
  <img src="https://cdn.jsdelivr.net/gh/magnifito/viber-connect/assets/badges/chat-on-viber.svg"
       alt="Chat on Viber" height="28">
</a>
```

**Shields.io** (dynamic width, official Viber logo):
```md
[![Chat on Viber](https://img.shields.io/badge/Chat%20on%20Viber-7360F2?logo=viber&logoColor=white)](https://viber.me/359881234567)
```

---

## 2. Live buttons (web component)

Best for a real website — the link is generated for you (number sanitizing, UTM, pre-filled draft),
and it emits a `viber:click` event for analytics.

```html
<script type="module"
  src="https://cdn.jsdelivr.net/npm/@puralex/viber-connect-web-component/dist/viber-button.global.js"></script>

<!-- Primary CTA -->
<viber-button phone="+30 231 231 1388" label="Chat on Viber" utm-source="website"></viber-button>

<!-- Outline / small badge / trust badge -->
<viber-button phone="+30 231 231 1388" variant="outline" label="Chat on Viber"></viber-button>
<viber-button phone="+30 231 231 1388" variant="badge" label="Viber"></viber-button>
<viber-button phone="+30 231 231 1388" variant="verified" label="Viber Business"></viber-button>

<!-- Contextual lead: pre-fill the product -->
<viber-button phone="+30 231 231 1388"
  text="Hi! I'm interested in {product}"
  label="Ask about this product"></viber-button>
```

**Analytics:**
```html
<script>
  document.addEventListener("viber:click", (e) => {
    gtag?.("event", "viber_chat_open", { number: e.detail.number });
  });
</script>
```

---

## 3. Live buttons (React)

```tsx
import { ViberButton } from "@puralex/viber-connect-react";
import "@puralex/viber-connect-react/styles.css";

<ViberButton phone="+30 231 231 1388" utm={{ source: "website" }} />
<ViberButton phone="+30 231 231 1388" variant="outline" />
<ViberButton phone="+30 231 231 1388" variant="badge" label="Viber" />
<ViberButton phone="+30 231 231 1388" variant="verified" label="Viber Business" />
<ViberButton phone="+30 231 231 1388" variant="fab" />  {/* floating bubble */}
```

---

## 4. Composite CTA blocks

Copy-paste HTML for higher-converting placements. All use the web component above.

**Seller contact row** (mirrors a directory listing — Phone · Website · Chat on Viber):
```html
<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
  <a class="btn" href="tel:+302312311388">Phone</a>
  <a class="btn" href="https://heals.gr">Website</a>
  <viber-button phone="+302312311388" label="Chat on Viber" utm-source="directory"></viber-button>
</div>
```

**Inquiry card** (product page, next to "Add to cart"):
```html
<div style="border:1px solid #eee;border-radius:12px;padding:16px;max-width:340px">
  <strong>Questions about this product?</strong>
  <p style="color:#666;margin:.4em 0 12px">Chat with the seller on Viber — usually replies in minutes.</p>
  <viber-button phone="+302312311388"
    text="Hi! I'm interested in {product} — {url}"
    label="Chat on Viber"></viber-button>
</div>
```

**Floating bubble** (site-wide, bottom-right):
```html
<viber-button phone="+302312311388" variant="fab" utm-source="website"></viber-button>
```

---

## 5. Variant reference

| `variant` | Use for |
| --- | --- |
| `full` (default) | Primary CTA — solid purple button with logo + label. |
| `outline` | Secondary CTA that sits next to other outline buttons. |
| `badge` | Compact pill for dense rows / cards. |
| `verified` | Trust signal — "Viber Business" presence, softer styling. |
| `icon` | Icon-only, round. |
| `link` | Inline text link. |
| `fab` | Fixed floating action button, bottom-right. |

Shared attributes/props: `phone`, `text` (+`{product}`/`{url}` placeholders), `label`, `color`,
`target` (`web`/`app`/`auto`), UTM (`utm-source`/`utm-medium`/`utm-campaign`).

---

## 6. Brand rules

- **Color:** Viber purple `#7360F2`. Override with `color="..."` only to match a design system — keep enough contrast on the label.
- **Label:** prefer "Chat on Viber" / "Message us on Viber". Don't imply Viber endorses the business.
- **Logo:** ships embedded; don't stretch or recolor the glyph outside the button's `currentColor`.
- **Not affiliated** with Rakuten Viber — this is a community toolkit.

---

## Only show when the account is active

An unregistered number shows "Page Not Found" in Viber. Gate the badge on a validation check:

```ts
import { validateViberNumber } from "@puralex/viber-connect";

const { hasBusinessAccount } = await validateViberNumber("+302312311388", {
  endpoint: "https://api.yoursite.com/viber/validate", // your backend — see @puralex/viber-connect-server
});
if (hasBusinessAccount !== false) renderViberButton();
```

See [`@puralex/viber-connect-server`](packages/server) for the backend handler.
