import type { Metadata } from "next";
import { unstable_setRequestLocale } from "next-intl/server";

import type { Locale } from "@/constants/lang";
import { SITE } from "@/constants/site";
import { Hero } from "@/components/home/hero";
import { Routes } from "@/components/home/routes";
import { ScenarioSection } from "@/components/home/scenario-section";
import { Featured } from "@/components/home/featured";
import { Connections } from "@/components/home/connections";
import { History } from "@/components/home/history";
import { Contact } from "@/components/home/contact";

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  return {
    title: SITE.defaultTitle,
    description: SITE.description[params.locale] ?? SITE.description.en,
    alternates: { canonical: `/${params.locale}` },
  };
}

/**
 * The home page is one scenario, read top to bottom:
 *   00 trigger → 01 router → 02 scenario → 03 work → 04 connections
 *   → 05 history → 06 contact
 */
export default function HomePage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Routes />
      <ScenarioSection />
      <Featured locale={locale} />
      <Connections />
      <History />
      <Contact />
    </>
  );
}
