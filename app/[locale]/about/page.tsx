/* eslint-disable react/no-unescaped-entities */
import Education from "@/components/about/educations/Education";
import Experience from "@/components/about/Experience";
import Skills from "@/components/about/skills/Skills";
import Layout from "@/components/layout/Layout";
import AnimatedNumbers from "@/components/sub/AnimatedNumbers";
import AnimatedText from "@/components/sub/AnimatedText";
import { Metadata } from "next";
import Image from "next/image";
import React from "react";
import profilePic from "@/public/images/profile/sambatra-andriamihaja.png";
import ParticlesBackground from "@/components/sub/ParticlesBackground";

export const metadata: Metadata = {
  title: "Sambatra | About",
  description: "About Sambatra",
};

const About = () => {
  return (
    <main className="flex w-full flex-col items-center justify-center dark:text-light">
      <Layout className="pt-16">
        <ParticlesBackground />
        <AnimatedText text="Passion Fuels Purpose!" className="mb-16" />
        <div className="grid w-full grid-cols-8 gap-16">
          <div className="col-span-3 flex flex-col items-start justify-start">
            <h2 className="mb-4 text-lg font-bold uppercase text-dark/75">
              Biography
            </h2>
            <p className="font-medium">
              The Information Technology world has profoundly transformed our
              reality. For better or for worse, our future is now digital.
              Everything is digital, artificial intelligence is everywhere. At
              first, all these technological advances were beyond me.
            </p>
            <p className="my-4 font-medium">
              That's why I chose to join ITUniveristy Andoharanofotsy in
              Antananarivo, one of the best universities for information
              technology in Madagascar. I decided to study IT so that I could
              master this world, which is the foundation of our future.
            </p>
            <p className="mb-4 font-medium">
              During my time at university, I discovered many programming
              languages, databases, IT tools and methods that I was able to
              perfect through my internships and personal projects.
            </p>
            <p className="font-medium">
              Since obtaining my Master of Science degree, my passion for
              programming has continued to grow. Of course, there's still a lot
              to learn and many challenges to overcome, but I'm always ready to
              face them, because life is a perpetual learning process after all.
            </p>
          </div>
          <div
            className="col-span-3 relative h-max rounded-2xl border-2 border-solid border-dark
            bg-light p-8"
          >
            <div className="absolute top-0 -right-3 -z-10 w-[102%] h-[103%] rounded-[2rem] bg-dark" />
            <Image
              src={profilePic}
              alt="Sambatra Andriamihaja"
              className="w-full h-auto rounded-2xl"
            />
          </div>
        </div>
        <Skills />
        <Experience />
        <Education />
      </Layout>
    </main>
  );
};

export default About;
