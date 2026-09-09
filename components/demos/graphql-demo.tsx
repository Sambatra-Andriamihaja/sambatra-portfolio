"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { DemoProps } from "./types";

/**
 * Orizon (Smart Predict) — one GraphQL schema, two clients. The query pane
 * is classic GraphiQL; the two previews are the Orizon web calendar and the
 * React Native feed, both rendered from the same response object.
 */

const COPY = {
  en: { run: "Run", response: "Response", web: "Web · calendar", mobile: "Mobile · feed", badge: "1 schema · 2 clients · Prisma", validated: "Validated", pending: "Pending", running: "Running…" },
  fr: { run: "Exécuter", response: "Réponse", web: "Web · calendrier", mobile: "Mobile · fil", badge: "1 schéma · 2 clients · Prisma", validated: "Validé", pending: "En attente", running: "En cours…" },
} as const;

type Ev = { id: string; type: "LEAVE" | "HOME_OFFICE" | "EVENT"; title: string; day: string; status: "VALIDATED" | "PENDING"; people: number };

const EVENTS: Ev[] = [
  { id: "ev_01", type: "LEAVE", title: "Leave", day: "Mon 15", status: "VALIDATED", people: 1 },
  { id: "ev_02", type: "HOME_OFFICE", title: "Home Office", day: "Tue 16", status: "VALIDATED", people: 7 },
  { id: "ev_03", type: "EVENT", title: "Wimtim brainstorm", day: "Tue 16", status: "PENDING", people: 3 },
  { id: "ev_04", type: "LEAVE", title: "Leave", day: "Thu 18", status: "PENDING", people: 1 },
  { id: "ev_05", type: "HOME_OFFICE", title: "Home Office", day: "Fri 19", status: "VALIDATED", people: 8 },
];

const PRESETS = [
  {
    key: "events",
    label: "events",
    query: `query Week($n: Int!) {\n  events(week: $n) {\n    id\n    type\n    title\n    day\n    status\n    attendees { count }\n  }\n}`,
    data: () => ({ events: EVENTS.map((e) => ({ ...e, attendees: { count: e.people } })) }),
    rows: () => EVENTS,
  },
  {
    key: "user",
    label: "user.leaves",
    query: `query Me {\n  user(id: "u_42") {\n    name\n    team { name }\n    leaves(status: PENDING) {\n      id\n      day\n      status\n    }\n  }\n}`,
    data: () => ({ user: { name: "Sambatra A.", team: { name: "SmartPredict" }, leaves: EVENTS.filter((e) => e.type === "LEAVE" && e.status === "PENDING") } }),
    rows: () => EVENTS.filter((e) => e.type === "LEAVE"),
  },
  {
    key: "validate",
    label: "validateLeave",
    query: `mutation Validate {\n  validateLeave(id: "ev_04") {\n    id\n    status\n    validatedBy { name }\n  }\n}`,
    data: () => ({ validateLeave: { id: "ev_04", status: "VALIDATED", validatedBy: { name: "N. Rakoto" } } }),
    rows: () => EVENTS.map((e) => (e.id === "ev_04" ? { ...e, status: "VALIDATED" as const } : e)),
  },
];

/* GraphiQL classic palette */
const G = { kw: "#B11A04", field: "#1F61A0", arg: "#8B2BB9", str: "#D64292", num: "#2882F9", punct: "#555555" };

function Query({ q }: { q: string }) {
  return (
    <pre className="whitespace-pre font-mono text-[12px] leading-[1.6] text-[#555]">
      {q.split("\n").map((line, i) => (
        <div key={i}>
          {line.split(/(\s+|[{}():!]|\$\w+|"[^"]*"|\b\d+\b)/).filter(Boolean).map((tok, j) => {
            let color = G.field;
            if (/^(query|mutation|subscription|fragment)$/.test(tok)) color = G.kw;
            else if (/^\$/.test(tok) || /^[A-Z][A-Za-z]*!?$/.test(tok) || tok === "PENDING") color = G.arg;
            else if (/^".*"$/.test(tok)) color = G.str;
            else if (/^\d+$/.test(tok)) color = G.num;
            else if (/^[{}():!\s]+$/.test(tok)) color = G.punct;
            else if (/^[a-z]\w*$/.test(tok) && line.includes("(") && line.indexOf(tok) > line.indexOf("(")) color = G.arg;
            return <span key={j} style={{ color }}>{tok}</span>;
          })}
        </div>
      ))}
    </pre>
  );
}

