"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";

interface ICustomLink {
  href: string;
  title: string;
  className: string;
}

const CustomLink = (props: ICustomLink) => {
  const { href, title, className = "" } = props;
  const pathname = usePathname();

  return (
    <Link href={href} passHref className={`${className} relative group`}>
      {title}
      <span
        className={`
              h-[2px] inline-block bg-dark 
              absolute left-0 -bottom-0.5 
              group-hover:w-full transition-[width] ease duration-300
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
