"use client";

import React from "react";
import { MySLogo } from "../sub/Icons";
import useDarkMode from "@/hooks/useDarkMode";

interface IS {
  className?: string;
}

const S = (props: IS) => {
  const { className = "" } = props;
  const { resolvedTheme } = useDarkMode();

  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className}`}
    >
      <MySLogo theme={resolvedTheme} />
    </div>
  );
};

export default S;
