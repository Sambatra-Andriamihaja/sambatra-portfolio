"use client";

import React from "react";
import { MySLogo } from "../sub/Icons";
import useDarkMode from "@/hooks/useDarkMode";
import { LIGHT, S_DARK, S_LIGHT } from "@/constants/theme";

interface IS {
  className?: string;
  reverse?: boolean;
}

const S = (props: IS) => {
  const { className = "", reverse = false } = props;
  const { resolvedTheme } = useDarkMode();

  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className}`}
    >
      <MySLogo
        fill={
          resolvedTheme == LIGHT
            ? reverse
              ? S_DARK
              : S_LIGHT
            : reverse
            ? S_LIGHT
            : S_DARK
        }
      />
    </div>
  );
};

export default S;
