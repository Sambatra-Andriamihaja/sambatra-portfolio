"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, Send } from "@/components/ui/icon";
import type { DemoProps } from "./types";

const EASE = [0.16, 1, 0.3, 1] as const;

type Locale = DemoProps["locale"];
type Block =
  | { kind: "text"; text: string }
  | { kind: "table"; head: readonly string[]; rows: readonly (readonly string[])[] }
  | { kind: "bullets"; items: readonly string[] };
type Tool = { name: "Brevo" | "Supabase mirror" | "Gong"; call: string; result: string; ms: number };
type Script = { tools: readonly Tool[]; blocks: Record<Locale, readonly Block[]> };
type AgentMsg = { id: number; role: "agent"; time: string; tools: readonly Tool[]; blocks: readonly Block[]; toolsDone: number; cursor: number; done: boolean };
type Msg = { id: number; role: "user"; time: string; text: string } | AgentMsg;
type Active = Pick<AgentMsg, "id" | "tools" | "blocks">;

const COPY = {
  en: {
    channel: "revops",
    name: "Dust assistant",
    sub: "Connected to Brevo, Supabase, Gong",
    you: "Sam B.",
    placeholder: "Message #revops",
    send: "Send",
    app: "APP",
    running: "Running…",
    welcome: "Hi! I can read Brevo deals, the Supabase mirror and Gong call notes. Ask me anything about the pipeline.",
    chips: ["What's in the pipeline for Q3?", "Which won deals this week lack an order form?", "Summarize the last call with Northwind", "Who owns the biggest open deal?"],
  },
  fr: {
    channel: "revops",
    name: "Dust assistant",
    sub: "Connecté à Brevo, Supabase, Gong",
    you: "Sam B.",
    placeholder: "Envoyer un message dans #revops",
    send: "Envoyer",
    app: "APP",
    running: "En cours…",
    welcome: "Bonjour ! Je lis les deals Brevo, le miroir Supabase et les notes d'appel Gong. Posez-moi vos questions sur le pipeline.",
    chips: ["Quel est le pipeline du Q3 ?", "Quels deals gagnés cette semaine n'ont pas de bon de commande ?", "Résume le dernier appel avec Northwind", "Qui possède le plus gros deal ouvert ?"],
  },
} as const;

const OWNERS = [["Camille R.", "5", "€168k"], ["Yanis B.", "4", "€121k"], ["Sofia M.", "3", "€79k"]] as const;
const MISSING = ["Northwind — €24k · Camille R.", "Acme Tools — €9.8k · Yanis B.", "Lumen Retail — €31k · Sofia M."] as const;

