import React from "react";
import { CircularText } from "./Icons";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { isLangEn } from "@/utils/i18n";

interface IHireMe {
  lang: string;
}

const HireMe = (props: IHireMe) => {
  const { lang } = props;

  const t = useTranslations("General");

  return (
    <div className="flex items-center justify-center overflow-hidden">
      <div className="w-48 h-auto flex items-center justify-center relative">
        <CircularText className={"fill-dark animate-spin-slow"} lang={lang} />

        <Link
          href="mailto:sambatra.andriamihaja@outlook.com"
          className={`flex items-center justify-center
        absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
        bg-dark text-light text-center shadow-md border border-solid border-dark
        w-20 h-20 rounded-full
        font-semibold hover:bg-light hover:text-dark 
        capitalize ${!isLangEn(lang) && "text-xs"}`}
        >
          {t("hireMe")}
        </Link>
      </div>
    </div>
  );
};

export default HireMe;
