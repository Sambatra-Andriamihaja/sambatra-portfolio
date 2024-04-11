"use client";

import React, { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import EducationDetails from "./EducationDetails";

const Education = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });

  return (
    <div className="my-64">
      <h2 className="font-bold text-8xl mb-32 w-full text-center">Education</h2>
      <div ref={ref} className="w-[75%] mx-auto relative">
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className="absolute left-9 top-0 w-[4px] h-full bg-dark dark:bg-light/45 origin-top"
        />
        <ul className="w-full flex flex-col items-start justify-between ml-4">
          <EducationDetails
            type="Master Student"
            place="ESTIA"
            placeIcon="/images/educations/estia-favicon.png"
            bgIcon="bg-white"
            placeLogo="/images/educations/estia-logo.png"
            placeLogoWidth={150}
            placeLink="https://www.estia.fr/"
            time="Apr. 2021 - Dec. 2023"
            info="I specialised in AI and Big Data by following the BIHAR course at the ESTIA engineering school online in partnership with ITUniversity, where I obtained the Master of Science Big data Intellignece for Human Augmented Reality diploma."
          />
          <EducationDetails
            type="Bachelor Student"
            place="ITUniversity"
            placeIcon="/images/educations/itu-favicon.png"
            bgIcon="bg-ituBackground"
            placeLogo="/images/educations/itu-logo.png"
            placeLogoWidth={220}
            placeLink="https://www.ituniversity-mg.com/page/"
            time="Sep. 2017 - Mar. 2021"
            info="I studied Computer Science at the ITUniversity, where I graduated with a Bachelor's degree in Computer Science, Development option"
          />
          <EducationDetails
            type="Collegial Student"
            place="Lycée Saint Gabriel in Mahajanga, Madagascar"
            placeIcon="/images/educations/st-gab-favicon.png"
            bgIcon="bg-white"
            placeLogoWidth={200}
            placeLink="https://www.montfort-stgabrielmahajanga.mg/lycee/"
            time="Sep. 2014 - Jul. 2017"
            info="I studied at the Lycée Saint Gabriel in Mahajanga, Madagascar where I obtained my Scientific Baccalaureate"
          />
        </ul>
      </div>
    </div>
  );
};

export default Education;
