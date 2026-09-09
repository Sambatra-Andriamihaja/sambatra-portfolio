"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";
import { PROFILE } from "@/constants/profile";
import { Window } from "@/components/os/window";
import { useHireMe } from "@/components/layout/hire-context";
import { COMMAND_NAMES, resolve } from "./registry";
import { ConsoleLine } from "./console-line";
import type { ConsoleCtx, Entry } from "./types";

let uid = 0;

type ConsoleProps = {
  variant?: "inline" | "overlay";
  onClose?: () => void;
  className?: string;
  autoFocus?: boolean;
  /** Pre-typed command, executed on mount. */
  initialCommand?: string;
};

/**
 * The terminal. Two skins live in the DOM at once and CSS picks one, so the
 * right shell renders on the first paint:
 *
 *   Ubuntu   GNOME Terminal — aubergine, Yaru palette, Ubuntu Mono,
 *            `sambatra@ubuntu:~$`.
 *   Windows  Windows Terminal running PowerShell — #012456, Campbell
 *            palette, `PS C:\Users\sambatra>`.
 */
export function Console({
  variant = "inline",
  onClose,
  className,
  autoFocus = false,
  initialCommand,
}: ConsoleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const translate = useTranslations();
  const tt = useTranslations("Terminal");
  const hire = useHireMe();
  const locale = pathname.split("/")[1] || "en";

  const [entries, setEntries] = useState<Entry[]>([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const [busy, setBusy] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ghost = useMemo(() => {
    const v = value.trim();
    if (!v || v.includes(" ")) return "";
    const hit = COMMAND_NAMES.find((c) => c.startsWith(v) && c !== v);
    return hit ? hit.slice(v.length) : "";
  }, [value]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries, busy]);

  const ctx: ConsoleCtx = useMemo(
    () => ({
      locale,
      pathname,
      theme: resolvedTheme ?? theme,
      t: (key: string) => translate(key),
      push: (lines) =>
        setEntries((e) => [...e, { id: uid++, input: null, lines }]),
      clear: () => setEntries([]),
      close: () => onClose?.(),
      setTheme,
      emit: (event) => window.dispatchEvent(new CustomEvent(event)),
      hire: () => {
        onClose?.();
        hire.open();
      },
      navigate: (href) => {
        if (href.startsWith("__locale__:")) {
          const next = href.split(":")[1];
          const rest = pathname.split("/").slice(2).join("/");
          router.push(`/${next}${rest ? `/${rest}` : ""}`);
          return;
        }
        router.push(`/${locale}${href}`);
      },
    }),
    [
      locale,
      onClose,
      pathname,
      resolvedTheme,
      router,
      setTheme,
      theme,
      translate,
      hire,
    ],
  );

  const submit = useCallback(
    (raw: string) => {
      const input = raw.trim();
      if (!input) return;

      setHistory((h) => [input, ...h].slice(0, 40));
      setCursor(-1);
      setValue("");

      const { cmd, name, args } = resolve(input);
      if (!cmd) {
        setEntries((e) => [
          ...e,
          {
            id: uid++,
            input,
            lines: [{ kind: "error", value: tt("unknown", { command: name }) }],
          },
        ]);
        return;
      }

      setBusy(true);
      const id = uid++;
      setEntries((e) => [...e, { id, input, lines: [] }]);
      setTimeout(
        () => {
          const out = cmd.run(ctx, args);
          setBusy(false);
          if (cmd.name === "clear") return;
          setEntries((e) =>
            e.map((en) => (en.id === id ? { ...en, lines: out ?? [] } : en)),
          );
        },
        160 + Math.random() * 160,
      );
    },
    [ctx, tt],
  );

  const submitRef = useRef(submit);
  useEffect(() => {
    submitRef.current = submit;
  }, [submit]);

  useEffect(() => {
    if (!initialCommand) return;
    const t = setTimeout(() => submitRef.current(initialCommand), 350);
    return () => clearTimeout(t);
  }, [initialCommand]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(value);
      return;
    }
    if (e.key === "Tab" || (e.key === "ArrowRight" && ghost)) {
      if (ghost) {
        e.preventDefault();
        setValue(value.trim() + ghost);
      }
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(cursor + 1, history.length - 1);
      if (next >= 0) {
        setCursor(next);
        setValue(history[next]);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = cursor - 1;
      setCursor(next);
      setValue(next >= 0 ? history[next] : "");
      return;
    }
    if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
      return;
    }
    if (e.key === "Escape" && variant === "overlay") onClose?.();
  };

  const isOverlay = variant === "overlay";

  return (
    <Window
      chrome="terminal"
      className={cn("font-ubuntu os-win:font-mono", className)}
      title={
        <>
          <span className="hidden os-ubuntu:inline">
            {PROFILE.handle}@ubuntu: ~
          </span>
          <span className="hidden os-win:inline">Windows PowerShell</span>
        </>
      }
      subtitle="~"
      icon={<TerminalGlyph />}
      onClose={isOverlay ? onClose : undefined}
      bodyClassName="flex"
    >
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus({ preventScroll: true })}
        className={cn(
          "no-scrollbar min-h-0 w-full flex-1 overflow-y-auto px-4 py-3 text-[0.9rem] leading-[1.5] os-win:text-[0.8125rem] os-win:leading-[1.55]",
          isOverlay && "max-h-[56vh]",
        )}
        style={{ background: "var(--t-bg)", color: "var(--t-fg)" }}
      >
        <Banner locale={locale} />

        <p className="mb-2 whitespace-pre-wrap" style={{ color: "var(--t-ok)" }}>
          {tt("welcome")}
        </p>

        <AnimatePresence initial={false}>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: EASE.expo }}
              className="mb-1.5 last:mb-0"
            >
              {entry.input !== null && (
                <p className="flex flex-wrap gap-x-2">
                  <Prompt />
                  <span>{entry.input}</span>
                </p>
              )}
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.022 } },
                }}
              >
                {entry.lines.map((line, i) => (
                  <ConsoleLine key={i} line={line} />
                ))}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {busy && (
          <p className="animate-pulse text-xs" style={{ color: "var(--t-dim)" }}>
            ▋ {tt("processing")}
          </p>
        )}

        {/* Prompt */}
        <div className="mt-0.5 flex items-center gap-2">
          <Prompt />
          <div className="relative min-w-0 flex-1">
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              aria-label="Terminal input"
              className="w-full bg-transparent caret-transparent outline-none"
              style={{ color: "var(--t-fg)" }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center whitespace-pre"
              style={{ color: "var(--t-dim)" }}
            >
              <span className="invisible">{value}</span>
              <span>{ghost}</span>
              {!ghost && (
                <span
                  className={cn(
                    "ml-px inline-block h-[1.15em] w-[0.55em]",
                    focused ? "animate-caret" : "opacity-50",
                  )}
                  style={{
                    background: "var(--t-fg)",
                    outline: focused ? undefined : "1px solid var(--t-fg)",
                    outlineOffset: -1,
                    backgroundColor: focused ? "var(--t-fg)" : "transparent",
                  }}
                />
              )}
            </span>
          </div>
        </div>
      </div>
    </Window>
  );
}

