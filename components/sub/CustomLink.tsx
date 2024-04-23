"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IMenu } from "@/constants/menu";
import { useTranslations } from "next-intl";

interface ICustomLink {
  menu: IMenu;
  className: string;
  isDisplayedOnSmallScreen?: boolean;
  toggle?: () => void;
}

const CustomLink = (props: ICustomLink) => {
  const {
    menu,
    className = "",
    isDisplayedOnSmallScreen = false,
    toggle = () => {},
  } = props;

  const t = useTranslations("NavBar");

  const pathname = usePathname();
  const router = useRouter();
  const handleClick = () => {
    toggle?.();
    router.push(menu.url);
  };

  return isDisplayedOnSmallScreen ? (
    <button
      onClick={handleClick}
      className={`${className} relative group text-light dark:text-dark`}
    >
      {t(`${menu.title}`)}
      <span
        className={`
          h-[2px] block bg-light
          absolute left-1/2 transform -translate-x-1/2 -bottom-0.5
          group-hover:w-full transition-width ease duration-300
          ${pathname === menu.url ? "w-full" : "w-0"}
          dark:bg-dark
        `}
      >
        &nbsp;
      </span>
    </button>
  ) : (
    <Link href={menu.url} passHref className={`${className} relative group`}>
      {t(`${menu.title}`)}
      <span
        className={`
          h-[2px] block bg-dark
          absolute left-1/2 transform -translate-x-1/2 -bottom-0.5
          group-hover:w-full transition-width ease duration-300
          ${pathname === menu.url ? "w-full" : "w-0"}
          dark:bg-light
        `}
      >
        &nbsp;
      </span>
    </Link>
  );
};

export default CustomLink;
