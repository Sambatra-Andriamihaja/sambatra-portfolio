"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SCENARIO_RUN_PENDING } from "@/components/console/registry";
import { APPS, NODE_R } from "./apps";
import type { NodeStatus, Scenario, ScenarioEdge, ScenarioNode } from "./types";

export type ScenarioLabels = {
  run: string;
  running: string;
  reset: string;
  ops: string;
  schedule: string;
  hint: string;
  errorHandler: string;
};

const DEFAULT_LABELS: ScenarioLabels = {
  run: "Run once",
  running: "Running…",
  reset: "Reset layout",
  ops: "operations",
  schedule: "Scheduling",
  hint: "Drag a module · hover for details",
  errorHandler: "error handler",
};

type Props = {
  scenario: Scenario;
  variant?: "full" | "compact";
  className?: string;
  runEvent?: string;
  autoRun?: boolean;
  labels?: Partial<ScenarioLabels>;
};

type Bundle = { id: number; edge: string; start: number; dur: number; onDone?: () => void };

/* Make's editor palette — the canvas is a product surface, so it does not
   follow the OS theme. */
const MK = {
  bg: "#F4F4F7",
  route: "#BDBDC9",
  active: "#6D00CC",
  filterStroke: "#D9D9E1",
  text: "#26262E",
  sub: "#6E6E7A",
  error: "#E23C3C",
  white: "#FFFFFF",
};

const W = 1000;
const H = 560;
const TRAVEL = 700;
let bid = 0;

/**
 * Make-style scenario canvas. Solid brand-coloured modules wired left to
 * right; "Run once" walks the graph tier by tier and sends bundles down each
 * route. Modules drag, routes carry filter pills, error routes are dashed,
 * and every module opens an inspector on hover. The animation loop only
 * runs while a bundle is travelling.
 */
