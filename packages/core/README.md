# @puralex/viber-connect

Zero-dependency builder for [Viber Click-to-Chat](https://www.viber.com/) deep links.
Sanitizes phone numbers, interpolates a pre-filled draft message, appends UTM tracking,
and emits both the web (`viber.me`) and native (`viber://`) URLs.

```bash
npm install @puralex/viber-connect
```

```ts
import { buildViberLink, buildViberLinks, validateViberNumber } from "@puralex/viber-connect";

// One string, safe for <a href> (redirects into the app on mobile):
buildViberLink({
  phone: "+359 (88) 123-4567",
  text: "Hi! Interested in {product} — {url}",
  vars: { product: "Red Shoes", url: "https://shop.example/p/42" },
  utm: { source: "Shoply", medium: "directory" },
});
// → https://viber.me/359881234567?utm_source=Shoply&utm_medium=directory&text=Hi!+Interested+in+Red+Shoes+%E2%80%94+https%3A%2F%2Fshop.example%2Fp%2F42

// Both flavors + the sanitized number:
const { web, app, number, message } = buildViberLinks({ phone: "0888123456" });

// Guard against dead buttons (needs your own backend proxy — see @puralex/viber-connect-server):
const { hasBusinessAccount } = await validateViberNumber("+359881234567", {
  endpoint: "https://api.yoursite.com/viber/validate",
});
```

## API

| Export | Purpose |
| --- | --- |
| `buildViberLink(opts)` | One URL string. `target: "web" \| "app" \| "auto"` (default `web`). |
| `buildViberLinks(opts)` | `{ number, web, app, message }`. |
| `sanitizePhone(str)` | Digits only, leading zeros / symbols stripped. |
| `isValidPhone(str)` / `assertPhone(str)` | E.164-ish 7–15 digit check. |
| `interpolate(tpl, vars)` | `{var}` templating. |
| `validateViberNumber(phone, opts)` | Business-account check via your backend. |
| `isMobile()` | SSR-safe device hint. |

The phone must be full international format. Only **leading** zeros are stripped — pass a real
country code (a national trunk `0` after the country code is not removed automatically).

MIT
