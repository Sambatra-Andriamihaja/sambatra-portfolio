"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import { Plus } from "@/components/ui/icon";
import type { DemoProps } from "./types";

const EASE = [0.16, 1, 0.3, 1] as const;

type SectionId = "hero" | "logos" | "features" | "testimonial" | "pricing" | "faq" | "footer";
type Section = { id: SectionId; visible: boolean; tag?: string };
/** Palette values are the data — they paint mozar.io, not our site. */
type Theme = { page: string; hero: string; heroFg: string; accent: string; onAccent: string; card: string; heading: string; link: string; footer: string };

/** Copy is mozar.io's own (FR is verbatim; EN is a faithful translation). */
const COPY = {
  en: {
    sections: "Sections", show: "Show", theme: "Theme", themes: ["Mozar (current)", "Mozar · Navy", "Mozar · Beige"], cta: "CTA text",
    publish: "Publish", publishing: "Publishing…", published: "Published", downtime: "0 downtime", deploy: "Last deploy", ago: "2 min ago", justNow: "just now",
    count: (n: number) => `${n} sections`, names: { hero: "Hero", logos: "Press", features: "Missions", testimonial: "Testimonials", pricing: "Pricing", faq: "FAQ", footer: "Footer" },
    site: {
      nav: ["Entrepreneurs", "Professionals", "Products", "Resources"], login: "Log in", navCta: "Get my quote",
      h1a: "Your statutory auditor's report", h1b: "online, within 72 hours",
      sub: "Mozar simplifies your legal operation: contribution auditor, conversion auditor, capital-increase auditor. A compliant report, signed and delivered securely.",
      ctaDefault: "Get my free quote", trust: "5/5 Google reviews · Free, instant quote · CNCC-registered auditors", press: "As featured in",
      missions: ["MISSIONS", "Our statutory audit missions", [["Conversion auditor", "Turning your SARL into an SAS? The law requires a conversion auditor. Mozar delivers the report in 72h."], ["Contribution auditor", "Contributing a business, property or shares to a company? The auditor certifies the value contributed."], ["Capital increase", "Waiving preferential rights or offsetting debts? One or more auditor reports are mandatory."]]],
      more: "See the dedicated page", quotes: ["TESTIMONIALS", "600+ entrepreneurs got their auditor's report with Mozar"],
      quote: "Fast, precise, efficient and easy to reach! I gladly recommend Mozar. Thanks to the whole team.", author: "Oriane B",
      pricing: ["PRICING", "A transparent price, known upfront", [["Conversion", "€600"], ["Contributions", "€600"], ["Capital increase", "€750"]]], excl: "excl. VAT",
      faq: ["FAQ", "Frequently asked questions", ["Which mission matches my operation?", "How long until I receive the report?", "How are the fees calculated?"]],
      cols: [["Products", "Legal conversion", "Contributions in kind", "Capital increase"], ["Useful links", "Google reviews", "Legal notice", "Terms"], ["Resources", "Blog", "Guides", "Press"]],
      copyright: "© 2026 Mozar - All rights reserved.",
    },
  },
  fr: {
    sections: "Sections", show: "Afficher", theme: "Thème", themes: ["Mozar (actuel)", "Mozar · Bleu foncé", "Mozar · Beige"], cta: "Texte du CTA",
    publish: "Publier", publishing: "Publication…", published: "Publié", downtime: "0 interruption", deploy: "Dernier déploiement", ago: "il y a 2 min", justNow: "à l'instant",
    count: (n: number) => `${n} sections`, names: { hero: "Hero", logos: "Presse", features: "Missions", testimonial: "Témoignages", pricing: "Tarifs", faq: "FAQ", footer: "Pied de page" },
    site: {
      nav: ["Entrepreneurs", "Professionnels", "Produits", "Ressources"], login: "Se connecter", navCta: "Obtenir mon devis",
      h1a: "Votre rapport de commissaire aux comptes", h1b: "en ligne et en 72h",
      sub: "Avec Mozar, simplifiez votre opération juridique : commissaire aux apports, commissaire à la transformation, commissaire à l'augmentation de capital. Un rapport conforme, signé et livré en toute sécurité.",
      ctaDefault: "Obtenir mon devis gratuit", trust: "5/5 avis Google · Devis gratuit et instantané · Commissaires aux comptes inscrits à la CNCC", press: "Nos apparitions dans la presse",
      missions: ["MISSIONS", "Nos missions de commissariat aux comptes", [["Commissaire à la transformation", "Vous transformez votre SARL en SAS ? La loi impose l'intervention d'un commissaire à la transformation. Mozar vous délivre le rapport requis en 72h."], ["Commissaire aux apports", "Vous apportez un fonds de commerce, un bien immobilier ou des titres à une société ? Le commissaire aux apports certifie la valeur des biens apportés."], ["Augmentation de capital", "Suppression du droit préférentiel de souscription ou compensation de créances ? Un ou plusieurs rapports du commissaire aux comptes sont obligatoires."]]],
      more: "Découvrez la page dédiée", quotes: ["TÉMOIGNAGES", "600+ entrepreneurs ont obtenu leur rapport de commissaire aux comptes avec Mozar"],
      quote: "Rapide, précis, efficace et facilement joignable ! C'est avec plaisir que je recommande Mozar. Merci à toute l'équipe.", author: "Oriane B",
      pricing: ["TARIFS", "Un prix transparent, connu à l'avance", [["Transformation", "600 €"], ["Apports", "600 €"], ["Augmentation de capital", "750 €"]]], excl: "HT",
      faq: ["FAQ", "Questions fréquentes", ["Quelle mission correspond à mon opération ?", "Quel est le délai pour recevoir le rapport ?", "Comment sont calculés les honoraires ?"]],
      cols: [["Produits", "Transformation juridique", "Apports en nature", "Augmentation de capital"], ["Liens utiles", "Avis Google", "Mentions légales", "CGU - CGV"], ["Ressources", "Blog", "Guides", "Presse"]],
      copyright: "© 2026 Mozar - Tous droits réservés.",
    },
  },
} as const;
type Copy = (typeof COPY)[keyof typeof COPY];

