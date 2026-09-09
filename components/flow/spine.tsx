"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type Port = { id: string; name: string; at: number };

const RAIL = 240; // px
const AXIS = 6.5; // px — centre line of the wire and every dot
const PORT = 13; // px — port ring diameter
const BUNDLE = 8; // px — travelling dot diameter

/**
 * The flow spine. A fixed rail on the left (xl+) that mirrors the page as
 * a scenario: every `[data-module]` section is a port, the visitor is the
 * bundle on the wire. Every element is centred on one axis; the bundle
 * moves with a transform only. The active section's name stays visible on
 * wide screens; the others show on hover.
 */
export function Spine() {
  const [ports, setPorts] = useState<Port[]>([]);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });
  const y = useTransform(progress, (v) => v * RAIL);

  useEffect(() => {
    const measure = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-module]"));
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setPorts(
        els.map((el) => ({
          id: el.id,
          name: el.dataset.moduleName ?? "",
          at: Math.min(1, Math.max(0, (el.offsetTop - 96) / max)),
        })),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      let i = 0;
      for (let k = 0; k < ports.length; k++) if (v + 0.02 >= ports[k].at) i = k;
      setActive(i);
    });
    return unsub;
  }, [ports, scrollYProgress]);

  if (ports.length < 2) return null;

  return (
    <nav
      aria-label="Sections"
      className="pointer-events-none fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
      style={{ height: RAIL, width: PORT }}
    >
      {/* wire */}
      <span className="absolute top-0 h-full w-px bg-line" style={{ left: AXIS - 0.5 }} />
      <motion.span
        className="absolute top-0 h-full w-px origin-top bg-accent/70"
        style={{ left: AXIS - 0.5, scaleY: progress }}
      />

      {/* bundle — positioned so its centre sits on the axis; y is the only transform */}
      <motion.span
        aria-hidden
        className="absolute rounded-full bg-accent"
        style={{
          left: AXIS - BUNDLE / 2,
          top: -BUNDLE / 2,
          width: BUNDLE,
          height: BUNDLE,
          y,
        }}
      />

      {ports.map((p, i) => {
        const on = i === active;
        const passed = i < active;
        return (
          <a
            key={p.id}
            href={`#${p.id}`}
            aria-label={p.name}
            aria-current={on ? "step" : undefined}
            className="group pointer-events-auto absolute flex items-center gap-2.5"
            style={{ left: AXIS - PORT / 2, top: p.at * RAIL - PORT / 2, height: PORT }}
          >
            <span
              className={cn(
                "grid place-items-center rounded-full bg-canvas ring-1 transition-colors duration-200",
                on || passed ? "ring-accent/70" : "ring-line group-hover:ring-edge",
              )}
              style={{ width: PORT, height: PORT }}
            >
              <span
                className={cn(
                  "h-[5px] w-[5px] rounded-full",
                  on ? "bg-accent" : passed ? "bg-accent/50" : "bg-faint/50",
                )}
              />
            </span>
            <span
              className={cn(
                "whitespace-nowrap rounded-[4px] bg-surface px-1.5 py-0.5 text-[0.72rem] font-medium leading-none text-ink shadow-card transition-opacity duration-150",
                on ? "opacity-0 2xl:opacity-100" : "opacity-0",
                "group-hover:opacity-100",
              )}
            >
              {p.name}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
