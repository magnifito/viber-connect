# @viberbutton/web-component

`<viber-button>` custom element for Viber Click-to-Chat. Framework-free — drop into any HTML page.

**CDN (no build):**
```html
<script type="module"
  src="https://cdn.jsdelivr.net/npm/@viberbutton/web-component/dist/viber-button.global.js"></script>

<viber-button
  phone="+359 88 123 4567"
  text="Interested in {product}"
  label="Chat on Viber"
  variant="full"
  color="#7360f2"
  utm-source="shoply">
</viber-button>
```

**npm:**
```bash
npm install @viberbutton/web-component
```
```ts
import "@viberbutton/web-component"; // registers <viber-button>
```

Attributes: `phone`, `text`, `label`, `variant` (`full`/`icon`/`link`/`fab`), `color`, `target`,
`hide-icon`, `utm-source`, `utm-medium`, `utm-campaign`. Styles are encapsulated in shadow DOM. MIT.
