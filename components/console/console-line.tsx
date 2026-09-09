"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import type { Line } from "./types";

const row = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE.expo } },
};

/**
 * Terminal output renderer. Colours come from the active skin's CSS
 * variables (Ubuntu in the dark, PowerShell in the light).
 */
export function ConsoleLine({ line }: { line: Line }) {
  switch (line.kind) {
    case "rule":
      return (
        <motion.p
          variants={row}
          className="my-1 select-none"
          style={{ color: "var(--t-dim)" }}
        >
          ━━━━━━━━━━━━━━━━━━━━━
        </motion.p>
      );

    case "title":
      return (
        <motion.div variants={row} className="mb-1.5 mt-0.5">
          <p className="font-semibold" style={{ color: "var(--t-title)" }}>
            {line.value}
          </p>
          <p className="select-none" style={{ color: "var(--t-dim)" }}>
            {"━".repeat(Math.min(line.value.length, 28))}
          </p>
        </motion.div>
      );

    case "text":
      return (
        <motion.p
          variants={row}
          className="whitespace-pre-wrap"
          style={{ color: line.dim ? "var(--t-dim)" : "var(--t-fg)" }}
        >
          {line.value}
        </motion.p>
      );

    case "ok":
      return (
        <motion.p variants={row} style={{ color: "var(--t-ok)" }}>
          ✓ {line.value}
        </motion.p>
      );

    case "error":
      return (
        <motion.p variants={row} style={{ color: "var(--t-err)" }}>
          ✕ {line.value}
        </motion.p>
      );

    case "brace":
      return (
        <motion.p variants={row} style={{ color: "var(--t-dim)" }}>
          {line.value}
        </motion.p>
      );

    case "kv":
      return (
        <motion.p variants={row} className="flex gap-3">
          <span
            className="w-[22ch] shrink-0 truncate"
            style={{ color: "var(--t-key)" }}
          >
            ▸ {line.key}
          </span>
          <span className="min-w-0 whitespace-pre-wrap">{line.value}</span>
        </motion.p>
      );

    case "json": {
      const isArray = Array.isArray(line.value);
      return (
        <motion.div variants={row} className="pl-4">
          <span style={{ color: "var(--t-link)" }}>&quot;{line.key}&quot;</span>
          <span style={{ color: "var(--t-dim)" }}>: </span>
          {isArray ? (
            <>
              <span style={{ color: "var(--t-dim)" }}>[</span>
              <span className="block pl-4">
                {(line.value as string[]).map((v, i, a) => (
                  <span key={v} className="block">
                    <span style={{ color: "var(--t-key)" }}>
                      &quot;{v}&quot;
                    </span>
                    {i < a.length - 1 && (
                      <span style={{ color: "var(--t-dim)" }}>,</span>
                    )}
                  </span>
                ))}
              </span>
              <span style={{ color: "var(--t-dim)" }}>]</span>
            </>
          ) : (
            <span style={{ color: "var(--t-key)" }}>
              &quot;{line.value as string}&quot;
            </span>
          )}
          {!line.last && <span style={{ color: "var(--t-dim)" }}>,</span>}
        </motion.div>
      );
    }

    case "chips":
      return (
        <motion.div variants={row} className="flex flex-wrap gap-1.5 py-1">
          {line.values.map((v) => (
            <span
              key={v}
              className="rounded border px-1.5 py-0.5 text-[0.7rem]"
              style={{ borderColor: "var(--t-rule)" }}
            >
              {v}
            </span>
          ))}
        </motion.div>
      );

    case "result":
      return (
        <motion.div
          variants={row}
          className="my-1.5 rounded-md border px-3 py-2"
          style={{
            borderColor: "var(--t-rule)",
            background: "var(--t-well)",
          }}
        >
          <p
            className="text-[1.05rem] font-semibold"
            style={{ color: "var(--t-title)" }}
          >
            {line.value}
          </p>
          {line.caption && (
            <p
              className="mt-1 text-[0.68rem]"
              style={{ color: "var(--t-dim)" }}
            >
              {line.caption}
            </p>
          )}
        </motion.div>
      );

    case "link": {
      const cls =
        "group inline-flex items-center gap-2 underline underline-offset-4 transition-opacity hover:opacity-80";
      const style = { color: "var(--t-link)" };
      return (
        <motion.p variants={row}>
          {line.external ? (
            <a
              href={line.href}
              target="_blank"
              rel="noreferrer noopener"
              className={cls}
              style={style}
            >
              <span className="whitespace-pre">{line.label}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                ↗
              </span>
            </a>
          ) : (
            <Link href={line.href} className={cls} style={style}>
              <span className="whitespace-pre">{line.label}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          )}
        </motion.p>
      );
    }

    default:
      return null;
  }
}
