/**
 * Sanitize a phone number into the full international format Viber deep links require:
 * digits only, no leading zeros, no `+`, spaces, dashes, brackets, or dots.
 *
 * Note: only *leading* zeros are stripped. A national trunk "0" that sits after the
 * country code (mid-string) is left as-is — pass a real international number.
 *
 * @example
 * sanitizePhone("+44 7123 456789")   // "447123456789"
 * sanitizePhone("00359 88 123 4567") // "359881234567"
 * sanitizePhone("0888123456")        // "888123456"
 */
export function sanitizePhone(input: string): string {
  if (typeof input !== "string") {
    throw new TypeError("phone must be a string");
  }
  const digits = input.replace(/\D+/g, "");
  const trimmed = digits.replace(/^0+/, "");
  return trimmed;
}

/** True when the input sanitizes to a plausible international number (7–15 digits, per E.164). */
export function isValidPhone(input: string): boolean {
  const n = sanitizePhone(input);
  return n.length >= 7 && n.length <= 15;
}

/** Throws a descriptive error when the phone cannot form a valid Viber link. */
export function assertPhone(input: string): string {
  const n = sanitizePhone(input);
  if (n.length < 7 || n.length > 15) {
    throw new Error(
      `Invalid Viber phone number "${input}" → "${n}". Provide a full international number (7–15 digits, no leading zero).`,
    );
  }
  return n;
}
