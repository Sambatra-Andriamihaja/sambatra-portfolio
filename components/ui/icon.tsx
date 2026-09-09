import type { SVGProps } from "react";

/**
 * Hand-drawn hairline icon set. 24px grid, 1.5 stroke, round caps.
 * Deliberately not a third-party pack — the weight is tuned to the
 * typography so nothing in the interface shouts.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export const ArrowUpRight = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="M7 17 17 7M8.5 7H17v8.5" />
  </svg>
);

export const ArrowRight = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="M4 12h15m-5.5-5.5L19 12l-5.5 5.5" />
  </svg>
);

export const ArrowDown = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="M12 4v15m-5.5-5.5L12 19l5.5-5.5" />
  </svg>
);

export const Corner = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="M4 4v16h16" />
  </svg>
);

export const Close = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const Sun = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
  </svg>
);

export const Moon = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.2 8.2 0 1 0 10.2 10.2Z" />
  </svg>
);

export const Terminal = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <rect x="2.5" y="4" width="19" height="16" rx="3" />
    <path d="m7 10 2.5 2.5L7 15M12.5 15.5H17" />
  </svg>
);

export const Search = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
);

export const Download = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="M12 3v11m-4-4 4 4 4-4M4 20h16" />
  </svg>
);

export const Mail = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <rect x="2.5" y="5" width="19" height="14" rx="3" />
    <path d="m3.5 7.5 7.3 5.1a2 2 0 0 0 2.4 0l7.3-5.1" />
  </svg>
);

export const Github = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="M9.2 20.4c-4 1.2-4-2.2-5.7-2.6m11.4 4.2v-3.3a2.9 2.9 0 0 0-.8-2.2c2.6-.3 5.4-1.3 5.4-5.9a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6.2 0C6.1 3.9 5.1 4.2 5.1 4.2a4.2 4.2 0 0 0-.1 3.2 4.6 4.6 0 0 0-1.3 3.2c0 4.6 2.8 5.6 5.4 5.9a2.9 2.9 0 0 0-.8 2.2v3.3" />
  </svg>
);

export const LinkedIn = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <rect x="3" y="3" width="18" height="18" rx="3.5" />
    <path d="M7.6 10.4V17M7.6 7.3v.02M11.6 17v-3.6a2 2 0 0 1 4 0V17M11.6 17v-6.6" />
  </svg>
);

export const Globe = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3.2 9.6h17.6M3.2 14.4h17.6M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
  </svg>
);

export const Return = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="M20 5v5.5a3 3 0 0 1-3 3H4.5m3.5-4-3.5 4 3.5 4" />
  </svg>
);

export const Command = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3Z" />
  </svg>
);

export const Plus = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Layers = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="m12 3 9 5-9 5-9-5 9-5ZM3 13l9 5 9-5M3 17.5 12 22l9-4.5" />
  </svg>
);

export const Cpu = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <rect x="6.5" y="6.5" width="11" height="11" rx="2.5" />
    <path d="M10 3v3.5M14 3v3.5M10 17.5V21M14 17.5V21M3 10h3.5M3 14h3.5M17.5 10H21M17.5 14H21" />
  </svg>
);

export const Database = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <ellipse cx="12" cy="6" rx="7.5" ry="3.2" />
    <path d="M4.5 6v12c0 1.8 3.4 3.2 7.5 3.2s7.5-1.4 7.5-3.2V6M4.5 12c0 1.8 3.4 3.2 7.5 3.2s7.5-1.4 7.5-3.2" />
  </svg>
);

export const Play = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="M8 5.5 18.5 12 8 18.5v-13Z" />
  </svg>
);

export const Copy = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2.5" />
    <path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15" />
  </svg>
);

export const Check = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const Spark = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="M12 3c.5 4.6 3.4 7.5 8 8-4.6.5-7.5 3.4-8 8-.5-4.6-3.4-7.5-8-8 4.6-.5 7.5-3.4 8-8Z" />
  </svg>
);

export const Route = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="18" cy="6" r="2.5" />
    <path d="M8.5 18H14a3 3 0 0 0 3-3v-1.5a3 3 0 0 0-3-3h-4a3 3 0 0 1-3-3V6h8.5" />
  </svg>
);

export const Menu = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);

export const Clock = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const Bolt = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="M13 2.5 5 13.5h6l-1 8 8-11h-6l1-8Z" />
  </svg>
);

export const Send = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="M14.5 21.7a.5.5 0 0 0 .94-.03l6.5-19a.5.5 0 0 0-.63-.63l-19 6.5a.5.5 0 0 0-.03.94l7.93 3.18a2 2 0 0 1 1.11 1.11Z" />
    <path d="m21.85 2.15-10.94 10.94" />
  </svg>
);

export const Folder = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  </svg>
);

export const FolderOpen = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2" />
  </svg>
);

export const Compass = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="m16.24 7.76-1.8 5.41a2 2 0 0 1-1.27 1.27L7.76 16.24l1.8-5.41a2 2 0 0 1 1.27-1.27Z" />
  </svg>
);

export const Star = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z" />
  </svg>
);

export const Calendar = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
    <path d="M8 2.5v4M16 2.5v4M3 10h18" />
  </svg>
);

export const MapPin = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="M12 21.5s7-6.3 7-11.5a7 7 0 0 0-14 0c0 5.2 7 11.5 7 11.5Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const Briefcase = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <rect x="2.5" y="7" width="19" height="13" rx="2.5" />
    <path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7M2.5 12.5h19" />
  </svg>
);

export const GraduationCap = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="M2.5 9.5 12 5l9.5 4.5L12 14 2.5 9.5Z" />
    <path d="M6.5 11.5v4.3c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-4.3M21.5 9.5V15" />
  </svg>
);

export const Quote = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="M10 6.5H6.5A2.5 2.5 0 0 0 4 9v3.5A2.5 2.5 0 0 0 6.5 15H8v1.5a2 2 0 0 1-2 2M20 6.5h-3.5A2.5 2.5 0 0 0 14 9v3.5a2.5 2.5 0 0 0 2.5 2.5H18v1.5a2 2 0 0 1-2 2" />
  </svg>
);

export const ExternalLink = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="M14 4h6v6M20 4l-9 9M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
  </svg>
);

export const Maximize = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </svg>
);

export const Code = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16" />
  </svg>
);

export const FolderKanban = (p: IconProps) => (
  <svg {...base} width="1em" height="1em" {...p}>
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    <path d="M8 10v4M12 10v2M16 10v6" />
  </svg>
);
