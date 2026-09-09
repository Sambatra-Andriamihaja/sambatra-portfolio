"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { DemoProps } from "./types";

/**
 * WikIT — TELMA's document management platform (2021), rebuilt in
 * CodeIgniter + AngularJS + Bootstrap 4. Versioned documents, role-based
 * access, a search index that returns the right file.
 */

const COPY = {
  en: { search: "Search documents…", count: "documents", empty: "No document matches.", versions: "Versions", restore: "Restore this version", current: "current", viewAs: "View as", back: "Back to list", owner: "Owner", dept: "Department", updated: "Updated", access: "Access", locked: "Restricted for this role", home: "Home", docs: "Documents" },
  fr: { search: "Rechercher un document…", count: "documents", empty: "Aucun document ne correspond.", versions: "Versions", restore: "Restaurer cette version", current: "actuelle", viewAs: "Voir en tant que", back: "Retour à la liste", owner: "Propriétaire", dept: "Direction", updated: "Mis à jour", access: "Accès", locked: "Restreint pour ce rôle", home: "Accueil", docs: "Documents" },
} as const;

type Role = "admin" | "agent" | "guest";
type Access = "Public" | "Interne" | "Restreint";
type Version = { v: number; author: string; date: string; note: string };
type Doc = { id: string; title: string; dept: string; owner: string; tag: string; updated: string; access: Access; versions: Version[] };

const RANK: Record<Access, number> = { Public: 0, Interne: 1, Restreint: 2 };
const CLEARANCE: Record<Role, number> = { guest: 0, agent: 1, admin: 2 };
const BADGE: Record<Access, string> = { Public: "bg-[#28A745] text-white", Interne: "bg-[#FFC107] text-[#212529]", Restreint: "bg-[#DC3545] text-white" };

const v = (n: number, author: string, date: string, note: string): Version => ({ v: n, author, date, note });
const DOCS: Doc[] = [
  { id: "DOC-0142", title: "Procédure sauvegarde Oracle v3", dept: "DSI · Production", owner: "R. Andrianaivo", tag: "Runbook", updated: "2021-02-18", access: "Interne", versions: [v(1, "R. Andrianaivo", "2019-06-02", "Création"), v(2, "R. Andrianaivo", "2020-03-11", "Ajout RMAN incrémental"), v(3, "H. Rakoto", "2021-02-18", "Rétention 30 jours")] },
  { id: "DOC-0097", title: "Charte sécurité SI", dept: "DSI · Sécurité", owner: "M. Razafy", tag: "Politique", updated: "2021-01-05", access: "Public", versions: [v(1, "M. Razafy", "2018-09-14", "Version initiale"), v(2, "M. Razafy", "2021-01-05", "MFA obligatoire")] },
  { id: "DOC-0210", title: "Runbook incident réseau", dept: "DSI · Réseau", owner: "T. Rabe", tag: "Runbook", updated: "2021-03-02", access: "Interne", versions: [v(1, "T. Rabe", "2020-11-20", "Création"), v(2, "T. Rabe", "2021-03-02", "Escalade niveau 3")] },
  { id: "DOC-0031", title: "Plan de reprise d'activité", dept: "DSI · Gouvernance", owner: "S. Ramanantsoa", tag: "PRA", updated: "2020-12-10", access: "Restreint", versions: [v(1, "S. Ramanantsoa", "2017-05-30", "Création"), v(2, "S. Ramanantsoa", "2019-04-22", "Site de secours Toamasina"), v(3, "S. Ramanantsoa", "2020-12-10", "Tests semestriels"), v(4, "H. Rakoto", "2021-01-19", "Annexe contacts")] },
  { id: "DOC-0188", title: "Guide déploiement CodeIgniter", dept: "DSI · Études", owner: "S. Andriamihaja", tag: "Guide", updated: "2021-02-26", access: "Interne", versions: [v(1, "S. Andriamihaja", "2021-01-12", "Création"), v(2, "S. Andriamihaja", "2021-02-26", "Environnements de recette")] },
  { id: "DOC-0075", title: "Matrice des habilitations", dept: "DSI · Sécurité", owner: "M. Razafy", tag: "Référentiel", updated: "2021-02-01", access: "Restreint", versions: [v(1, "M. Razafy", "2020-02-01", "Création"), v(2, "M. Razafy", "2021-02-01", "Revue annuelle")] },
  { id: "DOC-0119", title: "Procédure création compte AD", dept: "DSI · Support", owner: "L. Randria", tag: "Procédure", updated: "2020-10-08", access: "Interne", versions: [v(1, "L. Randria", "2020-10-08", "Création")] },
  { id: "DOC-0203", title: "Catalogue des services SI", dept: "DSI · Gouvernance", owner: "S. Ramanantsoa", tag: "Catalogue", updated: "2021-01-28", access: "Public", versions: [v(1, "S. Ramanantsoa", "2020-06-15", "Création"), v(2, "S. Ramanantsoa", "2021-01-28", "Ajout téléphonie IP")] },
  { id: "DOC-0056", title: "Politique de mots de passe", dept: "DSI · Sécurité", owner: "M. Razafy", tag: "Politique", updated: "2020-09-21", access: "Public", versions: [v(1, "M. Razafy", "2019-01-08", "Création"), v(2, "M. Razafy", "2020-09-21", "12 caractères minimum")] },
  { id: "DOC-0164", title: "Architecture réseau agences", dept: "DSI · Réseau", owner: "T. Rabe", tag: "Schéma", updated: "2020-11-30", access: "Restreint", versions: [v(1, "T. Rabe", "2020-11-30", "Création")] },
  { id: "DOC-0091", title: "Procédure astreinte weekend", dept: "DSI · Production", owner: "H. Rakoto", tag: "Procédure", updated: "2021-02-08", access: "Interne", versions: [v(1, "H. Rakoto", "2020-04-03", "Création"), v(2, "H. Rakoto", "2021-02-08", "Rotation trimestrielle")] },
  { id: "DOC-0137", title: "Inventaire licences logicielles", dept: "DSI · Achats", owner: "N. Rasoanaivo", tag: "Inventaire", updated: "2021-03-01", access: "Interne", versions: [v(1, "N. Rasoanaivo", "2021-03-01", "Création")] },
];

