"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";

import Layout from "@/components/layout/Layout";
import AnimatedText from "@/components/sub/AnimatedText";
import ProjectCardList from "@/components/projects/ProjectCardList";
import ProjectCategory from "./ProjectCategory";
import projects, { IProject, KW, TProductCategory } from "@/constants/projects";
import { SearchInput } from "./SearchInput";
import { useSearchParams } from "next/navigation";
import { getFilteredData, getSearchedData } from "@/hooks/useFilterProjects";
import ParticlesBackground from "../sub/ParticlesBackground";

const ProjectsPage = () => {
  const t = useTranslations("Projects");

  const [projectList, setProjectList] = useState<IProject[]>(projects);
  const [filteredProjectList, setFilteredProjectList] =
    useState<IProject[]>(projectList);

  //Filter Function
  const filter = (category: TProductCategory) => {
    const filteredProjects = getFilteredData(category, projects);
    setFilteredProjectList(filteredProjects);
    setProjectList(filteredProjects);
  };

  // Search Function
  const searchParams = useSearchParams();
  const keyWords = searchParams.get(KW)?.toLowerCase() ?? "";
  const search = () => {
    const searchedProjects = getSearchedData(keyWords, filteredProjectList);
    setProjectList(searchedProjects);
  };

  return (
    <main className="w-full flex flex-col items-center justify-center">
      <Layout className="!pt-1 px-28 bg-transparent">
        <ParticlesBackground />
        <AnimatedText
          text={t("header")}
          className="!text-2xl xl:!text-6xl lg:!text-5xl md:!text-4xl sm:!text-3xl
          py-10 xl:py-0 z-10"
        />
        <SearchInput keyWords={keyWords} search={search} />
        <ProjectCategory filter={filter} />
        <ProjectCardList overwriteProjects={projectList} />
      </Layout>
    </main>
  );
};

export default ProjectsPage;
