import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

const PortfolioLogo = () => {
  return (
    <div className="flex items-center justify-center mt-2">
      <MotionLink
        href="/"
        className="w-16 h-16 bg-dark  text-light 
        flex items-center justify-center 
        rounded-full
        text-5xl font-bold
        border border-solid border-transparent
        dark:border-light
        "
        whileHover={{ scale: 1.1 }}
      >
        S
      </MotionLink>
    </div>
  );
};

export default PortfolioLogo;
