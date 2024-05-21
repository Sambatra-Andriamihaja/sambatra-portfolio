"use client";

import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";

import PortfolioLogo from "../sub/PortfolioLogo";
import ToggleTheme from "../sub/toggle-theme/ToggleTheme";
import { GithubIcon, LinkedInIcon } from "../sub/Icons";
import CustomLink from "../sub/CustomLink";
import LanguageSwitcher from "../sub/language-switcher/LanguageSwitcher";
import { useTranslations } from "next-intl";
import { menuItemsData } from "@/constants/menu";

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
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full md:px-32 px-16 py-8 font-medium flex items-center justify-between
      fixed top-0 left-0 right-0 z-50 bg-light dark:bg-dark dark:text-light backdrop-blur-sm ${
        isScrolled ? "bg-light/85 dark:bg-dark/85 shadow-2xl" : ""
      }`}
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
        <PortfolioLogo className="absolute left-[30px] top-2 translate-x-[30px]" />
        <nav className="ml-5">
          {menuItemsData(lang).map((item) => (
            <CustomLink key={item.title} menu={item} className="mx-4" />
          ))}
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
          initial={{ scale: 0, opacity: 0, x: "-50%", y: "1.75rem" }}
          animate={{ scale: 1, opacity: 1 }}
          className={`min-w-[70vw] flex flex-col justify-between items-center 
        fixed top-[3rem] left-1/2 -translate-x-1/2 translate-y-[1.75rem] z-30
        bg-dark/80 dark:bg-light/80 backdrop-blur-md py-32
         ${isScrolled ? "rounded-b-lg" : "rounded-lg"}
        lg:hidden`}
        >
          <nav className="flex items-baseline mb-4 flex-col justify-center ">
            <PortfolioLogo className="-mt-5 mb-5" reverse />
            {menuItemsData(lang).map((item) => (
              <CustomLink
                key={item.title}
                menu={item}
                className="mb-2"
                isDisplayedOnSmallScreen
                toggle={handleClick}
              />
            ))}
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
