"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "./icon";

type Tone = "primary" | "outline" | "ghost" | "gold";
type Size = "md" | "lg";

/** Maps the legacy tones onto the OS button classes. */
const tone: Record<Tone, string> = {
  primary: "btn-accent",
  gold: "btn-accent",
  outline: "btn-ghost",
  ghost: "btn-ghost !shadow-none !bg-transparent",
};

const size: Record<Size, string> = {
  md: "",
  lg: "!px-7 !py-4 !text-[0.95rem]",
};

type BaseProps = {
  children: ReactNode;
  className?: string;
  variant?: Tone;
  size?: Size;
  icon?: ReactNode;
  trailing?: ReactNode | false;
  shine?: boolean;
};

function Body({
  children,
  variant = "primary",
  size: s = "md",
  icon,
  trailing,
  className,
}: BaseProps) {
  const trail =
    trailing === false
      ? null
      : (trailing ??
        (variant === "outline" || variant === "ghost" ? <ArrowRight /> : null));
  return (
    <span className={cn("btn group/act", tone[variant], size[s], className)}>
      {icon && <span className="grid place-items-center text-[1.15em]">{icon}</span>}
      <span>{children}</span>
      {trail && (
        <span className="grid place-items-center text-[1em] transition-transform duration-500 ease-overshoot group-hover/act:translate-x-1">
          {trail}
        </span>
      )}
    </span>
  );
}

const wrap = "inline-flex";

export function ActionLink({
  href,
  children,
  className,
  variant,
  size,
  icon,
  trailing,
  shine,
  ...rest
}: BaseProps & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={wrap} {...rest}>
      <Body {...{ variant, size, icon, trailing, shine, className }}>{children}</Body>
    </Link>
  );
}

export function ActionAnchor({
  children,
  className,
  variant,
  size,
  icon,
  trailing,
  shine,
  ...rest
}: BaseProps & ComponentProps<"a">) {
  return (
    <a className={wrap} {...rest}>
      <Body {...{ variant, size, icon, trailing, shine, className }}>{children}</Body>
    </a>
  );
}

export function ActionButton({
  children,
  className,
  variant,
  size,
  icon,
  trailing,
  shine,
  ...rest
}: BaseProps & ComponentProps<"button">) {
  return (
    <button type="button" className={wrap} {...rest}>
      <Body {...{ variant, size, icon, trailing, shine, className }}>{children}</Body>
    </button>
  );
}