const fold = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function Mark({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const f = fold(text);
  const i = f.indexOf(fold(q));
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-[#FFF3CD] px-0.5 text-[#212529]">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

export default function DocsDemo({ locale, compact }: DemoProps) {
  const t = COPY[locale];
  const [q, setQ] = useState("");
  const [role, setRole] = useState<Role>("agent");
  const [openId, setOpenId] = useState<string | null>(null);
  const [current, setCurrent] = useState<Record<string, number>>({});

  const results = useMemo(() => {
    const tokens = fold(q.trim()).split(/\s+/).filter(Boolean);
    return DOCS.filter((d) => tokens.every((tk) => fold(`${d.title} ${d.dept} ${d.owner} ${d.tag} ${d.id}`).includes(tk)));
  }, [q]);

  const canSee = (d: Doc) => CLEARANCE[role] >= RANK[d.access];
  const open = openId ? DOCS.find((d) => d.id === openId) ?? null : null;
  const visibleOpen = open && canSee(open) ? open : null;
  const cur = (d: Doc) => current[d.id] ?? d.versions.length;

  const list = (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-2 p-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search} aria-label={t.search} className="h-[38px] w-full rounded-[4px] border border-[#CED4DA] bg-white px-3 text-[14px] text-[#495057] outline-none focus:border-[#80BDFF] focus:shadow-[0_0_0_3px_rgba(0,123,255,0.25)]" />
        <div className="flex shrink-0 overflow-hidden rounded-[4px] border border-[#007BFF]" role="group" aria-label={t.viewAs}>
          {(["admin", "agent", "guest"] as Role[]).map((r) => (
            <button key={r} type="button" onClick={() => setRole(r)} className={`px-2.5 py-[7px] text-[12px] font-medium capitalize ${role === r ? "bg-[#007BFF] text-white" : "bg-white text-[#007BFF] hover:bg-[#E9F2FF]"}`}>{r}</button>
          ))}
        </div>
      </div>
      <p className="px-3 pb-2 text-[12px] text-[#6C757D]">{results.length} {t.count}</p>
      <div className="min-h-0 flex-1 overflow-auto border-t border-[#DEE2E6]">
        {results.length === 0 ? (
          <p className="p-4 text-[14px] text-[#6C757D]">{t.empty}</p>
        ) : (
          <table className="w-full text-[13px] text-[#212529]">
            <tbody>
              {results.map((d, i) => {
                const ok = canSee(d);
                return (
                  <tr key={d.id} className={`${i % 2 ? "bg-[#F2F2F2]" : "bg-white"} ${ok ? "cursor-pointer hover:bg-[#E9F2FF]" : "opacity-50"}`} onClick={() => ok && setOpenId(d.id)} title={ok ? undefined : t.locked}>
                    <td className="px-3 py-2 font-mono text-[11px] text-[#6C757D]">{d.id}</td>
                    <td className="px-2 py-2 font-medium">
                      <Mark text={d.title} q={q} />
                      <span className="block text-[11px] font-normal text-[#6C757D]"><Mark text={d.dept} q={q} /> · <Mark text={d.owner} q={q} /></span>
                    </td>
                    <td className="px-2 py-2 text-right"><span className={`inline-block rounded-[10px] px-2 py-0.5 text-[10px] font-bold ${BADGE[d.access]}`}>{d.access}</span></td>
                    {!compact && <td className="px-3 py-2 text-right font-mono text-[11px] text-[#6C757D]">v{cur(d)} · {d.updated}</td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const detail = visibleOpen && (
    <motion.div key={visibleOpen.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8, transition: { duration: 0.12 } }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }} className="flex min-h-0 flex-1 flex-col overflow-auto bg-white p-3">
      {compact && (
        <button type="button" onClick={() => setOpenId(null)} className="mb-2 self-start rounded-[4px] border border-[#6C757D] px-2.5 py-1 text-[12px] text-[#6C757D] hover:bg-[#6C757D] hover:text-white">← {t.back}</button>
      )}
      <div className="rounded-[4px] border border-[#DEE2E6] bg-white">
        <div className="border-b border-[#DEE2E6] bg-[#F8F9FA] px-3 py-2">
          <p className="text-[15px] font-semibold text-[#212529]">{visibleOpen.title}</p>
          <p className="font-mono text-[11px] text-[#6C757D]">{visibleOpen.id} · {visibleOpen.tag}</p>
        </div>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-1 px-3 py-2 text-[12px]">
          <dt className="text-[#6C757D]">{t.dept}</dt><dd className="text-[#212529]">{visibleOpen.dept}</dd>
          <dt className="text-[#6C757D]">{t.owner}</dt><dd className="text-[#212529]">{visibleOpen.owner}</dd>
          <dt className="text-[#6C757D]">{t.updated}</dt><dd className="text-[#212529]">{visibleOpen.updated}</dd>
          <dt className="text-[#6C757D]">{t.access}</dt><dd><span className={`inline-block rounded-[10px] px-2 py-0.5 text-[10px] font-bold ${BADGE[visibleOpen.access]}`}>{visibleOpen.access}</span></dd>
        </dl>
      </div>
      <p className="mb-1 mt-3 text-[12px] font-semibold uppercase tracking-wide text-[#6C757D]">{t.versions}</p>
      <ul className="rounded-[4px] border border-[#DEE2E6]">
        {[...visibleOpen.versions].reverse().map((ver) => {
          const isCur = cur(visibleOpen) === ver.v;
          return (
            <li key={ver.v} className="flex items-center gap-3 border-b border-[#DEE2E6] px-3 py-2 text-[12px] last:border-0">
              <span className={`w-7 shrink-0 rounded-[3px] px-1 text-center font-mono text-[11px] ${isCur ? "bg-[#007BFF] text-white" : "bg-[#E9ECEF] text-[#495057]"}`}>v{ver.v}</span>
              <span className="min-w-0 flex-1 truncate text-[#212529]">{ver.note}<span className="text-[#6C757D]"> · {ver.author} · {ver.date}</span></span>
              {isCur ? (
                <span className="text-[11px] text-[#28A745]">{t.current}</span>
              ) : (
                <button type="button" onClick={() => setCurrent((c) => ({ ...c, [visibleOpen.id]: ver.v }))} className="rounded-[4px] border border-[#007BFF] px-2 py-0.5 text-[11px] text-[#007BFF] hover:bg-[#007BFF] hover:text-white">{t.restore}</button>
              )}
            </li>
          );
        })}
      </ul>
    </motion.div>
  );

  return (
    <div className="flex h-full w-full flex-col bg-[#F8F9FA] font-[system-ui] text-[#212529]">
      <header className="flex h-10 shrink-0 items-center gap-4 bg-[#006F3B] px-3 text-white">
        <span className="text-[15px] font-bold">WikIT</span>
        <nav className="hidden gap-3 text-[12px] text-white/85 sm:flex">
          <span className="font-medium text-white">{t.docs}</span><span>Catégories</span><span>Utilisateurs</span>
        </nav>
        <span className="ml-auto text-[11px] text-white/85">TELMA · DSI</span>
      </header>
      <nav className="px-3 pt-2 text-[12px] text-[#6C757D]">{t.home} <span className="px-1">/</span> <span className="text-[#212529]">{t.docs}</span></nav>
      <div className={`flex min-h-0 flex-1 ${compact ? "" : "lg:flex-row"} flex-col`}>
        <AnimatePresence mode="wait" initial={false}>
          {compact ? (visibleOpen ? detail : <motion.div key="list" className="flex min-h-0 flex-1 flex-col">{list}</motion.div>) : (
            <>
              <div className={`flex min-h-0 flex-col ${visibleOpen ? "lg:w-1/2 lg:border-r lg:border-[#DEE2E6]" : "flex-1"}`}>{list}</div>
              {detail}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