function Json({ lines, shown }: { lines: string[]; shown: number }) {
  return (
    <pre className="whitespace-pre font-mono text-[12px] leading-[1.6]">
      {lines.slice(0, shown).map((l, i) => {
        const m = l.match(/^(\s*)("[^"]+")(: )?(.*)$/);
        if (!m) return <div key={i} style={{ color: G.punct }}>{l}</div>;
        const v = m[4];
        const vc = /^"/.test(v) ? G.str : /^\d/.test(v) ? G.num : G.punct;
        return (
          <div key={i}>
            <span>{m[1]}</span>
            <span style={{ color: G.field }}>{m[2]}</span>
            <span style={{ color: G.punct }}>{m[3]}</span>
            <span style={{ color: vc }}>{v}</span>
          </div>
        );
      })}
    </pre>
  );
}

/* Orizon chips — blue leave, slate home office, green event, as in the app */
type Copy = (typeof COPY)[keyof typeof COPY];

function Chip({ e, t, small }: { e: Ev; t: Copy; small?: boolean }) {
  const bg = e.type === "LEAVE" ? "#2196F3" : e.type === "EVENT" ? "#6CC24A" : "#3B4B48";
  return (
    <div className="flex items-center gap-1.5 rounded-[6px] px-2 text-white" style={{ background: bg, height: small ? 24 : 28, fontSize: small ? 11 : 12 }}>
      <span className="font-medium">{e.title}</span>
      {e.type !== "EVENT" && (
        <span className="flex items-center gap-1 opacity-90">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: e.status === "VALIDATED" ? "#8BE05A" : "#FFC53D" }} />
          {e.status === "VALIDATED" ? t.validated : t.pending}
        </span>
      )}
      <span className="ml-auto flex -space-x-1">
        {Array.from({ length: Math.min(e.people, 3) }).map((_, i) => (
          <span key={i} className="h-4 w-4 rounded-full border border-white/70 bg-[#F0C9A0]" />
        ))}
        {e.people > 3 && <span className="ml-1 text-[10px]">+{e.people - 3}</span>}
      </span>
    </div>
  );
}