const INITIAL: Section[] = [
  { id: "hero", visible: true, tag: "A/B: v2" },
  { id: "logos", visible: true },
  { id: "features", visible: true, tag: "new" },
  { id: "testimonial", visible: true },
  { id: "pricing", visible: true, tag: "A/B: v2" },
  { id: "faq", visible: true },
  { id: "footer", visible: true },
];
/** mozar.io's Webflow tokens: dark-green hero, burnt-orange CTA, navy headings, #f5f5f0 cards, pale-blue footer — plus two variants from the same token set. */
const THEMES: readonly Theme[] = [
  { page: "#fefefc", hero: "#274f4b", heroFg: "#ffffff", accent: "#8c452b", onAccent: "#f4f1ee", card: "#f5f5f0", heading: "#111955", link: "#8c452b", footer: "#e6ebf9" },
  { page: "#fefefc", hero: "#111955", heroFg: "#ffffff", accent: "#c6f1ad", onAccent: "#111955", card: "#e6ebf9", heading: "#111955", link: "#111955", footer: "#e6ebf9" },
  { page: "#f4f1ee", hero: "#ebddd0", heroFg: "#111955", accent: "#8c452b", onAccent: "#f4f1ee", card: "#fefefc", heading: "#274f4b", link: "#8c452b", footer: "#d8c4b3" },
];
const PRESS = ["Challenges", "AGEFI", "Le Monde du Chiffre", "Finyear"];
const SITE_FONT: CSSProperties = { fontFamily: "Montserrat, 'Segoe UI', system-ui, sans-serif" };
const STAR = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

