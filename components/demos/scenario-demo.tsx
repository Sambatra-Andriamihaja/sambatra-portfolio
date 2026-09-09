"use client";

import { useTranslations } from "next-intl";
import type { TScenarioId } from "@/constants/projects";
import { ScenarioCanvas } from "@/components/scenario/scenario-canvas";
import { SCENARIOS } from "@/components/scenario/scenarios";
import type { DemoProps } from "./types";

/**
 * The Make scenario behind a Brevo project, playable. Full variant in the
 * detail window (labels, filters, inspector, drag); compact in the grid.
 */
export default function ScenarioDemo({
  compact,
  scenario = "sync",
}: DemoProps & { scenario?: TScenarioId }) {
  const t = useTranslations("Workflow");
  const s = SCENARIOS[scenario] ?? SCENARIOS.sync;
  return (
    <div className="flex h-full w-full flex-col bg-[#F4F4F7]">
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <ScenarioCanvas
          scenario={s}
          variant={compact ? "compact" : "full"}
          autoRun={!compact}
          className="max-h-full w-full"
          labels={{
            run: t("run"),
            running: t("running"),
            reset: t("reset"),
            ops: t("ops"),
            schedule: t("schedule"),
            hint: t("hint"),
            errorHandler: t("errorHandler"),
          }}
        />
      </div>
    </div>
  );
}
