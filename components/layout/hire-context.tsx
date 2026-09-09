"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Ctx = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const HireMeContext = createContext<Ctx | null>(null);

/** Lets the floating button, the console and any CTA open the same contact sheet. */
export function HireMeProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);
  return (
    <HireMeContext.Provider value={value}>{children}</HireMeContext.Provider>
  );
}

export function useHireMe() {
  const ctx = useContext(HireMeContext);
  if (!ctx) throw new Error("useHireMe must be used inside <HireMeProvider>");
  return ctx;
}
