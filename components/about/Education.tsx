/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import Image from "next/image";
import { Formats, TranslationValues, useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";
import { IEducations, ESTIA, ITU, STGAB } from "@/constants/educations";
import useDarkMode from "@/hooks/useDarkMode";

interface IEducationVerticalTimelineElement {
  education: IEducations;
  visible: boolean;
  t: (
    key: string,
    values?: TranslationValues | undefined,
    formats?: Partial<Formats> | undefined
  ) => string;
}

const EducationVerticalTimelineElement = React.forwardRef<
  HTMLDivElement,
  IEducationVerticalTimelineElement
>(({ education, visible, t }, ref) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div ref={ref} className="vertical-timeline-element">
      <VerticalTimelineElement
        visible={visible}
        date={t(`${education.key}.date`)}
        iconStyle={{ background: education.iconBg }}
        icon={
          <div className="flex justify-center items-center w-full h-full">
            <img
              src={education.iconSrc}
              alt={education.schoolName}
              className="w-[60%] h-[60%] object-contain"
            />
          </div>
        }
        contentStyle={{
          background: isDarkMode ? "#060717" : "",
          borderBottom: "8px",
          borderStyle: "solid",
          borderBottomColor: education.borderBottomColor,
          boxShadow: "none",
        }}
      >
        <div>
          <h3 className="text-black dark:text-light text-xl font-poppins font-semibold">
            {t(`${education.key}.educationLevel`)}
          </h3>
          <a
            href={education.websiteLink}
            target="_blank"
            className="text-primary capitalize flex items-center"
          >
            {education.logoSrc && education.logoWidth ? (
              <div
                style={{
                  height: "auto",
                  width: `${education.logoWidth}px`,
                }}
              >
                <Image
                  src={education.logoSrc}
                  alt={education.schoolName}
                  width={education.logoWidth}
                  height={100}
                />
              </div>
            ) : (
              <p
                className="text-black-500 dark:text-light/55 font-medium"
                style={{ margin: 0, fontSize: "24px" }}
              >
                {education.schoolName}
              </p>
            )}
          </a>
        </div>
        <p className="text-black-500/50 font-normal text-sm my-5 ml-5 space-y-2">
          {t(`${education.key}.point`)}
        </p>
      </VerticalTimelineElement>
    </div>
  );
});

EducationVerticalTimelineElement.displayName =
  "EducationVerticalTimelineElement";

const Education = () => {
  const t = useTranslations("About.Educations");

  const options = {
    threshold: 0,
  };
  const [estiaRef, estiaInView] = useInView(options);
  const [ituRef, ituInView] = useInView(options);
  const [stGabRef, stGabInView] = useInView(options);

  return (
    <section id="education" className="mb-32">
      <h2 className="font-bold text-8xl mb-32 w-full text-center">Education</h2>
      <div className="mt-12 flex">
        <VerticalTimeline>
          <EducationVerticalTimelineElement
            education={ESTIA}
            ref={estiaRef}
            visible={estiaInView}
            t={t}
          />
          <EducationVerticalTimelineElement
            education={ITU}
            ref={ituRef}
            visible={ituInView}
            t={t}
          />
          <EducationVerticalTimelineElement
            education={STGAB}
            ref={stGabRef}
            visible={stGabInView}
            t={t}
          />
        </VerticalTimeline>
      </div>
    </section>
  );
};

export default Education;
