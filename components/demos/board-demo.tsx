"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Calendar } from "@/components/ui/icon";
import type { DemoProps } from "./types";

const EASE = [0.16, 1, 0.3, 1] as const;
/**
 * monitoring.phidia.fr (Phoenix LiveView) palette, lifted from its app.css:
 * Arial/Manrope type, #f9f9f9 page, lavender #f3ebf6 board, #f5f5f5 stages with
 * coloured 8px headers + white counter pills, 3px cards, flat-UI priority colours.
 */
const FONT = 'Manrope, Arial, "Segoe UI", sans-serif';
const STAGE_COLORS = ["#95a5a6", "#3498db", "#e67e22", "#2ecc71"] as const;

type Party = "client" | "pm" | "dev" | "compta";
type Col = 0 | 1 | 2 | 3;
type Task = { id: string; title: string; party: Party; due: string; col: Col; blockedBy?: string };
type Project = { id: string; name: string; tasks: Task[] };

const COLS: readonly Col[] = [0, 1, 2, 3];
const PARTY_KEYS: readonly Party[] = ["client", "pm", "dev", "compta"];
/** Colour is the party's identity — the value *is* the data. Taken from the app's button/alert palette. */
const PARTIES: Record<Party, { initials: string; color: string }> = {
  client: { initials: "CL", color: "#17A2B8" },
  pm: { initials: "CP", color: "#0284C7" },
  dev: { initials: "DV", color: "#4361ee" },
  compta: { initials: "CO", color: "#e67e22" },
};

const COPY = {
  en: {
    project: "Project", cols: ["Intake", "In progress", "Validation", "Signed off"], who: "Who blocks whom",
    parties: { client: "Client", pm: "Project lead", dev: "Dev", compta: "Accounting" },
    blockedBy: "blocked by", back: "Move back", fwd: "Move forward", none: "No active blocker", user: "Sambatra A.",
    locked: (b: string) => `Blocked until “${b}” is signed off`,
    stats: (n: number, m: number, p: number) => `${n} tasks · ${m} blocked · ${p}% done`,
  },
  fr: {
    project: "Projet", cols: ["Intake", "En cours", "Validation", "Signé"], who: "Qui bloque qui",
    parties: { client: "Client", pm: "Chef de projet", dev: "Dev", compta: "Compta" },
    blockedBy: "bloqué par", back: "Reculer", fwd: "Avancer", none: "Aucun blocage actif", user: "Sambatra A.",
    locked: (b: string) => `Bloqué tant que « ${b} » n'est pas signé`,
    stats: (n: number, m: number, p: number) => `${n} tâches · ${m} bloquées · ${p}% terminé`,
  },
} as const;
type Copy = (typeof COPY)[keyof typeof COPY];

const PROJECTS: Project[] = [
  {
    id: "phidia",
    name: "Refonte SI Phidia",
    tasks: [
      { id: "p1", title: "Cahier des charges", party: "client", due: "12/06", col: 3 },
      { id: "p2", title: "Maquettes back-office", party: "dev", due: "20/06", col: 2 },
      { id: "p3", title: "Modèle de données", party: "dev", due: "28/06", col: 1, blockedBy: "p2" },
      { id: "p4", title: "Avenant lot 2", party: "pm", due: "30/06", col: 1 },
      { id: "p5", title: "Migration comptes clients", party: "dev", due: "10/07", col: 0, blockedBy: "p3" },
      { id: "p6", title: "Recette lot 1", party: "client", due: "15/07", col: 0 },
      { id: "p7", title: "Facture acompte 30 %", party: "compta", due: "05/07", col: 1, blockedBy: "p4" },
      { id: "p8", title: "Formation utilisateurs", party: "pm", due: "22/07", col: 0 },
      { id: "p9", title: "Mise en production", party: "dev", due: "31/07", col: 0 },
    ],
  },
  {
    id: "odoo",
    name: "Migration Odoo 16",
    tasks: [
      { id: "o1", title: "Audit modules custom", party: "dev", due: "03/07", col: 3 },
      { id: "o2", title: "Devis migration", party: "pm", due: "07/07", col: 2 },
      { id: "o3", title: "Bon de commande", party: "client", due: "12/07", col: 1, blockedBy: "o2" },
      { id: "o4", title: "Portage module codes-barres", party: "dev", due: "24/07", col: 0, blockedBy: "o3" },
      { id: "o5", title: "Reprise des écritures", party: "compta", due: "28/07", col: 0 },
      { id: "o6", title: "Bascule production", party: "dev", due: "04/08", col: 0, blockedBy: "o4" },
    ],
  },
  {
    id: "portail",
    name: "Portail client",
    tasks: [
      { id: "c1", title: "Parcours utilisateur", party: "pm", due: "15/08", col: 3 },
      { id: "c2", title: "Maquettes UI", party: "dev", due: "22/08", col: 3 },
      { id: "c3", title: "Validation maquettes", party: "client", due: "26/08", col: 2 },
      { id: "c4", title: "API factures", party: "dev", due: "05/09", col: 1, blockedBy: "c3" },
      { id: "c5", title: "Grille tarifaire", party: "compta", due: "08/09", col: 1 },
      { id: "c6", title: "Recette client", party: "client", due: "15/09", col: 0, blockedBy: "c4" },
    ],
  },
];

