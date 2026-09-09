"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, Check, Close, Mail, MapPin, Menu, Search } from "@/components/ui/icon";
import type { DemoProps } from "./types";

const EASE = [0.16, 1, 0.3, 1] as const;
const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
const VAT = 0.085;
const VOLUME_QTY = 10;
const VOLUME_OFF = 0.08;
/** focicom.re: royal-blue top bar & wordmark, Manrope-style type, 2px-radius blue CTAs, bordered white cards. */
const FONT = 'Manrope, "Segoe UI", system-ui, sans-serif';
const BTN = "inline-flex items-center justify-center gap-1.5 rounded-[2px] bg-[#1E2DB3] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#182490] disabled:cursor-not-allowed disabled:opacity-60";
const STEP = "flex h-6 w-6 items-center justify-center text-sm text-[#4B5563] transition-colors hover:bg-[#F3F4F6]";

type Cat = "snacking" | "boulangerie" | "boucherie" | "primeur" | "commerce";
type Filter = "all" | Cat;
type Product = { sku: string; name: string; cat: Cat; unit: string; price: number; stock: boolean };
type Line = { sku: string; qty: number };

const FILTERS: readonly Filter[] = ["all", "snacking", "boulangerie", "boucherie", "primeur", "commerce"];

const COPY = {
  en: {
    links: ["Home", "Shop", "Contact", "Request a quote"], search: "Search the catalogue…", inStock: "In stock", onOrder: "On order",
    add: "Add to quote", added: "In quote", quote: "Your quote", empty: "Your quote is empty.", emptyHint: "Add items from the catalogue.",
    subtotal: "Subtotal excl. VAT", vat: "VAT 8.5 % (Réunion)", total: "Total incl. VAT", request: "Request quote", sent: "Quote #Q-2023-0187 sent",
    volume: "Volume price −8 %", remove: "Remove", dec: "Decrease quantity", inc: "Increase quantity", ht: "excl. VAT",
    noResult: "No product matches.", lines: (n: number) => `${n} item${n > 1 ? "s" : ""}`,
    cats: { all: "All products", snacking: "Snacking", boulangerie: "Bakery", boucherie: "Butcher/Fish", primeur: "Produce", commerce: "Retail" },
  },
  fr: {
    links: ["Accueil", "Boutique", "Contact", "Demander un devis"], search: "Rechercher dans le catalogue…", inStock: "En stock", onOrder: "Sur commande",
    add: "Ajouter au devis", added: "Dans le devis", quote: "Votre devis", empty: "Votre devis est vide.", emptyHint: "Ajoutez des articles depuis le catalogue.",
    subtotal: "Sous-total HT", vat: "TVA 8,5 % (Réunion)", total: "Total TTC", request: "Demander le devis", sent: "Devis #Q-2023-0187 envoyé",
    volume: "Tarif volume −8 %", remove: "Retirer", dec: "Diminuer la quantité", inc: "Augmenter la quantité", ht: "HT",
    noResult: "Aucun produit ne correspond.", lines: (n: number) => `${n} ligne${n > 1 ? "s" : ""}`,
    cats: { all: "Tous Les Produits", snacking: "Snacking", boulangerie: "Boulangerie", boucherie: "Boucherie/Poissonnerie", primeur: "Primeur", commerce: "Commerce" },
  },
} as const;
type Copy = (typeof COPY)[keyof typeof COPY];

