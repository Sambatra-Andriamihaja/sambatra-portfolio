"use client";

import { useEffect, useRef } from "react";

/**
 * The live wire. Your pointer is a module port: a small node trails the
 * cursor, and the moment you hover anything interactive a route is drawn
 * from the node to that element — a Make-style bezier on Ubuntu, a
 * flowchart elbow on Windows. Every click sends a bundle down the wire.
 *
 * Fine pointers only, off under reduced motion. The loop runs only while
 * something is still settling; all writes go straight to a handful of SVG
 * attributes.
 */

const INTERACTIVE =
  "a, button, [role=button], input, select, textarea, summary, label, [data-wire]";

export function PointerFx() {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const root = svg.current;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!root || !fine || still) return;

    const q = <T extends SVGElement>(sel: string) => root.querySelector<T>(sel)!;
    const route = q<SVGPathElement>("#wire-route");
    const ring = q<SVGCircleElement>("#wire-ring");
    const dot = q<SVGCircleElement>("#wire-dot");
    const portDot = q<SVGCircleElement>("#wire-port");
    const frame = q<SVGRectElement>("#wire-frame");
    const bundle = q<SVGCircleElement>("#wire-bundle");
    const tail = q<SVGPathElement>("#wire-tail");
    const html = document.documentElement;

    let tx = -100;
    let ty = -100;
    let nx = tx;
    let ny = ty;
    let target: HTMLElement | null = null;
    let raf = 0;
    let shown = false;
    const trail: Array<[number, number]> = [];
    let flight: { start: number } | null = null;

    const isWin = () => html.classList.contains("light");

    /** Port on the target's edge nearest to the pointer, 10px outside it. */
    const dock = (r: DOMRect) => {
      const gap = 10;
      const d = [
        { k: "l", d: Math.abs(tx - r.left) },
        { k: "r", d: Math.abs(tx - r.right) },
        { k: "t", d: Math.abs(ty - r.top) },
        { k: "b", d: Math.abs(ty - r.bottom) },
      ].sort((a, b) => a.d - b.d)[0].k;
      const cx = Math.min(Math.max(tx, r.left + 10), r.right - 10);
      const cy = Math.min(Math.max(ty, r.top + 8), r.bottom - 8);
      if (d === "l") return { x: r.left - gap, y: cy, h: true };
      if (d === "r") return { x: r.right + gap, y: cy, h: true };
      if (d === "t") return { x: cx, y: r.top - gap, h: false };
      return { x: cx, y: r.bottom + gap, h: false };
    };

    /** Wire from the pointer to the docked node. */
    const routeD = (horizontal: boolean) => {
      if (isWin()) {
        return horizontal
          ? `M${tx} ${ty} H${(tx + nx) / 2} V${ny} H${nx}`
          : `M${tx} ${ty} V${(ty + ny) / 2} H${nx} V${ny}`;
      }
      const k = 0.5;
      return horizontal
        ? `M${tx} ${ty} C${tx + (nx - tx) * k} ${ty}, ${nx - (nx - tx) * k} ${ny}, ${nx} ${ny}`
        : `M${tx} ${ty} C${tx} ${ty + (ny - ty) * k}, ${nx} ${ny - (ny - ty) * k}, ${nx} ${ny}`;
    };

    const setVisible = (v: boolean) => {
      if (shown === v) return;
      shown = v;
      root.style.opacity = v ? "1" : "0";
    };

    const draw = (now: number) => {
      raf = 0;
      // the node follows the pointer — or docks onto the hovered element
      let goalX = tx;
      let goalY = ty;
      let port: { x: number; y: number; h: boolean } | null = null;
      let rect: DOMRect | null = null;
      if (target) {
        rect = target.getBoundingClientRect();
        port = dock(rect);
        goalX = port.x;
        goalY = port.y;
      }
      nx += (goalX - nx) * (target ? 0.3 : 0.24);
      ny += (goalY - ny) * (target ? 0.3 : 0.24);
      ring.setAttribute("cx", `${nx}`);
      ring.setAttribute("cy", `${ny}`);
      dot.setAttribute("cx", `${nx}`);
      dot.setAttribute("cy", `${ny}`);

      // comet tail — Ubuntu only
      if (!isWin()) {
        trail.push([nx, ny]);
        if (trail.length > 14) trail.shift();
        tail.setAttribute("d", trail.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" "));
        tail.style.opacity = "0.35";
      } else {
        trail.length = 0;
        tail.setAttribute("d", "");
      }

      let busy = Math.abs(goalX - nx) + Math.abs(goalY - ny) > 0.4;

      if (target && port && rect) {
        const r = rect;
        route.setAttribute("d", routeD(port.h));
        portDot.setAttribute("cx", `${port.x}`);
        portDot.setAttribute("cy", `${port.y}`);
        const pad = 4;
        frame.setAttribute("x", `${r.left - pad}`);
        frame.setAttribute("y", `${r.top - pad}`);
        frame.setAttribute("width", `${r.width + pad * 2}`);
        frame.setAttribute("height", `${r.height + pad * 2}`);
        const radius = parseFloat(getComputedStyle(target).borderRadius) || 6;
        frame.setAttribute("rx", `${Math.min(radius + pad, (r.height + pad * 2) / 2)}`);
        route.style.opacity = "1";
        portDot.style.opacity = "1";
        frame.style.opacity = "1";

        if (flight) {
          const t = Math.min(1, (now - flight.start) / 380);
          const e = 1 - Math.pow(1 - t, 3);
          const len = route.getTotalLength();
          const p = route.getPointAtLength(len * e);
          bundle.setAttribute("cx", `${p.x}`);
          bundle.setAttribute("cy", `${p.y}`);
          bundle.setAttribute("r", `${5 + (t > 0.85 ? (t - 0.85) * 40 : 0)}`);
          bundle.style.opacity = t < 1 ? `${1 - Math.max(0, t - 0.85) * 6}` : "0";
          if (t >= 1) flight = null;
          else busy = true;
        }
      } else {
        route.style.opacity = "0";
        portDot.style.opacity = "0";
        frame.style.opacity = "0";
        bundle.style.opacity = "0";
        flight = null;
      }

      if (busy || trail.length > 1) {
        if (!busy) trail.shift();
        raf = requestAnimationFrame(draw);
      }
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      setVisible(true);
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(INTERACTIVE) ?? null;
      if (el !== target) {
        target = el;
        root.dataset.hover = el ? "1" : "0";
      }
      kick();
    };
    const onDown = () => {
      if (!target) return;
      flight = { start: performance.now() };
      kick();
    };
    const onLeave = () => setVisible(false);
    const onScroll = () => {
      if (target) kick();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <svg
      ref={svg}
      aria-hidden
      data-hover="0"
      className="wire pointer-events-none fixed inset-0 z-[9998] hidden h-full w-full opacity-0 transition-opacity duration-300 [@media(hover:hover)_and_(pointer:fine)]:block motion-reduce:!hidden"
    >
      <path id="wire-tail" className="wire-tail" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path id="wire-route" className="wire-route" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect id="wire-frame" className="wire-frame" fill="none" />
      <circle id="wire-port" className="wire-port" r="4" />
      <circle id="wire-ring" className="wire-ring" r="10" fill="none" />
      <circle id="wire-dot" className="wire-dot" r="3.5" />
      <circle id="wire-bundle" className="wire-bundle" r="5" />
    </svg>
  );
}
