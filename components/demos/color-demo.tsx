"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { DemoProps } from "./types";

const EASE = [0.16, 1, 0.3, 1] as const;

/** "Pick up color" is the app's own (English-only) label, so it stays as-is in both locales. */
const COPY = {
  en: {
    picker: "Saturation and brightness", hue: "Hue", copy: "Copy", pick: "Pick up color", noPick: "EyeDropper needs Chrome or Edge",
    recent: "Recent colors", restore: "Restore", contrast: "Contrast", onWhite: "on white", onBlack: "on black", fail: "fail", mode: "Switch input format",
  },
  fr: {
    picker: "Saturation et luminosité", hue: "Teinte", copy: "Copier", pick: "Pick up color", noPick: "EyeDropper requiert Chrome ou Edge",
    recent: "Couleurs récentes", restore: "Restaurer", contrast: "Contraste", onWhite: "sur blanc", onBlack: "sur noir", fail: "échec", mode: "Changer le format de saisie",
  },
} as const;

type HSV = { h: number; s: number; v: number };
type RGB = { r: number; g: number; b: number };
type Out = "rgba" | "hsl" | "hex";
type Mode = "rgb" | "hsl" | "hex";
type Field = readonly [string, number, number, (n: number) => void];
type EyeDropperCtor = new () => { open(): Promise<{ sRGBHex: string }> };

/* ── Colour math ─────────────────────────────────────────────────────── */
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function hueOf(R: number, G: number, B: number, max: number, d: number): number {
  if (d === 0) return 0;
  const h = max === R ? ((G - B) / d) % 6 : max === G ? (B - R) / d + 2 : (R - G) / d + 4;
  return (h * 60 + 360) % 360;
}

/** Shared last step of the HSV/HSL → RGB conversions: pick the hue sector, add the lightness offset. */
function sector(hh: number, c: number, m: number): RGB {
  const x = c * (1 - Math.abs((hh % 2) - 1));
  const [r, g, b] = hh < 1 ? [c, x, 0] : hh < 2 ? [x, c, 0] : hh < 3 ? [0, c, x] : hh < 4 ? [0, x, c] : hh < 5 ? [x, 0, c] : [c, 0, x];
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}

function hsvToRgb({ h, s, v }: HSV): RGB {
  const V = v / 100, c = V * (s / 100);
  return sector((h % 360) / 60, c, V - c);
}

function hslToRgb(h: number, s: number, l: number): RGB {
  const L = l / 100, c = (1 - Math.abs(2 * L - 1)) * (s / 100);
  return sector((h % 360) / 60, c, L - c / 2);
}

function rgbToHsv({ r, g, b }: RGB): HSV {
  const R = r / 255, G = g / 255, B = b / 255;
  const max = Math.max(R, G, B), d = max - Math.min(R, G, B);
  return { h: hueOf(R, G, B, max, d), s: max === 0 ? 0 : (d / max) * 100, v: max * 100 };
}

function rgbToHsl({ r, g, b }: RGB): { h: number; s: number; l: number } {
  const R = r / 255, G = g / 255, B = b / 255;
  const max = Math.max(R, G, B), min = Math.min(R, G, B), d = max - min;
  const l = (max + min) / 2;
  return { h: hueOf(R, G, B, max, d), s: d === 0 ? 0 : (d / (1 - Math.abs(2 * l - 1))) * 100, l: l * 100 };
}

/** The app prints lowercase hex (`#a71d15`). */
const hex2 = (n: number) => n.toString(16).padStart(2, "0");
const toHex = ({ r, g, b }: RGB) => `#${hex2(r)}${hex2(g)}${hex2(b)}`;

