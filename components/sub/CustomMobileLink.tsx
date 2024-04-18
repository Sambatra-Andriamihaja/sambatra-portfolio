"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import React from "react";

interface ICustomMobileLink {
  href: string;
  title: string;
  className?: string;
  toggle: () => void;
}

const CustomMobileLink = (props: ICustomMobileLink) => {
  const { href, title, toggle, className = "" } = props;
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = () => {
    toggle();
    router.push(href);
  };

  return (
    <button
      onClick={handleClick}
      className={`${className} relative group text-light dark:text-dark`}
    >
      {title}
      <span
        className={`
          h-[2px] block bg-light
          absolute left-1/2 transform -translate-x-1/2 -bottom-0.5
          group-hover:w-full transition-width ease duration-300
          ${pathname === href ? "w-full" : "w-0"}
          dark:bg-dark
        `}
      >
        &nbsp;
      </span>
    </button>
  );
};

export default CustomMobileLink;
