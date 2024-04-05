"use client";

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { useEffect, useState } from "react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import HireMe from "@/components/sub/HireMe";

config.autoAddCss = false;

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} font-montserrat bg-light w-full min-h-screen`}
      >
        <div
          className={`fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-sm ${
            isScrolled ? "shadow-2xl" : ""
          }`}
        >
          <NavBar />
        </div>
        <div className="pt-[navbarHeight]">{children}</div>
        <div className="absolute right-8 bottom-8 ">
          <HireMe />
        </div>
        <Footer />
      </body>
    </html>
  );
}
