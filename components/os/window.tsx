import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * OS window chrome. Both control sets are in the DOM and CSS picks one, so
 * the frame is right on first paint:
 *
 *   :root  (Ubuntu)   Yaru headerbar — Ubuntu face, centred title, flat
 *                     minimise/maximise glyphs and the orange close circle.
 *   .light (Windows)  Win11 title bar — Segoe face, 32px, app icon + left
 *                     title, three 46px caption buttons, red close hover.
 *
 * `chrome="terminal"` swaps in the two terminal emulators' own bars:
 *
 *   Ubuntu   GNOME Terminal headerbar — aubergine, new-tab button, bold
 *            centred title over the working directory, tab overview and
 *            menu, Yaru round controls.
 *   Windows  Windows Terminal tab row — dark, one tab (icon, title, ×),
 *            new-tab + dropdown, white caption buttons.
 */

type WindowProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  status?: ReactNode;
  actions?: ReactNode;
  onClose?: () => void;
  onMaximize?: () => void;
  as?: ElementType;
  id?: string;
  chrome?: "app" | "terminal";
};

export function Window({
  title,
  subtitle,
  icon,
  children,
  className,
  bodyClassName,
  status,
  actions,
  onClose,
  onMaximize,
  as: Tag = "div",
  id,
  chrome = "app",
}: WindowProps) {
  return (
    <Tag id={id} className={cn("win", className)} data-window>
      {chrome === "terminal" ? (
        <TerminalBar title={title} subtitle={subtitle} icon={icon} onClose={onClose} />
      ) : (
      <div className="win-bar">
        <div className="flex min-w-0 items-center gap-2 os-ubuntu:min-w-[84px]">
          {icon && (
            <span className="grid h-4 w-4 shrink-0 place-items-center text-[14px]">
              {icon}
            </span>
          )}
          <span className="hidden truncate text-[0.75rem] os-win:inline">{title}</span>
        </div>

        <span className="hidden min-w-0 flex-1 truncate text-center text-[0.82rem] font-medium os-ubuntu:block">
          {title}
        </span>
        <span className="hidden flex-1 os-win:block" />

        {actions && <div className="flex items-center gap-1 text-[0.7rem] text-muted">{actions}</div>}

        {/* Ubuntu · Yaru */}
        <div className="hidden items-center gap-1 os-ubuntu:flex">
          <Yaru label="Minimize">
            <path d="M6 12h12" />
          </Yaru>
          <Yaru label="Maximize" onClick={onMaximize}>
            <rect x="6.5" y="6.5" width="11" height="11" rx="1.5" />
          </Yaru>
          <Yaru label="Close" onClick={onClose} close>
            <path d="m7.5 7.5 9 9M16.5 7.5l-9 9" />
          </Yaru>
        </div>

        {/* Windows · caption buttons */}
        <div className="-mr-2 hidden items-stretch self-stretch os-win:flex">
          <Caption label="Minimize">
            <path d="M5 12h14" />
          </Caption>
          <Caption label="Maximize" onClick={onMaximize}>
            <rect x="6" y="6" width="12" height="12" rx="1.5" />
          </Caption>
          <Caption label="Close" onClick={onClose} close>
            <path d="m6 6 12 12M18 6 6 18" />
          </Caption>
        </div>
      </div>
      )}

      {/* flex-auto, not flex-1: an explicit height on the body must win when
          the window is content-sized, yet still stretch in a fixed window. */}
      <div className={cn("relative min-h-0 flex-auto overflow-hidden", bodyClassName)}>
        {children}
      </div>

      {status && (
        <div className="flex h-8 shrink-0 items-center gap-3 border-t border-line bg-raise px-3 text-[0.7rem] text-faint">
          {status}
        </div>
      )}
    </Tag>
  );
}

function Yaru({
  children,
  label,
  onClick,
  close,
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  close?: boolean;
}) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      aria-label={onClick ? label : undefined}
      aria-hidden={!onClick}
      onClick={onClick}
      className={cn(
        "grid h-6 w-6 place-items-center rounded-full transition-colors duration-150",
        close ? "bg-accent text-white" : "text-ink/85",
        onClick && !close && "hover:bg-white/10",
        onClick && close && "hover:bg-accent2",
      )}
    >
      <svg viewBox="0 0 24 24" width={close ? 11 : 12} height={close ? 11 : 12} fill="none" stroke="currentColor" strokeWidth={close ? 2.6 : 1.8} strokeLinecap="round">
        {children}
      </svg>
    </Comp>
  );
}

function Caption({
  children,
  label,
  onClick,
  close,
  dark,
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  close?: boolean;
  dark?: boolean;
}) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      aria-label={onClick ? label : undefined}
      aria-hidden={!onClick}
      onClick={onClick}
      className={cn(
        "grid w-[46px] place-items-center transition-colors duration-100",
        dark ? "text-white" : "text-ink/85",
        onClick && !close && (dark ? "hover:bg-white/10" : "hover:bg-black/[0.06]"),
        onClick && close && "hover:bg-[#C42B1C] hover:text-white",
      )}
    >
      <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        {children}
      </svg>
    </Comp>
  );
}

