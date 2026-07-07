/** UTM tracking parameters appended to the generated link. */
export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

/**
 * Where the link should point.
 * - `web`  → https://viber.me/<number> (safe as an <a href>, redirects into the app on mobile)
 * - `app`  → viber://chat?number=... (opens the native app directly; use for buttons handled by JS)
 * - `auto` → `web` on server/desktop, `app` on a detected mobile device
 */
export type ViberLinkTarget = "web" | "app" | "auto";

export interface ViberLinkOptions {
  /** Phone number in any format. Sanitized to full international digits (leading zeros / +, spaces, dashes, brackets stripped). */
  phone: string;
  /**
   * Pre-filled draft message. Supports `{var}` placeholders resolved from `vars`.
   * Example: "I want to inquire about {product} — {url}"
   */
  text?: string;
  /** Values used to resolve `{var}` placeholders in `text`. */
  vars?: Record<string, string | number>;
  /** UTM tracking parameters. */
  utm?: UtmParams;
  /** Link flavor. Defaults to `web`. */
  target?: ViberLinkTarget;
}

export interface ViberLinks {
  /** Sanitized international number, digits only. */
  number: string;
  /** https://viber.me/... web link. */
  web: string;
  /** viber://chat?... native app link. */
  app: string;
  /** Resolved (interpolated) draft message, before URL-encoding. */
  message: string;
}