function Head({ eyebrow, title, color }: { eyebrow: string; title: string; color: string }) {
  return (
    <>
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#333]/70">{eyebrow}</p>
      <h4 className="mt-0.5 text-balance font-serif text-base leading-tight" style={{ color }}>{title}</h4>
    </>
  );
}

/** mozar.io, section by section, painted with the chosen palette. */
function Page({ id, th, cta, t }: { id: SectionId; th: Theme; cta: string; t: Copy }) {
  const s = t.site;
  const label = cta.trim() || s.ctaDefault;
  const card: CSSProperties = { backgroundColor: th.card };
  const btn: CSSProperties = { backgroundColor: th.accent, color: th.onAccent };
  const head: CSSProperties = { color: th.heading };
  switch (id) {
    case "hero":
      return (
        <div className="px-4 pt-3" style={{ backgroundColor: th.hero, color: th.heroFg }}>
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-serif text-base font-semibold tracking-tight">mozar</span>
            <span className="hidden gap-2.5 opacity-80 sm:flex">{s.nav.map((n) => <span key={n}>{n}</span>)}</span>
            <span className="flex items-center gap-2"><span className="opacity-80">{s.login}</span><span className="rounded-[5px] px-2 py-0.5 font-medium" style={btn}>{s.navCta}</span></span>
          </div>
          <h3 className="mx-auto mt-4 max-w-[22rem] text-balance text-center font-serif text-xl leading-tight">{s.h1a} <em>{s.h1b}</em></h3>
          <p className="mx-auto mt-2 max-w-[26rem] text-center text-xs leading-snug opacity-85">{s.sub}</p>
          <div className="mt-3 text-center">
            <motion.span key={label} initial={{ opacity: 0.4, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25, ease: EASE }} className="inline-block rounded-md px-3.5 py-1.5 text-xs font-medium" style={btn}>{label}</motion.span>
          </div>
          <p className="mt-2.5 text-center text-xs font-medium opacity-80">{s.trust}</p>
          <div className="mx-auto mt-3 flex max-w-[16rem] items-center gap-1.5 rounded-t-md bg-white/95 px-2.5 py-2 shadow-[0_-4px_16px_rgba(0,0,0,0.12)]" aria-hidden="true">
            <span className="h-1.5 w-10 rounded-full bg-[#c7cee0]" /><span className="h-1.5 w-6 rounded-full bg-[#e6ebf9]" /><span className="ml-auto h-1.5 w-8 rounded-full" style={{ backgroundColor: th.accent }} />
          </div>
        </div>
      );
    case "logos":
      return (
        <div className="px-4 py-3 text-center">
          <p className="text-xs uppercase tracking-[0.15em] text-[#333]/60">{s.press}</p>
          <div className="mt-1.5 flex flex-wrap justify-center gap-x-4 gap-y-1">{PRESS.map((p) => <span key={p} className="font-serif text-sm font-semibold text-[#333]/55">{p}</span>)}</div>
        </div>
      );
    case "features":
      return (
        <div className="px-4 py-3">
          <Head eyebrow={s.missions[0]} title={s.missions[1]} color={th.heading} />
          <div className="mt-2 grid gap-1.5 sm:grid-cols-3">
            {s.missions[2].map(([title, desc]) => (
              <div key={title} className="rounded-[5px] p-2.5" style={card}>
                <div className="flex items-center gap-1.5 rounded-full bg-white py-0.5 pl-1 pr-2"><span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: th.accent }} /><span className="text-xs font-medium leading-tight" style={head}>{title}</span></div>
                <p className="mt-1.5 text-xs leading-snug text-[#333]">{desc}</p>
                <p className="mt-1.5 text-xs font-medium" style={{ color: th.link }}>{s.more} ↘</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "testimonial":
      return (
        <div className="px-4 py-3">
          <Head eyebrow={s.quotes[0]} title={s.quotes[1]} color={th.heading} />
          <div className="mt-2 rounded-[5px] p-3" style={card}>
            <div className="flex gap-0.5 text-[#bfb084]" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <svg key={i} viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d={STAR} /></svg>)}</div>
            <p className="mt-1.5 text-xs leading-snug text-[#333]">{s.quote}</p>
            <p className="mt-1.5 text-xs font-medium" style={head}>{s.author}</p>
          </div>
        </div>
      );
    case "pricing":
      return (
        <div className="px-4 py-3">
          <Head eyebrow={s.pricing[0]} title={s.pricing[1]} color={th.heading} />
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {s.pricing[2].map(([name, price]) => (
              <div key={name} className="rounded-[5px] p-2.5 text-center" style={card}>
                <p className="text-xs font-medium leading-tight" style={head}>{name}</p>
                <p className="mt-1 font-serif text-lg leading-none" style={head}>{price}</p>
                <p className="text-xs text-[#333]/60">{s.excl}</p>
                <span className="mt-2 block truncate rounded-md px-1.5 py-1 text-xs font-medium" style={btn}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      );
    case "faq":
      return (
        <div className="px-4 py-3">
          <Head eyebrow={s.faq[0]} title={s.faq[1]} color={th.heading} />
          <div className="mt-2 flex flex-col gap-1.5">
            {s.faq[2].map((q) => (
              <div key={q} className="flex items-center justify-between gap-2 rounded-[10px] border border-[#d1d3d4] bg-white px-2.5 py-2 text-xs text-[#333]"><span>{q}</span><Plus className="shrink-0 text-[12px] text-[#333]/60" /></div>
            ))}
          </div>
        </div>
      );
    case "footer":
      return (
        <div className="px-4 pb-3 pt-4" style={{ backgroundColor: th.footer }}>
          <p className="font-serif text-base font-semibold" style={head}>mozar</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {s.cols.map(([h, ...links]) => (
              <div key={h} className="text-xs"><p className="font-serif font-medium" style={head}>{h}</p>{links.map((l) => <p key={l} className="text-[#333]/70">{l}</p>)}</div>
            ))}
          </div>
          <p className="mt-2 border-t border-[#111955]/15 pt-1.5 text-xs text-[#333]/60">{s.copyright}</p>
        </div>
      );
  }
}

export default function LandingDemo({ locale, compact = false }: DemoProps) {
  const t = COPY[locale];
  const [sections, setSections] = useState<Section[]>(INITIAL);
  const [theme, setTheme] = useState(0);
  const [cta, setCta] = useState<string>(t.site.ctaDefault);
  const [pub, setPub] = useState<"idle" | "publishing" | "done">("idle");
  const [deployed, setDeployed] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((x) => window.clearTimeout(x));
  }, []);

  const th = THEMES[theme];
  const visible = sections.filter((x) => x.visible);
  const toggle = (id: SectionId) => setSections((xs) => xs.map((x) => (x.id === id ? { ...x, visible: !x.visible } : x)));

  function publish() {
    if (pub !== "idle") return;
    setPub("publishing");
    timers.current.push(
      window.setTimeout(() => { setPub("done"); setDeployed(true); }, 1000),
      window.setTimeout(() => setPub("idle"), 2600),
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-[#F4F4F2] text-[#222]">
      <div className={`min-h-0 flex-1 gap-3 overflow-auto p-3 ${compact ? "flex flex-col" : "grid sm:grid-cols-[15rem_minmax(0,1fr)] sm:gap-4 sm:p-4"}`}>
        <aside className="flex flex-col gap-2.5" aria-label={t.sections}>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#777]">{t.sections}</p>
          <Reorder.Group axis="y" values={sections} onReorder={setSections} className="flex flex-col gap-1">
            {sections.map((s) => (
              <Reorder.Item key={s.id} value={s} className="flex cursor-grab select-none items-center gap-2 rounded-md border border-[#E3E3E0] bg-white px-2 py-1.5 text-xs shadow-sm active:cursor-grabbing">
                <span className="font-mono text-xs leading-none text-[#B0B0AC]" aria-hidden="true">⋮⋮</span>
                <input type="checkbox" checked={s.visible} onChange={() => toggle(s.id)} aria-label={`${t.show} ${t.names[s.id]}`} className="h-3.5 w-3.5 accent-[#274f4b]" />
                <span className={`flex-1 transition-colors ${s.visible ? "" : "text-[#AAA] line-through"}`}>{t.names[s.id]}</span>
                {s.tag && <span className="rounded-full bg-[#e6ebf9] px-1.5 font-mono text-xs font-medium text-[#111955]">{s.tag}</span>}
              </Reorder.Item>
            ))}
          </Reorder.Group>
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col gap-1 text-xs text-[#666]">
              {t.theme}
              <div role="radiogroup" aria-label={t.theme} className="flex gap-1.5">
                {THEMES.map((x, i) => (
                  <button key={t.themes[i]} type="button" role="radio" aria-checked={theme === i} onClick={() => setTheme(i)} aria-label={t.themes[i]} title={t.themes[i]} className={`relative h-7 w-7 rounded-md ${theme === i ? "ring-2 ring-[#274f4b] ring-offset-1 ring-offset-[#F4F4F2]" : "ring-1 ring-[#D6D6D2]"}`} style={{ backgroundColor: x.hero }}>
                    <span className="absolute inset-x-1.5 bottom-1.5 h-1.5 rounded-full" style={{ backgroundColor: x.accent }} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
            <label className="flex min-w-[8rem] flex-1 flex-col gap-1 text-xs text-[#666]">
              {t.cta}
              <input className="rounded-md border border-[#D6D6D2] bg-white px-2 py-1.5 text-xs text-[#222] outline-none focus:border-[#274f4b]" value={cta} maxLength={28} onChange={(e) => setCta(e.target.value)} aria-label={t.cta} />
            </label>
          </div>
        </aside>

        <section aria-label="mozar.io" className={`flex min-h-0 flex-col overflow-hidden rounded-lg border border-[#DDDDD8] bg-white shadow-sm ${compact ? "h-64 shrink-0" : ""}`}>
          <div className="flex items-center gap-2 border-b border-[#E3E3E0] px-2.5 py-1.5 text-xs">
            <span className="flex gap-1" aria-hidden="true">{[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 rounded-full bg-[#D9D9D5]" />)}</span>
            <span className="flex-1 rounded-md bg-[#F0F0EC] px-2 py-0.5 text-center font-mono text-[#666]">mozar.io</span>
            <span className="font-mono text-[#2E7D32]">live</span>
          </div>
          <div className="relative min-h-0 flex-1 overflow-auto transition-colors duration-300" style={{ ...SITE_FONT, backgroundColor: th.page, color: "#333" }}>
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((s) => (
                <motion.section key={s.id} layout="position" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3, ease: EASE }}>
                  <Page id={s.id} th={th} cta={cta} t={t} />
                </motion.section>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>

      <footer className="relative flex items-center justify-between gap-3 border-t border-[#E3E3E0] bg-white px-3 py-1.5 text-xs">
        <AnimatePresence>
          {pub === "publishing" && (
            <motion.span key="bar" className="absolute inset-x-0 top-0 h-0.5 origin-left bg-[#8c452b]" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1, ease: "linear" }} aria-hidden="true" />
          )}
        </AnimatePresence>
        <span className="truncate font-mono tabular-nums text-[#777]">
          {t.downtime} · {t.deploy} · {deployed ? t.justNow : t.ago} · {t.count(visible.length)}
        </span>
        <button type="button" onClick={publish} disabled={pub !== "idle"} aria-live="polite" className={`shrink-0 rounded-md px-3 py-1 text-xs font-medium transition-colors ${pub === "done" ? "bg-[#c6f1ad] text-[#111955]" : "bg-[#274f4b] text-white hover:bg-[#1f403d] disabled:opacity-70"}`}>
          {pub === "idle" ? t.publish : pub === "publishing" ? t.publishing : t.published}
        </button>
      </footer>
    </div>
  );
}
