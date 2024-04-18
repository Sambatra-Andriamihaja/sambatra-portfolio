"use client";

import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";

import PortfolioLogo from "../sub/PortfolioLogo";
import ToggleTheme from "../sub/toggle-theme/ToggleTheme";
import { GithubIcon, LinkedInIcon } from "../sub/Icons";
import CustomLink from "../sub/CustomLink";
import LanguageSwitcher from "../sub/language-switcher/LanguageSwitcher";
import { useTranslations } from "next-intl";
import CustomMobileLink from "../sub/CustomMobileLink";

interface INavBar {
  lang: string;
}

const NavBar = (props: INavBar) => {
  const { lang } = props;

  const t = useTranslations("NavBar");

  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = () => setIsOpen(!isOpen);

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
      }
      relative`}
    >
      <button
        className="flex-col justify-center items-center flex lg:hidden"
        onClick={handleClick}
      >
        <span
          className={`bg-dark dark:bg-light block h-1 w-8 rounded-md ${
            isOpen ? "rotate-45 translate-y-1" : "-translate-y-1"
          }
            transition-all duration-300 ease-out
            `}
        ></span>
        <span
          className={`bg-dark dark:bg-light block h-1 w-8 rounded-md my-0.5, ${
            isOpen ? "opacity-0" : "opacity-100"
          }
            transition-all duration-300 ease-out
            `}
        ></span>
        <span
          className={`bg-dark dark:bg-light block h-1 w-8 rounded-md ${
            isOpen ? "-rotate-45 -translate-y-1" : "translate-y-1"
          }
            transition-all duration-300 ease-out
            `}
        ></span>
      </button>

      <div className="w-full justify-between items-center hidden lg:flex">
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
      </div>
      {isOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0, x: "-50%", y: "3rem" }}
          animate={{ scale: 1, opacity: 1 }}
          className={`min-w-[70vw] flex flex-col justify-between items-center 
        fixed top-[3rem] left-1/2 -translate-x-1/2 translate-y-[3rem] z-30
        bg-dark/80 dark:bg-light/80 rounded-lg backdrop-blur-md py-32
        lg:hidden`}
        >
          <nav className="flex items-baseline mb-4 flex-col justify-center ">
            <CustomMobileLink
              href={`/${lang}`}
              title={t("home")}
              className="mb-2"
              toggle={handleClick}
            />
            <CustomMobileLink
              href={`/${lang}/about`}
              title={t("about")}
              className="mb-2"
              toggle={handleClick}
            />
            <CustomMobileLink
              href={`/${lang}/projects`}
              title={t("projects")}
              className="mb-2"
              toggle={handleClick}
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
              <GithubIcon className="text-light dark:text-dark" />
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
              <LanguageSwitcher isHamburgerNavbar />
            </motion.div>
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer w-18 ml-3"
            >
              <ToggleTheme />
            </motion.div>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default NavBar;
