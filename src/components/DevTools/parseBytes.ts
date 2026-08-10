export type ByteFormat = "hex" | "decimal";

export type ParseBytesResult =
  | { ok: true; bytes: number[] }
  | { ok: false; error: string };

const HEX_DIGITS = /^[0-9a-f]+$/i;
const DECIMAL_DIGITS = /^\d+$/;

export const parseBytes = (
  input: string,
  format: ByteFormat,
): ParseBytesResult => {
  const cleaned = input.trim().replace(/^\[/, "").replace(/\]$/, "").trim();
  if (!cleaned) return { ok: true, bytes: [] };

  const bytes: number[] = [];

  for (const token of cleaned.split(/[\s,]+/).filter(Boolean)) {
    if (format === "decimal") {
      if (!DECIMAL_DIGITS.test(token)) {
        return { ok: false, error: `"${token}" is not a decimal number` };
      }

      const value = Number(token);
      if (value > 255) {
        return { ok: false, error: `"${token}" is outside the 0-255 range` };
      }

      bytes.push(value);
      continue;
    }

    const digits = token.replace(/^0x/i, "").replace(/^#/, "");

    if (!digits || !HEX_DIGITS.test(digits)) {
      return { ok: false, error: `"${token}" is not a hex value` };
    }

    if (digits.length > 2 && digits.length % 2 !== 0) {
      return {
        ok: false,
        error: `"${token}" has an odd number of hex digits`,
      };
    }

    if (digits.length <= 2) {
      bytes.push(parseInt(digits, 16));
      continue;
    }

    for (let i = 0; i < digits.length; i += 2) {
      bytes.push(parseInt(digits.slice(i, i + 2), 16));
    }
  }

  return { ok: true, bytes };
};

export const toHexPreview = (bytes: number[]) =>
  bytes
    .map((byte) => byte.toString(16).padStart(2, "0").toUpperCase())
    .join(" ");
