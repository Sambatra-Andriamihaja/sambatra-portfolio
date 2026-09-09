"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { DemoProps } from "./types";

const EASE = [0.16, 1, 0.3, 1] as const;

type EventKey = "paired" | "calibrated" | "connected" | "on" | "off" | "auto";
type Entry = { id: number; time: string; key: EventKey };
type Sensors = { gas: number; pressure: number; temp: number; methane: number; rssi: number };
type Tab = "home" | "history" | "forecast" | "settings";

const COPY = {
  en: {
    status: "Connected · Kit #07", thermo: "Thermostat", thermoSub: "Temperature indicator",
    thermoWarn: "To optimise biogas production, keep the digester temperature at 35°C",
    gas: "Gasometer", gasSub: "Biogas in stock", gasWarn: "Refill the kit with organic matter when the indicator reads 10 %",
    press: "Manometer", pressSub: "Line pressure indicator", methane: "Methane", burner: "Burner", burnerSub: "Remote ignition",
    on: "ON", off: "OFF", ignite: "Tap to ignite remotely", extinguish: "Tap to cut the gas",
    daily: "Daily use", forecast: "Forecast", forecastSub: "Autonomy at the current pace", dryIn: "Tank runs dry in", today: "today",
    history: "History", historySub: "Latest kit events", settings: "Kit #07", firmware: "Firmware", signal: "Signal", tank: "Tank capacity",
    tabs: { home: "Home", history: "History", forecast: "Forecast", settings: "Settings" },
    days: (n: number) => (n === 1 ? "1 day" : `${n} days`),
    events: { paired: "Kit paired · firmware 1.4.2", calibrated: "Sensors calibrated", connected: "Connected to Kit #07", on: "Burner ignited remotely", off: "Burner cut remotely", auto: "Low gas — burner shut off" },
  },
  fr: {
    status: "Connecté · Kit #07", thermo: "Thermostat", thermoSub: "Indicateur de température",
    thermoWarn: "Pour optimiser la production de biogaz, veuillez maintenir la température dans le digesteur à 35°C",
    gas: "Gazomètre", gasSub: "Indicateur de la quantité de biogaz en stock", gasWarn: "Veuillez recharger le kit en matières organiques si l'indicateur affiche 10 %",
    press: "Manomètre", pressSub: "Indicateur de pression", methane: "Méthane", burner: "Brûleur", burnerSub: "Allumage à distance",
    on: "ALLUMÉ", off: "ÉTEINT", ignite: "Toucher pour allumer à distance", extinguish: "Toucher pour couper le gaz",
    daily: "Usage quotidien", forecast: "Prévision", forecastSub: "Autonomie au rythme actuel", dryIn: "Réservoir vide dans", today: "aujourd'hui",
    history: "Historique", historySub: "Derniers événements du kit", settings: "Kit #07", firmware: "Firmware", signal: "Signal", tank: "Capacité du réservoir",
    tabs: { home: "Accueil", history: "Historique", forecast: "Prévision", settings: "Réglages" },
    days: (n: number) => (n === 1 ? "1 jour" : `${n} jours`),
    events: { paired: "Kit appairé · firmware 1.4.2", calibrated: "Capteurs calibrés", connected: "Connecté au Kit #07", on: "Brûleur allumé à distance", off: "Brûleur coupé à distance", auto: "Gaz faible — brûleur coupé" },
  },
} as const;

/** Percent of the tank one burner-hour consumes, plus a 1 %/day passive loss; the kit's tank holds 150 L. */
const RATE = 6.5;
const TANK_L = 150;
const INITIAL: Sensors = { gas: 68, pressure: 4.2, temp: 31.4, methane: 61, rssi: -58 };
const SEED: Entry[] = [
  { id: 4, time: "06:53", key: "connected" },
  { id: 3, time: "06:52", key: "off" },
  { id: 2, time: "06:41", key: "calibrated" },
  { id: 1, time: "06:38", key: "paired" },
];
let seq = SEED.length;
const TABS: readonly Tab[] = ["home", "history", "forecast", "settings"];

