"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Github, Search } from "@/components/ui/icon";
import { ISA_MAX, ISA_SAMPLES, spell } from "@/lib/isa";
import type { DemoProps } from "./types";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Thin-space digit groups; commas are off limits (the module reads them as decimal points). */
const group = (n: number | string) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\u2009");

/** The npm chrome and README are the package's own English; only our helper messages are localised. */
const COPY = {
  en: {
    label: "Number", placeholder: "Type a number…", hint: `0 – ${group(ISA_MAX)}`, copy: "Copy install command", search: "Search packages",
    reasons: {
      empty: "Type a number and the module spells it out in Malagasy.",
      nan: "Digits only — decimals take a dot or a comma.",
      range: `Out of range: the whole part must stay between 0 and ${group(ISA_MAX)} (lavitrisa is the largest unit).`,
      error: "The module could not spell this one.",
    },
  },
  fr: {
    label: "Nombre", placeholder: "Tapez un nombre…", hint: `0 – ${group(ISA_MAX)}`, copy: "Copier la commande d'installation", search: "Search packages",
    reasons: {
      empty: "Tapez un nombre et le module l'écrit en toutes lettres malgaches.",
      nan: "Chiffres uniquement — les décimales avec un point ou une virgule.",
      range: `Hors limites : la partie entière doit rester entre 0 et ${group(ISA_MAX)} (lavitrisa est la plus grande unité).`,
      error: "Le module n'a pas pu écrire celui-ci.",
    },
  },
} as const;

const TABS = ["Readme", "Code", "0 Dependencies", "Versions"];
/** Real registry metadata for 1sa@1.0.0: five files, 5.45 kB unpacked, MIT. */
const META = [["Version", "1.0.0"], ["License", "MIT"], ["Unpacked Size", "5.45 kB"], ["Total Files", "5"]] as const;
const FONT = { fontFamily: "'Source Sans Pro', 'Segoe UI', system-ui, sans-serif" };
const CODE = "mt-1.5 overflow-x-auto rounded bg-[#F7F7F7] px-3 py-2 font-mono text-[12px] leading-relaxed text-[#231F20]";
const SIDE_H = "text-[12px] font-semibold text-[#757575]";

const truncate = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s);

