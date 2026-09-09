"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { PROFILE } from "@/constants/profile";
import { Console } from "@/components/console/console";
import { Download, Play } from "@/components/ui/icon";

const HeroField = dynamic(() => import("@/components/os/hero-field"), { ssr: false });
const Bloom = dynamic(() => import("@/components/os/bloom"), { ssr: false });

const OUT = [0.23, 1, 0.32, 1] as const;

/**
 * The hero. Four text elements and the live terminal; the point field
 * behind it is the only authored entrance on the page. The field loads
 * after the page is idle, only on fine pointers, never under reduced motion.
 */
export function Hero() {
  const t = useTranslations("Hero");
  const reduce = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const [desktop, setDesktop] = useState(false);
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.innerWidth < 1024) return;
    setDesktop(true);
    if (reduce) return;
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void) => number })
      .requestIdleCallback;
    if (ric) ric(() => setIdle(true));
    else setTimeout(() => setIdle(true), 600);
  }, [reduce]);

  // Ubuntu gets the point wave, Windows the Bloom — both after idle.
  const field = desktop && idle && resolvedTheme === "dark";
  const bloom = desktop && idle && resolvedTheme === "light";

  const runScenario = () => {
    document.getElementById("scenario")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    setTimeout(() => window.dispatchEvent(new CustomEvent("scenario:run")), 900);
  };

  const rise = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: OUT, delay: d },
  });

  return (
    <section
      id="trigger"
      data-module="00"
      data-module-name="trigger"
      className="relative flex min-h-[100dvh] flex-col overflow-hidden pt-[calc(var(--nav-h)+2.5rem)] md:pt-[calc(var(--nav-h)+3.5rem)]"
    >
      {field && <HeroField className="pointer-events-none absolute inset-x-0 bottom-0 top-[30%] -z-10" />}
      {/* The Bloom is a wallpaper: it rises behind the terminal and is
          cropped by the viewport's right and bottom edges; the mask feathers
          the canvas's own left edge so nothing is cut hard. */}
      {bloom && (
        <Bloom className="pointer-events-none absolute -bottom-[30%] right-[-20%] top-[6%] -z-10 w-[min(1200px,75vw)] [mask-image:linear-gradient(to_right,transparent,#000_14%)]" />
      )}

      <div className="mx-auto grid w-full max-w-frame grid-cols-1 gap-10 px-gutter lg:flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-12 lg:pb-12">
        <div>
          <motion.h1 {...rise(0)} className="display text-display-xl text-ink">
            {PROFILE.firstName}
            <br />
            <span className="font-normal text-muted">Andriamihaja</span>
          </motion.h1>

          <motion.p {...rise(0.08)} className="mt-6 font-display text-fluid-xl font-medium tracking-crush text-ink">
            {t.rich("role", { em: (c) => <span className="text-accent">{c}</span> })}
          </motion.p>

          <motion.p {...rise(0.14)} className="mt-4 max-w-[52ch] text-fluid-base leading-relaxed text-muted text-pretty">
            {t("description")}
          </motion.p>

          <motion.div {...rise(0.2)} className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={runScenario} className="btn btn-accent">
              <Play className="text-[15px]" />
              {t("run")}
            </button>
            <a href={PROFILE.cv} download className="btn btn-ghost">
              <Download className="text-[15px]" />
              {t("downloadResume")}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: OUT, delay: 0.16 }}
          className="lg:self-end"
        >
          <Console className="h-[400px]" />
        </motion.div>
      </div>
    </section>
  );
}
