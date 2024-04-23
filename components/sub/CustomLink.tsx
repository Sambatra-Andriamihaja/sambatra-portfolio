"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface ICustomLink {
  href: string;
  title: string;
  className: string;
  isDisplayedOnSmallScreen?: boolean;
  toggle?: () => void;
}

const CustomLink = (props: ICustomLink) => {
  const {
    href,
    title,
    className = "",
    isDisplayedOnSmallScreen = false,
    toggle = () => {},
  } = props;

  const pathname = usePathname();

  const router = useRouter();
  const handleClick = () => {
    toggle?.();
    router.push(href);
  };

  return isDisplayedOnSmallScreen ? (
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
  ) : (
    <Link href={href} passHref className={`${className} relative group`}>
      {title}
      <span
        className={`
          h-[2px] block bg-dark
          absolute left-1/2 transform -translate-x-1/2 -bottom-0.5
          group-hover:w-full transition-width ease duration-300
          ${pathname === href ? "w-full" : "w-0"}
          dark:bg-light
        `}
      >
        &nbsp;
      </span>
    </Link>
  );
};

export default CustomLink;
