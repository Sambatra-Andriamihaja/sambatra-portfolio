import React from "react";
import { Metadata } from "next";

import ProjectsPage from "@/components/projects/ProjectsPage";

export const metadata: Metadata = {
  title: "Sambatra | Projects",
  description: "Sambatra's projects",
};

export default function Projects() {
  return <ProjectsPage />;
}
