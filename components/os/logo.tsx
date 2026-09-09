import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

/**
 * The mark: two braces written by hand — `{` above, `}` below — the end of
 * one hook meeting the start of the other at the centre, so together they
 * read as an S. The opening and closing of a function.
 *
 * Each brace is one pen stroke: a short hook, a stem that flows into a
 * small sharp nose, a stem, a hook. Round caps at the free ends (marker),
 * miter at the nose (pen point). The `}` is the `{` turned 180° about the
 * centre, so the S has true rotational symmetry. Compact braces and a 24°
 * lean are what make the S read first — the noses stay inside the
 * silhouette, the hooks become the S's terminals. Strokes inherit
 * `currentColor`, so the same paths serve every size.
 */

/** `{` — hook end top-right (50,12), nose at (34,31), hook end at the centre (50,50). */
export const LOGO_OPEN = "M50 12C45 12 42 14.5 42 19C42 24 40 27 34 31C40 35 42 38 42 43C42 47.5 45 50 50 50";
/** `}` — starts at the centre (50,50), nose at (66,69), hook end bottom-left (50,88). */
export const LOGO_CLOSE = "M50 50C55 50 58 52.5 58 57C58 62 60 65 66 69C60 73 58 76 58 81C58 85.5 55 88 50 88";
export const LOGO_LEAN = "translate(50 50) skewX(-24) translate(-50 -50)";
export const LOGO_STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "miter" as const,
  strokeMiterlimit: 3,
};

export function Logo({ className, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden {...rest}>
      <g {...LOGO_STROKE} transform={LOGO_LEAN}>
        <path d={LOGO_OPEN} />
        <path d={LOGO_CLOSE} />
      </g>
    </svg>
  );
}

/** App-icon tile: the mark in white on the OS accent. */
export function LogoMark({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-accent text-onAccent",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Logo style={{ width: size * 0.8, height: size * 0.8 }} />
    </span>
  );
}
