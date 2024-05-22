import React from "react";
import Image, { StaticImageData } from "next/image";
import AnimatedNumbers from "@/components/sub/AnimatedNumbers";

interface IStatCard {
  numberValue: number;
  onClick: () => void;
  description: string;
  icon: StaticImageData;
  alt: string;
}

const StatCard = (props: IStatCard) => {
  const { numberValue, onClick, description, icon, alt } = props;

  return (
    <div
      className="flex flex-col items-end justify-center border border-solid border-[#d9d4d8] dark:border-light rounded-lg z-10 p-2 w-64 h-44 bg-white dark:bg-blueDark cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      onClick={onClick}
    >
      <Image
        src={icon}
        alt={alt}
        className="w-12 h-auto absolute -mt-40 -mr-7"
      />
      <span className="inline-block text-7xl font-bold">
        <AnimatedNumbers value={numberValue} />+
      </span>
      <h2 className="text-xl font-medium capitalize text-dark/75 dark:text-light/75">
        {description}
      </h2>
    </div>
  );
};

export default StatCard;
