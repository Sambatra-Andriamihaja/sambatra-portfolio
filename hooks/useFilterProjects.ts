import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ALL, IProject, TProductCategory } from "@/constants/projects";

export function getFilteredData(
  category: TProductCategory,
  projectListToFilter: IProject[]
): IProject[] {
  if (category === ALL) {
    return projectListToFilter;
  }
  return projectListToFilter.filter((project) => project.category === category);
}

export function getSearchedData(
  keyWords: string | undefined,
  projectListToSearch: IProject[]
): IProject[] {
  if (!keyWords) {
    return projectListToSearch;
  }

  return projectListToSearch.filter((project) => {
    const lowerTitle = project.title.toLowerCase();
    const lowerDesc = project.desc.toLowerCase();

    return (
      lowerTitle.includes(keyWords) ||
      lowerDesc.includes(keyWords) ||
      project.tags.some((tag) => tag.name.toLowerCase().includes(keyWords))
    );
  });
}
