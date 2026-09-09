"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bolt, Check, Close } from "@/components/ui/icon";
import type { DemoProps } from "./types";

const EASE = [0.16, 1, 0.3, 1] as const;

const COPY = {
  en: {
    email: "Contact email",
    enrich: "Enrich",
    running: "Enriching…",
    contacts: "Contacts",
    attributes: "Attributes",
    enrichment: "Enrichment",
    idle: "Idle · 4 attributes · 11 providers available",
    called: "providers called",
    hits: "found",
    saved: "saved vs flat calls",
    confidence: "confidence",
    hit: "Found",
    miss: "No match",
    querying: "Querying…",
    phone: "Phone",
    company: "Company",
    industry: "Industry",
    tech: "Tech stack",
    title: "Job title",
  },
  fr: {
    email: "Email du contact",
    enrich: "Enrichir",
    running: "Enrichissement…",
    contacts: "Contacts",
    attributes: "Attributs",
    enrichment: "Enrichissement",
    idle: "Inactif · 4 attributs · 11 fournisseurs disponibles",
    called: "fournisseurs appelés",
    hits: "trouvés",
    saved: "économisé vs appels à plat",
    confidence: "confiance",
    hit: "Trouvé",
    miss: "Aucun résultat",
    querying: "Requête…",
    phone: "Téléphone",
    company: "Société",
    industry: "Secteur",
    tech: "Stack technique",
    title: "Poste",
  },
} as const;

type FieldKey = "phone" | "company" | "tech" | "title";
type Status = "idle" | "querying" | "miss" | "hit";
type Row = { name: string; status: Status; ms: number };
type Step = { key: FieldKey; hitAt: number; rows: Row[] };
type Profile = { company: string; industry: string; phone: string; tech: readonly string[]; title: string };
type Job = { email: string; id: number };

const PROVIDERS = ["Provider A", "Provider B", "Internal model (LangChain)"] as const;
const FIELDS: readonly { key: FieldKey; providers: readonly string[] }[] = [
  { key: "phone", providers: PROVIDERS },
  { key: "company", providers: PROVIDERS.slice(0, 2) },
  { key: "tech", providers: PROVIDERS },
  { key: "title", providers: PROVIDERS },
];
const FLAT_CALLS = FIELDS.reduce((n, f) => n + f.providers.length, 0);
const SHORT: Record<string, string> = { "Provider A": "A", "Provider B": "B", "Internal model (LangChain)": "LangChain" };
const QUICK = ["jonas@stripe.com", "amina@brevo.com", "mike@acme-tools.fr"] as const;
const NAMES: Record<string, string> = { "lea.martin@northwind.io": "Léa Martin" };

const PROFILES: Record<string, Profile> = {
  "northwind.io": { company: "Northwind", industry: "Logistics SaaS", phone: "+33 6 12 34 56 78", tech: ["React", "Segment", "HubSpot"], title: "Head of Growth" },
  "stripe.com": { company: "Stripe", industry: "Fintech", phone: "+1 415 555 0132", tech: ["Ruby", "Kafka", "Salesforce"], title: "Solutions Engineer" },
  "brevo.com": { company: "Brevo", industry: "Marketing automation", phone: "+33 7 45 09 81 23", tech: ["Symfony", "React", "Snowflake"], title: "Growth Engineer" },
  "acme-tools.fr": { company: "Acme Tools", industry: "Industrial supplies", phone: "+33 6 78 21 40 95", tech: ["WooCommerce", "Zapier", "Pipedrive"], title: "Directeur commercial" },
};

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

function identity(email: string) {
  const clean = email.trim().toLowerCase();
  const [local = "", domain = ""] = clean.split("@");
  const name = NAMES[clean] ?? (local.split(/[._-]+/).filter(Boolean).map(cap).join(" ") || "Unknown");
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return { name, initials, domain };
}

