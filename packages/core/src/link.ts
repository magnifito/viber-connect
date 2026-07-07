import { assertPhone } from "./phone.js";
import type { ViberLinkOptions, ViberLinks, UtmParams } from "./types.js";

/** Replace `{key}` placeholders in a template from a values map. Unknown keys are left untouched. */
export function interpolate(
  template: string,
  vars: Record<string, string | number> = {},
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const v = vars[key];
    return v === undefined || v === null ? match : String(v);
  });
}

function utmEntries(utm: UtmParams = {}): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  for (const key of ["source", "medium", "campaign", "term", "content"] as const) {
    const v = utm[key];
    if (v != null && v !== "") out.push([`utm_${key}`, String(v)]);
  }
  return out;
}

/**
 * Build every flavor of a Viber Click-to-Chat link from a single set of options.
 * Prefer this when you want both the web (`viber.me`) and native (`viber://`) URLs.
 */
export function buildViberLinks(options: ViberLinkOptions): ViberLinks {
  const { phone, text, vars, utm } = options;
  const number = assertPhone(phone);
  const message = text ? interpolate(text, vars) : "";

  const utmPairs = utmEntries(utm);

  // Web link: https://viber.me/<number>?utm_*&text=<encoded>
  const webParams = new URLSearchParams();
  for (const [k, v] of utmPairs) webParams.set(k, v);
  if (message) webParams.set("text", message);
  const webQuery = webParams.toString();
  const web = `https://viber.me/${number}${webQuery ? `?${webQuery}` : ""}`;

  // Native link: viber://chat?number=<number>&draft=<encoded>&utm_*
  const appParams = new URLSearchParams();
  appParams.set("number", `+${number}`);
  if (message) appParams.set("draft", message);
  for (const [k, v] of utmPairs) appParams.set(k, v);
  const app = `viber://chat?${appParams.toString()}`;

  return { number, web, app, message };
}

/**
 * Build a single Viber link string.
 *
 * @returns the web (`viber.me`) URL by default — safe to drop straight into an `<a href>`.
 *   Pass `target: "app"` for the native `viber://` URL, or `target: "auto"` to pick based
 *   on the current device (native on mobile, web elsewhere).
 *
 * @example
 * buildViberLink({
 *   phone: "+359 88 123 4567",
 *   text: "Hi! Interested in {product} — {url}",
 *   vars: { product: "Red Shoes", url: "https://shop.example/p/42" },
 *   utm: { source: "Shoply", medium: "directory" },
 * });
 */
export function buildViberLink(options: ViberLinkOptions): string {
  const links = buildViberLinks(options);
  const target = options.target ?? "web";
  if (target === "app") return links.app;
  if (target === "auto") return isMobile() ? links.app : links.web;
  return links.web;
}

/** Best-effort mobile detection (SSR-safe: returns false when there is no `navigator`). */
export function isMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  return /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
}
