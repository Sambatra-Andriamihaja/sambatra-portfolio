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

const Experience = () => {
  const t = useTranslations("About.Experiences");

  const triggerOnceOtions = {
    triggerOnce: true,
  };
  const options = {
    threshold: 0,
  };
  const [spRef, spInView] = useInView(options);
  const [mgbiRef, mgbiInView] = useInView(options);
  const [odcRef, odcInView] = useInView(options);
  const [telmaRef, telmaInView] = useInView(options);

  return (
    <div className="my-64">
      <h2 className="font-bold text-8xl mb-32 w-full text-center">
        Experience
      </h2>
      <section className="mt-12 flex">
        <VerticalTimeline>
          {/* SP */}
          <div ref={spRef} className="vertical-timeline-element">
            <VerticalTimelineElement
              visible={spInView}
              key={t("SP.companyName")}
              date={t("SP.date")}
              iconStyle={{ background: "#000000" }}
              icon={
                <div className="flex justify-center items-center w-full h-full">
                  <img
                    src={"/images/experiences/sp-favicon.png"}
                    alt={t("SP.companyName")}
                    className="w-[60%] h-[60%] object-contain"
                  />
                </div>
              }
              contentStyle={{
                borderBottom: "8px",
                borderStyle: "solid",
                borderBottomColor: "#000000",
                boxShadow: "none",
              }}
            >
              <div>
                <h3 className="text-black text-xl font-poppins font-semibold">
                  {t("SP.experienceTitle")}
                </h3>
                <a
                  href={"https://www.smartpredictservices.com/fr/"}
                  target="_blank"
                  className="text-primary capitalize flex items-center"
                >
                  <div style={{ height: "auto", width: `${150}px` }}>
                    <Image
                      src={"/images/experiences/sp-logo.png"}
                      alt={t("SP.companyName")}
                      width={150}
                      height={100}
                    />
                  </div>
                </a>
              </div>
              <ul className="my-5 list-disc ml-5 space-y-2">
                <li className="text-black-500/50 font-normal pl-1 text-sm">
                  {t("SP.points.0")}
                </li>
                <li className="text-black-500/50 font-normal pl-1 text-sm">
                  {t("SP.points.1")}
                </li>
              </ul>
            </VerticalTimelineElement>
          </div>

          {/* MGBI */}
          <div ref={mgbiRef} className="vertical-timeline-element">
            <VerticalTimelineElement
              visible={mgbiInView}
              key={t("MGBI.companyName")}
              date={t("MGBI.date")}
              iconStyle={{ background: "#ffffff" }}
              icon={
                <div className="flex justify-center items-center w-full h-full">
                  <img
                    src={"/images/experiences/mgbi-favicon.png"}
                    alt={t("MGBI.companyName")}
                    className="w-[60%] h-[60%] object-contain"
                  />
                </div>
              }
              contentStyle={{
                borderBottom: "8px",
                borderStyle: "solid",
                borderBottomColor: "#3fa7e2",
                boxShadow: "none",
              }}
            >
              <div>
                <h3 className="text-black text-xl font-poppins font-semibold">
                  {t("MGBI.experienceTitle")}
                </h3>
                <a
                  href={"https://mgbi.mg/"}
                  target="_blank"
                  className="text-primary capitalize flex items-center"
                >
                  <div style={{ height: "auto", width: `${220}px` }}>
                    <Image
                      src={"/images/experiences/mgbi-logo.png"}
                      alt={t("MGBI.companyName")}
                      width={220}
                      height={100}
                    />
                  </div>
                </a>
              </div>
              <ul className="my-5 list-disc ml-5 space-y-2">
                <li className="text-black-500/50 font-normal pl-1 text-sm">
                  {t("MGBI.points.0")}
                </li>
                <li className="text-black-500/50 font-normal pl-1 text-sm">
                  {t("MGBI.points.1")}
                </li>
              </ul>
            </VerticalTimelineElement>
          </div>

          {/* ODC */}
          <div ref={odcRef} className="vertical-timeline-element">
            <VerticalTimelineElement
              visible={odcInView}
              key={t("ODC.companyName")}
              date={t("ODC.date")}
              iconStyle={{ background: "#ff7900" }}
              icon={
                <div className="flex justify-center items-center w-full h-full">
                  <img
                    src={"/images/experiences/orange-favicon.png"}
                    alt={t("ODC.companyName")}
                    className="w-[60%] h-[60%] object-contain"
                  />
                </div>
              }
              contentStyle={{
                borderBottom: "8px",
                borderStyle: "solid",
                borderBottomColor: "#ff7900",
                boxShadow: "none",
              }}
            >
              <div>
                <h3 className="text-black text-xl font-poppins font-semibold">
                  {t("ODC.experienceTitle")}
                </h3>
                <a
                  href={"https://www.orangedigitalcenters.com/country/MG/home"}
                  target="_blank"
                  className="text-primary capitalize flex items-center"
                >
                  <div style={{ height: "auto", width: `${200}px` }}>
                    <Image
                      src={"/images/experiences/odc-logo.png"}
                      alt={t("ODC.companyName")}
                      width={200}
                      height={100}
                    />
                  </div>
                </a>
              </div>
              <ul className="my-5 list-disc ml-5 space-y-2">
                <li className="text-black-500/50 font-normal pl-1 text-sm">
                  {t("ODC.points.0")}
                </li>
              </ul>
            </VerticalTimelineElement>
          </div>

          {/* TELMA */}
          <div ref={telmaRef} className="vertical-timeline-element">
            <VerticalTimelineElement
              visible={telmaInView}
              key={t("TELMA.companyName")}
              date={t("TELMA.date")}
              iconStyle={{ background: "#006f3b" }}
              icon={
                <div className="flex justify-center items-center w-full h-full">
                  <img
                    src={"/images/experiences/telma-favicon.png"}
                    alt={t("TELMA.companyName")}
                    className="w-[60%] h-[60%] object-contain"
                  />
                </div>
              }
              contentStyle={{
                borderBottom: "8px",
                borderStyle: "solid",
                borderBottomColor: "#006f3b",
                boxShadow: "none",
              }}
            >
              <div>
                <h3 className="text-black text-xl font-poppins font-semibold">
                  {t("TELMA.experienceTitle")}
                </h3>
                <a
                  href={"https://www.telma.mg/"}
                  target="_blank"
                  className="text-primary capitalize flex items-center"
                >
                  <div style={{ height: "auto", width: `${80}px` }}>
                    <Image
                      src={"/images/experiences/telma-logo.png"}
                      alt={t("TELMA.companyName")}
                      width={80}
                      height={100}
                    />
                  </div>
                </a>
              </div>
              <ul className="my-5 list-disc ml-5 space-y-2">
                <li className="text-black-500/50 font-normal pl-1 text-sm">
                  {t("TELMA.points.0")}
                </li>
              </ul>
            </VerticalTimelineElement>
          </div>
        </VerticalTimeline>
      </section>
    </div>
  );
};

export default Experience;
