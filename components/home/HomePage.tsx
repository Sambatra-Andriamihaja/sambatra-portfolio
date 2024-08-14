"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";

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
import { useEffect, useState } from "react";
import WhoIs from "./WhoIs";
import Cmd from "./Cmd";
import { About } from "@/constants/about";
import StatCard from "./StatCard";
import CvButton from "./CvButton";

const HomePage = () => {
  const t = useTranslations("HomePage");
  const pathname = usePathname();
  const router = useRouter();

  const [inputText, setInputText] = useState<string>("");
  const [openSumUp, setOpenSumUp] = useState<boolean>(false);

  useEffect(() => {
    const handleInput = () => {
      if (inputText === "whois") {
        setOpenSumUp(true);
      }
    };
    handleInput();
  }, [inputText]);

  return (
    <main className="flex text-dark w-full min-h-screen dark:text-light">
      <Layout className="pt-0 bg-transparent">
        <ParticlesBackground />
        {/* <LottieContainer /> */}
        <div className="flex justify-center w-full h-[50%]">
          <div className="flex flex-col md:flex-row w-full justify-between ">
            <div className="md:w-1/2 w-full h-full px-8 flex flex-col items-center self-center z-10 relative top-0">
              <AnimatedText
                className="!font-normal normal-case !text-xl !text-left xl:!text-4xl lg:!text-3xl md:!text-2xl sm:!text-xl"
                text={t("title")}
              />
              <AnimatedText
                className="!text-2xl !text-left xl:!text-6xl lg:!text-5xl md:!text-4xl sm:!text-3xl"
                text={About.name}
              />
              <p className="my-4 text-base font-medium">{t("description")}</p>
              <div className="flex items-center self-start mt-2">
                <CvButton />
              </div>
            </div>
            <div className="md:w-1/2 w-full h-[20rem] md:h-full z-10 hidden md:block">
              {/* <Image src={profilePic} alt="CodeBucks" className="w-full h-auto" /> */}
              {/* <ModelViewer /> */}
              {/* <S /> */}

              <Cmd setInputText={setInputText} isDisabled={openSumUp} />
              <AnimatePresence>
                {openSumUp && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5 }}
                  >
                    <WhoIs />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 2lg:grid-cols-3 gap-8 w-[75%] m-8">
          <StatCard
            numberValue={40}
            onClick={() => router.push(`${pathname}/about#skills`)}
            description={t("technoUsed")}
            icon={stack}
            alt="Stack"
          />
          <StatCard
            numberValue={10}
            onClick={() => router.push(`${pathname}/projects`)}
            description={t("projectsCompleted")}
            icon={checkmark}
            alt="Check Mark"
          />
          <StatCard
            numberValue={3}
            onClick={() => router.push(`${pathname}/about#experience`)}
            description={t("yearsOfExperience")}
            icon={medal}
            alt="Medal"
          />
        </div>
      </Layout>
    </main>
  );
};

export default HomePage;