const PRODUCTS: Product[] = [
  { sku: "BB-BAG-50", name: "Boîte burger x50 bagasse 2 comp. 241×163×65 mm blanc", cat: "snacking", unit: "le carton de 50", price: 24.9, stock: true },
  { sku: "BS-KR-300", name: "Barquette salade kraft 750 ml + couvercle", cat: "snacking", unit: "le carton de 300", price: 58.5, stock: true },
  { sku: "GB-KR-1000", name: "Gobelet carton kraft 12 oz", cat: "snacking", unit: "le carton de 1 000", price: 74, stock: false },
  { sku: "SB-30-500", name: "Sac bretelle 30×50×14 /500", cat: "boulangerie", unit: "le carton de 500", price: 19.8, stock: true },
  { sku: "SP-BAG-1000", name: "Sac papier baguette kraft brun", cat: "boulangerie", unit: "le carton de 1 000", price: 32.4, stock: true },
  { sku: "BP-4P-100", name: "Boîte pâtissière 4 parts blanche 22×22×8", cat: "boulangerie", unit: "le lot de 100", price: 41.9, stock: true },
  { sku: "PB-BL-35", name: "Papier boucher blanc 2 faces 35 cm", cat: "boucherie", unit: "la bobine 10 kg", price: 36.7, stock: true },
  { sku: "BQ-ABS-500", name: "Barquette absorbante 17×23 cm", cat: "boucherie", unit: "le carton de 500", price: 47.2, stock: false },
  { sku: "SG-ISO-100", name: "Sac isotherme poisson 40 L", cat: "boucherie", unit: "le carton de 100", price: 52, stock: true },
  { sku: "SK-KR-1000", name: "Sac kraft fruits & légumes 2 kg", cat: "primeur", unit: "le carton de 1 000", price: 44.6, stock: true },
  { sku: "BQ-PE-800", name: "Barquette bois peuplier 500 g", cat: "primeur", unit: "le carton de 800", price: 68.3, stock: true },
  { sku: "SC-KR-250", name: "Sac cabas kraft poignées torsadées 26×12×35", cat: "commerce", unit: "le carton de 250", price: 47.5, stock: true },
];

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

type Row = Line & { p: Product; discount: boolean; total: number };

const BagIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 8h14l-1 12H6L5 8Z M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);

type PanelProps = { t: Copy; rows: Row[]; sent: boolean; compact: boolean; onQty: (sku: string, delta: number) => void; onRemove: (sku: string) => void; onRequest: () => void };