/** Material icon paths (24px grid), filled like the app's own. */
const ICON = {
  home: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
  history: "M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z",
  forecast: "M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z",
  settings: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
  power: "M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z",
  warn: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
  thermo: "M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-8c0-.55.45-1 1-1s1 .45 1 1h-1v1h1v2h-1v1h1v2h-2V5z",
  tank: "M9 2h6v2H9zM7 5h10a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3zm5 6c-1.2 2-2.5 3.3-2.5 4.7A2.5 2.5 0 0 0 12 18a2.5 2.5 0 0 0 2.5-2.3C14.5 14.3 13.2 13 12 11z",
  gauge: "M20.38 8.57l-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 15.58 6.85l1.85-1.23A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1 10 10 0 0 0-.27-10.44zm-9.79 6.84a2 2 0 0 0 2.83 0l5.66-8.49-8.49 5.66a2 2 0 0 0 0 2.83z",
  flame: "M12 22c-4.4 0-7-3-7-6.6C5 11 8.6 8.7 9.4 4c2.8 1.9 4.2 4.7 3.9 7.5 1.2-.5 1.9-1.6 2.2-3.1C17.6 10.3 19 12.6 19 15.4 19 19 16.4 22 12 22z",
} as const;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const jitter = (amp: number) => (Math.random() - 0.5) * 2 * amp;
const stamp = () => new Date().toTimeString().slice(0, 5);
const entry = (key: EventKey): Entry => ({ id: ++seq, time: stamp(), key });

const Ico = ({ d, className }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" fillRule="evenodd" aria-hidden="true"><path d={d} /></svg>
);

/** The flame only exists while the burner is on, so its flicker never runs idle. */
function Flame({ className }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 24 32" className={className} aria-hidden="true" style={{ originX: 0.5, originY: 1 }} animate={{ scaleY: [1, 1.07, 0.96, 1.04, 1], scaleX: [1, 0.95, 1.03, 0.98, 1] }} transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}>
      <path d="M12 1c1 6 8 9 8 17a8 8 0 0 1-16 0c0-4 2-6 3-9 1 3 2 4 3 4 1-4 1-8 2-12Z" fill="#F4511E" />
      <motion.path d="M12 11c1 3 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-5 .5 1.5 1 2 1.5 2 .5-2 .5-4 1.5-6Z" fill="#FB8C00" style={{ originX: 0.5, originY: 0.78 }} animate={{ scaleY: [1, 0.88, 1.1, 0.95, 1] }} transition={{ duration: 0.45, repeat: Infinity, ease: "easeInOut" }} />
      <path d="M12 19c.5 1.5 2.5 2.5 2.5 4.5a2.5 2.5 0 0 1-5 0c0-1.5 1-2 1.5-3 .3.8.6 1 1 1Z" fill="#FFD54F" />
    </motion.svg>
  );
}

/** The app's card: peach header band, orange Material icon, sky-blue title, grey subtitle, bold orange reading. */
function Card({ icon, title, sub, value, children }: { icon: string; title: string; sub: string; value?: ReactNode; children?: ReactNode }) {
  return (
    <section aria-label={title} className="overflow-hidden rounded-2xl border border-[#E4E4E4] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-3 bg-[#FCE9D6] px-3 py-2">
        <Ico d={icon} className="h-8 w-8 shrink-0 text-[#F3923A]" />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] leading-tight text-[#4DC3F2]">{title}</p>
          <p className="text-[12px] leading-snug text-[#555]">{sub}</p>
        </div>
        {value !== undefined && <p className="shrink-0 text-[16px] font-bold tabular-nums text-[#F3923A]">{value}</p>}
      </div>
      {children && <div className="px-3 py-2.5">{children}</div>}
    </section>
  );
}

