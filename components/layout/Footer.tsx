import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import Layout from "./Layout";

const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <footer
      className="w-full border-t-2 border-solid border-dark
    font-medium text-lg
    "
    >
      <Layout className="py-8 flex items-center justify-between">
        <span>{t("copyright", { year: new Date().getFullYear() })}</span>
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
