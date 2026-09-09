"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";
import { EXPERIENCES, type ITimelineNode } from "@/constants/experiences";
import { EDUCATIONS } from "@/constants/educations";
import { SectionHead } from "@/components/flow/section-head";
import { DiplomaViewer } from "@/components/about/diploma-viewer";
import { ArrowUpRight, GraduationCap, MapPin } from "@/components/ui/icon";

type Tab = "experience" | "education";

/**
 * Module 05 — history. The career as an execution log, the way Make lists
 * runs: status, when, where, what ran, how many operations. Rows expand.
 */
export function History({ standalone = false }: { standalone?: boolean }) {
  const t = useTranslations("About");
  const th = useTranslations("History");
  const [tab, setTab] = useState<Tab>("experience");
  const [open, setOpen] = useState<string | null>(EXPERIENCES[0].key);
  const [diploma, setDiploma] = useState<{ src: string; label: string } | null>(null);

  const rows = tab === "experience" ? EXPERIENCES : EDUCATIONS;
  const ns = tab === "experience" ? "Experiences" : "Educations";

  return (
    <section
      id={standalone ? "timeline" : "history"}
      data-module={standalone ? "03" : "05"}
      data-module-name="history"
      className="mx-auto max-w-frame px-gutter pt-band"
    >
      <SectionHead
        title={th.rich("title", { em: (c) => <span className="text-accent">{c}</span> })}
        lede={th("subtitle")}
        aside={
          <div role="tablist" aria-label={th("tabs")} className="flex rounded-ctl bg-ink/[0.05] p-1 ring-1 ring-inset ring-line">
            {(["experience", "education"] as Tab[]).map((k) => (
              <button
                key={k}
                role="tab"
                aria-selected={tab === k}
                onClick={() => {
                  setTab(k);
                  setOpen((k === "experience" ? EXPERIENCES : EDUCATIONS)[0].key);
                }}
                className={cn(
                  "relative rounded-ctl px-4 py-1.5 text-[0.8rem] font-medium transition-colors",
                  tab === k ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {tab === k && (
                  <motion.span
                    layoutId="history-tab"
                    className="absolute inset-0 -z-10 rounded-ctl bg-surface shadow-card"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {t(`Timeline.${k}`)}
              </button>
            ))}
          </div>
        }
      />

      <div className="card overflow-hidden">
        {/* header row */}
        <div className="hidden grid-cols-[28px_150px_minmax(0,1fr)_200px_90px] gap-4 border-b border-line px-5 py-2.5 text-[0.72rem] text-faint md:grid">
          <span />
          <span>{th("col.when")}</span>
          <span>{th("col.what")}</span>
          <span>{th("col.where")}</span>
          <span className="text-right">{th("col.ops")}</span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: EASE.expo }}
            className="divide-y divide-line"
          >
            {rows.map((row) => (
              <Run
                key={row.key}
                row={row}
                ns={ns}
                open={open === row.key}
                onToggle={() => setOpen((o) => (o === row.key ? null : row.key))}
                onDiploma={
                  row.diploma
                    ? () => setDiploma({ src: row.diploma!, label: t(`${ns}.${row.key}.educationLevel`) })
                    : undefined
                }
              />
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>

      <DiplomaViewer
        open={Boolean(diploma)}
        src={diploma?.src}
        label={diploma?.label}
        onClose={() => setDiploma(null)}
      />
    </section>
  );
}

function Run({
  row,
  ns,
  open,
  onToggle,
  onDiploma,
}: {
  row: ITimelineNode;
  ns: "Experiences" | "Educations";
  open: boolean;
  onToggle: () => void;
  onDiploma?: () => void;
}) {
  const t = useTranslations(`About.${ns}`);
  const th = useTranslations("History");
  const isEdu = ns === "Educations";
  const heading = isEdu ? t(`${row.key}.educationLevel`) : t(`${row.key}.experienceTitle`);
  const date = t(`${row.key}.date`);
  const points = isEdu
    ? [t(`${row.key}.point`)]
    : Array.from({ length: row.points }, (_, i) => t(`${row.key}.points.${i}`));

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          "grid w-full grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-ink/[0.03] md:grid-cols-[28px_150px_minmax(0,1fr)_200px_90px]",
          open && "bg-ink/[0.025]",
        )}
      >
        <span className="grid h-7 w-7 place-items-center overflow-hidden rounded-full bg-surface ring-1 ring-line">
          {row.logo ? (
            <Image src={row.logo} alt="" width={20} height={20} className="h-5 w-5 object-contain" />
          ) : (
            <GraduationCap className="text-[14px] text-muted" />
          )}
        </span>
        <span className="order-last col-span-3 text-[0.78rem] text-muted tnum md:order-none md:col-span-1">
          {date}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[0.95rem] font-semibold text-ink">{heading}</span>
          <span className="block truncate text-xs text-muted">
            <span style={{ color: row.color }}>{row.org}</span>
            {row.via && <span className="text-faint"> · {t("via")} {row.via}</span>}
          </span>
        </span>
        <span className="hidden items-center gap-1.5 truncate text-xs text-muted md:flex">
          <MapPin className="text-[12px] text-faint" /> {row.location}
        </span>
        <span className="text-right text-xs text-muted tnum">
          {row.stack?.length ?? points.length}
          <span className="text-faint"> {th("ops")}</span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE.expo }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-5 px-5 pb-6 pt-1 md:grid-cols-[28px_minmax(0,1fr)] md:pl-[3.25rem]">
              <span className="hidden md:block" />
              <div className="flex flex-col gap-4">
                <ul className="flex flex-col gap-2 text-sm leading-relaxed text-muted">
                  {points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span className="mt-[0.55rem] h-px w-4 shrink-0 bg-accent" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-center gap-1.5">
                  {row.stack?.map((s) => (
                    <span key={s} className="pill !py-0.5 !text-[0.68rem]">{s}</span>
                  ))}
                  {row.url && (
                    <a href={row.url} target="_blank" rel="noreferrer noopener" className="pill hover:text-ink">
                      {row.org} <ArrowUpRight className="text-[12px]" />
                    </a>
                  )}
                  {onDiploma && (
                    <button type="button" onClick={onDiploma} className="pill pill-accent">
                      {t("viewDiploma")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
