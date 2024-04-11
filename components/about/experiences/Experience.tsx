"use client";

import React, { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import ExperienceDetails from "./ExperienceDetails";

const Experience = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });

  return (
    <div className="my-64">
      <h2 className="font-bold text-8xl mb-32 w-full text-center">
        Experience
      </h2>
      <div ref={ref} className="w-[75%] mx-auto relative">
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className="absolute left-9 top-0 w-[4px] h-full bg-dark dark:bg-light/45 origin-top"
        />
        <ul className="w-full flex flex-col items-start justify-between ml-4">
          <ExperienceDetails
            position="Frontend Developer"
            company="Smart Predict"
            companyIcon="/images/experiences/sp-favicon.png"
            bgIcon="bg-spBackground"
            companyLogo="/images/experiences/sp-logo.png"
            companyLogoWidth={150}
            companyLink="https://www.smartpredictservices.com/fr/"
            time="Sep. 2022 - Present"
            work="Worked on a team responsible for maintaining and developing new features on mobile for Orizon's 
              project called Orizon."
          />
          <ExperienceDetails
            position="Software Developer"
            company="MGBI"
            companyIcon="/images/experiences/mgbi-favicon.png"
            bgIcon="bg-light"
            companyLogo="/images/experiences/mgbi-logo.png"
            companyLogoWidth={220}
            companyLink="https://mgbi.mg/"
            time="Jan. 2023 - Jul. 2023"
            work="Developed web applications as well as I designed and maintained software tools for customers."
          />
          <ExperienceDetails
            position="Mobile Developer"
            company="Orange Digital Center"
            companyIcon="/images/experiences/orange-favicon.png"
            bgIcon="bg-orangeBackground"
            companyLogo="/images/experiences/odc-logo.png"
            companyLogoWidth={200}
            companyLink="https://www.orangedigitalcenters.com/country/MG/home"
            time="Jul. 2022 - Sep. 2022"
            work="Did an end-of-studies internship as part of the Orange Summer Challenge 2022 on the theme of 'tech4good' (in other words, technology for good), organised by the Orange Digital Center as part of my BIHAR Master of Sciences degree, in which I was tasked with building a mobile application."
          />
          <ExperienceDetails
            position="Web App Developer"
            company="Telma"
            companyIcon="/images/experiences/telma-favicon.png"
            bgIcon="bg-telmaBackground"
            companyLogo="/images/experiences/telma-logo.png"
            companyLogoWidth={80}
            companyLink="https://www.telma.mg/"
            time="Dec. 2020 - Mar. 2021"
            work="Did an internship with a view to obtaining a Bachelor's degree in Computer Science with a Development option, during which I redesigned the document management web application for Telma's Information Systems Department."
          />
        </ul>
      </div>
    </div>
  );
};

export default Experience;
