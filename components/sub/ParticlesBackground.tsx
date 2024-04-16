"use client";

import React, { useCallback, useEffect, useState } from "react";
import { loadSlim } from "tsparticles-slim";
import Particles from "react-particles";
import type { Container, Engine } from "tsparticles-engine";
import { particlesOptions, starsOptions } from "@/config/particles";
import useDarkMode from "@/hooks/useDarkMode";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    console.log(engine);
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
      await console.log(container);
    },
    []
  );

  const { isDarkMode } = useDarkMode();

  return (
    <div id="particles-background" className="relative z-0">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={isDarkMode ? starsOptions : particlesOptions}
      />
    </div>
  );
};

export default ParticlesBackground;
