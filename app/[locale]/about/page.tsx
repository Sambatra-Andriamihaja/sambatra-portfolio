/* eslint-disable react/no-unescaped-entities */
import Education from "@/components/about/Education";
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
import Hello from "@/components/about/Hello";

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
        <Hello />
        <Skills />
        <Experience />
        <Education />
      </Layout>
    </main>
  );
};

export default About;
