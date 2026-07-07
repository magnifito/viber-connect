import { sanitizePhone } from "./phone.js";

export interface ValidationResult {
  number: string;
  /** `true` = registered Viber Business account, `false` = not found, `null` = unknown/could not check. */
  hasBusinessAccount: boolean | null;
  /** Business display name, when the provider returns one. */
  name?: string;
  /** Raw provider payload, for debugging. */
  raw?: unknown;
}

export interface ValidateOptions {
  /**
   * URL of a backend endpoint you control that proxies Viber's Business account
   * validation API. It receives `?number=<intl-digits>` and returns
   * `{ hasBusinessAccount: boolean, name?: string }`.
   *
   * Viber does not expose a public browser-callable validation API, so this must
   * point at your own server (see `@puralex/viber-connect-server`). Without it, validation
   * is skipped and `hasBusinessAccount` is `null`.
   */
  endpoint?: string;
  /** Custom fetch (for Node < 18 or testing). Defaults to global `fetch`. */
  fetch?: typeof fetch;
  signal?: AbortSignal;
}

/**
 * Check whether a number is backed by a Viber Business account, so you can avoid
 * rendering a button that would land the user on a "Page Not Found" screen.
 *
 * This is a thin client — the actual check happens on YOUR backend endpoint, which
 * holds the Viber credentials. When no `endpoint` is given, returns `hasBusinessAccount: null`.
 */
export async function validateViberNumber(
  phone: string,
  options: ValidateOptions = {},
): Promise<ValidationResult> {
  const number = sanitizePhone(phone);
  const { endpoint, signal } = options;
  const doFetch = options.fetch ?? (typeof fetch !== "undefined" ? fetch : undefined);

  if (!endpoint || !doFetch) {
    return { number, hasBusinessAccount: null };
  }

  try {
    const url = `${endpoint}${endpoint.includes("?") ? "&" : "?"}number=${encodeURIComponent(number)}`;
    const res = await doFetch(url, { signal });
    if (!res.ok) return { number, hasBusinessAccount: null };
    const data = (await res.json()) as { hasBusinessAccount?: boolean; name?: string };
    return {
      number,
      hasBusinessAccount:
        typeof data.hasBusinessAccount === "boolean" ? data.hasBusinessAccount : null,
      name: data.name,
      raw: data,
    };
  } catch {
    return { number, hasBusinessAccount: null };
  }
}
