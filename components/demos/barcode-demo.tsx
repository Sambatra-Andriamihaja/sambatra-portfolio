"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Clock, Copy, Layers } from "@/components/ui/icon";
import type { DemoProps } from "./types";

const EASE = [0.16, 1, 0.3, 1] as const;
/** Odoo 16 web client: Roboto-ish system stack, brand purple #714B67, #DEE2E6 hairlines. */
const FONT = 'Roboto, "Segoe UI", system-ui, sans-serif';
const FIELD = "w-full min-w-0 border-0 border-b border-[#DEE2E6] bg-transparent py-0.5 text-[13px] text-[#212529] outline-none focus:border-[#714B67]";

const COPY = {
  en: {
    app: "Inventory", menus: ["Overview", "Operations", "Products", "Reporting"], crumb: "Products", save: "Save", discard: "Discard",
    onHand: "On Hand", sold: "Sold", name: "Product Name", category: "Product Category", material: "Material", size: "Size",
    sequence: "Sequence", next: "next", saved: "Record saved", dup: "Duplicate detected — sequence bumped", dupCheck: "Duplicate check", unique: "unique",
    tabs: ["General Information", "Inventory", "Reference & Barcode"], ref: "Internal Reference", barcode: "Barcode", checkDigit: "Check digit", copy: "Copy", copied: "Copied",
    groups: [[["Product Type", "Storable Product"], ["Sales Price", "89.90 €"], ["Unit of Measure", "Units"]], [["Routes", "Buy"], ["Weight", "6.80 kg"], ["Volume", "0.02 m³"]]],
  },
  fr: {
    app: "Inventaire", menus: ["Aperçu", "Opérations", "Produits", "Analyse"], crumb: "Produits", save: "Sauvegarder", discard: "Annuler",
    onHand: "En stock", sold: "Vendus", name: "Nom du produit", category: "Catégorie de produit", material: "Matière", size: "Taille",
    sequence: "Séquence", next: "suivant", saved: "Enregistrement sauvegardé", dup: "Doublon détecté — séquence incrémentée", dupCheck: "Contrôle doublon", unique: "unique",
    tabs: ["Informations générales", "Inventaire", "Référence & code-barres"], ref: "Référence interne", barcode: "Code-barres", checkDigit: "Clé de contrôle", copy: "Copier", copied: "Copié",
    groups: [[["Type de produit", "Produit stockable"], ["Prix de vente", "89,90 €"], ["Unité de mesure", "Unités"]], [["Routes", "Acheter"], ["Poids", "6,80 kg"], ["Volume", "0,02 m³"]]],
  },
} as const;

type Option = { code: string; label: string };
const CATEGORIES: Option[] = [
  { code: "TOOL", label: "Outillage" },
  { code: "PACK", label: "Emballage" },
  { code: "ELEC", label: "Électricité" },
  { code: "HARD", label: "Quincaillerie" },
];
const MATERIALS: Option[] = [
  { code: "ST", label: "Acier" },
  { code: "PL", label: "Plastique" },
  { code: "IX", label: "Inox" },
];
const SIZES: Option[] = ["S", "M", "L", "XL"].map((s) => ({ code: s, label: s }));
const DEFAULTS = { name: "Coffret outils 117 pcs", cat: "TOOL", mat: "ST", size: "L" };

/** Code 128 bar/space module widths, indexed by symbol value (106 = stop). */
const C128: readonly string[] = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
  "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
  "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
  "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
  "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
  "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141",
  "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
  "114131", "311141", "411131", "211412", "211214", "211232", "2331112",
];

/** Start B (104), data (charCode − 32), checksum (104 + Σ vᵢ·i) mod 103, stop (106). */
function encode128B(text: string): number[] {
  const values = Array.from(text).map((ch) => {
    const v = ch.charCodeAt(0) - 32;
    return v >= 0 && v <= 95 ? v : 0;
  });
  const check = values.reduce((acc, v, i) => acc + v * (i + 1), 104) % 103;
  return [104, ...values, check, 106];
}

function hash32(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193) >>> 0;
  return h >>> 0;
}

/** EAN-13 in the "200" internal range; body derived from the reference, valid check digit. */
function ean13(ref: string): string {
  const body = `200${String(hash32(ref)).padStart(10, "0").slice(-9)}`;
  const sum = Array.from(body).reduce((acc, d, i) => acc + Number(d) * (i % 2 === 0 ? 1 : 3), 0);
  return body + String((10 - (sum % 10)) % 10);
}

function Code128Svg({ value, className }: { value: string; className?: string }) {
  const MODULE = 2;
  const QUIET = 10 * MODULE;
  const H = 56;
  const bars: { x: number; w: number }[] = [];
  let x = QUIET;
  for (const code of encode128B(value)) {
    const pattern = C128[code] ?? "";
    for (let j = 0; j < pattern.length; j++) {
      const w = Number(pattern[j] ?? 0) * MODULE;
      if (j % 2 === 0) bars.push({ x, w });
      x += w;
    }
  }
  return (
    <svg viewBox={`0 0 ${x + QUIET} ${H}`} className={className} role="img" aria-label={`Code 128: ${value}`} shapeRendering="crispEdges" preserveAspectRatio="xMidYMid meet">
      {bars.map((b) => <rect key={b.x} x={b.x} y={0} width={b.w} height={H} fill="currentColor" />)}
    </svg>
  );
}