/* ── Terminal chrome ─────────────────────────────────────────────────── */

function TerminalBar({
  title,
  subtitle,
  icon,
  onClose,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  onClose?: () => void;
}) {
  return (
    <>
      {/* Ubuntu · GNOME Terminal headerbar */}
      <div
        className="hidden h-[46px] shrink-0 select-none items-center gap-1 px-2 font-ubuntu text-white os-ubuntu:flex"
        style={{ background: "#2c0b1f", boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.45)" }}
      >
        <HeaderIcon label="New tab">
          <path d="M3.5 7.5v10a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-8l-1.6-2H5.5a2 2 0 0 0-2 2v1z" />
          <path d="M12 10.5v6M9 13.5h6" />
        </HeaderIcon>
        <div className="min-w-0 flex-1 px-2 text-center leading-none">
          <div className="truncate text-[0.86rem] font-bold">{title}</div>
          {subtitle && <div className="mt-[3px] truncate text-[0.66rem] text-white/60">{subtitle}</div>}
        </div>
        <HeaderIcon label="Tabs">
          <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
          <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
          <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
          <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
        </HeaderIcon>
        <HeaderIcon label="Menu">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </HeaderIcon>
        <div className="ml-1.5 flex items-center gap-[7px]">
          <Round label="Minimize">
            <path d="M7 12.5h10" />
          </Round>
          <Round label="Maximize">
            <rect x="7.25" y="7.25" width="9.5" height="9.5" rx="1" />
          </Round>
          <Round label="Close" onClick={onClose} close>
            <path d="m8 8 8 8M16 8l-8 8" />
          </Round>
        </div>
      </div>

      {/* Windows · Windows Terminal tab row */}
      <div
        className="hidden h-10 shrink-0 select-none items-stretch pl-2 font-sans text-white os-win:flex"
        style={{ background: "#1c1c1c" }}
      >
        <div className="mt-[5px] flex min-w-0 max-w-[240px] items-center gap-2 rounded-t-[6px] bg-[#2d2d2d] pl-2.5 pr-1 text-[0.75rem]">
          {icon && <span className="grid h-4 w-4 shrink-0 place-items-center">{icon}</span>}
          <span className="min-w-0 flex-1 truncate pr-4">{title}</span>
          <TabButton label="Close tab" onClick={onClose} size={24}>
            <path d="m7 7 10 10M17 7 7 17" />
          </TabButton>
        </div>
        <div className="mt-[5px] flex items-center gap-0.5 pl-1.5">
          <TabButton label="New tab" size={30}>
            <path d="M12 6v12M6 12h12" />
          </TabButton>
          <TabButton label="Open a new tab dropdown" size={22}>
            <path d="m7 10 5 5 5-5" />
          </TabButton>
        </div>
        <span className="flex-1" />
        <div className="flex items-stretch">
          <Caption label="Minimize" dark>
            <path d="M5 12h14" />
          </Caption>
          <Caption label="Maximize" dark>
            <rect x="6" y="6" width="12" height="12" rx="1.5" />
          </Caption>
          <Caption label="Close" onClick={onClose} close dark>
            <path d="m6 6 12 12M18 6 6 18" />
          </Caption>
        </div>
      </div>
    </>
  );
}

/** GNOME symbolic-icon button (new tab, tabs, menu). Decorative unless wired. */
function HeaderIcon({ children, label, onClick }: { children: ReactNode; label: string; onClick?: () => void }) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      aria-label={onClick ? label : undefined}
      aria-hidden={!onClick}
      onClick={onClick}
      className={cn("grid h-8 w-8 place-items-center rounded-md text-white/90", onClick && "hover:bg-white/10")}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </Comp>
  );
}

/** Yaru round window control: grey disc, white glyph; the close disc is lighter. */
function Round({ children, label, onClick, close }: { children: ReactNode; label: string; onClick?: () => void; close?: boolean }) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      aria-label={onClick ? label : undefined}
      aria-hidden={!onClick}
      onClick={onClick}
      className={cn(
        "grid h-[26px] w-[26px] place-items-center rounded-full text-white transition-colors duration-150",
        close ? "bg-white/[0.28]" : "bg-white/[0.12]",
        onClick && (close ? "hover:bg-white/[0.38]" : "hover:bg-white/[0.2]"),
      )}
    >
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth={close ? 1.9 : 1.6} strokeLinecap="round">
        {children}
      </svg>
    </Comp>
  );
}

/** Windows Terminal tab-row button (tab close, new tab, dropdown). */
function TabButton({ children, label, onClick, size }: { children: ReactNode; label: string; onClick?: () => void; size: number }) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      aria-label={onClick ? label : undefined}
      aria-hidden={!onClick}
      onClick={onClick}
      style={{ width: size, height: size }}
      className={cn("grid shrink-0 place-items-center rounded-[4px] text-white/75", onClick && "hover:bg-white/10 hover:text-white")}
    >
      <svg viewBox="0 0 24 24" width={size >= 30 ? 12 : 10} height={size >= 30 ? 12 : 10} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </Comp>
  );
}
