"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { IProject, TDemo, TScenarioId } from "@/constants/projects";
import type { DemoProps } from "./types";

type AnyDemo = ComponentType<DemoProps & { scenario?: TScenarioId }>;

function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-surface">
      <span className="h-5 w-5 rounded-full border-2 border-line border-t-accent animate-spin motion-reduce:animate-none" aria-label="Loading" />
    </div>
  );
}

const lazy = (loader: () => Promise<{ default: AnyDemo }>): AnyDemo =>
  dynamic(loader, { ssr: false, loading: Loading });

/** Every playable demo, code-split and mounted only when its window shows. */
export const DEMOS: Record<TDemo, AnyDemo> = {
  scenario: lazy(() => import("./scenario-demo")),
  enrich: lazy(() => import("./enrich-demo")),
  agent: lazy(() => import("./agent-demo")),
  isa: lazy(() => import("./isa-demo")),
  color: lazy(() => import("./color-demo")),
  barcode: lazy(() => import("./barcode-demo")),
  print: lazy(() => import("./print-demo")),
  biogas: lazy(() => import("./biogas-demo")),
  shop: lazy(() => import("./shop-demo")),
  board: lazy(() => import("./board-demo")),
  docs: lazy(() => import("./docs-demo")),
  graphql: lazy(() => import("./graphql-demo")),
  landing: lazy(() => import("./landing-demo")),
};

export function ProjectDemo({
  project,
  locale,
  compact = false,
}: {
  project: IProject;
  locale: "en" | "fr";
  compact?: boolean;
}) {
  const Demo = DEMOS[project.demo];
  return (
    <Demo
      locale={locale}
      compact={compact}
      variant={project.demoVariant}
      scenario={project.scenario}
    />
  );
}
