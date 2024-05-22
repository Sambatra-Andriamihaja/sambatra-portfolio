"use client";

import React, { forwardRef } from "react";

import { AiSkillData, DbSkillData, DevSkillData } from "@/constants/skill";
import SkillImage from "../sub/SkillImage";
import AnimatedText from "../sub/AnimatedText";
import { useTranslations } from "next-intl";
import SkillCard from "./SkillCard";
import { dev, ml, dba } from "@/data/lottieFiles";
import styles from "./Skills.module.css";

const Skills = forwardRef<HTMLElement, {}>((props, ref) => {
  const t = useTranslations("About.Skills");
  return (
    <section
      id="skills"
      ref={ref}
      className="flex flex-col items-center justify-center gap-3 h-full relative overflow-hidden"
      style={{ transform: "scale(0.9)" }}
    >
      <AnimatedText
        className="!text-2xl !text-left xl:!text-6xl lg:!text-5xl md:!text-4xl sm:!text-3xl flex items-center justify-center z-10 mt-64 mb-40"
        text={t("header")}
      />
      <div className={styles.gridContainer}>
        <SkillCard
          lottieSrc={dev}
          skills={DevSkillData}
          title={t("dev.title")}
          description={t("dev.description")}
        />
        <SkillCard
          lottieSrc={ml}
          lottieWidth="auto"
          lottieHeight="235px"
          lottieMarginTop="-105px"
          lottieMarginLeft="-45px"
          skills={AiSkillData}
          title={t("ai.title")}
          description={t("ai.description")}
        />
        <SkillCard
          lottieSrc={dba}
          skills={DbSkillData}
          title={t("dba.title")}
          description={t("dba.description")}
        />
      </div>
    </section>
  );
});

Skills.displayName = "Skills";

export default Skills;
