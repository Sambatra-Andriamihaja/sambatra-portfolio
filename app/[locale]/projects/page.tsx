import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import type { Locale } from "@/constants/lang";
import { WorkIndex } from "@/components/work/work-index";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "Projects",
  });
  return {
    title: t("metaTitle"),
    description: t("subtitle"),
    alternates: { canonical: `/${params.locale}/projects` },
  };
}

export default function ProjectsPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  unstable_setRequestLocale(locale);

  return (
    <Suspense fallback={null}>
      <WorkIndex locale={locale} />
    </Suspense>
  );
}
