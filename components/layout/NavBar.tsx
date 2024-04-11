"use client";

import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";

import PortfolioLogo from "../sub/PortfolioLogo";
import ToggleTheme from "../sub/toggle-theme/ToggleTheme";
import { GithubIcon, LinkedInIcon } from "../sub/Icons";
import CustomLink from "../sub/CustomLink";
import LanguageSwitcher from "../sub/language-switcher/LanguageSwitcher";
import { useTranslations } from "next-intl";

interface INavBar {
  lang: string;
}

const NavBar = (props: INavBar) => {
  const { lang } = props;

  const t = useTranslations("NavBar");

  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full px-32 py-8 font-medium flex items-center justify-between
      fixed top-0 left-0 right-0 z-50 bg-light dark:bg-dark dark:text-light backdrop-blur-sm ${
        isScrolled ? "bg-light/85 dark:bg-dark/85 shadow-2xl" : ""
      }`}
    >
      <nav>
        <CustomLink href={`/${lang}`} title={t("home")} className="mr-4" />
        <CustomLink
          href={`/${lang}/about`}
          title={t("about")}
          className="mx-4"
        />
        <CustomLink
          href={`/${lang}/projects`}
          title={t("projects")}
          className="mx-4"
        />
      </nav>

      <nav className="flex items-center justify-center flex-wrap">
        <motion.a
          href="https://github.com/Sambatra-Andriamihaja"
          target={"_blank"}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 mr-3"
        >
          <GithubIcon />
        </motion.a>

        <motion.a
          href="https://www.linkedin.com/in/sambatra-andriamihaja-b439361b9/"
          target={"_blank"}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 mx-3"
        >
          <LinkedInIcon />
        </motion.a>
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.9 }}
          className="cursor-pointer w-25 mx-3"
        >
          <LanguageSwitcher />
        </motion.div>
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.9 }}
          className="cursor-pointer w-18 ml-3"
        >
          <ToggleTheme />
        </motion.div>
      </nav>
      <div className="absolute left-[50%] top-2 translate-x-[50%]">
        <PortfolioLogo />
      </div>
    </header>
  );
};

export default NavBar;
