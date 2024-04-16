import { Montserrat } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import HireMe from "@/components/sub/HireMe";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Metadata } from "next";

config.autoAddCss = false;

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/images/icons/app/S_light.png",
        href: "/images/icons/app/S_light.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/images/icons/app/S_dark.png",
        href: "/images/icons/app/S_dark.png",
      },
    ],
  },
};

interface ILocaleLayout {
  children: React.ReactNode;
  params: { locale: string };
}

export default function LocaleLayout({
  children,
  params: { locale },
}: Readonly<ILocaleLayout>) {
  const messages = useMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${montserrat.variable} font-montserrat bg-light dark:bg-dark w-full min-h-screen`}
      >
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <NavBar lang={locale} />
            <div className="pt-[navbarHeight]">{children}</div>
            <div className="absolute right-8 bottom-8 ">
              <HireMe lang={locale} />
            </div>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
