# @puralex/viber-connect-react

React `<ViberButton />` for Viber Click-to-Chat. Renders an `<a>` — works without JS, keyboard/SR friendly.

```bash
npm install @puralex/viber-connect-react
```

```tsx
import { ViberButton } from "@puralex/viber-connect-react";
import "@puralex/viber-connect-react/styles.css"; // import once in your app

<ViberButton
  phone="+359 88 123 4567"
  text="Interested in {product} — {url}"
  vars={{ product: "Red Shoes", url: location.href }}
  utm={{ source: "shoply", medium: "directory" }}
  variant="full"           // "full" | "icon" | "link" | "fab"
  color="#7360f2"
  onChatClick={() => analytics.track("viber_click")}
/>
```

Props extend `<a>` attributes. `color` sets the `--viber-color` CSS var; you can also theme via the
`.viber-btn` CSS custom properties. MIT.
