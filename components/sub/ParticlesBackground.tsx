"use client";

import React, { useCallback, useEffect, useState } from "react";
import { loadSlim } from "tsparticles-slim";
import Particles from "react-particles";
import type { Container, Engine } from "tsparticles-engine";
import { particlesOptions, starsOptions } from "@/config/particles";
import useThemeSwitcher from "@/hooks/useThemeSwitcher";
import { useTheme } from "next-themes";

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

  const { resolvedTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  useEffect(() => {
    setIsDarkMode(resolvedTheme === "dark");
  }, [resolvedTheme]);

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
