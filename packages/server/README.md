# @viberbutton/server

Transport-agnostic backend handler to validate a **Viber Business account** before you render a
button — so visitors never hit a "Page Not Found" screen.

> Viber has no public browser-callable validation API. You provide a `checker` (partner API,
> server-side probe, or a curated allow-list); this package wraps it with input sanitizing,
> validation, caching, and a clean response shape.

```bash
npm install @viberbutton/server
```

```ts
import { createValidationHandler } from "@viberbutton/server";

const validate = createValidationHandler({
  checker: async (number) => {
    // your logic — return { hasBusinessAccount, name? }
    return { hasBusinessAccount: await isOnboarded(number) };
  },
  cacheTtlMs: 3_600_000,
});

// Express:
app.get("/viber/validate", async (req, res) => {
  const r = await validate(String(req.query.number ?? ""));
  res.status(r.status).json(r.body);
});
```

Point the front end at this endpoint via `validateViberNumber(phone, { endpoint })` from
`@viberbutton/core`. MIT.
