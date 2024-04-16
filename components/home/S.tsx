"use client";

import React from "react";
import { MySLogo } from "../sub/Icons";
import useDarkMode from "@/hooks/useDarkMode";

const S = () => {
  const { resolvedTheme } = useDarkMode();

  console.log(resolvedTheme);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <MySLogo theme={resolvedTheme} />
    </div>
  );
};

export default S;
