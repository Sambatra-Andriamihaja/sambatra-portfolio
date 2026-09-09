"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { EASE } from "@/lib/motion";
import { IDENTITY, PROFILE } from "@/constants/profile";
import { SectionHead } from "@/components/flow/section-head";
import { Window } from "@/components/os/window";
import { useConsole } from "@/components/console/console-provider";
import { Quote } from "@/components/ui/icon";

/**
 * About · module 01 — whois. The portrait in an image-viewer window, the
 * identity record printed the way the terminal prints it, and the intro.
 */
export function Intro() {
  const t = useTranslations("About");
  const console = useConsole();
  const keys = Object.keys(IDENTITY);

  return (
    <section
      id="intro"
      data-module="01"
      data-module-name="whois"
      className="mx-auto max-w-frame px-gutter pt-[calc(var(--nav-h)+3.5rem)]"
    >
      <SectionHead
        as="h1"
        title={t.rich("titleRich", { em: (c) => <span className="text-accent">{c}</span> })}
        lede={t("intro")}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: EASE.expo }}
        >
          <Window
            title={`${PROFILE.handle}.png — 1 × 1`}
            icon={<span className="h-2.5 w-2.5 rounded-sm bg-accent" />}
            bodyClassName="bg-canvas"
            status={
              <>
                <span>PNG · sRGB</span>
                <span className="ml-auto">{PROFILE.located}</span>
              </>
            }
          >
            <div className="dotgrid relative aspect-square">
              <Image
                src="/images/profile/sambatra-andriamihaja-with-bg.png"
                alt={PROFILE.name}
                fill
                priority
                sizes="(min-width:1024px) 420px, 100vw"
                className="object-cover"
              />
            </div>
          </Window>
        </motion.div>

        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, ease: EASE.expo, delay: 0.08 }}
            className="card p-6 font-mono text-[0.8rem] leading-relaxed"
          >
            <p className="mb-3 flex items-center justify-between text-faint">
              <span>
                <span className="text-accent">$</span> whois {PROFILE.handle}
              </span>
              <button
                type="button"
                onClick={() => console.show("whois")}
                className="link-underline text-[0.72rem] hover:text-ink"
              >
                {t("openConsole")}
              </button>
            </p>
            <p className="text-faint">{"{"}</p>
            {keys.map((k, i) => {
              const v = IDENTITY[k];
              const last = i === keys.length - 1;
              return (
                <div key={k} className="pl-4">
                  <span className="text-accent">&quot;{k}&quot;</span>
                  <span className="text-faint">: </span>
                  {Array.isArray(v) ? (
                    <>
                      <span className="text-faint">[</span>
                      <span className="block pl-4">
                        {v.map((x, j) => (
                          <span key={x} className="block text-ink">
                            &quot;{x}&quot;
                            {j < v.length - 1 && <span className="text-faint">,</span>}
                          </span>
                        ))}
                      </span>
                      <span className="text-faint">]{!last && ","}</span>
                    </>
                  ) : (
                    <span className="text-ink">
                      &quot;{v}&quot;{!last && <span className="text-faint">,</span>}
                    </span>
                  )}
                </div>
              );
            })}
            <p className="text-faint">{"}"}</p>
          </motion.div>

          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, ease: EASE.expo, delay: 0.16 }}
            className="card flex gap-4 p-6"
          >
            <Quote className="shrink-0 text-[28px] text-accent/60" />
            <div>
              <p className="font-display text-[1.35rem] font-medium leading-snug tracking-crush text-ink">{t("quote")}</p>
              <footer className="caption mt-3">{PROFILE.name}</footer>
            </div>
          </motion.blockquote>
        </div>
      </div>
    </section>
  );
}
