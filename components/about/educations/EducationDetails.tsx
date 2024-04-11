import React, { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import LiIcon from "../sub/LiIcon";
import Image from "next/image";

interface IEducationDetails {
  type: string;
  place: string;
  placeIcon: string;
  bgIcon: string;
  placeLogo?: string;
  placeLogoWidth: number;
  placeLink: string;
  time: string;
  address?: string;
  info: string;
}

const EducationDetails = (props: IEducationDetails) => {
  const {
    type,
    place,
    placeIcon,
    bgIcon,
    placeLogo,
    placeLogoWidth,
    placeLink,
    time,
    address,
    info,
  } = props;

  const ref = useRef<HTMLLIElement>(null);

  return (
    <li
      ref={ref}
      className="my-8 first:mt-0 last:mb-0 w-[60%] mx-auto flex flex-col items-center justify-between"
    >
      <LiIcon reference={ref} logo={placeIcon} bgIcon={bgIcon} />
      <motion.div
        initial={{ y: 100 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <h3 className="capitalize font-bold text-2xl flex items-center">
          {type}&nbsp;
          <a
            href={placeLink}
            target="_blank"
            className="text-primary capitalize flex items-center"
          >
            @
            {placeLogo ? (
              <div style={{ height: "auto", width: `${placeLogoWidth}px` }}>
                <Image
                  src={placeLogo}
                  alt={place}
                  width={placeLogoWidth}
                  height={100}
                />
              </div>
            ) : (
              place
            )}
          </a>
        </h3>
        <span className="capitalize font-medium text-dark/75">
          {/* {time} | {address} */}
          {time}
        </span>
        <p className="font-medium w-full">{info}</p>
      </motion.div>
    </li>
  );
};

export default EducationDetails;
