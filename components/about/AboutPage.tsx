"use client";

import React from "react";

import Education from "@/components/about/Education";
import Experience from "@/components/about/Experience";
import Skills from "@/components/about/Skills";
import Layout from "@/components/layout/Layout";
import AnimatedText from "@/components/sub/AnimatedText";
import ParticlesBackground from "@/components/sub/ParticlesBackground";
import Hello from "@/components/about/Hello";

const AboutPage = () => {
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

export default AboutPage;
