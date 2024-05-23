/* eslint-disable @next/next/no-img-element */
"use client";

import React, { forwardRef } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import Image from "next/image";
import { Formats, TranslationValues, useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";
import { SP, MGBI, ODC, TELMA, IExperiences } from "@/constants/experiences";
import useDarkMode from "@/hooks/useDarkMode";
import AnimatedText from "../sub/AnimatedText";

interface IExperienceVerticalTimelineElement {
  experience: IExperiences;
  visible: boolean;
  t: (
    key: string,
    values?: TranslationValues | undefined,
    formats?: Partial<Formats> | undefined
  ) => string;
}

const ExperienceVerticalTimelineElement = forwardRef<
  HTMLDivElement,
  IExperienceVerticalTimelineElement
>(({ experience, visible, t }, ref) => {
  const { isDarkMode } = useDarkMode();

  const renderPoints = () => {
    const points = [];
    for (let i = 0; i < experience.points; i++) {
      points.push(
        <li
          key={`point-${i}`}
          className="text-black-500/50 font-normal pl-1 text-sm"
        >
          {t(`${experience.key}.points.${i}`)}
        </li>
      );
    }
    return points;
  };

  return (
    <div ref={ref} className="vertical-timeline-element">
      <VerticalTimelineElement
        visible={visible}
        key={experience.companyName}
        date={t(`${experience.key}.date`)}
        iconStyle={{ background: experience.iconBg }}
        icon={
          <div className="flex justify-center items-center w-full h-full">
            <img
              src={experience.iconSrc}
              alt={experience.companyName}
              className="w-[60%] h-[60%] object-contain"
            />
          </div>
        }
        contentStyle={{
          background: isDarkMode ? "#25263f" : "",
          borderBottom: "8px",
          borderStyle: "solid",
          borderBottomColor: experience.borderBottomColor,
          boxShadow: "none",
        }}
        contentArrowStyle={{
          borderRight: isDarkMode ? "7px solid #25263f" : "",
        }}
      >
        <div>
          <h3 className="text-black dark:text-light text-xl font-poppins font-semibold">
            {t(`${experience.key}.experienceTitle`)}
          </h3>
          <a
            href={experience.websiteLink}
            target="_blank"
            className="text-primary capitalize flex items-center"
          >
            <div>
              <Image
                src={experience.logoSrc}
                alt={experience.companyName}
                width={experience.logoWidth}
                height={100}
              />
            </div>
          </a>
        </div>
        <ul className="my-5 list-disc ml-5 space-y-2">{renderPoints()}</ul>
      </VerticalTimelineElement>
    </div>
  );
});

ExperienceVerticalTimelineElement.displayName =
  "ExperienceVerticalTimelineElement";

const Experience = forwardRef<HTMLElement, {}>((props, ref) => {
  const t = useTranslations("About.Experiences");

  const { isDarkMode } = useDarkMode();

  const triggerOnceOtions = {
    triggerOnce: true,
  };
  const options = {
    threshold: 0,
  };
  const [spRef, spInView] = useInView(triggerOnceOtions);
  const [mgbiRef, mgbiInView] = useInView(triggerOnceOtions);
  const [odcRef, odcInView] = useInView(triggerOnceOtions);
  const [telmaRef, telmaInView] = useInView(triggerOnceOtions);

  return (
    <section id="experience" ref={ref} className="pt-[10rem] mb-64">
      <AnimatedText
        className="!text-2xl !text-left xl:!text-6xl lg:!text-5xl md:!text-4xl sm:!text-3xl flex items-center justify-center mb-4 z-10"
        text={t("header")}
      />
      <div className="mt-12 flex">
        <VerticalTimeline
          className={`${isDarkMode ? "vertical-timeline-dark-mode" : ""}`}
        >
          {/* SP */}
          <ExperienceVerticalTimelineElement
            ref={spRef}
            visible={spInView}
            experience={SP}
            t={t}
          />
          {/* MGBI */}
          <ExperienceVerticalTimelineElement
            ref={mgbiRef}
            visible={mgbiInView}
            experience={MGBI}
            t={t}
          />
          {/* ODC */}
          <ExperienceVerticalTimelineElement
            ref={odcRef}
            visible={odcInView}
            experience={ODC}
            t={t}
          />
          {/* TELMA */}
          <ExperienceVerticalTimelineElement
            ref={telmaRef}
            visible={telmaInView}
            experience={TELMA}
            t={t}
          />
        </VerticalTimeline>
      </div>
    </section>
  );
});

Experience.displayName = "Experience";

export default Experience;
