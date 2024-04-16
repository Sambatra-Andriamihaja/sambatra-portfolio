import { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import AnimatedText from "@/components/sub/AnimatedText";
import { LinkArrow } from "@/components/sub/Icons";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { ModelViewer } from "@/components/sub/ModelViewer";
import LottieContainer from "@/components/sub/LottieContainer";
import ParticlesBackground from "@/components/sub/ParticlesBackground";
import AnimatedNumbers from "@/components/sub/AnimatedNumbers";
import checkmark from "@/public/images/icons/icons8-checkmark-100.png";
import medal from "@/public/images/icons/icons8-medal-100.png";
import stack from "@/public/images/icons/icons8-stack-100.png";
import S from "@/components/home/S";

export const metadata: Metadata = {
  title: "Sambatra | Portfolio",
  description: "Sambatra's portfolio",
};

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <main className="flex items-center text-dark w-full min-h-screen dark:text-light">
      <Layout className="pt-[navbarHeight] h-screen">
        <ParticlesBackground />
        {/* <LottieContainer /> */}
        <div className="flex items-center justify-center w-full h-[50%]">
          <div className="flex flex-row w-full items-center justify-between ">
            <div className="w-1/2 ">
              {/* <Image src={profilePic} alt="CodeBucks" className="w-full h-auto" /> */}
              {/* <ModelViewer /> */}
              <S />
            </div>
            <div className="w-1/2 flex flex-col items-center self-center z-10">
              <AnimatedText
                className="!text-5xl !text-left"
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
}
