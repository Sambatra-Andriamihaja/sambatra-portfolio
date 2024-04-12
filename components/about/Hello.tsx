/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteRight, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import MyProfilePic from "@/public/images/profile/sambatra-andriamihaja-with-bg.png";

const Hello = () => {
  return (
    <section className="mx-auto bg-white p-5 sm:p-12 grid grid-cols-1 sm:grid-cols-[1fr_3fr] md:grid-cols-[1fr_4fr] items-center gap-5 md:gap-8 rounded-xl overflow-hidden">
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
          <h2 className="text-xl font-medium">Sambatra Andriamihaja</h2>
          <p className="text-gray-600">IT Engineer | Versatile Developer</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="text-[16px] sm:text-[18px] space-y-3">
        {/* Testimonial */}

        <FontAwesomeIcon
          icon={faQuoteLeft}
          size="3x"
          className="text-dark/80 dark:text-white/65"
        />
        <div className="leading-[30px] font-semibold">
          <p className="mx-4 font-medium">
            As an IT enthusiast, I've witnessed the profound metamorphosis of
            our world through technology. Embracing the digital age, I embarked
            on a transformative journey at ITUniveristy Andoharanofotsy, a
            bastion of excellence in Madagascar's technology education
            landscape. There, amidst a plethora of programming languages and
            cutting-edge tools, I cultivated my skills and honed my craft
            through immersive projects and internships. Armed with a Master's
            degree in Computer Science, my passion for programming burns
            brighter than ever. I thrive on every challenge, driven by an
            insatiable hunger for knowledge and innovation. Join me as I
            navigate the ever-evolving field of technology, where every obstacle
            is an opportunity and learning is a lifelong adventure.
          </p>
        </div>
        <FontAwesomeIcon
          icon={faQuoteRight}
          size="3x"
          className="text-dark/80 dark:text-white/65"
        />
      </div>
    </section>
  );
};

export default Hello;
