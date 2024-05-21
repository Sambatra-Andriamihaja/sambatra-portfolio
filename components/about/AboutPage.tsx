"use client";

import React, { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

import Education from "@/components/about/Education";
import Experience from "@/components/about/Experience";
import Skills from "@/components/about/Skills";
import Layout from "@/components/layout/Layout";
import AnimatedText from "@/components/sub/AnimatedText";
import ParticlesBackground from "@/components/sub/ParticlesBackground";
import Hello from "@/components/about/Hello";
import SectionNavBar from "./SectionNavBar";
import { aboutSubMenu } from "@/constants/menu";

const AboutPage = () => {
  const helloSectionRef = useRef<HTMLElement>(null);
  const skillsSectionRef = useRef<HTMLElement>(null);
  const experienceSectionRef = useRef<HTMLElement>(null);
  const educationSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hash = window.location.hash;

    const scrollToSection = () => {
      if (hash === "#skills" && skillsSectionRef.current) {
        skillsSectionRef.current.scrollIntoView({ block: "start" });
      }

      if (hash === "#experience" && experienceSectionRef.current) {
        experienceSectionRef.current.scrollIntoView({ block: "start" });
      }
    };

    requestAnimationFrame(scrollToSection);
  }, []);

  return (
    <main className="flex w-full flex-col items-center justify-center dark:text-light">
      <Layout className="pt-16 lg:!pl-48">
        <ParticlesBackground />
        <SectionNavBar items={aboutSubMenu} />
        <AnimatedText text="Passion Fuels Purpose!" className="mb-16" />
        <Hello ref={helloSectionRef} />
        <Skills ref={skillsSectionRef} />
        <Experience ref={experienceSectionRef} />
        <Education ref={educationSectionRef} />
      </Layout>
    </main>
  );
};

export default AboutPage;