function profileFor(domain: string): Profile {
  const known: Profile | undefined = PROFILES[domain];
  if (known) return known;
  const h = hash(domain);
  const two = (n: number) => String(n % 100).padStart(2, "0");
  return {
    company: cap(domain.split(".")[0] ?? "Acme"),
    industry: "B2B software",
    phone: `+33 6 ${two(h)} ${two(h >>> 8)} ${two(h >>> 16)} ${two(h >>> 24)}`,
    tech: ["Next.js", "Segment", "Intercom"],
    title: "Operations Manager",
  };
}

function buildSteps(email: string): Step[] {
  const h = hash(email.trim().toLowerCase());
  return FIELDS.map((f, i) => ({
    key: f.key,
    hitAt: (h >>> (i * 3)) % f.providers.length,
    rows: f.providers.map((name, j) => ({ name, status: "idle", ms: 400 + ((h >>> (i * 5 + j * 2)) % 7) * 50 })),
  }));
}

const STATUS_TEXT: Record<Status, string> = { idle: "text-[#9AA5B5]", querying: "text-[#F5A623]", miss: "text-[#5E6C84]", hit: "text-[#0B996E]" };
const CHIP: Record<Status, string> = {
  idle: "border-[#E3E8EF] bg-white text-[#9AA5B5]",
  querying: "border-[#F5A623] bg-white text-[#0F1C2E]",
  miss: "border-[#E3E8EF] bg-white text-[#9AA5B5] line-through",
  hit: "border-[#0B996E] bg-[#E6F5EF] text-[#0B996E]",
};

function Mark({ status }: { status: Status }) {
  if (status === "hit") return <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#0B996E] text-white"><Check width={10} height={10} strokeWidth={2.5} /></span>;
  if (status === "miss") return <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#CBD2DC] text-white"><Close width={10} height={10} strokeWidth={2.5} /></span>;
  return <span className={cx("h-4 w-4 shrink-0 rounded-full border-2 bg-white transition-colors duration-300", status === "querying" ? "border-[#F5A623]" : "border-[#E3E8EF]")} />;
}

function Value({ ready, busy, children }: { ready: boolean; busy: boolean; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {ready ? (
        <motion.dd key="v" className="min-w-0 truncate text-right text-[#0F1C2E]" initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: EASE }}>{children}</motion.dd>
      ) : (
        <motion.dd key="p" className="flex justify-end" exit={{ opacity: 0, transition: { duration: 0.15 } }}>
          {busy ? <span className="h-2.5 w-16 rounded bg-[#E3E8EF]" /> : <span className="text-[#9AA5B5]">—</span>}
        </motion.dd>
      )}
    </AnimatePresence>
  );
}

