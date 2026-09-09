import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import "@/app/globals.css";

import { fontVariables } from "@/lib/fonts";
import { LOCALES, type Locale } from "@/constants/lang";
import { SITE } from "@/constants/site";
import { PROFILE, SOCIALS } from "@/constants/profile";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ConsoleProvider } from "@/components/console/console-provider";
import { HireMeProvider } from "@/components/layout/hire-context";
import { HireMe } from "@/components/layout/hire-me";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Backdrop } from "@/components/os/backdrop";
import { Boot } from "@/components/os/boot";
import { PointerFx } from "@/components/os/pointer-fx";
import { Spine } from "@/components/flow/spine";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#21141e" },
    { media: "(prefers-color-scheme: light)", color: "#ecf3fb" },
  ],
  colorScheme: "dark light",
};

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const description = SITE.description[params.locale] ?? SITE.description.en;

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: SITE.defaultTitle,
      template: SITE.titleTemplate,
    },
    description,
    keywords: [...SITE.keywords],
    authors: [{ name: PROFILE.name, url: SITE.url }],
    creator: PROFILE.name,
    alternates: {
      canonical: `/${params.locale}`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      type: "website",
      locale: params.locale === "fr" ? "fr_FR" : "en_US",
      url: `${SITE.url}/${params.locale}`,
      siteName: SITE.name,
      title: SITE.defaultTitle,
      description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: SITE.defaultTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE.defaultTitle,
      description,
      images: ["/opengraph-image"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    // Icons come from app/icon.tsx and app/apple-icon.tsx, drawn from the
    // same paths as the logo.
  };
}

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: Locale };
}) {
  unstable_setRequestLocale(locale);
  const messages = useMessages();

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PROFILE.name,
    jobTitle: locale === "fr" ? PROFILE.roleFr : PROFILE.role,
    email: `mailto:${PROFILE.email}`,
    url: `${SITE.url}/${locale}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Antananarivo",
      addressCountry: "MG",
    },
    worksFor: [
      { "@type": "Organization", name: PROFILE.agency },
      {
        "@type": "Organization",
        name: PROFILE.company,
        url: PROFILE.companyUrl,
      },
    ],
    knowsAbout: [
      "Make (Integromat)",
      "Workflow automation",
      "Brevo",
      "Supabase",
      "LangChain",
      "Python",
      "TypeScript",
    ],
    sameAs: SOCIALS.filter((s) => s.key !== "email").map((s) => s.url),
  };

  return (
    <html lang={locale} suppressHydrationWarning className={fontVariables}>
      <body className="min-h-[100dvh] antialiased">
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <HireMeProvider>
              <ConsoleProvider>
                <a
                  href="#main"
                  className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-field focus:bg-brass focus:px-5 focus:py-2 focus:font-sans focus:text-sm focus:font-semibold focus:text-onGold"
                >
                  Skip to content
                </a>

                <Backdrop />
                <PointerFx />
                <Spine />

                <div className="flex min-h-[100dvh] flex-col">
                  <Nav locale={locale} />
                  <main id="main" className="relative z-10 flex-1">
                    {children}
                  </main>
                  <Footer locale={locale} />
                </div>

                <HireMe />
                <Boot />
              </ConsoleProvider>
            </HireMeProvider>
          </NextIntlClientProvider>
        </ThemeProvider>

        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
