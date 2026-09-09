import { useMemo } from "react";
import type { IProject, TProjectCategory } from "@/constants/projects";
import { ALL } from "@/constants/projects";

const normalise = (v: string) =>
  v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/**
 * Search matches title (both locales), description, client, slug, year
 * and every tag name — so "elixir", "réunion" and "2024" all resolve.
 */
export function useProjectFilter(
  projects: IProject[],
  category: TProjectCategory,
  keyword: string,
) {
  return useMemo(() => {
    const kw = normalise(keyword.trim());

    return projects.filter((p) => {
      if (category !== ALL && p.category !== category) return false;
      if (!kw) return true;

      const haystack = normalise(
        [
          p.titleEn,
          p.titleFr,
          p.descEn,
          p.descFr,
          p.client ?? "",
          p.slug,
          p.year,
          p.category,
          ...p.tags.map((t) => t.name),
        ].join(" "),
      );

      return kw.split(/\s+/).every((token) => haystack.includes(token));
    });
  }, [projects, category, keyword]);
}