const SCRIPTS: readonly (Script & { match: RegExp })[] = [
  {
    match: /pipeline|q3|forecast/i,
    tools: [
      { name: "Brevo", call: "read deals (stage=Q3, open)", result: "14 rows", ms: 220 },
      { name: "Supabase mirror", call: "SELECT owner, SUM(weighted) … GROUP BY owner", result: "3 rows", ms: 41 },
    ],
    blocks: {
      en: [
        { kind: "text", text: "14 open deals in Q3, €412k weighted. Three owners carry 80% of it:" },
        { kind: "table", head: ["Owner", "Deals", "Weighted"], rows: OWNERS },
        { kind: "text", text: "Two deals have had no activity for 21+ days — want me to flag them in #revops?" },
      ],
      fr: [
        { kind: "text", text: "14 deals ouverts au Q3, 412 k€ pondérés. Trois owners en portent 80 % :" },
        { kind: "table", head: ["Owner", "Deals", "Pondéré"], rows: OWNERS },
        { kind: "text", text: "Deux deals sont sans activité depuis plus de 21 jours — je les signale dans #revops ?" },
      ],
    },
  },
  {
    match: /order form|won|bon de commande|gagn/i,
    tools: [
      { name: "Brevo", call: "read deals (stage=won, closed≥7d)", result: "9 rows", ms: 184 },
      { name: "Supabase mirror", call: "SELECT deal_id FROM order_forms WHERE deal_id IN (…)", result: "6 rows", ms: 38 },
    ],
    blocks: {
      en: [
        { kind: "text", text: "9 deals were won this week; 3 have no order form attached:" },
        { kind: "bullets", items: MISSING },
        { kind: "text", text: "I can draft the reminders to the owners — say the word." },
      ],
      fr: [
        { kind: "text", text: "9 deals gagnés cette semaine ; 3 n'ont pas de bon de commande :" },
        { kind: "bullets", items: MISSING },
        { kind: "text", text: "Je peux rédiger les relances aux owners — dites-moi." },
      ],
    },
  },
  {
    match: /northwind|call|appel|summar|résum/i,
    tools: [
      { name: "Brevo", call: "read deals (company=Northwind)", result: "1 row", ms: 96 },
      { name: "Gong", call: "call notes (Northwind, latest)", result: "1 transcript", ms: 310 },
    ],
    blocks: {
      en: [
        { kind: "text", text: "Tuesday call with Léa Martin (Head of Growth), 32 min." },
        { kind: "bullets", items: ["Pain: manual enrichment in HubSpot, ~6h/week", "Budget confirmed for Q3, legal review pending", "Next step: security questionnaire by Friday"] },
        { kind: "text", text: "Sentiment positive; the main risk is the procurement timeline." },
      ],
      fr: [
        { kind: "text", text: "Appel de mardi avec Léa Martin (Head of Growth), 32 min." },
        { kind: "bullets", items: ["Douleur : enrichissement manuel dans HubSpot, ~6h/semaine", "Budget confirmé pour le Q3, revue juridique en cours", "Prochaine étape : questionnaire sécurité vendredi"] },
        { kind: "text", text: "Sentiment positif ; le risque principal est le délai achats." },
      ],
    },
  },
  {
    match: /biggest|largest|owns|owner|plus gros|possède/i,
    tools: [
      { name: "Brevo", call: "read deals (open, sort=amount desc, first=1)", result: "1 row", ms: 140 },
      { name: "Supabase mirror", call: "SELECT owner, last_touch FROM deals WHERE id = 'd_8821'", result: "1 row", ms: 22 },
    ],
    blocks: {
      en: [
        { kind: "text", text: "Lumen Retail — €31k — owned by Sofia M." },
        { kind: "bullets", items: ["Stage: Negotiation", "Expected close: 24 Sep", "Last touch: 2 days ago (Gong call)"] },
      ],
      fr: [
        { kind: "text", text: "Lumen Retail — 31 k€ — owner : Sofia M." },
        { kind: "bullets", items: ["Étape : Négociation", "Clôture prévue : 24 sept.", "Dernier contact : il y a 2 jours (appel Gong)"] },
      ],
    },
  },
];

function generic(q: string): Script {
  const short = q.length > 42 ? `${q.slice(0, 42)}…` : q;
  return {
    tools: [
      { name: "Supabase mirror", call: "SELECT … FROM deals WHERE search @@ :q", result: "6 rows", ms: 47 },
      { name: "Brevo", call: "read deals (ids=[…])", result: "6 rows", ms: 175 },
    ],
    blocks: {
      en: [{ kind: "text", text: `No saved playbook matches “${short}”, so I ran a broad search on the deal mirror. 6 deals are close to your question; the most recent is Lumen Retail (Negotiation, Sofia M.). Want me to open it in Brevo or post a summary here?` }],
      fr: [{ kind: "text", text: `Aucun playbook ne correspond à « ${short} », j'ai donc lancé une recherche large sur le miroir des deals. 6 deals s'en rapprochent ; le plus récent est Lumen Retail (Négociation, Sofia M.). Je l'ouvre dans Brevo ou je poste un résumé ici ?` }],
    },
  };
}

const units = (b: Block) => (b.kind === "text" ? b.text.length : b.kind === "table" ? b.rows.length * 4 : b.items.length * 4);
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
const TOOL_BAR: Record<Tool["name"], string> = { Brevo: "border-l-[#0B996E]", "Supabase mirror": "border-l-[#3ECF8E]", Gong: "border-l-[#8039DF]" };
const WELCOME_AT = new Date(2026, 8, 8, 9, 41);

function stamp(locale: Locale, d: Date) {
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  return locale === "fr" ? `${String(h).padStart(2, "0")}:${m}` : `${h % 12 || 12}:${m} ${h < 12 ? "AM" : "PM"}`;
}