const Warn = ({ text }: { text: string }) => (
  <p className="flex items-start gap-1.5 text-[12px] leading-snug text-[#555]"><Ico d={ICON.warn} className="mt-px h-4 w-4 shrink-0 text-[#E53935]" />{text}</p>
);

function Tank({ pct }: { pct: number }) {
  return (
    <div className="relative mx-auto h-24 w-28 overflow-hidden rounded-xl bg-[#CDEEFB]" aria-hidden="true">
      <motion.div className="absolute inset-x-0 bottom-0 bg-[#A6E1F9]" animate={{ height: `${clamp(pct, 0, 100)}%` }} transition={{ duration: 0.3, ease: EASE }}>
        <svg viewBox="0 0 100 8" preserveAspectRatio="none" className="absolute -top-1.5 h-2 w-full fill-[#A6E1F9]"><path d="M0 8V4c20-4 30 4 50 0s30-4 50 0v4z" /></svg>
      </motion.div>
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white px-2.5 py-1 text-[18px] font-bold tabular-nums text-[#F3C300] shadow-sm">{Math.round(pct)}%</span>
    </div>
  );
}

export default function BiogasDemo({ locale, compact = false }: DemoProps) {
  const t = COPY[locale];
  const root = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [tab, setTab] = useState<Tab>("home");
  const [burner, setBurner] = useState(false);
  const [hours, setHours] = useState(2.5);
  const [s, setS] = useState<Sensors>(INITIAL);
  const [log, setLog] = useState<Entry[]>(SEED);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => setNow(Date.now()), []);

  /** Sensors only tick while the demo is on screen in a visible tab. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let seen = false;
    const update = () => setLive(seen && document.visibilityState === "visible");
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; update(); }, { threshold: 0.1 });
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);

  /** Random-walk drift; the burner pulls gas down faster and dips the line pressure. */
  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => {
      setS((p) => ({
        gas: clamp(p.gas - (burner ? 0.25 : 0.03) + jitter(0.02), 0, 100),
        pressure: clamp(p.pressure + ((burner ? 3.1 : 4.3) - p.pressure) * 0.2 + jitter(0.05), 1.5, 6),
        temp: clamp(p.temp + ((burner ? 34.5 : 31.2) - p.temp) * 0.1 + jitter(0.15), 20, 45),
        methane: clamp(p.methane + jitter(0.4), 45, 75),
        rssi: clamp(Math.round(p.rssi + jitter(1.5)), -70, -50),
      }));
    }, 1500);
    return () => window.clearInterval(id);
  }, [live, burner]);

  /** Safety cut-off, exactly what the kit's firmware does. */
  useEffect(() => {
    if (burner && s.gas <= 5) {
      setBurner(false);
      setLog((l) => [entry("auto"), ...l].slice(0, 6));
    }
  }, [burner, s.gas]);

  function toggle() {
    const next = !burner;
    setBurner(next);
    setLog((l) => [entry(next ? "on" : "off"), ...l].slice(0, 6));
  }

  const daily = hours * RATE + 1;
  const daysExact = s.gas / daily;
  const nDays = Math.max(1, Math.ceil(daysExact));
  const dryDate = now === null ? "…" : new Date(now + daysExact * 864e5).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "short" });

  return (
    <div ref={root} className="flex h-full w-full flex-col items-center bg-[#EDEDED] text-[#333]" style={{ fontFamily: "Montserrat, 'Segoe UI', system-ui, sans-serif" }}>
      <div className={`flex min-h-0 w-full flex-1 flex-col bg-white ${compact ? "max-w-[320px]" : "max-w-[360px]"}`}>
        <header className="relative z-10 shrink-0 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)]">
          <div className="flex items-center gap-2 px-3 pt-1.5 pb-1">
            <svg viewBox="0 0 32 32" className="h-9 w-9" aria-hidden="true">
              <path d="M16 2c1 7 10 10 10 19a10 10 0 0 1-20 0c0-5 3-7 4-11 1 3 2 5 3 5 1-5 2-9 3-13Z" fill="#3FB8F0" />
              <path d="M16 15c.7 3.5 5 5 5 9a5 5 0 0 1-10 0c0-2.5 1.5-3.5 2.2-5.5.4 1.5 1 2 1.6 2 .4-2 .6-3.5 1.2-5.5Z" fill="#F3923A" />
            </svg>
            <p className="text-[22px] font-medium leading-none tracking-tight">Kit <span className="text-[#F3923A]">App</span></p>
          </div>
          <div className="flex h-6 items-center bg-[#8ED8F6] px-3">
            <p className="text-[12px] font-medium text-[#1A5C78]">{t.status}</p>
          </div>
          <span className="absolute right-2 top-1 grid h-12 w-12 place-items-center rounded-full bg-white" aria-hidden="true">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#22C05A] text-white shadow-[0_2px_4px_rgba(0,0,0,0.2)]"><Ico d={ICON.power} className="h-5 w-5" /></span>
          </span>
        </header>

        <main className="min-h-0 flex-1 overflow-auto px-3 py-3">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2, ease: EASE }} className="flex flex-col gap-3">
              {tab === "home" && (
                <>
                  <Card icon={ICON.thermo} title={t.thermo} sub={t.thermoSub} value={`${s.temp.toFixed(1)} °C`}><Warn text={t.thermoWarn} /></Card>
                  <Card icon={ICON.tank} title={t.gas} sub={t.gasSub} value={`${((s.gas * TANK_L) / 100).toFixed(1)} L`}>
                    <Tank pct={s.gas} />
                    <div className="mt-2.5"><Warn text={t.gasWarn} /></div>
                  </Card>
                  <Card icon={ICON.gauge} title={t.press} sub={t.pressSub} value={`${s.pressure.toFixed(1)} kPa`}>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#CDEEFB]" aria-hidden="true">
                      <motion.div className="h-full rounded-full bg-[#4DC3F2]" animate={{ width: `${(s.pressure / 6) * 100}%` }} transition={{ duration: 0.3, ease: EASE }} />
                    </div>
                    <p className="mt-1.5 text-[12px] text-[#555]">{t.methane} <strong className="font-bold tabular-nums text-[#F3923A]">{Math.round(s.methane)} %</strong></p>
                  </Card>
                  <Card icon={ICON.flame} title={t.burner} sub={t.burnerSub} value={burner ? t.on : t.off}>
                    <button type="button" role="switch" aria-checked={burner} onClick={toggle} className="flex w-full items-center gap-3 text-left">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#FCE9D6]">
                        <AnimatePresence mode="wait" initial={false}>
                          {burner ? (
                            <motion.span key="on" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="flex"><Flame className="h-8 w-6" /></motion.span>
                          ) : (
                            <motion.span key="off" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="flex text-[#BDBDBD]"><Ico d={ICON.flame} className="h-8 w-8" /></motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                      <span className="min-w-0 flex-1 text-[12px] leading-snug text-[#555]">{burner ? t.extinguish : t.ignite}</span>
                      <span className={`relative h-[14px] w-[34px] shrink-0 rounded-full transition-colors duration-300 ${burner ? "bg-[#22C05A]/45" : "bg-[#9E9E9E]/50"}`} aria-hidden="true">
                        <motion.span className={`absolute -top-[3px] h-5 w-5 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.3)] ${burner ? "bg-[#22C05A]" : "bg-[#FAFAFA]"}`} animate={{ x: burner ? 16 : -2 }} transition={{ duration: 0.25, ease: EASE }} />
                      </span>
                    </button>
                  </Card>
                </>
              )}
              {tab === "history" && (
                <Card icon={ICON.history} title={t.history} sub={t.historySub}>
                  <ul className="flex flex-col gap-1.5 text-[12px]">
                    <AnimatePresence initial={false}>
                      {log.map((e) => (
                        <motion.li key={e.id} layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="flex items-baseline gap-2">
                          <span className="shrink-0 font-bold tabular-nums text-[#F3923A]">{e.time}</span>
                          <span className={`truncate ${e.key === "auto" ? "font-medium text-[#E53935]" : "text-[#555]"}`}>{t.events[e.key]}</span>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </Card>
              )}
              {tab === "forecast" && (
                <Card icon={ICON.forecast} title={t.forecast} sub={t.forecastSub} value={t.days(nDays)}>
                  <label className="flex flex-col gap-1 text-[12px] text-[#555]">
                    <span className="flex items-center justify-between">{t.daily}<span className="font-bold tabular-nums text-[#F3923A]">{hours.toFixed(1)} h</span></span>
                    <input type="range" min={0.5} max={6} step={0.5} value={hours} onChange={(e) => setHours(Number(e.target.value))} aria-label={t.daily} className="w-full accent-[#F3923A]" />
                  </label>
                  <p className="mt-2 text-[12px] text-[#555]">
                    {t.dryIn}{" "}
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.strong key={nDays} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease: EASE }} className="inline-block text-[15px] font-bold text-[#4DC3F2]">{t.days(nDays)}</motion.strong>
                    </AnimatePresence>{" "}
                    <span className="tabular-nums text-[#888]">(≈ {dryDate})</span>
                  </p>
                  <div className="mt-2 flex h-12 items-end gap-0.5" aria-hidden="true">
                    {Array.from({ length: 14 }, (_, i) => {
                      const level = Math.max(0, s.gas - daily * i);
                      const tone = level === 0 ? "bg-[#E53935]/25" : i === Math.floor(daysExact) ? "bg-[#F3C300]" : "bg-[#A6E1F9]";
                      return <motion.div key={i} className={`flex-1 rounded-sm ${tone}`} animate={{ height: `${Math.max(6, level)}%` }} transition={{ duration: 0.3, ease: EASE }} />;
                    })}
                  </div>
                  <div className="mt-1 flex justify-between text-[12px] text-[#888]"><span>{t.today}</span><span>+14 d</span></div>
                </Card>
              )}
              {tab === "settings" && (
                <Card icon={ICON.settings} title={t.settings} sub={t.status}>
                  <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-[12px] text-[#555]">
                    <div><dt>{t.firmware}</dt><dd className="font-bold text-[#333]">1.4.2</dd></div>
                    <div><dt>{t.signal}</dt><dd className="font-bold tabular-nums text-[#333]">{s.rssi} dBm</dd></div>
                    <div><dt>{t.tank}</dt><dd className="font-bold tabular-nums text-[#333]">{TANK_L} L</dd></div>
                    <div><dt>{t.methane}</dt><dd className="font-bold tabular-nums text-[#333]">{Math.round(s.methane)} %</dd></div>
                  </dl>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <nav aria-label="Kit App" className="relative grid h-12 shrink-0 grid-cols-4 bg-[#F5A24B]">
          {TABS.map((k) => {
            const active = tab === k;
            return (
              <button key={k} type="button" onClick={() => setTab(k)} aria-pressed={active} aria-label={t.tabs[k]} title={t.tabs[k]} className="relative grid place-items-center text-[#7A4A1D]">
                {active && <motion.span layoutId="kit-app-bump" className="absolute -top-3.5 h-12 w-12 rounded-full bg-[#F5A24B] shadow-[0_0_0_3px_#fff]" transition={{ duration: 0.3, ease: EASE }} aria-hidden="true" />}
                <motion.span className="relative flex" animate={{ y: active ? -12 : 0 }} transition={{ duration: 0.3, ease: EASE }}><Ico d={ICON[k]} className="h-6 w-6" /></motion.span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
