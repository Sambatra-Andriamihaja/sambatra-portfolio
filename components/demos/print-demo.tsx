"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock, Download } from "@/components/ui/icon";
import type { DemoProps } from "./types";

const EASE = [0.16, 1, 0.3, 1] as const;
/** Odoo 16 web client chrome (#714B67, #DEE2E6 hairlines); reports come out of wkhtmltopdf in Lato. */
const FONT = 'Roboto, "Segoe UI", system-ui, sans-serif';
const LATO = 'Lato, "Segoe UI", system-ui, sans-serif';
const FIELD = "w-full min-w-0 border-0 border-b border-[#DEE2E6] bg-transparent py-0.5 text-[13px] text-[#212529] outline-none focus:border-[#714B67]";
const BTN = "rounded-[3px] bg-[#714B67] px-3 py-1 text-[13px] font-medium text-white transition-colors hover:bg-[#5F3F57] disabled:cursor-not-allowed disabled:opacity-50";
const BOX = "border border-[#8C8C8C]";
const ROW = "grid grid-cols-[150px_minmax(0,1fr)] gap-2";
const ar = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const DATE = "08/05/2023";

const COPY = {
  en: {
    app: "Inventory", menus: ["Overview", "Operations", "Products"], appBill: "Accounting", menusBill: ["Customers", "Vendors", "Reporting"],
    crumb: "Products", crumbBill: "Invoices", name: "Product Name", ref: "Internal Reference", price: "Sales Price (Ar)", remise: "Discount %", brand: "Brand", desc: "Description",
    print: "Print", rendered: "Report rendered in 84 ms", file: "Article_117_Pcs_tools_set.pdf", fileBill: "Impression_traites.pdf",
    selected: "selected", printBatch: "Print batch", printed: (n: number) => `1 document · ${n} page${n > 1 ? "s" : ""}`, empty: "Select invoices to build the batch.",
    number: "Number", customer: "Customer", due: "Due Date", total: "Total", selectAll: "Select all",
  },
  fr: {
    app: "Inventaire", menus: ["Aperçu", "Opérations", "Produits"], appBill: "Comptabilité", menusBill: ["Clients", "Fournisseurs", "Analyse"],
    crumb: "Produits", crumbBill: "Factures", name: "Nom du produit", ref: "Référence interne", price: "Prix de vente (Ar)", remise: "Remise %", brand: "Marque", desc: "Description",
    print: "Imprimer", rendered: "Rapport généré en 84 ms", file: "Article_117_Pcs_tools_set.pdf", fileBill: "Impression_traites.pdf",
    selected: "sélectionnées", printBatch: "Imprimer le lot", printed: (n: number) => `1 document · ${n} page${n > 1 ? "s" : ""}`, empty: "Sélectionnez des factures pour composer le lot.",
    number: "Numéro", customer: "Client", due: "Échéance", total: "Total", selectAll: "Tout sélectionner",
  },
} as const;
type Copy = (typeof COPY)[keyof typeof COPY];
type Invoice = { id: string; customer: string; amount: number; words: string; due: string };
type Sheet = { name: string; ref: string; price: number; remise: number; brand: string; lines: string[] };

const BRANDS: { name: string; color: string }[] = [
  { name: "INGCO", color: "#1A1A1A" }, { name: "Foska", color: "#D7261E" }, { name: "beko", color: "#0057B8" }, { name: "GeKa", color: "#4A4A4A" },
  { name: "BAUMERK", color: "#2E7D32" }, { name: "CASALINE", color: "#111111" }, { name: "colorama", color: "#E67E22" }, { name: "FRANKE", color: "#C8102E" },
];
const DESC = ["117 Pcs Tools Set", "Include:", "1 Pcs 8Oz Claw hammer", '1 Pcs 6" Combination Pliers', '1 Pcs 6" Long nose pliers', "1 Pcs SL5.5*100 Screwdriver", "1 Pcs PH1*100 Screwdriver", "1 Pcs Screwdriver tester", '1 Pcs 8" Adjustable Wrench', "1 Pcs 3M Steel measuring tape", "1 Pcs Mini Hacks"].join("\n");

