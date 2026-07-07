import { describe, it, expect, vi } from "vitest";
import { createValidationHandler } from "../src/index.js";

describe("createValidationHandler", () => {
  it("rejects an invalid number with 400", async () => {
    const checker = vi.fn();
    const validate = createValidationHandler({ checker });
    const r = await validate("123");
    expect(r.status).toBe(400);
    expect(r.body.error).toBe("invalid_number");
    expect(checker).not.toHaveBeenCalled();
  });

  it("sanitizes then calls the checker and returns 200", async () => {
    const checker = vi.fn().mockResolvedValue({ hasBusinessAccount: true, name: "Acme" });
    const validate = createValidationHandler({ checker, cacheTtlMs: 0 });
    const r = await validate("+359 (88) 123-4567");
    expect(checker).toHaveBeenCalledWith("359881234567");
    expect(r.status).toBe(200);
    expect(r.body).toEqual({ number: "359881234567", hasBusinessAccount: true, name: "Acme" });
  });

  it("caches results within the TTL (checker called once)", async () => {
    const checker = vi.fn().mockResolvedValue({ hasBusinessAccount: false });
    const validate = createValidationHandler({ checker, cacheTtlMs: 10_000 });
    await validate("359881234567");
    await validate("+359 88 123 4567"); // same number, different formatting
    expect(checker).toHaveBeenCalledTimes(1);
  });

  it("returns 502 when the checker throws", async () => {
    const checker = vi.fn().mockRejectedValue(new Error("upstream down"));
    const validate = createValidationHandler({ checker, cacheTtlMs: 0 });
    const r = await validate("359881234567");
    expect(r.status).toBe(502);
    expect(r.body.error).toBe("check_failed");
    expect(r.body.hasBusinessAccount).toBeNull();
  });
});
