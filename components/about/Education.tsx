/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";

const Education = () => {
  const t = useTranslations("About.Educations");

  const triggerOnceOtions = {
    triggerOnce: true,
  };
  const options = {
    threshold: 0,
  };
  const [estiaRef, estiaInView] = useInView(options);
  const [ituRef, ituInView] = useInView(options);
  const [stGabRef, stGabInView] = useInView(options);

  return (
    <div className="my-64">
      <h2 className="font-bold text-8xl mb-32 w-full text-center">Education</h2>
      <section className="mt-12 flex">
        <VerticalTimeline>
          {/* ESTIA */}
          <div ref={estiaRef} className="vertical-timeline-element">
            <VerticalTimelineElement
              visible={estiaInView}
              key={t("ESTIA.schoolName")}
              date={t("ESTIA.date")}
              iconStyle={{ background: "#ffffff" }}
              icon={
                <div className="flex justify-center items-center w-full h-full">
                  <img
                    src={"/images/educations/estia-favicon.png"}
                    alt={t("ESTIA.schoolName")}
                    className="w-[60%] h-[60%] object-contain"
                  />
                </div>
              }
              contentStyle={{
                borderBottom: "8px",
                borderStyle: "solid",
                borderBottomColor: "#52bbe6",
                boxShadow: "none",
              }}
            >
              <div>
                <h3 className="text-black text-xl font-poppins font-semibold">
                  {t("ESTIA.educationLevel")}
                </h3>
                <a
                  href={"https://www.estia.fr/"}
                  target="_blank"
                  className="text-primary capitalize flex items-center"
                >
                  <div style={{ height: "auto", width: `${150}px` }}>
                    <Image
                      src={"/images/educations/estia-logo.png"}
                      alt={t("ESTIA.schoolName")}
                      width={150}
                      height={100}
                    />
                  </div>
                </a>
              </div>
              <p className="my-5 ml-5 space-y-2">{t("ESTIA.point")}</p>
            </VerticalTimelineElement>
          </div>

          {/* ITU */}
          <div ref={ituRef} className="vertical-timeline-element">
            <VerticalTimelineElement
              visible={ituInView}
              key={t("ITU.schoolName")}
              date={t("ITU.date")}
              iconStyle={{ background: "#273d91" }}
              icon={
                <div className="flex justify-center items-center w-full h-full">
                  <img
                    src={"/images/educations/itu-favicon.png"}
                    alt={t("ITU.schoolName")}
                    className="w-[60%] h-[60%] object-contain"
                  />
                </div>
              }
              contentStyle={{
                borderBottom: "8px",
                borderStyle: "solid",
                borderBottomColor: "#bbcc08",
                boxShadow: "none",
              }}
            >
              <div>
                <h3 className="text-black text-xl font-poppins font-semibold">
                  {t("ITU.educationLevel")}
                </h3>
                <a
                  href={"https://www.ituniversity-mg.com/page/"}
                  target="_blank"
                  className="text-primary capitalize flex items-center"
                >
                  <div style={{ height: "auto", width: `${220}px` }}>
                    <Image
                      src={"/images/educations/itu-logo.png"}
                      alt={t("ITU.schoolName")}
                      width={220}
                      height={100}
                    />
                  </div>
                </a>
              </div>
              <p className="my-5 ml-5 space-y-2">{t("ITU.point")}</p>
            </VerticalTimelineElement>
          </div>

          {/* SAINT GAB */}
          <div ref={stGabRef} className="vertical-timeline-element">
            <VerticalTimelineElement
              visible={stGabInView}
              key={t("STGAB.schoolName")}
              date={t("STGAB.date")}
              iconStyle={{ background: "#ffffff" }}
              icon={
                <div className="flex justify-center items-center w-full h-full">
                  <img
                    src={"/images/educations/st-gab-favicon.png"}
                    alt={t("STGAB.schoolName")}
                    className="w-[60%] h-[60%] object-contain"
                  />
                </div>
              }
              contentStyle={{
                borderBottom: "8px",
                borderStyle: "solid",
                borderBottomColor: "#fdfd7a",
                boxShadow: "none",
              }}
            >
              <div>
                <h3 className="text-black text-xl font-poppins font-semibold">
                  {t("STGAB.educationLevel")}
                </h3>
                <a
                  href={"https://www.montfort-stgabrielmahajanga.mg/lycee/"}
                  target="_blank"
                  className="text-primary capitalize flex items-center"
                >
                  <p
                    className="text-black-500 font-medium text-base"
                    style={{ margin: 0 }}
                  >
                    {t("STGAB.schoolName")}
                  </p>
                </a>
              </div>
              <p className="my-5 ml-5 space-y-2">{t("STGAB.point")}</p>
            </VerticalTimelineElement>
          </div>
        </VerticalTimeline>
      </section>
    </div>
  );
};

export default Education;