const INVOICES: Invoice[] = [
  { id: "FACTURE/2023/1415", customer: "Rakoto Frères — Antananarivo", amount: 16000, words: "Seize Mille Ariary", due: "05/05/2023" },
  { id: "FACTURE/2023/1416", customer: "Quincaillerie Ravao — Toamasina", amount: 4000, words: "Quatre Mille Ariary", due: "05/05/2023" },
  { id: "FACTURE/2023/1417", customer: "Randria BTP — Antsirabe", amount: 250000, words: "Deux Cent Cinquante Mille Ariary", due: "12/05/2023" },
  { id: "FACTURE/2023/1418", customer: "Mahajanga Outillage", amount: 75000, words: "Soixante-Quinze Mille Ariary", due: "12/05/2023" },
  { id: "FACTURE/2023/1419", customer: "Société Tsiky — Fianarantsoa", amount: 120000, words: "Cent Vingt Mille Ariary", due: "19/05/2023" },
  { id: "FACTURE/2023/1420", customer: "Garage Rasoa — Analakely", amount: 32000, words: "Trente-Deux Mille Ariary", due: "19/05/2023" },
  { id: "FACTURE/2023/1421", customer: "Hôtel Andilana — Nosy Be", amount: 540000, words: "Cinq Cent Quarante Mille Ariary", due: "26/05/2023" },
  { id: "FACTURE/2023/1422", customer: "Coopérative Vanille — Sambava", amount: 88000, words: "Quatre-Vingt-Huit Mille Ariary", due: "26/05/2023" },
  { id: "FACTURE/2023/1423", customer: "Pharmacie Analakely", amount: 9500, words: "Neuf Mille Cinq Cents Ariary", due: "02/06/2023" },
];

function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const show = useCallback((m: string) => {
    setMsg(m);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMsg(null), 2200);
  }, []);
  return { msg, show };
}

/** Scale a page designed at w×h px so it fits its viewer (width only, or both axes). */
function useFit(w: number, h: number, both: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry?.contentRect;
      if (r) setScale(Math.max(0.2, Math.min((r.width - 24) / w, both ? (r.height - 24) / h : 2, 1.5)));
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [w, h, both]);
  return { ref, scale };
}

