import React from "react";
import { Metadata } from "next";

import AboutPage from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "Sambatra | About",
  description: "About Sambatra",
};

export default function About() {
  return <AboutPage />;
}
