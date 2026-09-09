"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LOCALES } from "@/constants/lang";
import { Globe } from "@/components/ui/icon";

const NAMES: Record<string, string> = { en: "English", fr: "Français" };

/** Globe + code trigger with a small listbox — the original site's control. */
export function LocaleSwitch({
  className,
  id = "nav",
}: {
  className?: string;
  id?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = pathname.split("/")[1] || "en";

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const swap = (next: string) => {
    setOpen(false);
    if (next === current) return;
    const rest = pathname.split("/").slice(2).join("/");
    startTransition(() => router.push(`/${next}${rest ? `/${rest}` : ""}`));
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.95 }}
        aria-label="Switch language"
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-muted transition-colors duration-300 hover:bg-ink/5 hover:text-ink",
          pending && "opacity-60",
        )}
      >
        <Globe className="text-[1rem]" />
        <span className="text-xs font-semibold uppercase">{current}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            role="listbox"
            aria-label="Select language"
            id={`locale-list-${id}`}
            className="absolute right-0 z-50 mt-1 w-32 overflow-hidden rounded-lg bg-surface py-1 shadow-lift ring-1 ring-inset ring-line"
          >
            {LOCALES.map((l) => {
              const active = l === current;
              return (
                <li key={l}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => swap(l)}
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-2 text-left text-xs font-medium transition-colors",
                      active
                        ? "bg-indigo/10 text-signal"
                        : "text-muted hover:bg-ink/5 hover:text-ink",
                    )}
                  >
                    <span>{NAMES[l] ?? l}</span>
                    <span className="text-[10px] uppercase opacity-60">
                      {l}
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
