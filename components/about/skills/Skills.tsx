"use client";

import React from "react";

import { AiSkillData, DbSkillData, DevSkillData } from "@/data/skill";
import SkillDataProvider from "./SkillDataProvider";

const Skills = () => {
  return (
    <section
      id="skills"
      className="flex flex-col items-center justify-center gap-3 h-full relative overflow-hidden pb-80 py-20"
      style={{ transform: "scale(0.9" }}
    >
      <h2 className="font-bold text-8xl mt-64 w-full text-center">Skills</h2>

      <div className="flex flex-row justify-around flex-wrap mt-4 gap-5 items-center">
        {DevSkillData.map((image, index) => (
          <SkillDataProvider
            key={index}
            src={image.Image}
            name={image.skill_name}
            width={image.width}
            height={image.height}
            index={index}
          />
        ))}
      </div>

      <div className="flex flex-row justify-around flex-wrap mt-4 gap-5 items-center">
        {AiSkillData.map((image, index) => (
          <SkillDataProvider
            key={index}
            src={image.Image}
            name={image.skill_name}
            width={image.width}
            height={image.height}
            index={index}
          />
        ))}
      </div>
      <div className="flex flex-row justify-around flex-wrap mt-4 gap-5 items-center">
        {DbSkillData.map((image, index) => (
          <SkillDataProvider
            key={index}
            src={image.Image}
            name={image.skill_name}
            width={image.width}
            height={image.height}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default Skills;