export function ScenarioCanvas({
  scenario,
  variant = "full",
  className,
  runEvent,
  autoRun = variant === "full",
  labels: partial,
}: Props) {
  const labels = { ...DEFAULT_LABELS, ...partial };
  const compact = variant === "compact";

  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const bundleRefs = useRef<Record<number, SVGGElement | null>>({});
  const bundlesRef = useRef<Bundle[]>([]);
  const timers = useRef<number[]>([]);
  const raf = useRef(0);

  const [pos, setPos] = useState<Record<string, { x: number; y: number }>>(() =>
    Object.fromEntries(scenario.nodes.map((n) => [n.id, { x: n.x, y: n.y }])),
  );
  const [status, setStatus] = useState<Record<string, NodeStatus>>({});
  const [ops, setOps] = useState<Record<string, number>>({});
  const [activeEdges, setActiveEdges] = useState<Set<string>>(new Set());
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [drag, setDrag] = useState<string | null>(null);
  const [inView, setInView] = useState(false);
  const ranOnce = useRef(false);

  const nodes = useMemo(() => Object.fromEntries(scenario.nodes.map((n) => [n.id, n])), [scenario.nodes]);

  const vb = useMemo(() => {
    if (!compact) return { x: 0, y: 0, w: W, h: H };
    const xs = scenario.nodes.map((n) => pos[n.id].x);
    const ys = scenario.nodes.map((n) => pos[n.id].y);
    const pad = NODE_R + 40;
    const x = Math.min(...xs) - pad;
    const y = Math.min(...ys) - pad;
    return { x, y, w: Math.max(...xs) + pad - x, h: Math.max(...ys) + pad - y };
  }, [compact, pos, scenario.nodes]);

  const edgePath = useCallback(
    (e: ScenarioEdge) => {
      const a = pos[e.from];
      const b = pos[e.to];
      const x1 = a.x + NODE_R + 2;
      const x2 = b.x - NODE_R - 2;
      const dx = Math.max(Math.abs(x2 - x1) * 0.5, 40);
      return `M ${x1} ${a.y} C ${x1 + dx} ${a.y}, ${x2 - dx} ${b.y}, ${x2} ${b.y}`;
    },
    [pos],
  );

  /* ── animation loop: alive only while bundles exist ────────────────── */
  useEffect(() => {
    bundlesRef.current = bundles;
    if (!bundles.length || raf.current) return;
    const tick = (now: number) => {
      const list = bundlesRef.current;
      if (!list.length) {
        raf.current = 0;
        return;
      }
      const finished: Bundle[] = [];
      for (const b of list) {
        const path = pathRefs.current[b.edge];
        const g = bundleRefs.current[b.id];
        if (!path || !g) continue;
        const t = Math.min(1, (now - b.start) / b.dur);
        const eased = 1 - Math.pow(1 - t, 3);
        const p = path.getPointAtLength(path.getTotalLength() * eased);
        g.setAttribute("transform", `translate(${p.x} ${p.y})`);
        if (t >= 1) finished.push(b);
      }
      if (finished.length) {
        setBundles((cur) => cur.filter((b) => !finished.includes(b)));
        finished.forEach((b) => b.onDone?.());
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [bundles]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const send = useCallback((edge: string, onDone?: () => void) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDone?.();
      return;
    }
    setBundles((cur) => [...cur, { id: bid++, edge, start: performance.now(), dur: TRAVEL, onDone }]);
  }, []);

  /* ── run ───────────────────────────────────────────────────────────── */
  const run = useCallback(() => {
    if (running) return;
    setRunning(true);
    setStatus({});
    setOps({});
    setActiveEdges(new Set());
    setElapsed(null);
    const t0 = performance.now();

    const outgoing = new Map<string, ScenarioEdge[]>();
    scenario.edges.filter((e) => !e.error).forEach((e) => outgoing.set(e.from, [...(outgoing.get(e.from) ?? []), e]));
    const incoming = new Set(scenario.edges.map((e) => e.to));
    const roots = scenario.nodes.filter((n) => n.kind === "trigger" || !incoming.has(n.id));

    let pending = 0;
    const finish = () =>
      later(() => {
        setRunning(false);
        setElapsed(Math.round(performance.now() - t0));
        setActiveEdges(new Set());
      }, 450);

    const arrive = (id: string) => {
      setStatus((s) => ({ ...s, [id]: "active" }));
      setOps((o) => ({ ...o, [id]: (o[id] ?? 0) + 1 }));
      later(() => setStatus((s) => ({ ...s, [id]: "done" })), 600);
      const next = outgoing.get(id) ?? [];
      next.forEach((e, i) => {
        pending++;
        later(() => {
          setActiveEdges((set) => new Set(set).add(e.id));
          send(e.id, () => {
            pending--;
            arrive(e.to);
            if (pending === 0) finish();
          });
        }, 220 + i * 80);
      });
      if (next.length === 0 && pending === 0) finish();
    };

    roots.forEach((r, i) => later(() => arrive(r.id), i * 120));
  }, [later, running, scenario.edges, scenario.nodes, send]);

  const runRef = useRef(run);
  useEffect(() => {
    runRef.current = run;
  }, [run]);

  useEffect(() => {
    if (!runEvent) return;
    const h = () => runRef.current();
    window.addEventListener(runEvent, h);
    return () => window.removeEventListener(runEvent, h);
  }, [runEvent]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || ranOnce.current) return;
    let pending = false;
    try {
      pending = sessionStorage.getItem(SCENARIO_RUN_PENDING) === "1";
      if (pending) sessionStorage.removeItem(SCENARIO_RUN_PENDING);
    } catch {
      /* ignore */
    }
    if (pending || autoRun) {
      ranOnce.current = true;
      later(() => runRef.current(), pending ? 400 : 700);
    }
  }, [autoRun, inView, later]);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  /* ── drag ──────────────────────────────────────────────────────────── */
  const toCanvas = (e: ReactPointerEvent) => {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const m = svg.getScreenCTM();
    return m ? pt.matrixTransform(m.inverse()) : pt;
  };
  const onDown = (id: string) => (e: ReactPointerEvent<SVGGElement>) => {
    if (compact) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag(id);
  };
  const onMove = (e: ReactPointerEvent<SVGGElement>) => {
    if (!drag) return;
    const p = toCanvas(e);
    setPos((cur) => ({
      ...cur,
      [drag]: {
        x: Math.min(W - NODE_R - 8, Math.max(NODE_R + 8, p.x)),
        y: Math.min(H - NODE_R - 44, Math.max(NODE_R + 8, p.y)),
      },
    }));
  };
  const onUp = () => setDrag(null);
  const reset = () => setPos(Object.fromEntries(scenario.nodes.map((n) => [n.id, { x: n.x, y: n.y }])));

  const totalOps = Object.values(ops).reduce((a, b) => a + b, 0);
  const hovered = hover ? nodes[hover] : null;
  const pct = (x: number, y: number) => ({
    left: `${((x - vb.x) / vb.w) * 100}%`,
    top: `${((y - vb.y) / vb.h) * 100}%`,
  });

  return (
    <div
      ref={wrapRef}
      className={cn("relative select-none", className)}
      style={{
        aspectRatio: `${vb.w} / ${vb.h}`,
        background: MK.bg,
        backgroundImage: "radial-gradient(rgba(0,0,0,0.11) 1px, transparent 1.2px)",
        backgroundSize: "22px 22px",
      }}
    >
      <svg
        ref={svgRef}
        viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
        className="relative block h-full w-full"
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        role="img"
        aria-label={scenario.name}
      >
        {scenario.edges.map((e) => {
          const d = edgePath(e);
          const on = activeEdges.has(e.id);
          const a = pos[e.from];
          const b = pos[e.to];
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          const label = e.error ? labels.errorHandler : e.filter;
          return (
            <g key={e.id}>
              <path
                ref={(el) => {
                  pathRefs.current[e.id] = el;
                }}
                d={d}
                fill="none"
                stroke={e.error ? MK.error : on ? MK.active : MK.route}
                strokeWidth={e.error ? 1.5 : 2.5}
                strokeDasharray={e.error ? "5 7" : undefined}
                strokeLinecap="round"
                style={{ transition: "stroke 300ms ease" }}
              />
              {on && !e.error && (
                <path d={d} fill="none" stroke={MK.active} strokeWidth={2.5} strokeDasharray="4 20" strokeLinecap="round" className="animate-flow" opacity={0.9} />
              )}
              {label && !compact && (
                <g transform={`translate(${mx} ${my})`}>
                  <rect x={-(label.length * 3.4 + 16)} y={-11} width={label.length * 6.8 + 32} height={22} rx={11} fill={MK.white} stroke={e.error ? MK.error : MK.filterStroke} />
                  <path d="M-3 -4h6l-2.2 3v3l-1.6 1v-4z" transform={`translate(${-(label.length * 3.4 + 4)} 0)`} fill={e.error ? MK.error : MK.sub} />
                  <text x={4} y={3.5} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill={e.error ? MK.error : MK.sub}>
                    {label}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {scenario.nodes.map((n) => (
          <Module
            key={n.id}
            node={n}
            x={pos[n.id].x}
            y={pos[n.id].y}
            status={status[n.id] ?? "idle"}
            ops={ops[n.id] ?? 0}
            compact={compact}
            onPointerDown={onDown(n.id)}
            onEnter={() => setHover(n.id)}
            onLeave={() => setHover((h) => (h === n.id ? null : h))}
          />
        ))}

        {bundles.map((b) => (
          <g
            key={b.id}
            ref={(el) => {
              bundleRefs.current[b.id] = el;
            }}
            transform="translate(-100 -100)"
          >
            <circle r={10} fill={MK.active} opacity={0.18} />
            <circle r={5.5} fill={MK.active} />
          </g>
        ))}
      </svg>

      <AnimatePresence>
        {hovered && !drag && (
          <motion.div
            key={hovered.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className="pointer-events-none absolute z-10 w-60 -translate-x-1/2 translate-y-3 rounded-lg bg-white p-3 text-left shadow-[0_8px_30px_-12px_rgba(0,0,0,0.35)] ring-1 ring-black/10"
            style={pct(pos[hovered.id].x, pos[hovered.id].y + NODE_R + 40)}
          >
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full text-white" style={{ background: APPS[hovered.app].hue }}>
                <svg viewBox="0 0 24 24" width="14" height="14">{APPS[hovered.app].glyph}</svg>
              </span>
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold" style={{ color: MK.text }}>
                  {hovered.label} <span style={{ color: MK.sub }}>· {hovered.action}</span>
                </p>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: MK.sub }}>
                  {hovered.kind} · {APPS[hovered.app].name}
                </p>
              </div>
            </div>
            {hovered.note && <p className="mt-2 text-[12px] leading-relaxed" style={{ color: MK.sub }}>{hovered.note}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {compact ? (
        <button
          type="button"
          onClick={run}
          disabled={running}
          aria-label={labels.run}
          className="absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full text-white shadow-md transition-transform active:scale-95 disabled:opacity-60"
          style={{ background: MK.active }}
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden><path d="M7 5v14l11-7z" /></svg>
        </button>
      ) : (
        <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center gap-3 rounded-lg bg-white px-3 py-2 shadow-[0_6px_24px_-12px_rgba(0,0,0,0.3)] ring-1 ring-black/[0.06]">
          <button
            type="button"
            onClick={run}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] font-semibold text-white transition-transform active:scale-[0.97] disabled:opacity-60"
            style={{ background: MK.active }}
          >
            <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor" aria-hidden><path d="M7 5v14l11-7z" /></svg>
            {running ? labels.running : labels.run}
          </button>
          <span className="hidden text-[11px] sm:inline" style={{ color: MK.sub }}>
            {labels.schedule}: <span style={{ color: MK.text }}>{scenario.schedule}</span>
          </span>
          <span className="ml-auto text-[11px] tnum" style={{ color: MK.sub }}>
            <span className="font-semibold" style={{ color: MK.text }}>{totalOps}</span> {labels.ops}
            {elapsed !== null && ` · ${elapsed} ms`}
          </span>
          <button type="button" onClick={reset} className="hidden text-[11px] underline-offset-2 hover:underline md:inline" style={{ color: MK.sub }}>
            {labels.reset}
          </button>
          <span className="hidden text-[11px] lg:inline" style={{ color: MK.sub }}>{labels.hint}</span>
        </div>
      )}
    </div>
  );
}

function Module({
  node,
  x,
  y,
  status,
  ops,
  compact,
  onPointerDown,
  onEnter,
  onLeave,
}: {
  node: ScenarioNode;
  x: number;
  y: number;
  status: NodeStatus;
  ops: number;
  compact: boolean;
  onPointerDown: (e: ReactPointerEvent<SVGGElement>) => void;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const app = APPS[node.app];
  const lit = status === "active";
  return (
    <g
      transform={`translate(${x} ${y})`}
      onPointerDown={onPointerDown}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      style={{ cursor: compact ? "default" : "grab" }}
    >
      {lit && <circle r={NODE_R + 6} fill="none" stroke={app.hue} strokeWidth={2} opacity={0.55} />}
      {node.kind === "trigger" && (
        <circle r={NODE_R + 6} fill="none" stroke={app.hue} strokeOpacity={0.5} strokeWidth={1.2} strokeDasharray="3 6" />
      )}
      <circle r={NODE_R} fill={app.hue} style={{ filter: lit ? `drop-shadow(0 4px 12px ${app.hue}88)` : "drop-shadow(0 2px 6px rgba(0,0,0,0.18))", transition: "filter 300ms ease" }} />
      <svg x={-13} y={-13} width={26} height={26} viewBox="0 0 24 24" style={{ color: "#fff" }}>
        {app.glyph}
      </svg>
      {ops > 0 && (
        <g transform={`translate(${NODE_R * 0.8} ${-NODE_R * 0.8})`}>
          <circle r={9} fill={MK.active} stroke={MK.white} strokeWidth={2} />
          <text y={3.5} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="var(--font-mono)" fill="#fff">
            {ops}
          </text>
        </g>
      )}
      {!compact && (
        <>
          <text y={NODE_R + 19} textAnchor="middle" fontSize={13} fontWeight={600} fontFamily="var(--font-sans)" fill={MK.text}>
            {node.label}
          </text>
          <text y={NODE_R + 34} textAnchor="middle" fontSize={10.5} fontFamily="var(--font-mono)" fill={MK.sub}>
            {node.action}
          </text>
        </>
      )}
    </g>
  );
}
