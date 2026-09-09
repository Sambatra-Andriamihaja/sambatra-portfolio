import type { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import type { Locale } from "@/constants/lang";
import { Intro } from "@/components/about/intro";
import { Connections } from "@/components/home/connections";
import { History } from "@/components/home/history";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "About",
  });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: { canonical: `/${params.locale}/about` },
  };
}

/** About: 01 whois → 02 connections → 03 history. */
export default function AboutPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <Intro />
      <Connections index="02" />
      <History standalone />
    </>
  );
}
