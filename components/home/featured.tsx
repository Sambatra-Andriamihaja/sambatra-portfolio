"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import projects, { type IProject } from "@/constants/projects";
import { SectionHead } from "@/components/flow/section-head";
import { ProjectWindow } from "@/components/work/project-window";
import { ProjectDetail } from "@/components/work/project-detail";
import { ArrowRight } from "@/components/ui/icon";

/** Four windows for the home page — an automation, an API, a product, a library. */
const HOME_SLUGS = ["brevo-sync", "enrichment-apis", "biogas-smart-app", "1sa"] as const;

/**
 * Work. A bento of running windows: the Make scenario spans two columns,
 * the rest sit beside it. Every one is playable in place.
 */
export function Featured({ locale }: { locale: "en" | "fr" }) {
  const t = useTranslations("Featured");
  const [open, setOpen] = useState<IProject | null>(null);
  const list = HOME_SLUGS.map((s) => projects.find((p) => p.slug === s)!).filter(Boolean);

  return (
    <section
      id="work"
      data-module="03"
      data-module-name="work"
      className="mx-auto max-w-frame px-gutter pt-band"
    >
      <SectionHead
        title={t.rich("title", { em: (c) => <span className="text-accent">{c}</span> })}
        lede={t("subtitle")}
        aside={
          <Link href={`/${locale}/projects`} className="btn btn-ghost">
            {t("cta")}
            <ArrowRight className="text-[15px]" />
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {list.map((p, i) => (
          <ProjectWindow
            key={p.slug}
            project={p}
            locale={locale}
            onOpen={setOpen}
            tall={i === 0 || i === 3}
            className={i === 0 || i === 3 ? "md:col-span-2" : undefined}
          />
        ))}
      </div>

      <ProjectDetail project={open} locale={locale} onClose={() => setOpen(null)} />
    </section>
  );
}
