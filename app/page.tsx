import { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import AnimatedText from "@/components/sub/AnimatedText";
import { LinkArrow } from "@/components/sub/Icons";
import Image from "next/image";
import Link from "next/link";
import profilePic from "../public/images/profile/sambatra-andriamihaja.png";
import { ModelViewer } from "@/components/sub/ModelViewer";
import { Controls, Player } from "@lottiefiles/react-lottie-player";
import LottieContainer from "@/components/sub/LottieContainer";
import ParticlesBackground from "@/components/sub/ParticlesBackground";
import AnimatedNumbers from "@/components/sub/AnimatedNumbers";

export const metadata: Metadata = {
  title: "Sambatra | Portfolio",
  description: "Sambatra's portfolio",
};

export default function Home() {
  return (
    <main className="flex items-center text-dark w-full h-full">
      <Layout className="pt-[navbarHeight] h-screen">
        {/* <ParticlesBackground /> */}
        <LottieContainer />
        <div className="flex items-center justify-center w-full h-[50%]">
          <div className="flex flex-row w-full items-center justify-between ">
            <div className="w-1/2 ">
              {/* <Image src={profilePic} alt="CodeBucks" className="w-full h-auto" /> */}
              <ModelViewer />
            </div>
            <div className="w-1/2 flex flex-col items-center self-center z-10">
              <AnimatedText
                className="!text-5xl !text-left"
                text="Breathing life into ideas through coding"
              />
              <p className="my-4 text-base font-medium">
                As a versatile full-stack developer, I am committed to
                transforming concepts into cutting-edge solutions. Delve into my
                recent endeavors that highlight my proficiency in software
                engineering.
              </p>
              <div className="flex items-center self-start mt-2">
                <Link
                  href="/CV-Sambatra-Andriamihaja.pdf"
                  target={"_blank"}
                  className="flex items-center bg-dark text-light p-2.5 px-6
                  rounded-lg text-lg font-semibold hover:bg-transparent hover:text-dark
                  border border-solid border-transparent hover:border-dark
                  "
                  download={true}
                >
                  Resume <LinkArrow className={"w-6 ml-1"} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row items-end justify-between h-[50%] w-[75%]">
          <div className="flex flex-col items-end justify-center">
            <span className="inline-block text-7xl font-bold">
              <AnimatedNumbers value={20} />+
            </span>
            <h2 className="text-xl font-medium capitalize text-dark/75">
              technologies used
            </h2>
          </div>
          <div className="flex flex-col items-end justify-center">
            <span className="inline-block text-7xl font-bold">
              <AnimatedNumbers value={10} />+
            </span>
            <h2 className="text-xl font-medium capitalize text-dark/75">
              projects completed
            </h2>
          </div>
          <div className="flex flex-col items-end justify-center">
            <span className="inline-block text-7xl font-bold">
              <AnimatedNumbers value={2} />+
            </span>
            <h2 className="text-xl font-medium capitalize text-dark/75">
              years of experience
            </h2>
          </div>
        </div>
      </Layout>
    </main>
  );
}
