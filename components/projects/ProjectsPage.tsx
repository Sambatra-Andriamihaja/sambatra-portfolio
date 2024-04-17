"use client";

import React from "react";

import Layout from "@/components/layout/Layout";
import AnimatedText from "@/components/sub/AnimatedText";
import ProjectCardList from "@/components/projects/ProjectCardList";

const ProjectsPage = () => {
  return (
    <main className="w-full mb-16 flex flex-col items-center justify-center">
      <Layout className="pt-16 px-28">
        <AnimatedText text="Imagination Trumps Knowledge!" />
        <ProjectCardList />
      </Layout>
    </main>
  );
};

export default ProjectsPage;
