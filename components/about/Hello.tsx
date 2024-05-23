import React, { forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteRight, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import MyProfilePic from "@/public/images/profile/sambatra-andriamihaja-with-bg.png";
import { useTranslations } from "next-intl";
import { About } from "@/constants/about";
import AnimatedText from "../sub/AnimatedText";

const Hello = forwardRef<HTMLElement, {}>((props, ref) => {
  const t = useTranslations("About.Me");

  return (
    <section id="intro" ref={ref}>
      <AnimatedText
        className="!text-2xl !text-left xl:!text-6xl lg:!text-5xl md:!text-4xl sm:!text-3xl flex items-center justify-center mb-4 z-10"
        text={t("header")}
      />
      <div className="mx-auto bg-white dark:bg-offDark p-5 sm:p-12 grid relative z-10 grid-cols-1 md:grid-cols-[1fr_3fr] items-center gap-5 md:gap-8 rounded-xl overflow-hidden">
        {/* Left Section */}
        <div className="space-y-5 text-center">
          {/* Image */}
          <div className="border-8 inline-block rounded-full border-dark-200 p-2.5">
            <div className=" mx-auto w-[200px] h-[200px] rounded-full bg-gray-200 overflow-hidden">
              <Image
                src={MyProfilePic}
                alt="Sambatra Andriamihaja"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Little Info */}
          <div>
            <h2 className="text-xl font-medium">{About.name}</h2>
            <p className="text-gray-600 dark:text-white/50">{t("title")}</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="text-[16px] sm:text-[18px] space-y-3">
          {/* Testimonial */}
          <div className="relative">
            <FontAwesomeIcon
              icon={faQuoteLeft}
              size="3x"
              className="absolute left-0 -top-5 text-dark/80 dark:text-white/65"
            />
            <div className="leading-[30px] font-semibold pl-10">
              <p className="mx-4 font-medium">{t("quote")}</p>
            </div>
            {/* <FontAwesomeIcon
            icon={faQuoteRight}
            size="3x"
            className="absolute right-0 -bottom-5 text-dark/80 dark:text-white/65"
          /> */}
          </div>
        </div>
      </div>
    </section>
  );
});

Hello.displayName = "Hello";

export default Hello;