function parseHex(hex: string): RGB | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** WCAG 2.x relative luminance of an sRGB colour. */
function luminance({ r, g, b }: RGB): number {
  const lin = (c: number) => {
    const x = c / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(fg: RGB, bg: number): number {
  const L1 = luminance(fg), L2 = bg === 255 ? 1 : 0;
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}
const grade = (ratio: number) => (ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : "fail");

/* ── Presentation: the real app is an aubergine always-on-top window over the Ubuntu wallpaper ── */
const UI_FONT = "Ubuntu, 'Segoe UI', system-ui, sans-serif";
const WALL: CSSProperties = {
  fontFamily: UI_FONT,
  backgroundImage:
    "radial-gradient(circle at 78% 28%, rgba(255,196,110,0.40), transparent 34%), radial-gradient(circle at 18% 82%, rgba(90,28,8,0.55), transparent 42%), linear-gradient(162deg, #c9651f 0%, #a54819 46%, #7b2f12 100%)",
};
const HUE_TRACK = "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)";
const LABEL = "pl-3 text-[13px] leading-5 text-[#d9d9d9]";
const NUM = "h-7 w-full rounded-[3px] border border-[#dadada] bg-white text-center text-[12px] text-[#333] outline-none focus:border-[#4a90e2] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";
const THUMB =
  "[&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-transparent [&::-webkit-slider-thumb]:shadow-[0_0_2px_rgba(0,0,0,0.6)] [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-transparent [&::-moz-range-track]:bg-transparent";

/** The colour on the reference screenshot: rgba(167, 29, 21, 1) · hsl(3, 78%, 37%) · #a71d15. */
const DEFAULT: RGB = { r: 167, g: 29, b: 21 };
const SEED = ["#a71d15", "#e95420", "#772953", "#2c001e", "#aea79f"];
const NEXT: Record<Mode, Mode> = { rgb: "hsl", hsl: "hex", hex: "rgb" };
const dropper = () => (window as unknown as { EyeDropper?: EyeDropperCtor }).EyeDropper;

function Clipboard({ done }: { done: boolean }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.svg key={done ? "ok" : "copy"} viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.2, ease: EASE }}>
        {done ? <path d="m5 12 5 5L20 7" /> : <><rect x="6" y="5" width="12" height="16" rx="2" /><path d="M9 5a3 3 0 0 1 6 0M9 11h6M9 15h4" /></>}
      </motion.svg>
    </AnimatePresence>
  );
}

function OutField({ value, copy, done, onCopy }: { value: string; copy: string; done: boolean; onCopy: () => void }) {
  return (
    <span className="flex h-8 min-w-0 items-center rounded-full border border-[#9a9a9a]">
      <span className="min-w-0 flex-1 truncate pl-3 pr-2 text-[13px] text-[#ececec]">{value}</span>
      <button type="button" onClick={onCopy} aria-label={copy} title={copy} className={`grid h-full w-8 shrink-0 place-items-center rounded-r-full border-l border-[#9a9a9a] transition-colors hover:bg-white/10 ${done ? "text-[#8fe3a1]" : "text-[#d9d9d9]"}`}>
        <Clipboard done={done} />
      </button>
    </span>
  );
}

