"use client";

import React, { useState } from "react";

import Layout from "@/components/layout/Layout";
import AnimatedText from "@/components/sub/AnimatedText";
import ProjectCardList from "@/components/projects/ProjectCardList";
import ProjectCategory from "./ProjectCategory";
import projects, {
  ALL,
  IProject,
  TProductCategory,
} from "@/constants/projects";

const ProjectsPage = () => {
  const [projectList, setProjectList] = useState<IProject[]>(projects);

  //Filter Function
  const filter = (category: TProductCategory) => {
    if (category === ALL) {
      setProjectList(projects);
      return;
    }

    const filteredData = projects.filter(
      (project) => project.category === category
    );
    setProjectList(filteredData);
  };

  return (
    <main className="w-full mb-16 flex flex-col items-center justify-center">
      <Layout className="pt-16 px-28">
        <AnimatedText
          text="Imagination Trumps Knowledge!"
          className="!text-2xl xl:!text-6xl lg:!text-5xl md:!text-4xl sm:!text-3xl
          py-10 xl:py-0"
        />
        <ProjectCategory filter={filter} />
        <ProjectCardList overwriteProjects={projectList} />
      </Layout>
    </main>
  );
};

export default ProjectsPage;