/** `sambatra@ubuntu:~$` on Ubuntu, `PS C:\Users\sambatra>` on Windows. */
function Prompt() {
  return (
    <span className="select-none whitespace-pre" aria-hidden>
      <span className="hidden os-ubuntu:inline">
        <b style={{ color: "var(--t-user)" }}>{PROFILE.handle}@ubuntu</b>
        <span>:</span>
        <b style={{ color: "var(--t-path)" }}>~</b>
        <span>$</span>
      </span>
      <span className="hidden os-win:inline">
        PS C:\Users\{PROFILE.handle}&gt;
      </span>
    </span>
  );
}

/** The MOTD each shell prints before the site's own welcome. */
function Banner({ locale }: { locale: string }) {
  const [stamp, setStamp] = useState("");
  useEffect(() => {
    setStamp(
      new Date().toLocaleString(locale === "fr" ? "fr-FR" : "en-GB", {
        weekday: "short",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: PROFILE.timezone,
      }),
    );
  }, [locale]);

  return (
    <>
      <pre
        className="mb-3 hidden whitespace-pre-wrap font-ubuntu text-[0.8em] leading-[1.45] os-ubuntu:block"
        style={{ color: "var(--t-dim)" }}
      >
        {`Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-45-generic x86_64)

 * Portfolio:   sambatra.dev
 * Support:     ${PROFILE.email}

Last login: ${stamp || "—"} from 127.0.0.1`}
      </pre>
      <pre
        className="mb-3 hidden whitespace-pre-wrap font-mono text-[0.9em] leading-[1.5] os-win:block"
        style={{ color: "var(--t-fg)" }}
      >
        {`Windows PowerShell
Copyright (C) Microsoft Corporation. All rights reserved.

Install the latest PowerShell for new features and improvements! https://aka.ms/PSWindows
`}
      </pre>
    </>
  );
}

function TerminalGlyph() {
  return (
    <>
      {/* Ubuntu — GNOME terminal icon: dark tile, green prompt */}
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        className="hidden os-ubuntu:block"
        aria-hidden
      >
        <rect x="2" y="3" width="20" height="18" rx="3" fill="#300a24" />
        <path
          d="M6 8.5 9.5 12 6 15.5"
          fill="none"
          stroke="#8ae234"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M11 16h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {/* Windows — PowerShell tile */}
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        className="hidden os-win:block"
        aria-hidden
      >
        <path
          d="M5.5 3h15.2a1.4 1.4 0 0 1 1.36 1.72l-3.3 14.56A2.2 2.2 0 0 1 16.6 21H3.3a1.4 1.4 0 0 1-1.36-1.72l3.3-14.56A2.2 2.2 0 0 1 5.5 3z"
          fill="#2671E5"
        />
        <path
          d="m7.5 8.5 5 3.5-6 4.5"
          fill="none"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M12 16.5h5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </>
  );
}
