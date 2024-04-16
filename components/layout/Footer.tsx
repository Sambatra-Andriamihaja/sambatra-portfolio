import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import Layout from "./Layout";

const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <footer
      className="absolute w-full
      text-lightGrey dark:text-gray-300/80 text-center text-sm font-normal
      "
    >
      <Layout
        className="py-8 flex items-center justify-center 
        bg-offLight dark:bg-offDark
        shadow-inner"
      >
        <span>{t("copyright", { year: new Date().getFullYear() })}</span>
        &nbsp;|&nbsp;
        <div className="flex items-center">
          {t("buildBy")} &nbsp;
          <Link href="/" className="underline underline-offset-2">
            Sambatra Andriamihaja
          </Link>
        </div>
      </Layout>
    </footer>
  );
};

export default Footer;
