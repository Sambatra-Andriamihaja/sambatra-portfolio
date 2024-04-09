import { Montserrat } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import HireMe from "@/components/sub/HireMe";
import { NextIntlClientProvider, useMessages } from "next-intl";

config.autoAddCss = false;

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

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
    <html lang={locale}>
      <body
        className={`${montserrat.variable} font-montserrat bg-light dark:bg-dark w-full min-h-screen`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <NavBar />
          {/* <ParticlesBackground /> */}
          <div className="pt-[navbarHeight]">{children}</div>
          <div className="absolute right-8 bottom-8 ">
            <HireMe lang={locale} />
          </div>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
