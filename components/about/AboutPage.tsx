"use client";

import React from "react";

import { AnimatePresence } from "framer-motion";

import Education from "@/components/about/Education";
import Experience from "@/components/about/Experience";
import Skills from "@/components/about/skills/Skills";
import Layout from "@/components/layout/Layout";
import AnimatedText from "@/components/sub/AnimatedText";
import ParticlesBackground from "@/components/sub/ParticlesBackground";
import Hello from "@/components/about/Hello";
import PageTransition from "../sub/PageTransition";

const AboutPage = () => {
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={"aboutPageKey"} />
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
    </AnimatePresence>
  );
};

export default AboutPage;
