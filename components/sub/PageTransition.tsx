"use client";

import React from "react";
import { Variants, motion } from "framer-motion";

const PageTransition = () => {
  const transitionVariants: Variants = {
    initial: {
      x: "100%",
      width: "100%",
    },
    animate: {
      x: "0%",
      width: "0%",
    },
  };

  return (
    <>
      <motion.div
        className="fixed top-0 bottom-0 right-full w-screen h-screen z-30 bg-black dark:bg-white"
        variants={transitionVariants}
        initial="initial"
        animate="animate"
        exit={{
          x: ["0%", "100%"],
          width: ["0%", "100%"],
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed top-0 bottom-0 right-full w-screen h-screen z-30 bg-black dark:bg-white"
        variants={transitionVariants}
        initial="initial"
        animate="animate"
        exit={{
          x: ["0%", "100%"],
          width: ["0%", "100%"],
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed top-0 bottom-0 right-full w-screen h-screen z-20 bg-dark dark:bg-light"
        variants={transitionVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.2, duration: 0.6, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed top-0 bottom-0 right-full w-screen h-screen z-10 bg-blueDark dark:bg-offLight"
        variants={transitionVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.4, duration: 0.6, ease: "easeInOut" }}
      />
    </>
  );
};

export default PageTransition;
