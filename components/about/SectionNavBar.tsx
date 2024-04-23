"use client";

import React from "react";
import Link from "next/link";
import { IMenu } from "@/constants/menu";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

interface ISectionNavBar {
  items: IMenu[];
}

const SectionNavBar = (props: ISectionNavBar) => {
  const { items } = props;

  const t = useTranslations("NavBar");

  const router = useRouter();
  const pathName = usePathname();

  const handleClick = (section: string) =>
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="fixed left-4 top-32 z-10 bg-white dark:bg-blueDark shadow-lg lg:block hidden w-[10rem]">
      {items.map((item) => {
        return (
          <Link
            key={item.title}
            href={item.url}
            onClick={() => handleClick(item.title)}
            className="block px-4 py-2 text-dark dark:text-light hover:bg-light hover:dark:bg-dark"
          >
            {t(`${item.title}`)}
          </Link>
        );
      })}
    </div>
  );
};

export default SectionNavBar;
