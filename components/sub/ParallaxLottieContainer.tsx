"use client";

import { Player } from "@lottiefiles/react-lottie-player";
import { useEffect, useState } from "react";

interface ParallaxLottieContainerProps {
  animationUrls: string[];
}

const ParallaxLottieContainer = (props: ParallaxLottieContainerProps) => {
  const { animationUrls } = props;
  const [lottieAnimations, setLottieAnimations] = useState<
    { src: string; x: number; y: number }[]
  >([]);

  useEffect(() => {
    const containerWidth = window.innerWidth * 0.8;
    const containerHeight = window.innerHeight * 0.8;
    const maxX = containerWidth / 2;
    const maxY = containerHeight / 2;

    const animationsWithRandomPositions = animationUrls.map((src) => ({
      src,
      x: Math.random() * maxX - maxX / 2,
      y: Math.random() * maxY - maxY / 2,
    }));

    setLottieAnimations(animationsWithRandomPositions);
  }, [animationUrls]);

  return (
    <div className="absolute z-0 top-0 left-0 w-full h-full">
      {lottieAnimations.map((animation, index) => (
        <Player
          key={index}
          autoplay
          loop
          src={animation.src}
          style={{
            position: "absolute",
            width: "200px",
            height: "200px",
            left: `calc(50% + ${animation.x}px)`,
            top: `calc(50% + ${animation.y}px)`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* <Controls visible={true} buttons={["play", "repeat", "frame", "debug"]} /> */}
        </Player>
      ))}
    </div>
  );
};

export default ParallaxLottieContainer;