type ShellProps = { app: string; menus: readonly string[]; crumb: string; title?: string; actions: ReactNode; toast: string | null; compact: boolean; children: ReactNode };
/** Odoo 16 shell: purple navbar, control panel with breadcrumb + actions, top-right notification. */
function Shell({ app, menus, crumb, title, actions, toast, compact, children }: ShellProps) {
  return (
    <div className="relative flex h-full w-full flex-col bg-[#F8F8F8] text-[#212529]" style={{ fontFamily: FONT }}>
      <div className="flex h-[46px] shrink-0 items-center bg-[#714B67] px-2 text-white">
        <svg viewBox="0 0 16 16" className="mx-2 h-4 w-4 fill-current" aria-hidden="true">{[1, 6, 11].flatMap((x) => [1, 6, 11].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width={4} height={4} />))}</svg>
        <span className="px-2 text-sm font-medium">{app}</span>
        {menus.map((m) => <span key={m} className="hidden px-2 text-[13px] text-white/90 sm:inline">{m}</span>)}
        <span className="ml-auto flex items-center gap-3 pr-1 text-[13px]"><Clock className="text-[15px]" /><span className="hidden sm:inline">MGBI</span><span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-medium">SA</span></span>
      </div>
      <div className="relative flex shrink-0 items-center gap-2 border-b border-[#DEE2E6] bg-white px-3 py-1.5 text-[13px]">
        <nav className="min-w-0 flex-1 truncate" aria-label="breadcrumb">
          {title && <><span className="text-[#017E84]">{crumb}</span><span className="px-1.5 text-[#6C757D]">/</span></>}
          <span className="font-medium">{title ?? crumb}</span>
        </nav>
        {actions}
      </div>
      <div className={`grid min-h-0 flex-1 ${compact ? "grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]" : "grid-cols-1 overflow-auto sm:grid-cols-[minmax(230px,0.8fr)_minmax(0,1.3fr)] sm:overflow-hidden"}`}>{children}</div>
      <AnimatePresence>
        {toast && (
          <motion.div key={toast} role="status" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: EASE }} className="pointer-events-none absolute right-3 top-[52px] z-10 flex items-center gap-2 rounded-[4px] bg-[#212529] px-3 py-2 text-xs text-white shadow-lg">
            <Check className="shrink-0 text-[14px] text-[#28A745]" />{toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="grid grid-cols-[38%_minmax(0,1fr)] items-center gap-3 text-[13px]"><span className="font-medium text-[#212529]">{label}</span>{children}</label>
);

type ViewerProps = { file: string; pages: number; download: string; onDownload: () => void; fitRef: RefObject<HTMLDivElement>; compact: boolean; children: ReactNode };
/** PDF.js-style viewer: dark toolbar, grey well, white sheets with soft shadow. */
function PdfViewer({ file, pages, download, onDownload, fitRef, compact, children }: ViewerProps) {
  return (
    <div className={`flex min-h-0 flex-col bg-[#525659] ${compact ? "" : "max-sm:h-[300px]"}`}>
      <div className="flex h-8 shrink-0 items-center gap-3 bg-[#323639] px-3 text-xs text-[#E8EAED] shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
        <span className="min-w-0 flex-1 truncate">{file}</span>
        <span className="tnum shrink-0">{pages > 0 ? `1 / ${pages}` : "—"}</span>
        <button type="button" onClick={onDownload} aria-label={download} title={download} className="shrink-0 rounded p-1 transition-colors hover:bg-white/10"><Download className="text-[15px]" /></button>
      </div>
      <div ref={fitRef} className="flex min-h-0 flex-1 flex-col items-center gap-3 overflow-auto p-3">{children}</div>
    </div>
  );
}

/** A page designed at w×h, scaled without reflow. */
const Paper = ({ w, h, scale, children }: { w: number; h: number; scale: number; children: ReactNode }) => (
  <div style={{ width: w * scale, height: h * scale }} className="shrink-0">
    <div style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: "top left", fontFamily: LATO }} className="relative flex flex-col overflow-hidden bg-white text-[#1A1A1A] shadow-[0_1px_8px_rgba(0,0,0,0.45)]">{children}</div>
  </div>
);

/** Cheinmalt mark: red hexagon, black "i" with dots, ellipse shadow. */
const HexLogo = ({ size }: { size: number }) => (
  <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
    <path d="M13 6h12l6 10-6 10H13L7 16Z" fill="#C4352B" stroke="#2B1F00" strokeWidth="2" /><ellipse cx="17" cy="35" rx="11" ry="3" fill="#111" />
    <circle cx="33" cy="9" r="2.5" fill="#C4352B" /><rect x="31.5" y="14" width="3" height="12" rx="1.5" fill="#111" /><circle cx="37" cy="20" r="1.5" fill="#111" /><circle cx="37" cy="26" r="1.5" fill="#111" />
  </svg>
);

