"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE, inView } from "@/lib/motion";

export function Frame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-frame px-gutter", className)}>
      {children}
    </div>
  );
}

export function Band({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("relative py-band", className)}>
      {children}
    </section>
  );
}

/** Centered header for the utility pages (404, error). */
export function SectionHeader({
  title,
  subtitle,
  className,
  as: Tag = "h2",
}: {
  title: string;
  subtitle?: string;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 0.6, ease: EASE.expo }}
      className={cn("mb-12 text-center", className)}
    >
      <Tag className="display text-display-sm text-ink text-balance">{title}</Tag>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-lg text-fluid-base text-muted text-pretty">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
