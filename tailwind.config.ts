import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

/**
 * Design tokens — sambatra.os
 * ------------------------------------------------------------------
 * Two operating systems share one vocabulary. Dark is Ubuntu (Yaru dark
 * surfaces on an aubergine wallpaper, Ubuntu orange), light is Windows 11
 * (mica surfaces on the bloom wallpaper, Windows blue). Every colour is an
 * "R G B" triplet on :root / .light so alpha composes.
 */

const rgb = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./constants/**/*.{js,ts}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: rgb("--c-canvas"),
        raise: rgb("--c-raise"),
        surface: rgb("--c-surface"),
        inset: rgb("--c-inset"),
        line: "rgb(var(--c-line) / var(--line-a))",
        edge: "rgb(var(--c-line) / var(--edge-a))",
        ink: rgb("--c-ink"),
        muted: rgb("--c-muted"),
        faint: rgb("--c-faint"),
        accent: rgb("--c-accent"),
        accent2: rgb("--c-accent-2"),
        onAccent: rgb("--c-on-accent"),
        ok: rgb("--c-ok"),
        warn: rgb("--c-warn"),
        err: rgb("--c-err"),
        /* legacy aliases (contact sheet, locale switch) */
        indigo: rgb("--c-accent"),
        indigoLight: rgb("--c-accent-2"),
        indigoDark: rgb("--c-accent"),
        signal: rgb("--c-accent"),
        onIndigo: rgb("--c-on-accent"),
        brass: rgb("--c-accent"),
        gold: rgb("--c-accent"),
        onGold: rgb("--c-on-accent"),
      },
      fontFamily: {
        /* OS-selected faces — resolved per theme in globals.css */
        sans: ["var(--font-ui)"],
        display: ["var(--font-ui-display)"],
        mono: ["var(--font-code)"],
        /* fixed faces */
        ubuntu: ["var(--font-ubuntu-mono)", "monospace"],
        gnome: ["var(--font-ubuntu)", "Ubuntu", "system-ui", "sans-serif"],
        segoe: ['"Segoe UI Variable Text"', '"Segoe UI"', "var(--font-open-sans)", "sans-serif"],
      },
      fontSize: {
        "fluid-sm": "clamp(0.875rem, 0.84rem + 0.2vw, 0.9875rem)",
        "fluid-base": "clamp(1rem, 0.95rem + 0.28vw, 1.125rem)",
        "fluid-lg": "clamp(1.125rem, 1.05rem + 0.5vw, 1.375rem)",
        "fluid-xl": "clamp(1.25rem, 1.05rem + 0.9vw, 1.625rem)",
        "display-sm": "clamp(1.75rem, 1.3rem + 1.8vw, 2.5rem)",
        "display-md": "clamp(2.125rem, 1.4rem + 2.8vw, 3.5rem)",
        "display-lg": "clamp(2.75rem, 1.4rem + 5vw, 5.5rem)",
        "display-xl": "clamp(3.25rem, 1rem + 7.5vw, 6.75rem)",
      },
      letterSpacing: {
        tightest: "-0.035em",
        crush: "-0.02em",
      },
      borderRadius: {
        win: "var(--r-win)",
        ctl: "var(--r-ctl)",
        field: "var(--r-field)",
        card: "var(--r-card)",
        panel: "var(--r-win)",
        pill: "999px",
      },
      spacing: {
        gutter: "clamp(1rem, 4vw, 2.5rem)",
        band: "clamp(5rem, 9vw, 8rem)",
        bar: "var(--win-bar)",
      },
      maxWidth: {
        frame: "84rem",
        prose: "65ch",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.23, 1, 0.32, 1)",
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
        inout: "cubic-bezier(0.77, 0, 0.175, 1)",
        drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
        swift: "cubic-bezier(0.32, 0.72, 0, 1)",
        overshoot: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      keyframes: {
        caret: {
          "0%,49%": { opacity: "1" },
          "50%,100%": { opacity: "0" },
        },
        flow: {
          to: { strokeDashoffset: "-24" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
        plymouth: {
          "0%,100%": { opacity: "0.25" },
          "50%": { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        beam: {
          "0%,100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        caret: "caret 1.05s steps(1) infinite",
        flow: "flow 1.4s linear infinite",
        spin: "spin 1s linear infinite",
        plymouth: "plymouth 1.2s ease-in-out infinite",
        "fade-up": "fade-up 0.32s cubic-bezier(0.23, 1, 0.32, 1) both",
        beam: "beam 7s ease-in-out infinite",
        "beam-slow": "beam 11s ease-in-out infinite",
      },
      boxShadow: {
        win: "var(--shadow-win)",
        card: "0 1px 2px rgb(var(--c-shadow) / 0.06), 0 8px 24px -16px rgb(var(--c-shadow) / 0.25)",
        accent: "0 8px 24px -12px rgb(var(--c-accent) / 0.55)",
      },
      screens: {
        xs: "480px",
        "3xl": "1728px",
      },
    },
  },
  plugins: [
    plugin(({ addUtilities, addVariant }) => {
      addVariant("hocus", ["&:hover", "&:focus-visible"]);
      addVariant("fine", "@media (hover: hover) and (pointer: fine)");
      addVariant("os-ubuntu", "html:not(.light) &");
      addVariant("os-win", "html.light &");
      addUtilities({
        ".text-balance": { "text-wrap": "balance" },
        ".text-pretty": { "text-wrap": "pretty" },
        ".tnum": { "font-variant-numeric": "tabular-nums" },
        ".wide": { "font-stretch": "110%" },
      });
    }),
  ],
};

export default config;
