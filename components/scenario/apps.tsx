import type { ReactNode } from "react";
import type { AppKey } from "./types";

/**
 * Module registry. Every glyph is drawn on a 24-unit grid and inherits
 * `currentColor`, so the canvas can recolour a module by state without
 * touching the artwork. Brand hue is used only for the ring.
 */

type App = { name: string; hue: string; glyph: ReactNode };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const APPS: Record<AppKey, App> = {
  brevo: {
    name: "Brevo",
    hue: "#0B996E",
    glyph: (
      <g {...stroke}>
        <path d="M7 3.5v17" />
        <circle cx="13.2" cy="15" r="5.2" />
        <path d="M7 12.5c1.8-2.4 4-3 6.2-2.6" />
      </g>
    ),
  },
  make: {
    name: "Make",
    hue: "#7B2FD6",
    glyph: (
      <g fill="currentColor">
        <path d="M3.5 19 7.6 5h3.1L6.6 19z" />
        <path d="M9.5 19l4.1-14h3.1l-4.1 14z" />
        <path d="M15.5 19l4.1-14h1.4l-4.1 14z" />
      </g>
    ),
  },
  router: {
    name: "Router",
    hue: "#8E93A3",
    glyph: (
      <g {...stroke}>
        <circle cx="6" cy="12" r="2.2" />
        <circle cx="18" cy="5.5" r="2" />
        <circle cx="18" cy="12" r="2" />
        <circle cx="18" cy="18.5" r="2" />
        <path d="M8.2 11.2 16 6.2M8.2 12h7.8M8.2 12.8 16 17.8" />
      </g>
    ),
  },
  python: {
    name: "Python API",
    hue: "#4B8BBE",
    glyph: (
      <g {...stroke}>
        <path d="m8 8-4.5 4L8 16M16 8l4.5 4L16 16M13.5 5.5l-3 13" />
      </g>
    ),
  },
  langchain: {
    name: "LangChain",
    hue: "#3E8E8E",
    glyph: (
      <g {...stroke}>
        <path d="M10 14.5 8.3 16.2a3.6 3.6 0 0 1-5.1-5.1l3.4-3.4a3.6 3.6 0 0 1 5.1 0" />
        <path d="M14 9.5l1.7-1.7a3.6 3.6 0 0 1 5.1 5.1l-3.4 3.4a3.6 3.6 0 0 1-5.1 0" />
        <path d="M9.5 14.5 14.5 9.5" />
      </g>
    ),
  },
  supabase: {
    name: "Supabase",
    hue: "#3ECF8E",
    glyph: (
      <g fill="currentColor">
        <path d="M13.2 21.4c-.5.6-1.5.3-1.5-.5v-7.6H5.3c-1.2 0-1.9-1.4-1.2-2.4L10.8 2.6c.5-.6 1.5-.3 1.5.5v7.6h6.4c1.2 0 1.9 1.4 1.2 2.4l-6.7 8.3z" />
      </g>
    ),
  },
  pandadoc: {
    name: "PandaDoc",
    hue: "#47B972",
    glyph: (
      <g {...stroke}>
        <path d="M7 3h7l4 4v14H7z" />
        <path d="M14 3v4h4M9.5 12h5M9.5 15.5h5M9.5 19h3" />
      </g>
    ),
  },
  planhat: {
    name: "Planhat",
    hue: "#7C7FEA",
    glyph: (
      <g {...stroke}>
        <path d="M6.5 15.5a5.5 5.5 0 0 1 11 0" />
        <path d="M3.5 15.5h17" />
        <path d="M12 4.5v5" />
      </g>
    ),
  },
  qobra: {
    name: "Qobra",
    hue: "#5C6BF5",
    glyph: (
      <g {...stroke}>
        <circle cx="11" cy="11" r="6" />
        <path d="m15.5 15.5 4 4" />
      </g>
    ),
  },
  gong: {
    name: "Gong",
    hue: "#8B5CF6",
    glyph: (
      <g {...stroke}>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="0.8" fill="currentColor" />
      </g>
    ),
  },
  chilipiper: {
    name: "Chili Piper",
    hue: "#F5533D",
    glyph: (
      <g {...stroke}>
        <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
        <path d="M3.5 10h17M8 3v4M16 3v4M8 14h3M13 14h3M8 17h3" />
      </g>
    ),
  },
  slack: {
    name: "Slack",
    hue: "#E01E5A",
    glyph: (
      <g {...stroke} strokeWidth={2}>
        <path d="M9.5 4v16M14.5 4v16M4 9.5h16M4 14.5h16" />
      </g>
    ),
  },
  dust: {
    name: "Dust",
    hue: "#F59E0B",
    glyph: (
      <g {...stroke}>
        <path d="M12 3.5c.4 4.4 3.1 7.1 8.5 8.5-5.4 1.4-8.1 4.1-8.5 8.5-.4-4.4-3.1-7.1-8.5-8.5 5.4-1.4 8.1-4.1 8.5-8.5z" />
      </g>
    ),
  },
  webhook: {
    name: "Webhook",
    hue: "#C73A63",
    glyph: (
      <g {...stroke}>
        <path d="M12 5a3.6 3.6 0 0 1 3.1 5.4L11.3 17" />
        <path d="M8.6 10.2A3.6 3.6 0 0 0 7.7 19" />
        <path d="M7.7 17h9a2.9 2.9 0 1 1-.7 1.8" />
        <circle cx="12" cy="5" r="1.2" fill="currentColor" />
        <circle cx="7.7" cy="17" r="1.2" fill="currentColor" />
        <circle cx="16.7" cy="17" r="1.2" fill="currentColor" />
      </g>
    ),
  },
  cron: {
    name: "Schedule",
    hue: "#9CA3AF",
    glyph: (
      <g {...stroke}>
        <circle cx="12" cy="12" r="8.2" />
        <path d="M12 7.5V12l3.2 2" />
      </g>
    ),
  },
  platform: {
    name: "Internal platform",
    hue: "#D6A84F",
    glyph: (
      <g {...stroke}>
        <rect x="4" y="4" width="16" height="5" rx="1.5" />
        <rect x="4" y="10.5" width="16" height="5" rx="1.5" />
        <rect x="4" y="17" width="16" height="3" rx="1.2" />
        <path d="M7 6.5h.01M7 13h.01" strokeWidth={2.4} />
      </g>
    ),
  },
  user: {
    name: "Team",
    hue: "#9DA8F0",
    glyph: (
      <g {...stroke}>
        <circle cx="12" cy="8" r="3.6" />
        <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
      </g>
    ),
  },
};

export const NODE_R = 27;
