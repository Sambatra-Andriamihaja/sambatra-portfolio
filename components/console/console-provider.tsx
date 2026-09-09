"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { Console } from "./console";

type Ctx = {
  open: boolean;
  toggle: () => void;
  show: (command?: string) => void;
  hide: () => void;
};

const ConsoleContext = createContext<Ctx | null>(null);

export function useConsole() {
  const ctx = useContext(ConsoleContext);
  if (!ctx) throw new Error("useConsole must be used inside <ConsoleProvider>");
  return ctx;
}

/** ⌘K / Ctrl+K anywhere opens the terminal as an overlay. */
export function ConsoleProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [command, setCommand] = useState<string | undefined>();

  const show = useCallback((cmd?: string) => {
    setCommand(cmd);
    setOpen(true);
  }, []);
  const hide = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => {
    setCommand(undefined);
    setOpen((o) => !o);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const value = useMemo(
    () => ({ open, toggle, show, hide }),
    [open, toggle, show, hide],
  );

  return (
    <ConsoleContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[10vh] sm:pt-[14vh]">
            <motion.button
              type="button"
              aria-label="Dismiss console"
              onClick={hide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE.expo }}
              className="absolute inset-0 cursor-default bg-canvas/70 backdrop-blur-md"
            />
            <motion.div
              role="dialog"
              aria-modal
              aria-label="Terminal"
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="relative w-full max-w-2xl"
            >
              <Console
                variant="overlay"
                autoFocus
                onClose={hide}
                initialCommand={command}
                className="max-h-[70vh]"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConsoleContext.Provider>
  );
}