/** Odoo 16 main navbar: apps grid, app name, top menus, systray. */
function Navbar({ app, menus }: { app: string; menus: readonly string[] }) {
  return (
    <div className="flex h-[46px] shrink-0 items-center bg-[#714B67] px-2 text-white">
      <svg viewBox="0 0 16 16" className="mx-2 h-4 w-4 fill-current" aria-hidden="true">
        {[1, 6, 11].flatMap((x) => [1, 6, 11].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width={4} height={4} />))}
      </svg>
      <span className="px-2 text-sm font-medium">{app}</span>
      {menus.map((m) => <span key={m} className="hidden px-2 text-[13px] text-white/90 sm:inline">{m}</span>)}
      <span className="ml-auto flex items-center gap-3 pr-1 text-[13px]">
        <Clock className="text-[15px]" />
        <span className="hidden sm:inline">MGBI</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-medium">SA</span>
      </span>
    </div>
  );
}

/** Odoo form group row: 500-weight label on the left, underlined field on the right. */
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid grid-cols-[38%_minmax(0,1fr)] items-center gap-3 text-[13px]">
      <span className="font-medium text-[#212529]">{label}</span>
      {children}
    </label>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: Option[]; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <select className={FIELD} value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
        {options.map((o) => (
          <option key={o.code} value={o.code}>
            {o.label === o.code ? o.code : `${o.label} · ${o.code}`}
          </option>
        ))}
      </select>
    </Field>
  );
}

const pad = (n: number) => String(n).padStart(4, "0");
const labelOf = (list: Option[], code: string) => list.find((o) => o.code === code)?.label ?? code;

