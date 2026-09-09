import type { MetadataRoute } from "next";
import { LOCALES } from "@/constants/lang";
import { SITE } from "@/constants/site";

const ROUTES = ["", "/about", "/projects"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return LOCALES.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: `${SITE.url}/${locale}${route}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${SITE.url}/${l}${route}`]),
        ),
      },
    })),
  );
}
