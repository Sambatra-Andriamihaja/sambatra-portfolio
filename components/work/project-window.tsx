"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { IProject } from "@/constants/projects";
import { Window } from "@/components/os/window";
import { ProjectDemo } from "@/components/demos/registry";
import { ArrowUpRight, Github, Maximize } from "@/components/ui/icon";

type Props = {
  project: IProject;
  locale: "en" | "fr";
  onOpen: (p: IProject) => void;
  className?: string;
  tall?: boolean;
};

/**
 * A project as a running window. The demo mounts only once the window
 * scrolls near the viewport, so a page of sixteen windows stays light. The
 * status bar carries the "what to try" hint; the caption below carries the
 * copy. Maximise (or the title) opens the detail window.
 */
export function ProjectWindow({ project: p, locale, onOpen, className, tall }: Props) {
  const t = useTranslations("Projects");
  const fr = locale === "fr";
  const title = fr ? p.titleFr : p.titleEn;
  const desc = fr ? p.descFr : p.descEn;
  const hint = fr ? p.tryFr : p.tryEn;

  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "320px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article ref={ref} className={cn("group flex min-w-0 flex-col gap-4", className)}>
      <Window
        title={title}
        icon={<span className="h-2.5 w-2.5 rounded-full bg-accent" />}
        onMaximize={() => onOpen(p)}
        bodyClassName={cn("bg-surface", tall ? "h-[420px]" : "h-[340px]")}
        status={
          <>
            <span className="truncate text-muted">{hint}</span>
            <button
              type="button"
              onClick={() => onOpen(p)}
              className="ml-auto inline-flex shrink-0 items-center gap-1 text-faint transition-colors duration-150 hover:text-ink"
            >
              <Maximize className="text-[12px]" /> {t("viewDetails")}
            </button>
          </>
        }
      >
        {near ? <ProjectDemo project={p} locale={locale} compact /> : null}
      </Window>

      <div className="flex flex-col gap-2 px-1">
        <div className="caption flex items-center gap-2">
          {p.client && <span className="text-muted">{p.client}</span>}
          {p.via && (
            <span>
              {t("via")} {p.via}
            </span>
          )}
          <span className="ml-auto tnum">
            {p.year}
            {p.ongoing && ` — ${t("ongoing")}`}
          </span>
        </div>
        <h3 className="font-display text-[1.15rem] font-semibold leading-snug tracking-crush text-ink">
          <button type="button" onClick={() => onOpen(p)} className="link-underline text-left">
            {title}
          </button>
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted">{desc}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          {p.tags.slice(0, 5).map((tag) => (
            <span key={tag.name} className="pill !py-1 !pl-1.5">
              <Image src={tag.img} alt="" width={14} height={14} className="h-3.5 w-3.5 object-contain" />
              {tag.name}
            </span>
          ))}
          {p.tags.length > 5 && <span className="pill">+{p.tags.length - 5}</span>}
          <span className="ml-auto flex items-center gap-1 text-faint">
            {p.source && (
              <a href={p.source} target="_blank" rel="noreferrer noopener" aria-label={t("viewCode")} className="btn-icon !h-7 !w-7">
                <Github className="text-[14px]" />
              </a>
            )}
            {p.live && (
              <a href={p.live} target="_blank" rel="noreferrer noopener" aria-label={t("viewLive")} className="btn-icon !h-7 !w-7">
                <ArrowUpRight className="text-[14px]" />
              </a>
            )}
          </span>
        </div>
      </div>
    </article>
  );
}
