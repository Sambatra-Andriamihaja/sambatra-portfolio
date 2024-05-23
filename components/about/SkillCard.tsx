import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { ISkill } from "@/constants/skill";
import SkillImage from "../sub/SkillImage";

interface ISkillCard {
  lottieSrc: string | object;
  lottieWidth?: string;
  lottieHeight?: string;
  lottieMarginTop?: string;
  lottieMarginLeft?: string;
  skills: ISkill[];
  headerClassName?: string;
  title: string;
  description: string;
}

const SkillCard = (props: ISkillCard) => {
  const {
    lottieSrc,
    lottieWidth = "160px",
    lottieHeight = "auto",
    lottieMarginTop = "-65px",
    lottieMarginLeft = "0px",
    skills,
    headerClassName = "",
    title,
    description,
  } = props;

  return (
    <div className="relative flex flex-col items-start p-4 bg-offLight dark:bg-offDark rounded-lg border border-solid border-light dark:border-dark shadow-inner">
      <Player
        autoplay
        loop
        src={lottieSrc}
        style={{
          position: "absolute",
          width: lottieWidth,
          height: lottieHeight,
          opacity: 1,
          marginLeft: lottieMarginLeft,
          marginTop: lottieMarginTop,
        }}
      />
      <div className={`pl-40 z-10 ${headerClassName}`}>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="mt-2 text-md text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>
      <div className="w-full flex flex-row justify-around flex-wrap mt-16 gap-5 items-center p-4 ">
        {skills.map((image, index) => (
          <SkillImage
            key={index}
            src={image.Image}
            name={image.skill_name}
            width={image.width}
            height={image.height}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default SkillCard;
