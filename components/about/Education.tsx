/* eslint-disable @next/next/no-img-element */
"use client";

import React, { forwardRef, useState } from "react";
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
import AnimatedText from "../sub/AnimatedText";
import { Diploma, InfoDiploma } from "./Diploma";
import { Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import masterDiploma from "@/public/images/educations/diplomas/master.png";
import licenceDiploma from "@/public/images/educations/diplomas/licence.png";
import bacDiploma from "@/public/images/educations/diplomas/bac.png";

interface IEducationVerticalTimelineElement {
  education: IEducations;
  visible: boolean;
  t: (
    key: string,
    values?: TranslationValues | undefined,
    formats?: Partial<Formats> | undefined
  ) => string;
  onOpen: () => void;
}

const EducationVerticalTimelineElement = forwardRef<
  HTMLDivElement,
  IEducationVerticalTimelineElement
>(({ education, visible, t, onOpen }, ref) => {
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
        <Button
          onPress={onOpen}
          startContent={
            <FontAwesomeIcon
              icon={faFile}
              style={{ marginRight: "0.5rem" }}
              color="#ffffff"
            />
          }
        >
          See
        </Button>
      </VerticalTimelineElement>
    </div>
  );
});

EducationVerticalTimelineElement.displayName =
  "EducationVerticalTimelineElement";

const Education = forwardRef<HTMLElement, {}>((props, ref) => {
  const t = useTranslations("About.Educations");

  const options = {
    triggerOnce: true,
  };
  const [estiaRef, estiaInView] = useInView(options);
  const [ituRef, ituInView] = useInView(options);
  const [stGabRef, stGabInView] = useInView(options);

  const [isDiplomaOpen, setIsDiplomaOpen] = useState<boolean>(false);
  const [isEstiaDiplomaOpen, setIsEstiaDiplomaOpen] = useState<boolean>(false);
  const [isItuDiplomaOpen, setIsItuDiplomaOpen] = useState<boolean>(false);
  const [isStGabDiplomaOpen, setIsStGabDiplomaOpen] = useState<boolean>(false);

  const [currentDiplomaView, setCurrentDiplomaView] = useState<
    InfoDiploma | undefined
  >(undefined);

  const estiaDiploma: InfoDiploma = {
    title: "",
    diploma: masterDiploma,
  };

  const ituDiploma: InfoDiploma = {
    title: "",
    diploma: licenceDiploma,
  };

  const stGabDiploma: InfoDiploma = {
    title: "",
    diploma: bacDiploma,
  };

  const onOpenEstiaDiploma = () => {
    setCurrentDiplomaView(estiaDiploma);
    setIsEstiaDiplomaOpen(true);
  };
  const onOpenItuDiploma = () => {
    setCurrentDiplomaView(ituDiploma);
    setIsItuDiplomaOpen(true);
  };
  const onOpenStGabDiploma = () => {
    setCurrentDiplomaView(stGabDiploma);
    setIsStGabDiplomaOpen(true);
  };
  const onClose = () => {
    setCurrentDiplomaView(undefined);
    if (isEstiaDiplomaOpen) setIsEstiaDiplomaOpen(false);
    if (isItuDiplomaOpen) setIsItuDiplomaOpen(false);
    if (isStGabDiplomaOpen) setIsStGabDiplomaOpen(false);
  };

  return (
    <section id="education" ref={ref} className="pt-[10rem] mb-32">
      <AnimatedText
        className="!text-2xl !text-left xl:!text-6xl lg:!text-5xl md:!text-4xl sm:!text-3xl flex items-center justify-center mb-4 z-10"
        text={t("header")}
      />
      <Diploma
        isOpen={isEstiaDiplomaOpen || isItuDiplomaOpen || isStGabDiplomaOpen}
        onClose={onClose}
        infoDiploma={currentDiplomaView!}
      />
      <div className="mt-12 flex">
        <VerticalTimeline>
          <EducationVerticalTimelineElement
            education={ESTIA}
            ref={estiaRef}
            visible={estiaInView}
            t={t}
            onOpen={onOpenEstiaDiploma}
          />
          <EducationVerticalTimelineElement
            education={ITU}
            ref={ituRef}
            visible={ituInView}
            t={t}
            onOpen={onOpenItuDiploma}
          />
          <EducationVerticalTimelineElement
            education={STGAB}
            ref={stGabRef}
            visible={stGabInView}
            t={t}
            onOpen={onOpenStGabDiploma}
          />
        </VerticalTimeline>
      </div>
    </section>
  );
});

Education.displayName = "Education";

export default Education;
