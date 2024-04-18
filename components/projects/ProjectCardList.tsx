import projects, { IProject } from "@/constants/projects";
import React from "react";
import ProjectCard from "./project-card/ProjectCard";

interface IProjectCardList {
  overwriteProjects?: IProject[];
}

const ProjectCardList = (props: IProjectCardList) => {
  const { overwriteProjects } = props;

  const projectsList = overwriteProjects ? overwriteProjects : projects;
  return (
    <div className="grid grid-cols-1 gap-8 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 items-start">
      {projectsList
        .slice()
        .reverse()
        .map((item) => {
          return (
            <ProjectCard
              key={item.id}
              project={item}
              isMobileCard={item.isMobile || false}
              isWebCard={item.isWeb || false}
              isBothMobileAndWebCard={item.isBothMobileAndWebCard || false}
              is1saCard={item.is1sa || false}
              isSpecialCard={item.isSpecial || false}
            />
          );
        })}
    </div>
  );
};

export default ProjectCardList;