export default function GraphqlDemo({ locale, compact }: DemoProps) {
  const t = COPY[locale];
  const [preset, setPreset] = useState(0);
  const [shown, setShown] = useState(0);
  const [rows, setRows] = useState<Ev[]>(EVENTS);
  const [running, setRunning] = useState(false);
  const timers = useRef<number[]>([]);

  const p = PRESETS[preset];
  const lines = JSON.stringify({ data: p.data() }, null, 2).split("\n");

  const run = (idx = preset) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const target = PRESETS[idx];
    const total = JSON.stringify({ data: target.data() }, null, 2).split("\n").length;
    setPreset(idx);
    setShown(0);
    setRunning(true);
    for (let i = 1; i <= total; i++) {
      timers.current.push(window.setTimeout(() => setShown(i), 26 * i));
    }
    timers.current.push(
      window.setTimeout(() => {
        setRows(target.rows());
        setRunning(false);
      }, 26 * total + 80),
    );
  };

  useEffect(() => {
    const id = window.setTimeout(() => run(0), 400);
    const list = timers.current;
    return () => {
      clearTimeout(id);
      list.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`flex h-full w-full flex-col bg-white text-[#333] ${compact ? "" : "lg:flex-row"}`}>
      {/* GraphiQL */}
      <section className={`flex min-h-0 flex-col border-[#E0E0E0] ${compact ? "h-1/2 border-b" : "lg:w-[52%] lg:border-r"}`}>
        <div className="flex h-9 shrink-0 items-center gap-2 border-b border-[#E0E0E0] bg-[#F6F6F6] px-2">
          <button
            type="button"
            onClick={() => run()}
            disabled={running}
            aria-label={t.run}
            className="grid h-6 w-6 place-items-center rounded-full bg-[#E10098] text-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor" aria-hidden><path d="M7 5v14l11-7z" /></svg>
          </button>
          <span className="text-[12px] font-semibold text-[#444]">GraphiQL</span>
          <div className="ml-auto flex gap-1">
            {PRESETS.map((x, i) => (
              <button
                key={x.key}
                type="button"
                onClick={() => run(i)}
                className={`rounded px-2 py-0.5 font-mono text-[11px] ${i === preset ? "bg-[#E10098]/10 text-[#E10098]" : "text-[#666] hover:bg-black/5"}`}
              >
                {x.label}
              </button>
            ))}
          </div>
        </div>
        <div className={`grid min-h-0 flex-1 ${compact ? "grid-cols-2" : "grid-rows-2"}`}>
          <div className="min-h-0 overflow-auto border-[#E0E0E0] p-3 [border-right-width:1px] max-lg:[border-right-width:0]">
            <Query q={p.query} />
          </div>
          <div className="min-h-0 overflow-auto border-t border-[#E0E0E0] bg-[#FAFAFA] p-3">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#999]">{running ? t.running : t.response}</p>
            <Json lines={lines} shown={shown} />
          </div>
        </div>
      </section>

      {/* Orizon surfaces */}
      <section className={`flex min-h-0 flex-1 gap-3 bg-[#0F1614] p-3 ${compact ? "flex-row" : "flex-col lg:flex-row"}`}>
        {/* web */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg bg-[#1C2724] text-white ring-1 ring-white/10">
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#6CC24A] text-[10px] font-bold text-[#0F1614]">S</span>
            <span className="text-[11px] font-semibold">SmartPredict</span>
            <span className="ml-auto rounded-full bg-[#6CC24A] px-2 py-0.5 text-[9px] font-bold uppercase text-[#0F1614]">Month</span>
          </div>
          <div className="min-h-0 flex-1 space-y-1.5 overflow-auto p-2">
            {rows.map((e, i) => (
              <motion.div key={`${p.key}-${e.id}-${e.status}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }} className="flex items-center gap-2">
                <span className="w-10 shrink-0 text-[10px] text-white/50">{e.day}</span>
                <div className="min-w-0 flex-1"><Chip e={e} t={t} small={compact} /></div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between border-t border-white/10 px-3 py-1 text-[10px] text-white/45">
            <span>{t.web}</span>
            <span>{t.badge}</span>
          </div>
        </div>

        {/* mobile */}
        <div className={`flex shrink-0 flex-col overflow-hidden rounded-[18px] bg-[#1C2724] text-white ring-1 ring-white/15 ${compact ? "w-[132px]" : "w-[150px]"}`}>
          <div className="flex items-center justify-between px-3 pt-2 text-[9px] text-white/60"><span>9:41</span><span>●●●</span></div>
          <div className="px-3 pb-1 pt-2 text-[12px] font-semibold">Calendar</div>
          <div className="min-h-0 flex-1 space-y-1.5 overflow-auto px-2 pb-2">
            {rows.map((e, i) => (
              <motion.div key={`${p.key}-${e.id}-${e.status}-m`} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25, delay: 0.1 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}>
                <p className="mb-0.5 text-[9px] text-white/45">{e.day}</p>
                <Chip e={e} t={t} small />
              </motion.div>
            ))}
          </div>
          <div className="flex justify-around border-t border-white/10 py-1.5 text-[9px] text-white/50">
            <span>Hive</span><span className="text-[#6CC24A]">Calendar</span><span>To Do</span>
          </div>
        </div>
      </section>
    </div>
  );
}