/** Slack-style channel mentions (#revops) rendered as links. */
function Rich({ text }: { text: string }) {
  return <>{text.split(/(#[\w-]+)/g).map((p, i) => (i % 2 ? <span key={i} className="rounded-sm bg-[#1D9BD1]/10 px-0.5 text-[#1264A3]">{p}</span> : p))}</>;
}

const Caret = () => <span className="ml-px inline-block h-[15px] w-0.5 translate-y-[3px] bg-[#1D1C1D]" aria-hidden />;

function Answer({ blocks, cursor, live }: { blocks: readonly Block[]; cursor: number; live: boolean }) {
  let offset = 0;
  return (
    <div className="space-y-1.5">
      {blocks.map((b, i) => {
        const u = units(b);
        const local = Math.max(0, Math.min(u, cursor - offset));
        offset += u;
        if (local <= 0) return null;
        const streaming = live && local < u;
        if (b.kind === "text") return <p key={i}><Rich text={b.text.slice(0, local)} />{streaming && <Caret />}</p>;
        const n = Math.floor(local / 4);
        if (b.kind === "bullets")
          return (
            <ul key={i} className="list-disc space-y-0.5 pl-6">
              {b.items.slice(0, n).map((it) => <motion.li key={it} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25, ease: EASE }}>{it}</motion.li>)}
            </ul>
          );
        return (
          <div key={i} className="overflow-x-auto rounded border border-[#DDDDDD] bg-[#F8F8F8] px-2.5 py-1.5">
            <table className="w-full border-collapse font-mono text-[12px] leading-5 tabular-nums">
              <thead><tr className="text-left text-[#616061]">{b.head.map((h, j) => <th key={h} className={cx("border-b border-[#DDDDDD] pb-0.5 font-normal", j > 0 && "text-right")}>{h}</th>)}</tr></thead>
              <tbody>
                {b.rows.slice(0, n).map((r) => (
                  <motion.tr key={r[0]} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
                    {r.map((c, j) => <td key={j} className={cx("pt-0.5", j > 0 && "text-right")}>{c}</td>)}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

function ToolCard({ tool, done, running }: { tool: Tool; done: boolean; running: string }) {
  return (
    <motion.li className={cx("rounded-md border-l-4 bg-[#F8F8F8] py-1.5 pl-3 pr-2.5 text-[13px] leading-[1.4]", TOOL_BAR[tool.name])} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: EASE }}>
      <div className="flex items-center gap-2">
        <span className="font-bold text-[#1264A3]">{tool.name}</span>
        <span className="ml-auto flex shrink-0 items-center gap-1.5 text-[12px] text-[#616061] tabular-nums">
          {done ? <><span>{tool.result} · {tool.ms}ms</span><Check width={12} height={12} strokeWidth={2.5} className="text-[#007A5A]" /></> : <span>{running}</span>}
        </span>
      </div>
      <div className="truncate font-mono text-[12px] text-[#1D1C1D]">{tool.call}</div>
    </motion.li>
  );
}

export default function AgentDemo({ locale, compact }: DemoProps) {
  const t = COPY[locale];
  const [messages, setMessages] = useState<Msg[]>(() => [{ id: 1, role: "agent", time: stamp(locale, WELCOME_AT), tools: [], blocks: [{ kind: "text", text: t.welcome }], toolsDone: 0, cursor: Infinity, done: true }]);
  const [active, setActive] = useState<Active | null>(null);
  const [input, setInput] = useState("");
  const idRef = useRef(2);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (!active) return;
    const { id, tools, blocks } = active;
    const patch = (p: Partial<Pick<AgentMsg, "toolsDone" | "cursor" | "done">>) => setMessages((ms) => ms.map((m) => (m.id === id && m.role === "agent" ? { ...m, ...p } : m)));
    const timers: number[] = [];
    let raf = 0;
    let at = 300;
    tools.forEach((_, i) => {
      at += 480 + i * 140;
      timers.push(window.setTimeout(() => patch({ toolsDone: i + 1 }), at));
    });
    const total = blocks.reduce((n, b) => n + units(b), 0);
    const step = Math.min(12, 1500 / total);
    timers.push(window.setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const c = Math.min(total, Math.floor((now - start) / step));
        patch({ cursor: c });
        if (c < total) raf = requestAnimationFrame(tick);
        else { patch({ done: true }); setActive(null); }
      };
      raf = requestAnimationFrame(tick);
    }, at + 250));
    return () => { timers.forEach((k) => window.clearTimeout(k)); cancelAnimationFrame(raf); };
  }, [active]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const initials = t.you.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const send = (raw: string, preset?: number) => {
    const text = raw.trim();
    if (!text || active) return;
    const script = preset !== undefined ? SCRIPTS[preset] : SCRIPTS.find((s) => s.match.test(text)) ?? generic(text);
    const uid = idRef.current++;
    const aid = idRef.current++;
    const time = stamp(locale, new Date());
    const agent: AgentMsg = { id: aid, role: "agent", time, tools: script.tools, blocks: script.blocks[locale], toolsDone: 0, cursor: 0, done: false };
    setMessages((ms) => [...ms, { id: uid, role: "user", time, text }, agent]);
    setActive({ id: aid, tools: agent.tools, blocks: agent.blocks });
    setInput("");
  };

  return (
    <div className="flex h-full w-full flex-col bg-white font-[system-ui,sans-serif] text-[15px] leading-[1.46] text-[#1D1C1D]">
      <header className="flex shrink-0 items-center gap-3 border-b border-[#DDDDDD] px-4 py-2.5">
        <span className="shrink-0 font-bold"># {t.channel} · {t.name}</span>
        <span className="ml-auto min-w-0 truncate text-[13px] text-[#616061]">{t.sub}</span>
      </header>

      <ol ref={listRef} className="min-h-0 flex-1 overflow-auto py-2">
        {messages.map((m) => (
          <motion.li key={m.id} className="flex gap-2 px-4 py-1.5 transition-colors hover:bg-[#F8F8F8]" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: EASE }}>
            {m.role === "user" ? (
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded bg-[#4A154B] text-[13px] font-bold text-white">{initials}</span>
            ) : (
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded bg-black pb-0.5 text-[22px] font-bold leading-none text-white">d</span>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-1.5">
                <span className="font-bold">{m.role === "user" ? t.you : t.name}</span>
                {m.role === "agent" && <span className="rounded-sm bg-[#E8E8E8] px-1 text-[12px] font-bold uppercase leading-4 tracking-wide text-[#616061]">{t.app}</span>}
                <span className="text-[12px] text-[#616061]">{m.time}</span>
              </div>
              {m.role === "user" ? (
                <p>{m.text}</p>
              ) : (
                <>
                  {m.tools.length > 0 && (
                    <ul className="my-1 space-y-1">
                      {m.tools.slice(0, m.toolsDone + 1).map((tool, i) => <ToolCard key={tool.name + tool.call} tool={tool} done={i < m.toolsDone} running={t.running} />)}
                    </ul>
                  )}
                  {m.toolsDone >= m.tools.length && <Answer blocks={m.blocks} cursor={m.cursor} live={!m.done} />}
                </>
              )}
            </div>
          </motion.li>
        ))}
      </ol>

      <div className="shrink-0 px-4 pb-3 pt-1">
        <div className={cx("mb-2 flex gap-1.5", compact ? "overflow-x-auto pb-0.5" : "flex-wrap")}>
          {t.chips.map((c, i) => (
            <button key={c} type="button" className="h-7 shrink-0 whitespace-nowrap rounded-md border border-[#BBBABB] bg-white px-2.5 text-[13px] font-medium text-[#1D1C1D] transition-colors hover:bg-[#F8F8F8] disabled:opacity-50 disabled:hover:bg-white" disabled={Boolean(active)} onClick={() => send(c, i)}>{c}</button>
          ))}
        </div>
        <form className="rounded-lg border border-[#BBBABB] bg-white transition-colors focus-within:border-[#616061]" onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <div className="flex items-center gap-0.5 border-b border-[#DDDDDD] px-2 py-1 text-[13px] text-[#616061]" aria-hidden>
            <span className="grid h-6 w-6 place-items-center rounded font-bold">B</span>
            <span className="grid h-6 w-6 place-items-center rounded italic">I</span>
            <span className="grid h-6 w-6 place-items-center rounded line-through">S</span>
            <span className="mx-1 h-4 w-px bg-[#DDDDDD]" />
            <span className="grid h-6 w-6 place-items-center rounded font-mono text-[12px]">{"</>"}</span>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1.5">
            <input className="min-w-0 flex-1 bg-transparent text-[15px] text-[#1D1C1D] outline-none placeholder:text-[#616061] disabled:opacity-60" value={input} aria-label={t.placeholder} placeholder={t.placeholder} onChange={(e) => setInput(e.target.value)} disabled={Boolean(active)} />
            <button type="submit" className="grid h-7 w-7 shrink-0 place-items-center rounded bg-[#007A5A] text-white transition-colors hover:bg-[#148567] disabled:bg-[#DDDDDD] disabled:text-[#616061]" aria-label={t.send} disabled={Boolean(active) || !input.trim()}><Send width={14} height={14} /></button>
          </div>
        </form>
      </div>
    </div>
  );
}
