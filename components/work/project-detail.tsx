"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { EASE } from "@/lib/motion";
import type { IProject } from "@/constants/projects";
import { Window } from "@/components/os/window";
import { ProjectDemo } from "@/components/demos/registry";
import { ScenarioCanvas } from "@/components/scenario/scenario-canvas";
import { SCENARIOS } from "@/components/scenario/scenarios";
import { ArrowUpRight, Github } from "@/components/ui/icon";

type Props = {
  project: IProject | null;
  locale: "en" | "fr";
  onClose: () => void;
};

/**
 * The maximised window. Demo on top at full size, the case study beside it;
 * Brevo projects whose demo is not the canvas also get the Make scenario
 * behind the work.
 */
export function ProjectDetail({ project: p, locale, onClose }: Props) {
  const t = useTranslations("Projects");
  const tw = useTranslations("Workflow");
  const fr = locale === "fr";

  useEffect(() => {
    if (!p) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [p, onClose]);

  return (
    <AnimatePresence>
      {p && (
        <div className="fixed inset-0 z-[95] flex items-end justify-center sm:items-center sm:p-6">
          <motion.button
            type="button"
            aria-label={t("close")}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 cursor-default bg-canvas/75 backdrop-blur-md"
          />
          <motion.div
            role="dialog"
            aria-modal
            aria-label={fr ? p.titleFr : p.titleEn}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.5, ease: EASE.expo }}
            className="relative w-full max-w-6xl"
          >
            <Window
              title={fr ? p.titleFr : p.titleEn}
              icon={<span className="h-2.5 w-2.5 rounded-full bg-accent" />}
              onClose={onClose}
              className="max-h-[92dvh] sm:max-h-[88vh]"
              bodyClassName="overflow-y-auto"
              status={
                <>
                  <span className="text-muted">{fr ? p.tryFr : p.tryEn}</span>
                  <kbd className="kbd ml-auto">esc</kbd>
                </>
              }
            >
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
                {/* demo */}
                <div className="h-[420px] border-b border-line bg-canvas lg:h-[560px] lg:border-b-0 lg:border-r">
                  <ProjectDemo project={p} locale={locale} />
                </div>

                {/* case study */}
                <div className="flex flex-col gap-6 p-6 lg:p-8">
                  <div className="caption flex flex-wrap items-center gap-2">
                    <span className="pill pill-accent capitalize">{t(`category.${p.category}`)}</span>
                    <span className="tnum">
                      {p.year}
                      {p.ongoing && ` — ${t("ongoing")}`}
                    </span>
                    {p.client && <span>· {p.client}</span>}
                    {p.via && (
                      <span>
                        · {t("via")} {p.via}
                      </span>
                    )}
                  </div>

                  <h2 className="display text-display-sm text-ink">{fr ? p.titleFr : p.titleEn}</h2>
                  <p className="text-fluid-base leading-relaxed text-muted text-pretty">
                    {fr ? p.descFr : p.descEn}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noreferrer noopener" className="btn btn-accent btn-sm">
                        {t("viewLive")} <ArrowUpRight className="text-[14px]" />
                      </a>
                    )}
                    {p.source && (
                      <a href={p.source} target="_blank" rel="noreferrer noopener" className="btn btn-ghost btn-sm">
                        <Github className="text-[14px]" /> {t("viewCode")}
                      </a>
                    )}
                    {p.npm && (
                      <a href={`https://www.npmjs.com/package/${p.npm}`} target="_blank" rel="noreferrer noopener" className="btn btn-ghost btn-sm font-mono">
                        npm i {p.npm}
                      </a>
                    )}
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-semibold text-ink">{t("techStack")}</p>
                    <ul className="flex flex-wrap gap-1.5">
                      {p.tags.map((tag) => (
                        <li key={tag.name} className="pill !py-1 !pl-1.5">
                          <Image src={tag.img} alt="" width={14} height={14} className="h-3.5 w-3.5 object-contain" />
                          {tag.name}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {p.shot && (
                    <figure className="overflow-hidden rounded-card ring-1 ring-line">
                      <Image
                        src={p.shot}
                        alt=""
                        width={1200}
                        height={750}
                        className="h-auto w-full"
                        sizes="(min-width:1024px) 40vw, 100vw"
                      />
                      <figcaption className="caption border-t border-line bg-raise px-3 py-1.5">
                        {t("capture")}
                      </figcaption>
                    </figure>
                  )}
                </div>
              </div>

              {/* the Make scenario behind non-canvas Brevo work */}
              {p.scenario && p.demo !== "scenario" && (
                <div className="border-t border-line bg-raise p-4 sm:p-6">
                  <p className="mb-3 text-sm font-semibold text-ink">
                    Make <span className="font-normal text-muted">— {SCENARIOS[p.scenario].name}</span>
                  </p>
                  <div className="no-scrollbar overflow-x-auto rounded-card ring-1 ring-line">
                    <ScenarioCanvas
                      scenario={SCENARIOS[p.scenario]}
                      autoRun={false}
                      className="min-w-[680px]"
                      labels={{
                        run: tw("run"),
                        running: tw("running"),
                        reset: tw("reset"),
                        ops: tw("ops"),
                        schedule: tw("schedule"),
                        hint: tw("hint"),
                        errorHandler: tw("errorHandler"),
                      }}
                    />
                  </div>
                </div>
              )}
            </Window>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