export default function ColorDemo({ locale, compact = false }: DemoProps) {
  const t = COPY[locale];
  const [hsv, setHsv] = useState<HSV>(() => rgbToHsv(DEFAULT));
  const [mode, setMode] = useState<Mode>("rgb");
  const [draft, setDraft] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>(SEED);
  const [copied, setCopied] = useState<Out | null>(null);
  const [canPick, setCanPick] = useState(false);
  const dragging = useRef(false);
  const copyTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setCanPick(Boolean(dropper()));
    return () => window.clearTimeout(copyTimer.current);
  }, []);

  const rgb = hsvToRgb(hsv);
  const hsl = rgbToHsl(rgb);
  const hex = toHex(rgb);
  const H = Math.round(hsl.h), S = Math.round(hsl.s), L = Math.round(hsl.l);
  const out: Record<Out, string> = { rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`, hsl: `hsl(${H}, ${S}%, ${L}%)`, hex };
  const solid = `rgb(${rgb.r} ${rgb.g} ${rgb.b})`;

  /** Settle for 700ms and the colour joins the recent strip (most recent first, deduplicated). */
  useEffect(() => {
    const id = window.setTimeout(() => setHistory((h) => [hex, ...h.filter((x) => x !== hex)].slice(0, 5)), 700);
    return () => window.clearTimeout(id);
  }, [hex]);

  function pick(e: PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setHsv((p) => ({ ...p, s: clamp(((e.clientX - r.left) / r.width) * 100, 0, 100), v: clamp((1 - (e.clientY - r.top) / r.height) * 100, 0, 100) }));
  }

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    const step = e.shiftKey ? 10 : 1;
    const moves: Record<string, readonly [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    const m = moves[e.key];
    if (!m) return;
    e.preventDefault();
    setHsv((p) => ({ ...p, s: clamp(p.s + m[0], 0, 100), v: clamp(p.v + m[1], 0, 100) }));
  }

  function copy(key: Out) {
    if (typeof navigator !== "undefined" && navigator.clipboard) void navigator.clipboard.writeText(out[key]).catch(() => undefined);
    setCopied(key);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(null), 1200);
  }

  function restore(h: string) {
    const p = parseHex(h);
    if (p) setHsv(rgbToHsv(p));
  }

  /** The app's eyedropper: Chromium's EyeDropper API where available. */
  function pickUp() {
    const ED = dropper();
    if (!ED) return;
    void new ED().open().then(({ sRGBHex }) => restore(sRGBHex)).catch(() => undefined);
  }

  const setRgb = (p: Partial<RGB>) => setHsv(rgbToHsv({ ...rgb, ...p }));
  const setHsl = (p: Partial<{ h: number; s: number; l: number }>) => setHsv(rgbToHsv(hslToRgb(p.h ?? H, p.s ?? S, p.l ?? L)));
  const fields: readonly Field[] = mode === "rgb"
    ? [["R", rgb.r, 255, (n) => setRgb({ r: n })], ["G", rgb.g, 255, (n) => setRgb({ g: n })], ["B", rgb.b, 255, (n) => setRgb({ b: n })]]
    : [["H", H, 360, (n) => setHsl({ h: n })], ["S", S, 100, (n) => setHsl({ s: n })], ["L", L, 100, (n) => setHsl({ l: n })]];
  const connector = "h-px bg-[#9a9a9a]";

  return (
    <div className="flex h-full w-full flex-col relative overflow-auto" style={WALL}>
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-25" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#ffd9a6" strokeWidth="1.5" aria-hidden="true">
        <circle cx="332" cy="72" r="62" /><circle cx="332" cy="72" r="34" /><circle cx="58" cy="252" r="44" /><path d="M296 300c26-58 88-72 104-142M330 300c14-30 40-46 70-52" />
      </svg>

      <div className={`relative mx-auto flex w-full flex-col ${compact ? "max-w-[26rem] px-3 pt-2" : "max-w-[30rem] px-5 pt-4"}`}>
        <section aria-label="Color Picker" className={`relative rounded-2xl bg-[#2c1a23] shadow-[0_12px_32px_rgba(0,0,0,0.38)] ${compact ? "px-4 pb-10 pt-2.5" : "px-6 pb-12 pt-4"}`}>
          <span className="absolute right-2 top-2 flex flex-col gap-1.5" aria-hidden="true">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f0245a] text-[15px] font-bold leading-none text-white">×</span>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#8d8d8d] text-[15px] font-bold leading-none text-white">−</span>
          </span>
          <div className={`absolute flex items-center gap-1 ${compact ? "left-4 top-3" : "left-6 top-5"}`} aria-label={t.recent}>
            {history.map((h) => (
              <motion.button key={h} layout type="button" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.25, ease: EASE }} onClick={() => restore(h)} aria-label={`${t.restore} ${h}`} title={h} className={`h-3.5 w-3.5 rounded-full ${h === hex ? "ring-2 ring-white" : "ring-1 ring-[#9a9a9a]"}`} style={{ backgroundColor: h }} />
            ))}
          </div>

          <div className="mx-auto flex w-1/2 flex-col">
            <span className={LABEL}>RGBA</span>
            <OutField value={out.rgba} copy={`${t.copy} RGBA`} done={copied === "rgba"} onCopy={() => copy("rgba")} />
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_0.75rem_auto_0.75rem_minmax(0,1fr)] items-center">
            <span className={LABEL}>HSL</span>
            <span />
            <span className="h-5 w-px justify-self-center bg-[#9a9a9a]" aria-hidden="true" />
            <span />
            <span className={LABEL}>HEX</span>
            <OutField value={out.hsl} copy={`${t.copy} HSL`} done={copied === "hsl"} onCopy={() => copy("hsl")} />
            <span className={connector} aria-hidden="true" />
            <motion.span className={`rounded-full ${compact ? "h-12 w-12" : "h-16 w-16"}`} animate={{ backgroundColor: solid }} transition={{ duration: 0.2 }} aria-hidden="true" />
            <span className={connector} aria-hidden="true" />
            <OutField value={out.hex} copy={`${t.copy} HEX`} done={copied === "hex"} onCopy={() => copy("hex")} />
          </div>

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
            <button type="button" onClick={pickUp} disabled={!canPick} title={canPick ? t.pick : t.noPick} className="text-[16px] text-[#cfcfcf] transition-colors hover:text-white disabled:cursor-default disabled:opacity-60 disabled:hover:text-[#cfcfcf]">
              {t.pick}
            </button>
            <span className="flex items-center gap-2.5" aria-label={t.contrast}>
              {[255, 0].map((bg) => {
                const ratio = contrast(rgb, bg), g = grade(ratio);
                return (
                  <span key={bg} className="inline-flex items-center gap-1 text-[12px] text-[#cfcfcf]" title={`${t.contrast} ${bg ? t.onWhite : t.onBlack}`}>
                    <span className="grid h-4 w-4 place-items-center rounded-sm text-[12px] font-bold leading-none" style={{ backgroundColor: bg ? "#fff" : "#000", color: solid }} aria-hidden="true">A</span>
                    <span className="tabular-nums">{ratio.toFixed(1)}:1</span>
                    <span className={`rounded-sm px-1 font-semibold ${g === "fail" ? "bg-[#f0245a]/25 text-[#ff9dbb]" : "bg-white/10 text-[#ececec]"}`}>{g === "fail" ? t.fail : g}</span>
                  </span>
                );
              })}
            </span>
          </div>
        </section>

        <div className={`relative z-10 mx-auto mb-3 rounded-[3px] bg-white text-[#333] shadow-[0_2px_10px_rgba(0,0,0,0.35)] ${compact ? "-mt-9 w-56" : "-mt-10 w-64"}`}>
          <div
            role="slider"
            tabIndex={0}
            aria-label={t.picker}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(hsv.s)}
            aria-valuetext={`S ${Math.round(hsv.s)}% · V ${Math.round(hsv.v)}%`}
            className={`relative w-full cursor-crosshair touch-none select-none rounded-t-[3px] ${compact ? "h-20" : "h-24"}`}
            style={{ backgroundColor: `hsl(${hsv.h} 100% 50%)`, backgroundImage: "linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)" }}
            onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); e.currentTarget.focus(); pick(e); }}
            onPointerMove={(e) => { if (dragging.current) pick(e); }}
            onPointerUp={(e) => { dragging.current = false; e.currentTarget.releasePointerCapture(e.pointerId); }}
            onPointerCancel={() => { dragging.current = false; }}
            onKeyDown={onKey}
          >
            <span className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_2px_rgba(0,0,0,0.6)]" style={{ left: `${hsv.s}%`, top: `${100 - hsv.v}%` }} aria-hidden="true" />
          </div>

          <div className="flex items-center gap-2 px-2 pt-2">
            <button type="button" onClick={pickUp} disabled={!canPick} aria-label={t.pick} title={canPick ? t.pick : t.noPick} className="grid h-7 w-7 shrink-0 place-items-center rounded-[3px] bg-[#e0e0e0] text-[#333] transition-colors hover:bg-[#d2d2d2] disabled:cursor-default disabled:opacity-50 disabled:hover:bg-[#e0e0e0]">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4 20 1-4 9-9 3 3-9 9-4 1ZM13 8l3-3 1-1a2.1 2.1 0 0 1 3 3l-1 1-3 3" /></svg>
            </button>
            <motion.span className="h-7 w-7 shrink-0 rounded-full" animate={{ backgroundColor: solid }} transition={{ duration: 0.2 }} aria-hidden="true" />
            <span className="relative block h-2.5 min-w-0 flex-1 rounded-full" style={{ backgroundImage: HUE_TRACK }}>
              <input type="range" min={0} max={360} step={1} value={Math.round(hsv.h)} onChange={(e) => setHsv((p) => ({ ...p, h: Number(e.target.value) }))} aria-label={t.hue} className={`absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent ${THUMB}`} />
            </span>
          </div>

          <div className="flex items-start gap-2 px-2 pb-2 pt-2">
            {mode === "hex" ? (
              <label className="flex flex-1 flex-col items-center gap-1">
                <input value={draft ?? hex} onChange={(e) => { setDraft(e.target.value); restore(e.target.value); }} onBlur={() => setDraft(null)} spellCheck={false} autoComplete="off" className={`${NUM} font-mono`} aria-label="HEX" />
                <span className="text-[12px] text-[#222]">HEX</span>
              </label>
            ) : (
              fields.map(([label, value, max, onChange]) => (
                <label key={label} className="flex flex-1 flex-col items-center gap-1">
                  <input type="number" min={0} max={max} value={value} onChange={(e) => onChange(clamp(Number(e.target.value) || 0, 0, max))} className={`${NUM} tabular-nums`} aria-label={label} />
                  <span className="text-[12px] text-[#222]">{label}</span>
                </label>
              ))
            )}
            <button type="button" onClick={() => setMode((m) => NEXT[m])} aria-label={t.mode} title={t.mode} className="mt-1 grid h-6 w-5 shrink-0 place-items-center rounded-[3px] text-[#555] transition-colors hover:bg-[#eee] hover:text-[#111]">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m8 9 4-4 4 4M8 15l4 4 4-4" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
