"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PROFILE } from "@/constants/profile";
import { LogoMark } from "./logo";

const KEY = "sambatra.os:booted";
const DURATION = 800;

/**
 * One-second OS boot on the first visit of a session. Ubuntu shows the five
 * plymouth dots; Windows shows the ring spinner. Click or any key skips it.
 * Both variants are in the DOM and CSS picks one, so nothing waits on the
 * theme to resolve.
 */
export function Boot() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let booted = true;
    try {
      booted = sessionStorage.getItem(KEY) === "1";
    } catch {
      /* private mode */
    }
    if (booted) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setShow(true);
    const done = () => {
      setShow(false);
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* ignore */
      }
    };
    const t = setTimeout(done, DURATION);
    const skip = () => {
      clearTimeout(t);
      done();
    };
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="boot"
          role="status"
          aria-label="Booting"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeOut" } }}
          className="fixed inset-0 z-[200] grid place-items-center bg-canvas"
        >
          <div className="flex flex-col items-center gap-7">
            <div className="flex items-center gap-3 font-display text-[1.75rem] font-semibold tracking-tightest text-ink">
              <LogoMark size={40} />
              <span>
                {PROFILE.handle}
                <span className="text-accent">.os</span>
              </span>
            </div>

            {/* Ubuntu — plymouth dots */}
            <div className="hidden items-center gap-2.5 os-ubuntu:flex" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="h-2 w-2 rounded-full bg-accent animate-plymouth"
                  style={{ animationDelay: `${i * 0.16}s` }}
                />
              ))}
            </div>

            {/* Windows — ring spinner */}
            <div className="relative hidden h-8 w-8 os-win:block" aria-hidden>
              <span className="absolute inset-0 rounded-full border-[3px] border-ink/10" />
              <span className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-accent animate-spin" />
            </div>

            <p className="text-[0.8rem] text-faint">
              <span className="hidden os-ubuntu:inline">Starting session</span>
              <span className="hidden os-win:inline">Getting things ready</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
