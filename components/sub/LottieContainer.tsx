"use client";

import { Player } from "@lottiefiles/react-lottie-player";
import { dev, ml, dba } from "@/data/lottieFiles";

const LottieContainer = () => {
  return (
    <div className="absolute z-0 top-0 left-0 w-full h-full">
      <Player
        autoplay
        loop
        src={dev}
        style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          right: "1%",
          top: "12%",
          opacity: 0.85,
        }}
      />

      <Player
        autoplay
        loop
        src={ml}
        style={{
          position: "absolute",
          width: "250px",
          height: "250px",
          left: "42.5%",
          top: "7%",
          opacity: 0.85,
        }}
      />

      <Player
        autoplay
        loop
        src={dba}
        style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          right: "32.5%",
          top: "40%",
          opacity: 0.85,
        }}
      />
    </div>
  );
};

export default LottieContainer;
