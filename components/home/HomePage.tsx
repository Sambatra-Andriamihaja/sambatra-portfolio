"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

import Layout from "@/components/layout/Layout";
import AnimatedText from "@/components/sub/AnimatedText";
import { LinkArrow } from "@/components/sub/Icons";
// import { ModelViewer } from "@/components/sub/ModelViewer";
// import LottieContainer from "@/components/sub/LottieContainer";
import ParticlesBackground from "@/components/sub/ParticlesBackground";
import AnimatedNumbers from "@/components/sub/AnimatedNumbers";
import checkmark from "@/public/images/icons/icons8-checkmark-100.png";
import medal from "@/public/images/icons/icons8-medal-100.png";
import stack from "@/public/images/icons/icons8-stack-100.png";
import S from "@/components/home/S";
import styles from "./HomePage.module.css";
import terminalStyles from "@/components/projects/project-card/ProjectCard.module.css";
import { useEffect, useState } from "react";
import useDarkMode from "@/hooks/useDarkMode";

const HomePage = () => {
  const t = useTranslations("HomePage");
  const { isDarkMode } = useDarkMode();

  const [text, setText] = useState("");

  useEffect(() => {
    const handleInput = () => {
      if (text === "whois") {
        console.log("WWWWWWWWW");
      }
    };
    handleInput();
  }, [text]);

  return (
    <main className="flex items-center text-dark w-full min-h-screen dark:text-light">
      <Layout className="pt-0 bg-transparent">
        <ParticlesBackground />
        {/* <LottieContainer /> */}
        <div className="flex items-center justify-center w-full h-[50%] z-10">
          <div className="flex flex-col md:flex-row w-full items-center justify-between ">
            <div className="md:w-1/2 w-full h-[20rem] md:h-full z-10">
              {/* <Image src={profilePic} alt="CodeBucks" className="w-full h-auto" /> */}
              {/* <ModelViewer /> */}
              {/* <S /> */}
              <div className={styles.cmd}>
                <div className="flex gap-3">
                  <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {
                        x: "-100px",
                        opacity: 0,
                      },
                      visible: {
                        x: 0,
                        opacity: 1,
                        transition: {
                          delay: 0.4,
                          duration: 0.4,
                        },
                      },
                    }}
                  ></motion.p>
                  <motion.p
                    className="mb-2 text-sm"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {
                        x: "100px",
                        opacity: 0,
                      },
                      visible: {
                        x: 0,
                        opacity: 1,
                        transition: {
                          delay: 0.4,
                          duration: 0.4,
                        },
                      },
                    }}
                  >
                    Write the code below to sum up who am I :
                  </motion.p>
                </div>

                <div
                  className={`h-14 text-sm text-white font-medium bg-black dark:bg-gradient-to-b dark:from-terminal dark:bg-transparent p-2`}
                >
                  <div
                    className={` ${
                      isDarkMode
                        ? `${terminalStyles.terminalPrompt}`
                        : "flex ml-1"
                    } `}
                  >
                    <span className="text-white dark:text-terminalUser">
                      {"sambatra :"}
                    </span>
                    {!isDarkMode && <span>&nbsp;</span>}
                    <span className="text-white dark:text-terminalLocation">
                      {isDarkMode ? "~" : "\\"}
                    </span>
                    <span className="text-white">{isDarkMode ? "$" : ">"}</span>
                    <motion.div className="flex items-center">
                      <motion.span
                        animate={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                        className="ml-2"
                      >
                        <input
                          type="text"
                          placeholder="whois"
                          onChange={(e) => setText(e.target.value)}
                          className="bg-transparent border-none outline-none"
                        />
                      </motion.span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 w-full px-8 flex flex-col items-center self-center">
              <AnimatedText
                className="!text-2xl !text-left xl:!text-6xl lg:!text-5xl md:!text-4xl sm:!text-3xl"
                text={t("title")}
              />
              <p className="my-4 text-base font-medium">{t("description")}</p>
              <div className="flex items-center self-start mt-2">
                <Link
                  href="/CV-Sambatra-Andriamihaja.pdf"
                  target={"_blank"}
                  className="flex items-center bg-dark text-light p-2.5 px-6
                  rounded-lg text-lg font-semibold hover:bg-transparent hover:text-dark
                  border border-solid border-transparent hover:border-dark
                  dark:bg-light dark:text-dark hover:dark:bg-dark hover:dark:text-light
                  hover:dark:border-light
                  "
                  download={true}
                >
                  {t("resume")} <LinkArrow className={"w-6 ml-1"} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row items-end justify-between h-[50%] w-[75%]">
          <div className="flex flex-col items-end justify-center">
            <Image src={stack} alt="Stack" className="w-12 h-auto" />
            <span className="inline-block text-7xl font-bold">
              <AnimatedNumbers value={20} />+
            </span>
            <h2 className="text-xl font-medium capitalize text-dark/75 dark:text-light/75">
              {t("technoUsed")}
            </h2>
          </div>
          <div className="flex flex-col items-end justify-center">
            <Image src={checkmark} alt="Check Mark" className="w-12 h-auto" />
            <span className="inline-block text-7xl font-bold">
              <AnimatedNumbers value={10} />+
            </span>
            <h2 className="text-xl font-medium capitalize text-dark/75 dark:text-light/75">
              {t("projectsCompleted")}
            </h2>
          </div>
          <div className="flex flex-col items-end justify-center">
            <Image src={medal} alt="Medal" className="w-12 h-auto" />
            <span className="inline-block text-7xl font-bold">
              <AnimatedNumbers value={2} />+
            </span>
            <h2 className="text-xl font-medium capitalize text-dark/75 dark:text-light/75">
              {t("yearsOfExperience")}
            </h2>
          </div>
        </div>
      </Layout>
    </main>
  );
};

export default HomePage;