/** Article sheet (A4 landscape, 640×453): amber bands, dark hex-watermarked body, price block, partner brands. */
function SheetPage({ s }: { s: Sheet }) {
  const off = (s.price * s.remise) / 100;
  const net = s.price - off;
  const tva = net * 0.2;
  const rows = [["PRIX AR HT", ar.format(s.price), "text-white"], [`-REMISE ${s.remise.toFixed(2).replace(".", ",")}%`, off ? ar.format(off) : "-", "text-white"], ["TVA 20%", ar.format(tva), "text-white"], ["PRIX AR TTC", ar.format(net + tva), "text-[#F5A400]"]];
  const ingco = s.brand === "INGCO";
  return (
    <>
      <div className="flex h-12 shrink-0 items-center justify-between bg-[#F5A400] px-3">
        <div className="flex items-center gap-1.5"><HexLogo size={30} /><div className="leading-none text-[#B2352B]"><p className="text-[13px] font-extrabold">CHEINMALT</p><p className="text-xs font-bold">DISTRIBUTION</p></div></div>
        <p className="text-lg font-bold text-[#3D6E8E]">{s.ref}</p>
        <span className={ingco ? "bg-[#F39200] px-2 py-0.5 text-sm font-black italic text-[#1A1A1A]" : "text-sm font-extrabold"} style={{ color: ingco ? undefined : BRANDS.find((b) => b.name === s.brand)?.color }}>{s.brand}</span>
      </div>
      <div className="relative flex min-h-0 flex-1 flex-col bg-[#3A2C04] px-3 pb-2 pt-1.5 text-white">
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]" aria-hidden="true">
          <defs><pattern id="cheinmalt-hex" width="60" height="52" patternUnits="userSpaceOnUse"><path d="M30 0 52.5 13v26L30 52 7.5 39V13Z" fill="none" stroke="#F5A400" strokeWidth="2" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#cheinmalt-hex)" />
        </svg>
        <p className="relative text-center text-[13px] font-bold">{s.name}</p>
        <div className="relative mt-1.5 grid min-h-0 flex-1 grid-cols-[57%_minmax(0,1fr)] gap-3">
          <div className="flex min-h-0 flex-col">
            <div className="flex min-h-0 flex-1 items-center justify-center bg-white">
              <div className="flex h-[62%] w-[42%] flex-col items-center justify-end rounded-sm bg-[#2A2A2A] pb-2"><span className="h-2 w-10 rounded-sm bg-[#F39200]" /></div>
            </div>
            <div className="mt-1.5 grid grid-cols-[1fr_1.15fr] gap-2">
              <div className="flex flex-col justify-around text-center font-extrabold">
                {rows.map(([label]) => <span key={label} className={label.startsWith("PRIX") ? "text-lg text-[#F5A400]" : "text-[13px] text-[#E53935]"}>{label}</span>)}
              </div>
              <div className="flex flex-col justify-around divide-y divide-white/40 bg-white/70 px-3 text-right font-bold">
                {rows.map(([label, value, cls]) => <span key={label} className={`${cls} tnum py-0.5 ${label.startsWith("PRIX") ? "text-lg" : "text-sm"}`}>{value}</span>)}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center text-center text-xs leading-[1.45]">{s.lines.map((l, i) => <p key={i}>{l}</p>)}</div>
        </div>
      </div>
      <div className="flex h-6 shrink-0 items-center justify-between bg-black px-3 text-xs italic text-white">
        <span className="truncate">Tarif établi en fonction du cours de devises du jour. Prix susceptible de changement sans préavis.</span><span className="shrink-0 pl-3 text-[#F5A400]">{DATE}</span>
      </div>
      <div className="flex h-12 shrink-0 items-center gap-5 bg-[#F5A400] px-4 text-sm font-extrabold">{BRANDS.filter((b) => b.name !== s.brand && b.name !== "INGCO").map((b) => <span key={b.name} style={{ color: b.color }}>{b.name}</span>)}</div>
    </>
  );
}

/** RIB row: label, four bank-code boxes with their captions underneath. */
const rib = (label: string) => (
  <div className={`${ROW} items-start`}>
    <span>{label}</span>
    <div className="grid grid-cols-[1fr_1fr_2.4fr_1fr] text-center text-xs leading-none">
      {["Code Banque", "Code Agence", "N° Compte", "Clé RIB"].map((c) => <span key={c}><span className={`${BOX} mb-0.5 block h-5`} />{c}</span>)}
    </div>
  </div>
);

