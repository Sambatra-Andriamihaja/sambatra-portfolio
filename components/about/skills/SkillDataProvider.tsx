import React from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

interface ISkillDataProvider {
  index: number;
  src: string;
  name: string;
  width: number;
  height: number;
}

const SkillDataProvider = (props: ISkillDataProvider) => {
  const { src, name, width, height, index } = props;

  const { ref, inView } = useInView({
    triggerOnce: true,
  });

  const imageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const animationDelay = 0.3;

  const controls = useAnimation();

  const handleHover = () => {
    controls.start({ opacity: 1 });
  };

  const handleHoverExit = () => {
    controls.start({ opacity: 0 });
  };

  const divWidth = `${name.length * 10 + 24}px`; // Adjust the multiplier as needed

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      variants={imageVariants}
      animate={inView ? "visible" : "hidden"}
      custom={index}
      transition={{ delay: index * animationDelay }}
      style={{
        position: "relative",
        display: "inline-block",
        width: "80px",
        height: "80px",
      }}
      className="rounded-full bg-white dark:bg-white/75"
    >
      <motion.div
        whileHover={{ y: -10 }}
        whileTap={{ scale: 1.5 }}
        onMouseEnter={handleHover}
        onMouseLeave={handleHoverExit}
        className="flex rounded-full w-full h-full justify-center items-center"
      >
        <Image src={src} width={width} height={height} alt={name} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={controls}
        transition={{ duration: 0.2 }}
        style={{
          position: "absolute",
          bottom: "100%",
          left: "50%",
          transform: "translate(-50%, -10px)",
          width: divWidth,
        }}
        className="capitalize rounded-md text-sm text-center text-white dark:text-dark dark:bg-white/65 bg-dark/65"
      >
        {name}
      </motion.div>
    </motion.div>
  );
};

export default SkillDataProvider;
