"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { CATEGORIES, type TProjectCategory } from "@/constants/projects";
import { Close, Search } from "@/components/ui/icon";

type Props = {
  category: TProjectCategory;
  onCategory: (c: TProjectCategory) => void;
  keyword: string;
  onKeyword: (k: string) => void;
  count: number;
};

/** Route filters + a search field, styled as a scenario toolbar. */
export function FilterBar({ category, onCategory, keyword, onKeyword, count }: Props) {
  const t = useTranslations("Projects");

  return (
    <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-center">
      <div
        role="tablist"
        aria-label="Category"
        className="no-scrollbar flex gap-1 overflow-x-auto rounded-ctl bg-ink/[0.05] p-1 ring-1 ring-inset ring-line"
      >
        {CATEGORIES.map((c) => {
          const on = c === category;
          return (
            <button
              key={c}
              role="tab"
              aria-selected={on}
              onClick={() => onCategory(c)}
              className={cn(
                "relative shrink-0 rounded-ctl px-3.5 py-1.5 text-[0.8rem] font-medium transition-colors",
                on ? "text-ink" : "text-muted hover:text-ink",
              )}
            >
              {on && (
                <motion.span
                  layoutId="cat-pill"
                  className="absolute inset-0 -z-10 rounded-ctl bg-surface shadow-card"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="mr-1 font-mono text-[0.6rem] text-accent">if:</span>
              {t(`category.${c}`)}
            </button>
          );
        })}
      </div>

      <label className="field flex flex-1 items-center gap-2 !py-2">
        <Search className="text-[15px] text-faint" />
        <input
          type="search"
          value={keyword}
          onChange={(e) => onKeyword(e.target.value)}
          placeholder={t("search")}
          aria-label={t("searchLabel")}
          className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-faint/80 [&::-webkit-search-cancel-button]:hidden"
        />
        {keyword && (
          <button type="button" onClick={() => onKeyword("")} aria-label={t("clear")} className="btn-icon !h-6 !w-6">
            <Close className="text-[13px]" />
          </button>
        )}
      </label>

      <span className="caption shrink-0 tnum">
        {t("count", { count })}
      </span>
    </div>
  );
}