function QuotePanel({ t, rows, sent, compact, onQty, onRemove, onRequest }: PanelProps) {
  const subtotal = rows.reduce((a, r) => a + r.total, 0);
  const vat = subtotal * VAT;
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {!compact && (
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
          <p className="text-xs font-bold uppercase tracking-wide text-[#111827]">{t.quote}</p>
          <span className="tnum text-xs text-[#6B7280]">{t.lines(rows.length)}</span>
        </div>
      )}
      <ul className={`divide-y divide-[#E5E7EB] overflow-auto ${compact ? "max-h-40" : "min-h-0 flex-1"}`}>
        <AnimatePresence initial={false}>
          {rows.map((r) => (
            <motion.li
              key={r.sku}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden py-2 text-xs"
            >
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold uppercase text-[#374151]">{r.p.name}</p>
                  <p className="tnum text-[#6B7280]">
                    {r.sku} · {eur.format(r.p.price)} {t.ht}
                  </p>
                </div>
                <button type="button" className="rounded-[2px] p-1 text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-[#111827]" onClick={() => onRemove(r.sku)} aria-label={`${t.remove} ${r.p.name}`}>
                  <Close className="text-[14px]" />
                </button>
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <div className="inline-flex items-center divide-x divide-[#D1D5DB] rounded-[2px] border border-[#D1D5DB]">
                  <button type="button" className={STEP} onClick={() => onQty(r.sku, -1)} aria-label={t.dec}>−</button>
                  <span className="tnum w-8 text-center font-semibold text-[#111827]">{r.qty}</span>
                  <button type="button" className={STEP} onClick={() => onQty(r.sku, 1)} aria-label={t.inc}>+</button>
                </div>
                <div className="text-right">
                  <p className="tnum font-bold text-[#111827]">{eur.format(r.total)}</p>
                  <AnimatePresence>
                    {r.discount && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-[#15803D]">
                        {t.volume}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
        {rows.length === 0 && (
          <li className="flex flex-col items-center gap-1 py-6 text-center text-xs text-[#6B7280]">
            <span className="font-semibold text-[#111827]">{t.empty}</span>
            <span>{t.emptyHint}</span>
          </li>
        )}
      </ul>
      <dl className="mt-2 space-y-1 border-t border-[#E5E7EB] pt-2 text-xs">
        <div className="flex justify-between text-[#6B7280]"><dt>{t.subtotal}</dt><dd className="tnum">{eur.format(subtotal)}</dd></div>
        <div className="flex justify-between text-[#6B7280]"><dt>{t.vat}</dt><dd className="tnum">{eur.format(vat)}</dd></div>
        <div className="flex justify-between text-sm font-bold text-[#111827]"><dt>{t.total}</dt><dd className="tnum">{eur.format(subtotal + vat)}</dd></div>
      </dl>
      <button type="button" className={`${BTN} mt-2 w-full`} disabled={rows.length === 0 || sent} onClick={onRequest}>
        {sent ? <Check className="text-[14px]" /> : null}
        {sent ? t.sent : t.request}
      </button>
    </div>
  );
}

export default function ShopDemo({ locale, compact = false }: DemoProps) {
  const t = COPY[locale];
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [lines, setLines] = useState<Line[]>([{ sku: "SB-30-500", qty: 10 }, { sku: "BB-BAG-50", qty: 2 }]);
  const [sent, setSent] = useState(false);
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const visible = PRODUCTS.filter(
    (p) => (filter === "all" || p.cat === filter) && (q.trim() === "" || norm(`${p.name} ${p.sku}`).includes(norm(q))),
  );
  const rows: Row[] = lines.flatMap((l) => {
    const p = PRODUCTS.find((x) => x.sku === l.sku);
    if (!p) return [];
    const discount = l.qty >= VOLUME_QTY;
    return [{ ...l, p, discount, total: p.price * l.qty * (discount ? 1 - VOLUME_OFF : 1) }];
  });
  const ttc = rows.reduce((a, r) => a + r.total, 0) * (1 + VAT);

  const add = (sku: string) =>
    setLines((prev) => (prev.some((l) => l.sku === sku) ? prev.map((l) => (l.sku === sku ? { ...l, qty: l.qty + 1 } : l)) : [...prev, { sku, qty: 1 }]));
  const onQty = (sku: string, delta: number) =>
    setLines((prev) => prev.map((l) => (l.sku === sku ? { ...l, qty: l.qty + delta } : l)).filter((l) => l.qty > 0));
  const onRemove = (sku: string) => setLines((prev) => prev.filter((l) => l.sku !== sku));
  const onRequest = () => {
    setSent(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setSent(false);
      setLines([]);
      setOpen(false);
    }, 2400);
  };

  const panel = <QuotePanel t={t} rows={rows} sent={sent} compact={compact} onQty={onQty} onRemove={onRemove} onRequest={onRequest} />;

  return (
    <div className="relative flex h-full w-full flex-col bg-white text-[#111827]" style={{ fontFamily: FONT }}>
      {/* top bar: contact strip + site links */}
      <div className="flex h-6 shrink-0 items-center justify-between gap-3 bg-[#1E2DB3] px-3 text-xs text-white">
        <span className="flex min-w-0 items-center gap-3 truncate">
          <span className="inline-flex items-center gap-1"><MapPin className="text-[12px]" />FOCICOM, La Réunion</span>
          {!compact && <span className="hidden sm:inline">0262 37 66 43 / 0693 99 73 88</span>}
          {!compact && <span className="hidden items-center gap-1 sm:inline-flex"><Mail className="text-[12px]" />focicom.run@gmail.com</span>}
        </span>
        <span className="hidden shrink-0 gap-3 sm:flex">{t.links.map((l) => <span key={l}>{l}</span>)}</span>
      </div>

      {/* header: wordmark, category menu, icons */}
      <div className="flex shrink-0 items-center gap-3 border-b border-[#E5E7EB] bg-white px-3 py-1.5">
        <div className="shrink-0 leading-none text-[#1E2DB3]" aria-label="FOCICOM Réunion">
          <p className="text-lg font-black tracking-tight">FOCICOM</p>
          <p className="-mt-0.5 text-right text-xs font-bold">Réunion</p>
        </div>
        <nav className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto whitespace-nowrap text-xs text-[#4B5563]" role="tablist" aria-label="Categories">
          {FILTERS.map((f) => (
            <button key={f} type="button" role="tab" aria-selected={filter === f} onClick={() => setFilter(f)} className={`inline-flex shrink-0 items-center gap-1 rounded-[2px] px-2 py-1 transition-colors ${filter === f ? "bg-[#1E2DB3]/[0.08] font-semibold text-[#1E2DB3]" : "hover:text-[#1E2DB3]"}`}>
              {f === "all" && <Menu className="text-[13px]" />}
              {t.cats[f]}
            </button>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2.5 text-[#4B5563]">
          <Search className="text-[17px]" />
          <button type="button" onClick={() => compact && setOpen((o) => !o)} className="relative" aria-label={t.quote}>
            <BagIcon />
            {rows.length > 0 && <span className="tnum absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#1E2DB3] px-1 text-xs font-semibold text-white">{rows.length}</span>}
          </button>
          <UserIcon />
        </div>
      </div>

      <div className={`min-h-0 flex-1 ${compact ? "flex flex-col" : "overflow-auto sm:grid sm:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] sm:overflow-hidden"}`}>
        <section className={`flex min-h-0 flex-1 flex-col gap-2 bg-[#F9FAFB] p-3 ${compact ? "pb-12" : ""}`}>
          <label className="relative block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[14px] text-[#9CA3AF]" />
            <input className="w-full rounded-[2px] border border-[#D1D5DB] bg-white py-1.5 pl-8 pr-2 text-xs text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#1E2DB3]" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search} aria-label={t.search} />
          </label>
          <ul className={`grid min-h-0 flex-1 content-start gap-2 overflow-auto ${compact ? "grid-cols-3" : "grid-cols-2 lg:grid-cols-3"}`}>
            <AnimatePresence initial={false}>
              {visible.map((p) => {
                const inQuote = lines.some((l) => l.sku === p.sku);
                return (
                  <motion.li key={p.sku} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: EASE }} className="flex flex-col border border-[#E5E7EB] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                    <div className={`flex items-center justify-center bg-[#F3F4F6] text-[#C4C8CF] ${compact ? "h-12" : "aspect-[4/3]"}`} aria-hidden="true">
                      <span className="text-sm font-bold tracking-widest">{p.sku.split("-")[0]}</span>
                    </div>
                    <div className="flex flex-1 flex-col gap-1 p-2">
                      {!compact && <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">{t.cats[p.cat]}</p>}
                      <p className="line-clamp-2 text-xs font-semibold uppercase leading-snug text-[#4B5563]" title={p.name}>{p.name}</p>
                      {!compact && <p className="text-xs text-[#6B7280]">{p.unit}</p>}
                      <div className="mt-auto flex items-end justify-between gap-2 pt-1">
                        <p className="tnum text-sm font-bold text-[#111827]">
                          {eur.format(p.price)} <span className="text-xs font-normal text-[#6B7280]">{t.ht}</span>
                        </p>
                        <span className={`text-xs ${p.stock ? "text-[#15803D]" : "text-[#B45309]"}`}>{p.stock ? t.inStock : t.onOrder}</span>
                      </div>
                      <button type="button" className={`${BTN} mt-1 w-full`} onClick={() => add(p.sku)} aria-label={`${t.add}: ${p.name}`}>
                        {inQuote ? <Check className="text-[13px]" /> : null}
                        {inQuote ? t.added : t.add}
                      </button>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
            {visible.length === 0 && <li className="col-span-full px-3 py-6 text-center text-xs text-[#6B7280]">{t.noResult}</li>}
          </ul>
        </section>

        {compact ? (
          <div className="absolute inset-x-0 bottom-0 flex max-h-[85%] flex-col border-t border-[#E5E7EB] bg-white shadow-[0_-6px_20px_rgba(0,0,0,0.08)]">
            <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex items-center justify-between gap-3 px-3 py-2 text-xs">
              <span className="font-semibold text-[#111827]">
                {t.quote} · <span className="font-normal text-[#6B7280]">{t.lines(rows.length)}</span>
              </span>
              <span className="tnum font-bold text-[#1E2DB3]">{eur.format(ttc)}</span>
              <ArrowDown className={`text-[14px] text-[#6B7280] transition-transform duration-300 ${open ? "" : "rotate-180"}`} />
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="overflow-hidden">
                  <div className="px-3 pb-3">{panel}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <aside className="flex min-h-0 flex-col border-t border-[#E5E7EB] bg-white p-3 sm:border-l sm:border-t-0">{panel}</aside>
        )}
      </div>
    </div>
  );
}