export default function BarcodeDemo({ locale, compact = false }: DemoProps) {
  const t = COPY[locale];
  const [name, setName] = useState(DEFAULTS.name);
  const [cat, setCat] = useState(DEFAULTS.cat);
  const [mat, setMat] = useState(DEFAULTS.mat);
  const [size, setSize] = useState(DEFAULTS.size);
  const [seq, setSeq] = useState(117);
  const [tab, setTab] = useState(2);
  const [status, setStatus] = useState<"idle" | "saved" | "dup">("idle");
  const [flash, setFlash] = useState(false);
  const [copied, setCopied] = useState(false);
  const lastSig = useRef<string | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const reference = `${cat}-${mat}-${size}-${pad(seq)}`;
  const ean = ean13(reference);
  const signature = `${name.trim()}|${cat}|${mat}|${size}`;

  function generate() {
    const dup = lastSig.current === signature;
    lastSig.current = signature;
    setSeq((s) => s + 1);
    setFlash(true);
    setStatus(dup ? "dup" : "saved");
    later(() => setFlash(false), 500);
    later(() => setStatus("idle"), 2000);
  }

  function discard() {
    setName(DEFAULTS.name);
    setCat(DEFAULTS.cat);
    setMat(DEFAULTS.mat);
    setSize(DEFAULTS.size);
  }

  function copyRef() {
    if (typeof navigator !== "undefined" && navigator.clipboard) void navigator.clipboard.writeText(reference).catch(() => undefined);
    setCopied(true);
    later(() => setCopied(false), 1200);
  }

  const stats = [[t.onHand, "117", Layers], [t.sold, "42", ArrowUpRight]] as const;

  return (
    <div className="relative flex h-full w-full flex-col bg-[#F8F8F8] text-[#212529]" style={{ fontFamily: FONT }}>
      <Navbar app={t.app} menus={t.menus} />

      {/* control panel: breadcrumb + form status buttons */}
      <div className="flex shrink-0 items-center gap-2 border-b border-[#DEE2E6] bg-white px-3 py-1.5 text-[13px]">
        <nav className="min-w-0 flex-1 truncate" aria-label="breadcrumb">
          <span className="text-[#017E84]">{t.crumb}</span>
          <span className="px-1.5 text-[#6C757D]">/</span>
          <span className="font-medium">{name.trim() || "—"}</span>
        </nav>
        <button type="submit" form="odoo-product-form" className="rounded-[3px] bg-[#714B67] px-3 py-1 font-medium text-white transition-colors hover:bg-[#5F3F57]">{t.save}</button>
        <button type="button" onClick={discard} className="rounded-[3px] border border-[#DEE2E6] bg-white px-3 py-1 transition-colors hover:bg-[#F8F8F8]">{t.discard}</button>
        {!compact && <span className="tnum pl-2 text-[#6C757D]">1 / 24</span>}
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-2 sm:p-4">
        <form id="odoo-product-form" className="mx-auto max-w-[960px] border border-[#DEE2E6] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]" onSubmit={(e) => { e.preventDefault(); generate(); }}>
          {/* smart buttons */}
          <div className="flex justify-end">
            {stats.map(([label, value, Icon]) => (
              <div key={label} className="flex items-center gap-2 border-b border-l border-[#DEE2E6] px-3 py-1.5 text-xs">
                <Icon className="text-[16px] text-[#714B67]" />
                <span className="leading-tight"><span className="tnum block font-medium">{value}</span><span className="text-[#6C757D]">{label}</span></span>
              </div>
            ))}
          </div>

          <div className="flex gap-4 p-3 sm:gap-6 sm:p-5">
            <div className="min-w-0 flex-1">
              <input className="w-full border-0 border-b border-[#DEE2E6] bg-transparent pb-1 text-xl font-medium leading-tight text-[#212529] outline-none focus:border-[#714B67] sm:text-2xl" value={name} onChange={(e) => setName(e.target.value)} aria-label={t.name} placeholder={t.name} />
              <div className={`mt-3 grid gap-x-8 gap-y-2 ${compact ? "grid-cols-2" : "sm:grid-cols-2"}`}>
                <Select label={t.category} value={cat} options={CATEGORIES} onChange={setCat} />
                <Select label={t.material} value={mat} options={MATERIALS} onChange={setMat} />
                <Select label={t.size} value={size} options={SIZES} onChange={setSize} />
                <Field label={t.sequence}>
                  <span className={`${FIELD} tnum flex justify-between font-mono`}>
                    <span className="text-[#6C757D]">{t.next}</span>
                    <motion.span key={seq} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3, ease: EASE }}>{pad(seq)}</motion.span>
                  </span>
                </Field>
              </div>
            </div>
            {!compact && (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center border border-[#DEE2E6] bg-[#F8F8F8] text-[#ADB5BD]" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 8h3l2-2.5h6L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>
              </div>
            )}
          </div>

          {/* notebook */}
          <div className="px-3 sm:px-5">
            <div role="tablist" className="flex overflow-x-auto border-b border-[#DEE2E6] text-[13px]">
              {t.tabs.map((label, i) => (
                <button key={label} type="button" role="tab" aria-selected={tab === i} onClick={() => setTab(i)} className={`-mb-px shrink-0 border-b-[3px] px-3 py-2 transition-colors ${tab === i ? "border-[#714B67] font-medium text-[#212529]" : "border-transparent text-[#6C757D] hover:text-[#212529]"}`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="py-3 sm:py-4">
              {tab < 2 ? (
                <div className="grid max-w-md gap-2">
                  {t.groups[tab].map(([k, v]) => <Field key={k} label={k}><span className={FIELD}>{v}</span></Field>)}
                </div>
              ) : (
                <div className={`grid gap-4 ${compact ? "grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]" : "sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"}`}>
                  <div className="grid content-start gap-2">
                    <Field label={t.ref}>
                      <span className={`${FIELD} tnum overflow-hidden font-mono font-medium`}>
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span key={reference} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25, ease: EASE }} className="inline-block">{reference}</motion.span>
                        </AnimatePresence>
                      </span>
                    </Field>
                    <Field label={t.barcode}><span className={`${FIELD} tnum font-mono`}>{ean}</span></Field>
                    <Field label={t.checkDigit}><span className={`${FIELD} tnum font-mono`}>{ean.slice(-1)} <span className="text-[#6C757D]">· EAN-13</span></span></Field>
                    <p className="text-xs text-[#6C757D]">
                      {t.dupCheck}: <span className={`font-medium ${status === "dup" ? "text-[#E5A100]" : "text-[#28A745]"}`}>{status === "dup" ? t.dup : t.unique}</span>
                    </p>
                  </div>
                  {/* product label preview, as printed by the label report */}
                  <div className={`border border-[#DEE2E6] p-3 transition-shadow duration-500 ${flash ? "shadow-[0_0_0_2px_#714B67]" : "shadow-none"}`}>
                    <div className="flex items-start justify-between gap-2 text-xs">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{name.trim() || "—"}</p>
                        <p className="truncate text-[#6C757D]">{labelOf(CATEGORIES, cat)} · {labelOf(MATERIALS, mat)} · {size}</p>
                      </div>
                      <button type="button" onClick={copyRef} aria-label={t.copy} className="inline-flex shrink-0 items-center gap-1 rounded-[3px] bg-[#714B67] px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-[#5F3F57]">
                        {copied ? <Check className="text-[13px]" /> : <Copy className="text-[13px]" />}
                        {copied ? t.copied : t.copy}
                      </button>
                    </div>
                    <Code128Svg value={reference} className="mt-2 h-12 w-full text-[#212529]" />
                    <p className="mt-1 text-center font-mono text-xs tracking-[0.3em]">{reference}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Odoo notification */}
      <AnimatePresence>
        {status !== "idle" && (
          <motion.div key={status} role="status" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: EASE }} className="pointer-events-none absolute right-3 top-[52px] z-10 flex max-w-[85%] items-center gap-2 rounded-[4px] bg-[#212529] px-3 py-2 text-xs text-white shadow-lg">
            {status === "dup" ? <span className="text-[#FFAC00]" aria-hidden="true">⚠</span> : <Check className="shrink-0 text-[14px] text-[#28A745]" />}
            <span>{status === "dup" ? t.dup : t.saved}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
