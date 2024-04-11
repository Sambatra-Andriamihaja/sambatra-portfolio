import React, { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import LiIcon from "../sub/LiIcon";
import Image from "next/image";

interface IExperienceDetails {
  position: string;
  company: string;
  companyIcon: string;
  bgIcon: string;
  companyLogo: string;
  companyLogoWidth: number;
  companyLink: string;
  time: string;
  address?: string;
  work: string;
}

const ExperienceDetails = (props: IExperienceDetails) => {
  const {
    position,
    company,
    companyIcon,
    bgIcon,
    companyLogo,
    companyLogoWidth,
    companyLink,
    time,
    address,
    work,
  } = props;

  const ref = useRef<HTMLLIElement>(null);

  return (
    <li
      ref={ref}
      className="my-8 first:mt-0 last:mb-0 w-[60%] mx-auto flex flex-col items-center justify-between"
    >
      <LiIcon reference={ref} logo={companyIcon} bgIcon={bgIcon} />
      <motion.div
        initial={{ y: 100 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <h3 className="capitalize font-bold text-2xl flex items-center">
          {position}&nbsp;
          <a
            href={companyLink}
            target="_blank"
            className="text-primary capitalize flex items-center"
          >
            @
            {companyLogo ? (
              <div style={{ height: "auto", width: `${companyLogoWidth}px` }}>
                <Image
                  src={companyLogo}
                  alt={company}
                  width={companyLogoWidth}
                  height={100}
                />
              </div>
            ) : (
              company
            )}
          </a>
        </h3>
        <span className="capitalize font-medium text-dark/75 dark:text-light/75">
          {/* {time} | {address} */}
          {time}
        </span>
        <p className="font-medium w-full">{work}</p>
      </motion.div>
    </li>
  );
};

export default ExperienceDetails;
