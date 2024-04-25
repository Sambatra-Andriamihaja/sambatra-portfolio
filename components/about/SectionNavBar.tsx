"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IMenu } from "@/constants/menu";
import { useTranslations } from "next-intl";

interface ISectionNavBar {
  items: IMenu[];
}

const SectionNavBar = (props: ISectionNavBar) => {
  const { items } = props;

  const t = useTranslations("NavBar");

  const [active, setActive] = useState<string>("");

  const handleClick = (section: string) => {
    setActive(section);
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
  };

  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer logic to track section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActive(visibleEntry.target.id);
        }
      },
      { threshold: 0.5 }
    ); // Adjust threshold as needed

    observerRef.current = observer; // Store reference

    // Observe sections initially
    items.forEach((item) => {
      const section = document.getElementById(item.title);
      if (section) {
        observer.observe(section);
      }
    });

    // Cleanup on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect(); // Disconnect observer
      }
    };
  }, [items]); // Re-run useEffect on items change

  return (
    <div className="fixed left-4 top-32 z-10 bg-white dark:bg-blueDark shadow-lg lg:block hidden w-[10rem]">
      {items.map((item) => {
        return (
          <Link
            key={item.title}
            href={item.url}
            onClick={() => handleClick(item.title)}
            className={`block px-4 py-2 text-dark dark:text-light hover:bg-light hover:dark:bg-dark ${
              item.title == active && "bg-light dark:bg-dark font-extrabold"
            }`}
          >
            {t(`${item.title}`)}
          </Link>
        );
      })}
    </div>
  );
};

export default SectionNavBar;
