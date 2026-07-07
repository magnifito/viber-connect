# Security Policy

## Supported versions

The latest published `0.x` release of each `@viberbutton/*` package is supported.

## Reporting a vulnerability

Please **do not** open a public issue for security problems.

Use GitHub's private vulnerability reporting:
**Security → Report a vulnerability** on the repository, or open a private advisory at
<https://github.com/magnifito/viber-button/security/advisories/new>.

Include reproduction steps and affected package/version. We aim to acknowledge reports within
72 hours and to ship a fix or mitigation as quickly as practical.

## Scope notes

- These packages generate `viber.me` / `viber://` links and render buttons. Always URL-encode
  user-provided draft text (the library does this for you via `buildViberLink`).
- The validation flow relies on **your** backend endpoint — never expose Viber credentials to the
  browser.
