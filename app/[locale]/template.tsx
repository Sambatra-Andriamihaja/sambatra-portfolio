import type { ReactNode } from "react";

/**
 * Remounts on every navigation so the incoming page gets one short CSS
 * fade-up. No frozen router, no exit animation — the route swaps the moment
 * it is ready.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="animate-fade-up motion-reduce:animate-none">{children}</div>;
}
