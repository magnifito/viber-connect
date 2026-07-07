# @viberbutton/react

React `<ViberButton />` for Viber Click-to-Chat. Renders an `<a>` — works without JS, keyboard/SR friendly.

```bash
npm install @viberbutton/react
```

```tsx
import { ViberButton } from "@viberbutton/react";
import "@viberbutton/react/styles.css"; // import once in your app

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
