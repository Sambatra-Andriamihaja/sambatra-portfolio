"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PROFILE, SOCIALS } from "@/constants/profile";
import { SectionHead } from "@/components/flow/section-head";
import { useHireMe } from "@/components/layout/hire-context";
import { ArrowUpRight, Check, Copy, Download, Plus, Send } from "@/components/ui/icon";

/**
 * Contact. The last module in the flow is an empty slot — "add a module".
 * Clicking it opens the contact sheet.
 */
export function Contact() {
  const t = useTranslations("Contact");
  const hire = useHireMe();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* ignore */
    }
  };

  return (
    <section
      id="contact"
      data-module="06"
      data-module-name="contact"
      className="mx-auto max-w-frame px-gutter pt-band"
    >
      <SectionHead
        title={t.rich("title", { em: (c) => <span className="text-accent">{c}</span> })}
        lede={t("subtitle")}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <button
          type="button"
          onClick={hire.open}
          className="group relative flex min-h-[260px] flex-col items-center justify-center gap-4 overflow-hidden rounded-card border border-dashed border-edge bg-surface/40 p-10 text-center transition-colors duration-200 hover:border-accent hover:bg-accent/[0.04]"
        >
          <span className="dotgrid absolute inset-0 opacity-50" aria-hidden />
          <span className="relative grid h-14 w-14 place-items-center rounded-full bg-surface text-muted ring-1 ring-edge transition-[transform,color] duration-200 ease-out group-hover:scale-105 group-hover:text-accent">
            <Plus className="text-[24px]" />
          </span>
          <span className="relative">
            <span className="block font-display text-[1.3rem] font-semibold tracking-crush text-ink">{t("add")}</span>
            <span className="caption mt-1 block">{t("addHint")}</span>
          </span>
        </button>

        <aside className="card flex flex-col gap-4 p-6">
          <p className="text-sm font-semibold text-ink">{t("details")}</p>
          <div className="flex items-center justify-between gap-3 rounded-field bg-inset px-3 py-2.5 font-mono text-[0.8rem] text-ink">
            <span className="truncate">{PROFILE.email}</span>
            <button type="button" onClick={copy} className="btn-icon !h-7 !w-7" aria-label={t("copy")}>
              {copied ? <Check className="text-[14px] text-ok" /> : <Copy className="text-[14px]" />}
            </button>
          </div>
          <div className="flex flex-col">
            {SOCIALS.filter((s) => s.key !== "email").map((s) => (
              <a
                key={s.key}
                href={s.url}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center justify-between rounded-field px-3 py-2 text-sm text-muted transition-colors duration-150 hover:bg-ink/[0.04] hover:text-ink"
              >
                <span>{s.label}</span>
                <span className="flex items-center gap-2 text-[0.75rem] text-faint">
                  {s.handle} <ArrowUpRight className="text-[13px]" />
                </span>
              </a>
            ))}
          </div>
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            <button type="button" onClick={hire.open} className="btn btn-accent btn-sm">
              <Send className="text-[14px]" /> {t("write")}
            </button>
            <a href={PROFILE.cv} download className="btn btn-ghost btn-sm">
              <Download className="text-[14px]" /> CV
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
