import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import S from "../home/S";

const MotionLink = motion(Link);

interface IPortfolioLogo {
  className?: string;
}

const PortfolioLogo = (props: IPortfolioLogo) => {
  const { className = "" } = props;

  return (
    <div className={`flex items-center justify-center mt-2 ${className}`}>
      <MotionLink
        href="/"
        className={`
        w-16 h-16  text-light 
        flex items-center justify-center 
        rounded-full
        text-5xl font-bold
        border border-solid
        bg-dark border-light
        `}
        whileHover={{ scale: 1.1 }}
      >
        <S />
      </MotionLink>
    </div>
  );
};

export default PortfolioLogo;