function Avatar({ party, label }: { party: Party; label: string }) {
  const { initials, color } = PARTIES[party];
  return (
    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: color }} title={label} aria-label={label}>
      {initials}
    </span>
  );
}

type CardProps = {
  task: Task;
  blocker?: Task;
  blocked: boolean;
  shaking: boolean;
  t: Copy;
  onMove: (task: Task, dir: 1 | -1) => void;
};

const NAV = "flex h-6 w-6 items-center justify-center rounded-full text-[#606c76] transition-colors hover:bg-[#ececec] hover:text-[#111827] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent";

function TaskCard({ task, blocker, blocked, shaking, t, onMove }: CardProps) {
  const last = task.col === 3;
  return (
    <motion.article
      layout
      layoutId={`task-${task.id}`}
      animate={{ x: shaking ? [0, -6, 6, -4, 4, 0] : 0 }}
      transition={{ layout: { duration: 0.35, ease: EASE }, x: { duration: 0.4 } }}
      className="rounded-[3px] bg-white p-2.5 text-xs text-[#111827] shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="leading-snug">{task.title}</p>
        <Avatar party={task.party} label={t.parties[task.party]} />
      </div>
      <div className="mt-1.5 flex items-center gap-1 text-xs text-[#6b7280]">
        <Calendar className="text-[12px]" />
        <span className="tnum">{task.due}</span>
      </div>
      <AnimatePresence initial={false}>
        {blocked && blocker && (
          <motion.div
            key="blocked"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 6 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <span className="inline-flex max-w-full items-center rounded-full bg-[#e74c3c]/20 px-2 py-0.5 text-xs font-semibold text-[#e74c3c]">
              <span className="truncate">
                {t.blockedBy}: {blocker.title}
              </span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-2 flex items-center justify-between">
        <button type="button" className={NAV} disabled={task.col === 0} onClick={() => onMove(task, -1)} aria-label={t.back} title={t.back}>
          <ArrowRight className="rotate-180 text-[14px]" />
        </button>
        <button
          type="button"
          className={`${NAV} ${blocked ? "cursor-not-allowed opacity-40" : ""}`}
          disabled={last}
          aria-disabled={blocked || last}
          title={blocked && blocker ? t.locked(blocker.title) : t.fwd}
          aria-label={blocked && blocker ? t.locked(blocker.title) : t.fwd}
          onClick={() => onMove(task, 1)}
        >
          <ArrowRight className="text-[14px]" />
        </button>
      </div>
    </motion.article>
  );
}

export default function BoardDemo({ locale, compact = false }: DemoProps) {
  const t = COPY[locale];
  const [projectId, setProjectId] = useState(PROJECTS[0]?.id ?? "phidia");
  const [boards, setBoards] = useState<Record<string, Task[]>>(() =>
    Object.fromEntries(PROJECTS.map((p) => [p.id, p.tasks.map((x) => ({ ...x }))])),
  );
  const [shake, setShake] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const tasks = boards[projectId] ?? [];
  const byId = new Map(tasks.map((x) => [x.id, x] as const));
  const blockerOf = (x: Task) => (x.blockedBy ? byId.get(x.blockedBy) : undefined);
  const isBlocked = (x: Task) => {
    const b = blockerOf(x);
    return b !== undefined && b.col < 3;
  };
  const signed = tasks.filter((x) => x.col === 3).length;
  const pct = tasks.length ? Math.round((signed / tasks.length) * 100) : 0;
  const pairs = tasks.flatMap((x) => {
    const b = blockerOf(x);
    return b && b.col < 3 ? [{ from: b, to: x }] : [];
  });

  function move(task: Task, dir: 1 | -1) {
    if (dir === 1 && isBlocked(task)) {
      setShake(task.id);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setShake(null), 450);
      return;
    }
    const next = task.col + dir;
    if (next < 0 || next > 3) return;
    setBoards((prev) => ({
      ...prev,
      [projectId]: (prev[projectId] ?? []).map((y) => (y.id === task.id ? { ...y, col: next as Col } : y)),
    }));
  }

  return (
    <div className="flex h-full w-full flex-col bg-[#f9f9f9] text-[#111827]" style={{ fontFamily: FONT }}>
      {/* site header: brand, project picker, party legend, user */}
      <header className="relative z-10 flex shrink-0 flex-col gap-2 bg-white px-3 py-2 shadow-[0_6px_20px_rgba(0,0,0,0.10)]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="shrink-0 text-sm font-bold tracking-wide" style={{ fontFamily: "Arial, sans-serif" }}>
            PHIDIA<span className="text-[#606c76]">/</span> MONITORING
          </span>
          <select className="min-w-0 rounded-[4px] border border-[#d1d1d1] bg-white px-2 py-1 text-xs font-semibold text-[#111827] outline-none focus:border-[#0069d9]" value={projectId} onChange={(e) => setProjectId(e.target.value)} aria-label={t.project}>
            {PROJECTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <div className="ml-auto flex items-center gap-1.5">
            {PARTY_KEYS.map((p) => (
              <span key={p} className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e5e5] bg-white py-0.5 pl-0.5 pr-2 text-xs text-[#374151]">
                <Avatar party={p} label={t.parties[p]} />
                {!compact && t.parties[p]}
                <span className="tnum font-bold text-[#6b7280]">{tasks.filter((x) => x.party === p).length}</span>
              </span>
            ))}
            {!compact && <span className="ml-1 hidden items-center gap-1.5 text-xs text-[#374151] sm:inline-flex"><span className="h-6 w-6 rounded-full border border-[#d1d1d1] bg-[#F8F1F1]" aria-hidden="true" />{t.user}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e9e9e9]">
            <motion.div className="h-full rounded-full bg-[#0069d9]" animate={{ width: `${pct}%` }} transition={{ duration: 0.5, ease: EASE }} />
          </div>
          <span className="tnum w-9 text-right text-xs font-semibold text-[#606c76]">{pct}%</span>
        </div>
      </header>

      {/* board: lavender well, grey stages, coloured stage headers */}
      <div className="min-h-0 flex-1 p-2 sm:p-3">
        <div className={`h-full rounded-[4px] border border-[#eeeeee] bg-[#f3ebf6] p-2 ${compact ? "flex snap-x snap-mandatory gap-2 overflow-x-auto" : "grid grid-cols-4 gap-2 overflow-auto"}`}>
          {COLS.map((col) => {
            const items = tasks.filter((x) => x.col === col);
            return (
              <section key={col} aria-label={t.cols[col]} className={`flex min-h-0 flex-col rounded-[3px] bg-[#f5f5f5] p-1.5 ${compact ? "w-[78%] shrink-0 snap-start" : ""}`}>
                <div className="mb-2 flex h-[30px] shrink-0 items-center justify-between rounded-[8px] px-2" style={{ backgroundColor: STAGE_COLORS[col] }}>
                  <span className="truncate text-xs font-bold uppercase tracking-wide text-white">{t.cols[col]}</span>
                  <span className="tnum rounded-full bg-white px-2 text-xs font-bold text-[#353434]">{items.length}</span>
                </div>
                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
                  {items.map((x) => (
                    <TaskCard key={x.id} task={x} blocker={blockerOf(x)} blocked={isBlocked(x)} shaking={shake === x.id} t={t} onMove={move} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <footer className="flex items-center justify-between gap-3 border-t border-[#eeeeee] bg-white px-3 py-1.5 text-xs">
        <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto whitespace-nowrap">
          <span className="shrink-0 font-bold uppercase tracking-wide text-[#606c76]">{t.who}</span>
          <AnimatePresence initial={false} mode="popLayout">
            {pairs.length === 0 ? (
              <motion.span key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[#9ca3af]">
                {t.none}
              </motion.span>
            ) : (
              pairs.map(({ from, to }) => (
                <motion.span
                  key={`${from.id}-${to.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#e5e5e5] bg-white px-2 py-0.5 text-xs"
                >
                  <span className="text-[#111827]">{from.title}</span>
                  <span className="text-[#0069d9]">⟶</span>
                  <span className="text-[#6b7280]">{to.title}</span>
                </motion.span>
              ))
            )}
          </AnimatePresence>
        </div>
        <span className="tnum shrink-0 text-[#606c76]">{t.stats(tasks.length, pairs.length, pct)}</span>
      </footer>
    </div>
  );
}
