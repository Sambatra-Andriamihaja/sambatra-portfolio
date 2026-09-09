import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: ReactNode;
  lede?: ReactNode;
  aside?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
};

/**
 * Section head: a display title, one lede, an optional control on the
 * right. No kicker, no number, no status pill, no entrance animation — the
 * heading is visible before any JavaScript runs.
 */
export function SectionHead({ title, lede, aside, className, as: Heading = "h2" }: Props) {
  return (
    <header
      className={cn(
        "mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10",
        className,
      )}
    >
      <div className="max-w-3xl">
        <Heading className="display text-display-md text-ink text-balance">{title}</Heading>
        {lede && (
          <p className="mt-4 max-w-prose text-fluid-base leading-relaxed text-muted text-pretty">
            {lede}
          </p>
        )}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </header>
  );
}
