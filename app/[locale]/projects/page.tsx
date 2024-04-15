import React from "react";
import { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import AnimatedText from "@/components/sub/AnimatedText";
import ProjectCardList from "@/components/projects/ProjectCardList";

export const metadata: Metadata = {
  title: "Sambatra | Projects",
  description: "Sambatra's projects",
};

const Projects = () => {
  return (
    <main className="w-full mb-16 flex flex-col items-center justify-center">
      <Layout className="pt-16 px-28">
        <AnimatedText text="Imagination Trumps Knowledge!" />
        <ProjectCardList />
      </Layout>
    </main>
  );
};

export default Projects;