/** "Lettre de change" (LCR) form — two per A4 portrait page in the real report. */
function Lcr({ inv }: { inv: Invoice }) {
  const field = `${BOX} flex-1 px-1 font-bold`;
  return (
    <div className={`${BOX} flex flex-col gap-1 p-2 text-[13px] leading-snug`}>
      <div className="grid grid-cols-[44px_1.1fr_1fr] items-center gap-3">
        <HexLogo size={40} />
        <div className="grid gap-1">
          <div className="flex justify-between text-base"><span>LETTRE DE CHANGE</span><span>N° LCR</span></div><div className="flex items-center gap-2 text-sm"><span>Veuillez payer le</span><span className={field}>{inv.due}</span></div>
        </div>
        <div className="grid gap-1 text-sm">
          <div className="flex items-center gap-2"><span>BP Ar</span><span className={field}>{inv.amount.toFixed(1)} Ar</span></div><div className="flex items-center gap-2"><span>A l&apos;ordre de</span><span className={field}>Cheinmalt distribution</span></div>
        </div>
      </div>
      <div className={`${BOX} px-1`}>Adresse du bénéficiaire:</div>
      {rib("RIB du bénéficiaire")}
      <div className={ROW}><span>La somme en lettres</span><div className={`${BOX} min-h-[40px] px-1 text-xs`}>{inv.words}</div></div>
      <div className={ROW}><span>En règlement de</span><div className={`${BOX} px-1`}>FACTURE N° <b>{inv.id}</b></div></div>
      {rib("RIB du tiré")}
      <div className={`${BOX} px-1`}>Nom et adresse du tiré: <b>{inv.customer}</b></div>
      <p className="pl-28 text-xs">le, {DATE}</p>
      <div className="grid grid-cols-3 gap-4 text-center text-xs leading-tight">
        {["Signature Aval", "Signature Bénéficiaire", "Signature Tiré valant autorisation de débit irrévocable"].map((s) => <div key={s}><div className={`${BOX} mb-0.5 h-10`} />{s}</div>)}
      </div>
    </div>
  );
}

function SheetDemo({ t, compact }: { t: Copy; compact: boolean }) {
  const [name, setName] = useState("117 Pcs tools set");
  const [ref, setRef] = useState("HKTHP21171");
  const [price, setPrice] = useState("146250");
  const [remise, setRemise] = useState("0");
  const [brand, setBrand] = useState("INGCO");
  const [desc, setDesc] = useState(DESC);
  const toast = useToast();
  const fit = useFit(640, 453, true);
  const num = (v: string) => Number.parseFloat(v.replace(",", ".")) || 0;
  const sheet: Sheet = { name: name.trim() || "—", ref: ref.trim(), price: num(price), remise: num(remise), brand, lines: desc.split("\n").filter((l) => l.trim()) };
  const print = () => toast.show(t.rendered);
  const actions = <><button type="button" className={BTN} onClick={print}>{t.print}</button>{!compact && <span className="tnum pl-2 text-[#6C757D]">1 / 24</span>}</>;

  return (
    <Shell app={t.app} menus={t.menus} crumb={t.crumb} title={sheet.name} actions={actions} toast={toast.msg} compact={compact}>
      <form className="min-h-0 overflow-auto p-2 sm:p-3" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-2 border border-[#DEE2E6] bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <input className={`${FIELD} !text-base font-medium`} value={name} onChange={(e) => setName(e.target.value)} aria-label={t.name} placeholder={t.name} />
          <Field label={t.ref}><input className={`${FIELD} font-mono`} value={ref} onChange={(e) => setRef(e.target.value)} /></Field>
          <Field label={t.price}><input className={`${FIELD} tnum`} inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} /></Field>
          <Field label={t.remise}><input className={`${FIELD} tnum`} inputMode="decimal" value={remise} onChange={(e) => setRemise(e.target.value)} /></Field>
          <Field label={t.brand}><select className={FIELD} value={brand} onChange={(e) => setBrand(e.target.value)}>{BRANDS.map((b) => <option key={b.name}>{b.name}</option>)}</select></Field>
          <label className="text-[13px] font-medium">{t.desc}<textarea className={`${FIELD} mt-1 resize-none font-normal`} rows={compact ? 3 : 7} value={desc} onChange={(e) => setDesc(e.target.value)} /></label>
        </div>
      </form>
      <PdfViewer file={t.file} pages={1} download={t.print} onDownload={print} fitRef={fit.ref} compact={compact}>
        <Paper w={640} h={453} scale={fit.scale}><SheetPage s={sheet} /></Paper>
      </PdfViewer>
    </Shell>
  );
}

