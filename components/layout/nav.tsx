"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { navItems } from "@/constants/menu";
import { PROFILE, SOCIALS } from "@/constants/profile";
import { Close, Github, LinkedIn, Mail, Menu, Terminal } from "@/components/ui/icon";
import { LogoMark } from "@/components/os/logo";
import { useConsole } from "@/components/console/console-provider";
import { useHireMe } from "@/components/layout/hire-context";
import { LocaleSwitch } from "./locale-switch";
import { ThemeToggle } from "./theme-toggle";

/**
 * The OS bar. Brand, three routes, then the tray: terminal, OS switch,
 * language, hire. Transparent over the hero, mica once the page scrolls.
 */
export function Nav({ locale }: { locale: string }) {
  const t = useTranslations("NavBar");
  const th = useTranslations("HireMe");
  const pathname = usePathname();
  const console = useConsole();
  const hire = useHireMe();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 16);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const items = navItems(locale);
  const isActive = (url: string) => (url === `/${locale}` ? pathname === url : pathname.startsWith(url));

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[80] h-[var(--nav-h)] transition-[background-color,box-shadow] duration-300",
          scrolled || open ? "mica shadow-[0_1px_0_rgb(var(--c-line)/var(--line-a))]" : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-full max-w-frame items-center gap-3 px-gutter">
          <Link href={`/${locale}`} className="flex items-center gap-2.5" aria-label={PROFILE.name}>
            <LogoMark size={32} />
            <span className="font-display text-[1.05rem] font-semibold tracking-crush text-ink">
              {PROFILE.handle}
              <span className="font-mono text-[0.8rem] font-medium text-accent">.os</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="ml-6 hidden items-center gap-1 md:flex">
            {items.map((it) => {
              const active = isActive(it.url);
              return (
                <Link
                  key={it.url}
                  href={it.url}
                  className={cn(
                    "relative rounded-ctl px-3 py-1.5 text-[0.85rem] font-medium transition-colors duration-150",
                    active ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {t(it.title)}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-ctl bg-ink/[0.06]"
                      transition={{ type: "spring", duration: 0.45, bounce: 0.1 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <button type="button" onClick={() => console.toggle()} className="btn btn-ghost btn-sm hidden !gap-2 sm:inline-flex" aria-label={t("console")}>
              <Terminal className="text-[15px]" />
              <span className="hidden md:inline">{t("console")}</span>
              <kbd className="kbd">⌘K</kbd>
            </button>
            <button type="button" onClick={() => console.toggle()} className="btn-icon sm:hidden" aria-label={t("console")}>
              <Terminal className="text-[17px]" />
            </button>
            <ThemeToggle />
            <LocaleSwitch className="hidden sm:block" />
            <button type="button" onClick={hire.open} className="btn btn-accent btn-sm hidden lg:inline-flex">
              {th("button")}
            </button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="btn-icon md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <Close className="text-[18px]" /> : <Menu className="text-[18px]" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="mica fixed inset-0 z-[75] flex flex-col px-gutter pb-8 pt-[calc(var(--nav-h)+1.5rem)] md:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {items.map((it) => (
                <Link
                  key={it.url}
                  href={it.url}
                  className={cn(
                    "border-b border-line py-4 font-display text-[2rem] font-semibold tracking-tightest",
                    isActive(it.url) ? "text-ink" : "text-muted",
                  )}
                >
                  {t(it.title)}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <LocaleSwitch id="mobile" />
                <button type="button" onClick={() => { setOpen(false); hire.open(); }} className="btn btn-accent btn-sm ml-auto">
                  {th("button")}
                </button>
              </div>
              <div className="flex items-center gap-2 text-muted">
                {SOCIALS.map((s) => (
                  <a key={s.key} href={s.url} target={s.key === "email" ? undefined : "_blank"} rel="noreferrer noopener" aria-label={s.label} className="btn-icon">
                    {s.key === "github" ? <Github className="text-[18px]" /> : s.key === "linkedin" ? <LinkedIn className="text-[18px]" /> : <Mail className="text-[18px]" />}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