export default function EnrichDemo({ locale, compact }: DemoProps) {
  const t = COPY[locale];
  const [email, setEmail] = useState("lea.martin@northwind.io");
  const [job, setJob] = useState<Job | null>(null);
  const [steps, setSteps] = useState<Step[]>(() => buildSteps("lea.martin@northwind.io"));
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!job) return;
    const plan = buildSteps(job.email);
    setSteps(plan);
    setDone(false);
    const timers: number[] = [];
    const set = (fi: number, pi: number, status: Status) =>
      setSteps((prev) => prev.map((s, i) => (i !== fi ? s : { ...s, rows: s.rows.map((r, j) => (j === pi ? { ...r, status } : r)) })));
    let at = 120;
    plan.forEach((step, fi) =>
      step.rows.forEach((row, pi) => {
        if (pi > step.hitAt) return;
        timers.push(window.setTimeout(() => set(fi, pi, "querying"), at));
        at += row.ms;
        timers.push(window.setTimeout(() => set(fi, pi, pi === step.hitAt ? "hit" : "miss"), at));
      }),
    );
    timers.push(window.setTimeout(() => setDone(true), at));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [job]);

  const who = useMemo(() => identity(job?.email ?? email), [job, email]);
  const profile = useMemo(() => profileFor(who.domain), [who.domain]);
  const rows = steps.flatMap((s) => s.rows);
  const called = rows.filter((r) => r.status === "hit" || r.status === "miss");
  const hits = called.filter((r) => r.status === "hit").length;
  const elapsed = called.reduce((n, r) => n + r.ms, 0);
  const running = Boolean(job) && !done;
  const has = (key: FieldKey) => Boolean(job) && steps.some((s) => s.key === key && s.rows.some((r) => r.status === "hit"));
  const confidence = 84 + (hash(who.domain) % 14);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canRun = !running && valid;
  const run = (value: string) => {
    setEmail(value);
    setJob({ email: value, id: Date.now() });
  };
  const outcome = (r: Row) => (r.status === "hit" ? `${t.hit} · ${r.ms} ms` : r.status === "miss" ? `${t.miss} · ${r.ms} ms` : r.status === "querying" ? t.querying : "");

  const panel = "rounded-lg border border-[#E3E8EF] bg-[#F5F7FA]";
  const panelHead = "flex items-center justify-between gap-2 border-b border-[#E3E8EF] px-3 py-2 font-semibold text-[#0F1C2E]";

  const attributes = (
    <section aria-label={t.attributes} className={panel}>
      <div className={panelHead}>
        <span>{t.attributes}</span>
        <span className="text-[12px] font-normal text-[#5E6C84]">{who.domain || "—"}</span>
      </div>
      <div className="flex items-center gap-2.5 border-b border-[#E3E8EF] px-3 py-2">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#E6F5EF] text-[12px] font-semibold text-[#0B996E]">{who.initials}</span>
        <div className="min-w-0 leading-tight">
          <div className="truncate font-medium">{who.name}</div>
          <div className="truncate text-[12px] text-[#5E6C84]">{(job?.email ?? email).trim().toLowerCase()}</div>
        </div>
      </div>
      <dl className="divide-y divide-[#E3E8EF]">
        {([["phone", profile.phone], ["company", profile.company], ["industry", profile.industry], ["title", profile.title]] as const).map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-3 px-3 py-1.5">
            <dt className="shrink-0 text-[#5E6C84]">{t[k]}</dt>
            <Value ready={has(k === "industry" ? "company" : k)} busy={running}>
              <span className={cx(k === "phone" && "tabular-nums")}>{v}</span>
            </Value>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3 px-3 py-1.5">
          <dt className="shrink-0 text-[#5E6C84]">{t.tech}</dt>
          <Value ready={has("tech")} busy={running}>
            <span className="flex flex-wrap justify-end gap-1">{profile.tech.map((c) => <span key={c} className="rounded-md border border-[#E3E8EF] bg-white px-1.5 text-[12px] leading-5">{c}</span>)}</span>
          </Value>
        </div>
      </dl>
    </section>
  );

  const enrichment = (
    <section aria-label={t.enrichment} className={panel}>
      <div className={panelHead}>
        <span>{t.enrichment}</span>
        {job && <span className="text-[12px] font-normal text-[#5E6C84] tabular-nums">{called.length} / {FLAT_CALLS} · {(elapsed / 1000).toFixed(1)}s</span>}
      </div>
      <ol className="divide-y divide-[#E3E8EF]">
        {steps.map((step) => {
          const hit = step.rows.find((r) => r.status === "hit");
          return compact ? (
            <li key={step.key} className="flex items-center gap-2 px-3 py-1.5">
              <span className="w-[5.5rem] shrink-0 truncate font-medium">{t[step.key]}</span>
              <span className="flex min-w-0 flex-1 flex-wrap gap-1">
                {step.rows.map((row) => (
                  <span key={row.name} className={cx("inline-flex items-center gap-1 rounded-md border px-1.5 text-[12px] leading-5 transition-colors duration-300", CHIP[row.status])}>
                    {row.status === "hit" && <Check width={10} height={10} strokeWidth={2.5} />}{SHORT[row.name]}
                  </span>
                ))}
              </span>
            </li>
          ) : (
            <li key={step.key} className="px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{t[step.key]}</span>
                {hit && <span className="text-[12px] text-[#0B996E] tabular-nums">{SHORT[hit.name]} · {hit.ms} ms</span>}
              </div>
              <ul className="relative mt-1.5 space-y-1.5 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-[#E3E8EF]">
                {step.rows.map((row) => (
                  <li key={row.name} className="relative flex items-center gap-2">
                    <Mark status={row.status} />
                    <span className={cx("min-w-0 flex-1 truncate transition-colors duration-300", row.status === "idle" ? "text-[#9AA5B5]" : row.status === "miss" ? "text-[#5E6C84]" : "text-[#0F1C2E]")}>{row.name}</span>
                    <span className={cx("shrink-0 text-[12px] tabular-nums transition-colors duration-300", STATUS_TEXT[row.status])}>{outcome(row)}</span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </section>
  );

  return (
    <div className="flex h-full w-full flex-col bg-white font-[system-ui,sans-serif] text-[13px] leading-5 text-[#0F1C2E]">
      <header className="flex shrink-0 items-center gap-3 border-b border-[#E3E8EF] px-4 py-2.5">
        <span className="text-[18px] font-bold leading-none tracking-tight text-[#0B996E]">brevo</span>
        <span className="h-4 w-px bg-[#E3E8EF]" aria-hidden />
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-[#5E6C84]">
          <span>{t.contacts}</span>
          <span aria-hidden>/</span>
          <span className="truncate font-medium text-[#0F1C2E]">{who.name}</span>
        </nav>
        <AnimatePresence>
          {done && (
            <motion.span className="ml-auto shrink-0 rounded-lg bg-[#E6F5EF] px-2 text-[12px] font-medium leading-5 text-[#0B996E] tabular-nums" initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: EASE }}>
              {confidence}% {t.confidence}
            </motion.span>
          )}
        </AnimatePresence>
      </header>

      <form className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[#E3E8EF] px-4 py-2" onSubmit={(e) => { e.preventDefault(); if (canRun) run(email); }}>
        <input
          className={cx("h-8 min-w-0 flex-1 rounded-lg border bg-white px-2.5 text-[13px] text-[#0F1C2E] outline-none transition-colors placeholder:text-[#9AA5B5] focus:border-[#0B996E] focus:ring-2 focus:ring-[#0B996E]/20", valid || !email ? "border-[#E3E8EF]" : "border-[#D63A3A]")}
          type="email" value={email} aria-label={t.email} placeholder={t.email} spellCheck={false} onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-[#0B996E] px-3 font-medium text-white transition-colors hover:bg-[#087A57] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#0B996E]" disabled={!canRun}>
          <Bolt width={14} height={14} /> {running ? t.running : t.enrich}
        </button>
        <div className="flex w-full flex-wrap gap-1.5">
          {QUICK.map((q) => (
            <button key={q} type="button" className={cx("rounded-lg border px-2 text-[12px] leading-5 transition-colors disabled:opacity-50", email === q ? "border-[#0B996E] bg-[#E6F5EF] text-[#0B996E]" : "border-[#E3E8EF] bg-white text-[#5E6C84] hover:border-[#0B996E] hover:text-[#0F1C2E]")} onClick={() => run(q)} disabled={running} aria-label={`${t.enrich} ${q}`}>{q}</button>
          ))}
        </div>
      </form>

      <div className={cx("grid min-h-0 flex-1 content-start gap-3 overflow-auto p-4", !compact && "md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]")}>
        {compact ? <>{enrichment}{attributes}</> : <>{attributes}{enrichment}</>}
      </div>

      <div className="flex shrink-0 items-center gap-2 border-t border-[#E3E8EF] bg-[#F5F7FA] px-4 py-1.5 text-[12px] text-[#5E6C84] tabular-nums" role="status">
        {job ? (
          <span className="truncate">
            {called.length} {t.called} · <span className="text-[#0B996E]">{hits} {t.hits}</span> · ~{(elapsed / 1000).toFixed(1)}s
            {done && <> · {t.saved}: <span className="font-medium text-[#0B996E]">{Math.round((1 - called.length / FLAT_CALLS) * 100)}%</span></>}
          </span>
        ) : (
          <span>{t.idle}</span>
        )}
      </div>
    </div>
  );
}