function BillDemo({ t, compact }: { t: Copy; compact: boolean }) {
  const [sel, setSel] = useState<string[]>(INVOICES.slice(0, 4).map((i) => i.id));
  const [printing, setPrinting] = useState(false);
  const toast = useToast();
  const fit = useFit(560, 792, false);
  const chosen = INVOICES.filter((i) => sel.includes(i.id));
  const pages: Invoice[][] = [];
  for (let i = 0; i < chosen.length; i += 2) pages.push(chosen.slice(i, i + 2));
  const total = chosen.reduce((a, i) => a + i.amount, 0);
  const all = sel.length === INVOICES.length;
  const toggle = (id: string) => setSel((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const done = () => toast.show(t.printed(pages.length));
  const check = (on: boolean, onChange: () => void, label: string) => <input type="checkbox" className="accent-[#714B67]" checked={on} onChange={onChange} onClick={(e) => e.stopPropagation()} aria-label={label} />;
  const actions = (
    <>
      <span className="tnum truncate rounded-[3px] bg-[#F3EEF2] px-2 py-0.5 text-xs text-[#714B67]">{chosen.length} {t.selected} · {ar.format(total)} Ar</span>
      <button type="button" className={BTN} disabled={printing || chosen.length === 0} onClick={() => setPrinting(true)}>{t.printBatch}</button>
      {/* one-shot progress bar along the control panel's bottom edge */}
      {printing && <motion.div className="absolute inset-x-0 -bottom-px h-0.5 bg-[#714B67]" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.1, ease: "easeInOut" }} onAnimationComplete={() => { setPrinting(false); done(); }} />}
    </>
  );

  return (
    <Shell app={t.appBill} menus={t.menusBill} crumb={t.crumbBill} actions={actions} toast={toast.msg} compact={compact}>
      {/* Odoo list view with row selection */}
      <div className="min-h-0 overflow-auto bg-white">
        <table className="w-full border-collapse text-[13px]">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b border-[#DEE2E6] text-left font-medium">
              <th className="w-8 px-2 py-1.5">{check(all, () => setSel(all ? [] : INVOICES.map((i) => i.id)), t.selectAll)}</th>
              <th className="py-1.5 pr-2">{t.number}</th><th className="py-1.5 pr-2">{t.customer}</th>{!compact && <th className="py-1.5 pr-2">{t.due}</th>}<th className="py-1.5 pr-2 text-right">{t.total}</th>
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((inv) => {
              const on = sel.includes(inv.id);
              return (
                <tr key={inv.id} onClick={() => toggle(inv.id)} className={`cursor-pointer border-b border-[#DEE2E6] transition-colors ${on ? "bg-[#F3EEF2]" : "hover:bg-[#F8F8F8]"}`}>
                  <td className="px-2 py-1.5">{check(on, () => toggle(inv.id), inv.id)}</td>
                  <td className="tnum whitespace-nowrap py-1.5 pr-2 font-medium">{inv.id}</td><td className="w-full max-w-0 truncate py-1.5 pr-2">{inv.customer}</td>
                  {!compact && <td className="tnum whitespace-nowrap py-1.5 pr-2 text-[#6C757D]">{inv.due}</td>}<td className="tnum whitespace-nowrap py-1.5 pr-2 text-right">{ar.format(inv.amount)} Ar</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <PdfViewer file={t.fileBill} pages={pages.length} download={t.print} onDownload={done} fitRef={fit.ref} compact={compact}>
        <AnimatePresence initial={false}>
          {pages.length === 0 && <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-6 text-center text-xs text-[#E8EAED]/80">{t.empty}</motion.p>}
          {pages.map((page, i) => (
            <motion.div key={`page-${i}`} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3, ease: EASE }}>
              <Paper w={560} h={792} scale={fit.scale}><div className="flex flex-col gap-3 p-2">{page.map((inv) => <Lcr key={inv.id} inv={inv} />)}</div></Paper>
            </motion.div>
          ))}
        </AnimatePresence>
      </PdfViewer>
    </Shell>
  );
}

export default function PrintDemo({ locale, variant, compact = false }: DemoProps) {
  const t = COPY[locale];
  return variant === "bill" ? <BillDemo t={t} compact={compact} /> : <SheetDemo t={t} compact={compact} />;
}
