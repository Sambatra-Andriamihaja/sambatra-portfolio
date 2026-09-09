import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Clamp a number between two bounds. */
export const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

/** Zero-padded index, e.g. 3 -> "03". Used for editorial numbering. */
export const pad = (n: number, width = 2) => String(n).padStart(width, "0");
