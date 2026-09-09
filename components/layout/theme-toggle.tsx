"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/**
 * The OS switch. Dark is Ubuntu, light is Windows — the toggle says so.
 * The active indicator is positioned by CSS (html.light), so it is correct
 * before hydration and never jumps.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const toggle = () => setTheme(resolvedTheme === "light" ? "dark" : "light");
  const label = !mounted
    ? "Switch OS"
    : resolvedTheme === "light"
      ? "Switch to Ubuntu (dark)"
      : "Switch to Windows (light)";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        "relative grid h-8 w-[60px] grid-cols-2 items-center rounded-ctl bg-ink/[0.06] p-0.5 ring-1 ring-inset ring-line transition-colors hover:bg-ink/[0.1]",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute top-0.5 h-7 w-[28px] rounded-ctl bg-surface shadow-card transition-[left] duration-400 ease-swift os-ubuntu:left-0.5 os-win:left-[30px]"
      />
      <UbuntuGlyph className="relative z-10 mx-auto h-3.5 w-3.5 text-muted os-ubuntu:text-accent" />
      <WindowsGlyph className="relative z-10 mx-auto h-3.5 w-3.5 text-muted os-win:text-accent" />
    </button>
  );
}

/** Abstract "circle of friends" — three nodes on a ring. */
export function UbuntuGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <circle cx="12" cy="12" r="7.2" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="12" cy="3.6" r="2.6" />
      <circle cx="4.7" cy="16.2" r="2.6" />
      <circle cx="19.3" cy="16.2" r="2.6" />
    </svg>
  );
}

/** Four panes. */
export function WindowsGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <rect x="3" y="3" width="8.4" height="8.4" rx="1" />
      <rect x="12.6" y="3" width="8.4" height="8.4" rx="1" />
      <rect x="3" y="12.6" width="8.4" height="8.4" rx="1" />
      <rect x="12.6" y="12.6" width="8.4" height="8.4" rx="1" />
    </svg>
  );
}
