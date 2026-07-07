import { sanitizePhone } from "@viberbutton/core";

export interface BusinessCheck {
  hasBusinessAccount: boolean | null;
  name?: string;
}

/**
 * You supply this. It receives a sanitized international number and returns whether
 * it maps to an active Viber Business account.
 *
 * Viber does not publish a public browser-callable validation endpoint, so the
 * implementation is up to you — options in order of reliability:
 *  1. Viber Business / partner API (if you have partner credentials).
 *  2. A HEAD/GET probe of `https://viber.me/<number>` server-side, inspecting the
 *     response for the "not found" signal (brittle — treat unknowns as `null`).
 *  3. A manually curated allow-list of onboarded merchant numbers.
 */
export type BusinessAccountChecker = (
  number: string,
) => Promise<BusinessCheck> | BusinessCheck;

export interface ValidationHandlerOptions {
  checker: BusinessAccountChecker;
  /** Simple in-memory TTL cache (ms). Set 0 to disable. Default 1 hour. */
  cacheTtlMs?: number;
}

export interface ValidationResponse {
  status: number;
  body: { number: string; hasBusinessAccount: boolean | null; name?: string; error?: string };
}

/**
 * Build a transport-agnostic validation handler. Wire it into Express, Fastify,
 * Next.js route handlers, Cloudflare Workers — anything — by pulling the `number`
 * query param out of your request and passing it here.
 *
 * @example Express
 * const validate = createValidationHandler({ checker: myChecker });
 * app.get("/viber/validate", async (req, res) => {
 *   const r = await validate(String(req.query.number ?? ""));
 *   res.status(r.status).json(r.body);
 * });
 */
export function createValidationHandler(options: ValidationHandlerOptions) {
  const ttl = options.cacheTtlMs ?? 3_600_000;
  const cache = new Map<string, { at: number; value: BusinessCheck }>();

  return async function validate(rawNumber: string): Promise<ValidationResponse> {
    const number = sanitizePhone(rawNumber ?? "");
    if (number.length < 7 || number.length > 15) {
      return {
        status: 400,
        body: { number, hasBusinessAccount: null, error: "invalid_number" },
      };
    }

    if (ttl > 0) {
      const hit = cache.get(number);
      // Note: relies on Date.now(); acceptable server-side.
      if (hit && Date.now() - hit.at < ttl) {
        return { status: 200, body: { number, ...hit.value } };
      }
    }

    try {
      const value = await options.checker(number);
      if (ttl > 0) cache.set(number, { at: Date.now(), value });
      return { status: 200, body: { number, ...value } };
    } catch {
      return { status: 502, body: { number, hasBusinessAccount: null, error: "check_failed" } };
    }
  };
}
