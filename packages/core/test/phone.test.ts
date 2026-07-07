import { describe, it, expect } from "vitest";
import { sanitizePhone, isValidPhone, assertPhone } from "../src/phone.js";

describe("sanitizePhone", () => {
  it("strips +, spaces, dashes, brackets, dots", () => {
    expect(sanitizePhone("+359 (88) 123-4567")).toBe("359881234567");
    expect(sanitizePhone("+44 7123 456789")).toBe("447123456789");
    expect(sanitizePhone("+1.415.555.0132")).toBe("14155550132");
  });

  it("strips leading zeros only", () => {
    expect(sanitizePhone("0888123456")).toBe("888123456");
    expect(sanitizePhone("00359881234567")).toBe("359881234567");
    expect(sanitizePhone("447120000456")).toBe("447120000456"); // mid-string zeros kept
  });

  it("throws on non-string", () => {
    // @ts-expect-error runtime guard
    expect(() => sanitizePhone(123)).toThrow(TypeError);
  });
});

describe("isValidPhone", () => {
  it("accepts 7–15 digit numbers", () => {
    expect(isValidPhone("+359881234567")).toBe(true);
    expect(isValidPhone("1234567")).toBe(true);
  });
  it("rejects too short / too long", () => {
    expect(isValidPhone("12345")).toBe(false);
    expect(isValidPhone("1234567890123456")).toBe(false);
  });
});

describe("assertPhone", () => {
  it("returns the sanitized number", () => {
    expect(assertPhone("+359 88 123 4567")).toBe("359881234567");
  });
  it("throws with a helpful message on invalid input", () => {
    expect(() => assertPhone("123")).toThrow(/Invalid Viber phone number/);
  });
});
