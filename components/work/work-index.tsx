"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { SectionHead } from "@/components/flow/section-head";
import { FilterBar } from "./filter-bar";
import { ProjectWindow } from "./project-window";
import { ProjectDetail } from "./project-detail";
import { useProjectFilter } from "@/hooks/use-project-filter";
import {
  ALL,
  KW,
  orderedProjects,
  type IProject,
  type TProjectCategory,
} from "@/constants/projects";
import { EASE } from "@/lib/motion";

/** The projects page: every build as a running window, filterable. */
export function WorkIndex({ locale }: { locale: "en" | "fr" }) {
  const t = useTranslations("Projects");
  const router = useRouter();
  const params = useSearchParams();

  const [category, setCategory] = useState<TProjectCategory>(ALL);
  const [keyword, setKeyword] = useState(params.get(KW) ?? "");
  const [open, setOpen] = useState<IProject | null>(null);

  const results = useProjectFilter(orderedProjects, category, keyword);

  const initial = useRef(true);
  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      return;
    }
    const id = setTimeout(() => {
      const next = new URLSearchParams();
      if (keyword.trim()) next.set(KW, keyword.trim());
      const qs = next.toString();
      router.replace(qs ? `?${qs}` : "?", { scroll: false });
    }, 350);
    return () => clearTimeout(id);
  }, [keyword, router]);

  // A deep link with a slug keyword opens that project straight away.
  useEffect(() => {
    const kw = params.get(KW);
    if (!kw) return;
    const hit = orderedProjects.find((p) => p.slug === kw);
    if (hit) setOpen(hit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = useCallback(() => {
    setCategory(ALL);
    setKeyword("");
  }, []);

  return (
    <section
      id="work"
      data-module="01"
      data-module-name="work"
      className="mx-auto max-w-frame px-gutter pb-band pt-[calc(var(--nav-h)+3.5rem)]"
    >
      <SectionHead
        as="h1"
        title={t.rich("title", { em: (c) => <span className="text-accent">{c}</span> })}
        lede={t("subtitle")}
      />

      <FilterBar
        category={category}
        onCategory={setCategory}
        keyword={keyword}
        onKeyword={setKeyword}
        count={results.length}
      />

      <>
        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {results.map((p) => (
              <ProjectWindow key={p.slug} project={p} locale={locale} onOpen={setOpen} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE.expo }}
            className="dotgrid grid place-items-center rounded-card border border-dashed border-edge py-24 text-center"
          >
            <div className="max-w-sm px-6">
              <p className="font-display text-xl font-semibold tracking-crush text-ink">
                {t("empty.title")}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t("empty.body")}</p>
              <button type="button" onClick={reset} className="btn btn-ghost btn-sm mt-6">
                {t("category.all")}
              </button>
            </div>
          </motion.div>
        )}

        <ProjectDetail project={open} locale={locale} onClose={() => setOpen(null)} />
      </>
    </section>
  );
}