export default function IsaDemo({ locale, compact = false }: DemoProps) {
  const t = COPY[locale];
  const [raw, setRaw] = useState("1789");
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const res = spell(raw);
  const trimmed = raw.trim();
  const arg = res.ok ? String(res.input) : JSON.stringify(trimmed);
  const words = res.ok ? res.words : "";

  function copyInstall() {
    if (typeof navigator !== "undefined" && navigator.clipboard) void navigator.clipboard.writeText("npm i 1sa").catch(() => undefined);
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="flex h-full w-full flex-col bg-white text-[#231F20]" style={FONT}>
      <header className="flex shrink-0 items-center gap-3 border-b border-[#E6E6E6] border-t-[3px] border-t-[#CB3837] px-3 py-2">
        <span className="shrink-0 bg-[#CB3837] px-1.5 text-[12px] font-bold leading-6 tracking-tight text-white" aria-label="npm">npm</span>
        <span className="flex h-8 min-w-0 flex-1 items-center gap-2 border border-[#E6E6E6] bg-[#FAFAFA] px-2 text-[12px] text-[#757575]" aria-hidden="true">
          <Search className="shrink-0 text-[14px]" />
          <span className="truncate">{t.search}</span>
        </span>
      </header>

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="px-3 pt-3">
          <h1 className="text-[28px] font-bold leading-none">1sa</h1>
          <p className="mt-1.5 text-[12px] text-[#757575]">1.0.0 · Public · Published 2023</p>
        </div>
        <div className="mt-3 flex border-b border-[#E6E6E6] px-3 text-[13px] font-semibold" role="tablist" aria-label="1sa">
          {TABS.map((tab, i) => (
            <span key={tab} role="tab" aria-selected={i === 0} className={`-mb-px whitespace-nowrap border-b-2 px-3 py-1.5 ${i === 0 ? "border-[#CB3837] text-[#231F20]" : "border-transparent text-[#757575]"}`}>{tab}</span>
          ))}
        </div>

        <div className={`grid gap-4 px-3 py-3 ${compact ? "" : "sm:grid-cols-[minmax(0,1fr)_12rem] sm:gap-6"}`}>
          <article className="min-w-0">
            <h2 className="border-b border-[#E6E6E6] pb-1 text-[20px] font-semibold leading-tight">1sa</h2>
            <p className="mt-2 text-[13px] leading-relaxed">Javascript module that translates a number into Malagasy letters.</p>
            <h3 className="mt-3 text-[15px] font-semibold">Install</h3>
            <pre className={CODE}><code>npm i 1sa</code></pre>
            <h3 className="mt-3 text-[15px] font-semibold">Usage</h3>
            <pre className={CODE}>
              <code>
                <span className="text-[#CB3837]">import</span> {"{ isa }"} <span className="text-[#CB3837]">from</span> <span className="text-[#2E7D32]">&quot;1sa&quot;</span>;{"\n\n"}
                isa(<span className="tabular-nums">{arg}</span>);{" "}
                <span className="text-[#757575]">{res.ok ? `// "${truncate(words, 40)}"` : `// ${res.reason}`}</span>
              </code>
            </pre>
            <h3 className="mt-3 text-[15px] font-semibold">Try it</h3>
            <div className="mt-1.5 rounded border border-[#E6E6E6] p-2.5">
              <label className="flex flex-col gap-1 text-[12px] text-[#757575]">
                <span className="flex items-center justify-between"><span>{t.label}</span><span className="font-mono tabular-nums">{t.hint}</span></span>
                <input
                  className="h-9 rounded border border-[#CCCCCC] bg-white px-2 font-mono text-[16px] tabular-nums text-[#231F20] outline-none focus:border-[#CB3837] focus:ring-1 focus:ring-[#CB3837]"
                  value={raw}
                  onChange={(e) => setRaw(e.target.value)}
                  placeholder={t.placeholder}
                  inputMode="decimal"
                  spellCheck={false}
                  autoComplete="off"
                  aria-label={t.label}
                />
              </label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {ISA_SAMPLES.map((n) => {
                  const on = trimmed === String(n);
                  return (
                    <button key={n} type="button" onClick={() => setRaw(String(n))} aria-pressed={on} className={`rounded border px-2 py-0.5 font-mono text-[12px] tabular-nums transition-colors ${on ? "border-[#231F20] bg-[#F7F7F7] text-[#231F20]" : "border-[#CCCCCC] bg-white text-[#555] hover:bg-[#F7F7F7]"}`}>
                      {group(n)}
                    </button>
                  );
                })}
              </div>
              <div aria-live="polite" className={`mt-2.5 ${compact ? "min-h-[3rem]" : "min-h-[4rem]"}`}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div key={raw} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25, ease: EASE }}>
                    {res.ok ? (
                      <p className={`text-balance font-bold leading-snug ${compact ? "text-[16px]" : "text-[18px]"}`}>{res.words}</p>
                    ) : (
                      <p className={`text-[13px] leading-snug ${res.reason === "empty" ? "text-[#757575]" : "text-[#CB3837]"}`}>{t.reasons[res.reason]}</p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </article>

          <aside className="flex flex-col gap-3 text-[13px]">
            <div>
              <h4 className={SIDE_H}>Install</h4>
              <div className="mt-1 flex items-center gap-2 rounded border border-[#E6E6E6] bg-[#F7F7F7] px-2 py-1.5 font-mono text-[12px]">
                <span className="text-[#757575]" aria-hidden="true">&gt;</span>
                <span className="flex-1 truncate">npm i 1sa</span>
                <button type="button" onClick={copyInstall} aria-label={t.copy} title={t.copy} className="grid h-6 w-6 shrink-0 place-items-center rounded text-[#555] transition-colors hover:bg-[#E6E6E6] hover:text-[#231F20]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={copied ? "ok" : "copy"} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.2, ease: EASE }} className={`flex ${copied ? "text-[#2E7D32]" : ""}`}>
                      {copied ? <Check className="text-[14px]" /> : <Copy className="text-[14px]" />}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>
            </div>
            <div className="border-t border-[#E6E6E6] pt-2">
              <h4 className={SIDE_H}>Repository</h4>
              <p className="mt-1 flex items-center gap-1.5 break-all"><Github className="shrink-0 text-[14px]" />github.com/Sambatra-Andriamihaja/1sa</p>
            </div>
            <div className="border-t border-[#E6E6E6] pt-2">
              <h4 className={SIDE_H}>Weekly Downloads</h4>
              <div className="mt-1 flex items-end justify-between gap-3">
                <span className="text-[16px] font-bold tabular-nums leading-none">23</span>
                <svg viewBox="0 0 100 24" className="h-6 w-28 shrink-0" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 18 12 14 24 16 36 10 48 12 60 7 72 11 84 6 100 9V24H0Z" fill="#CB3837" fillOpacity="0.12" />
                  <path d="M0 18 12 14 24 16 36 10 48 12 60 7 72 11 84 6 100 9" fill="none" stroke="#CB3837" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-[#E6E6E6] pt-2">
              {META.map(([k, v]) => (
                <div key={k}><dt className={SIDE_H}>{k}</dt><dd className="mt-0.5 text-[15px] font-semibold tabular-nums">{v}</dd></div>
              ))}
            </dl>
          </aside>
        </div>
      </div>
    </div>
  );
}
