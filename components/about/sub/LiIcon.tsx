import React, { RefObject } from "react";
import { motion, useScroll } from "framer-motion";
import Image from "next/image";

interface ILiIcon {
  reference: RefObject<HTMLLIElement>;
  logo: string;
  bgIcon: string;
}

const LiIcon = (props: ILiIcon) => {
  const { reference, logo, bgIcon } = props;

  const { scrollYProgress } = useScroll({
    target: reference,
    offset: ["start end", "end"],
    // offset: ["start end", "center start"],
  });

  const imageStyle = {
    padding: "15%",
  };

  return (
    <figure className="absolute left-2">
      <motion.div className="rounded-full overflow-hidden relative w-[60px] h-[60px] bg-light dark:bg-dark border border-1 border-dark dark:border-light flex items-center justify-center">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundColor: "#000000",
            scaleY: scrollYProgress,
            transformOrigin: "top",
          }}
        />
        <div className={`rounded-full relative w-[50px] h-[50px] ${bgIcon}`}>
          <Image src={logo} alt={logo} style={imageStyle} fill />
        </div>
      </motion.div>
    </figure>
  );
};

export default LiIcon;
