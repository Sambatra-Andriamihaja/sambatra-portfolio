import { isa } from "1sa";

/**
 * Guarded wrapper around the published `1sa` package. The module trusts
 * its input, so we validate here: integers and decimals, up to twelve
 * digits (the largest unit it knows is "lavitrisa", 10⁹).
 */

export const ISA_MAX = 999_999_999_999;

export type IsaResult =
  | { ok: true; input: number; words: string }
  | { ok: false; reason: "empty" | "nan" | "range" | "error" };

export function spell(raw: string): IsaResult {
  const cleaned = raw.replace(/[\s_]/g, "").replace(",", ".");
  if (!cleaned) return { ok: false, reason: "empty" };
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) return { ok: false, reason: "nan" };

  const n = Number(cleaned);
  if (!Number.isFinite(n) || n < 0 || Math.trunc(n) > ISA_MAX)
    return { ok: false, reason: "range" };

  try {
    let words = isa(n);
    // v1.0.0 indexes `translate` instead of calling it on exact multiples of
    // 10⁶ / 10⁹, yielding "undefined tapitrisa". Compose those two cases here.
    if (words.includes("undefined") && Number.isInteger(n)) {
      if (n % 1e9 === 0) words = `${isa(n / 1e9)} lavitrisa`;
      else if (n % 1e6 === 0) words = `${isa(n / 1e6)} tapitrisa`;
    }
    words = words.trim().replace(/\s{2,}/g, " ");
    if (!words || words.includes("undefined"))
      return { ok: false, reason: "error" };
    return { ok: true, input: n, words };
  } catch {
    return { ok: false, reason: "error" };
  }
}

/** A few numbers that show the module off well. */
export const ISA_SAMPLES = [7, 42, 1789, 2026, 10_000, 3.14] as const;
