"use client";

import {
  ALL,
  PERSONAL,
  PROFESSIONAL,
  STUDIES,
  TProductCategory,
} from "@/constants/projects";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface IProjectCategory {
  filter: (category: TProductCategory) => void;
}

const ProjectCategory = (props: IProjectCategory) => {
  const { filter } = props;

  const t = useTranslations("Projects.category");

  const [currentCategory, setCurrentCategory] = useState<TProductCategory>(ALL);

  const handleFilter = (category: TProductCategory) => {
    setCurrentCategory(category);
    filter(category);
  };

  const types: TProductCategory[] = [ALL, PROFESSIONAL, PERSONAL, STUDIES];

  return (
    <section
      id="project-type"
      className="w-full flex items-center justify-center"
    >
      <div
        className="inline-flex rounded-md shadow-sm justify-between items-center m-4 w-[30rem]"
        role="group"
      >
        {types.map((type, index) => (
          <button
            key={`${index}_${type}`}
            type="button"
            onClick={() => handleFilter(type)}
            className={`
            ${
              type === currentCategory
                ? "font-semibold rounded py-2 px-4 bg-offDark dark:bg-offLight text-light dark:text-dark"
                : "bg-transparent font-semibold rounded py-2 px-4 border hover:bg-offDark hover:dark:bg-offLight text-gray-800 dark:text-gray-300  hover:text-light hover:dark:text-dark  border-offDark dark:border-offLight hover:border-transparent "
            }`}
          >
            {t(`${type}`)}
          </button>
        ))}
      </div>
    </section>
  );
};

export default ProjectCategory;
