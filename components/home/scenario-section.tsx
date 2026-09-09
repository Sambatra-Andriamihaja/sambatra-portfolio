"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { SectionHead } from "@/components/flow/section-head";
import { Window } from "@/components/os/window";
import { ScenarioCanvas } from "@/components/scenario/scenario-canvas";
import { SCENARIOS } from "@/components/scenario/scenarios";
import { SCENARIO_RUN_EVENT } from "@/components/console/registry";

const R = "/images/svgs/tech-stack";
const TOOLS = [
  ["Make", `${R}/automation/make.svg`],
  ["Brevo", `${R}/automation/brevo.svg`],
  ["Supabase", `${R}/automation/supabase.svg`],
  ["LangChain", `${R}/automation/langchain.svg`],
  ["Dust", `${R}/automation/dust.svg`],
  ["Slack", `${R}/automation/slack.svg`],
] as const;

/**
 * The scenario. The kind of flow built every week, live in a Make window:
 * run it, drag modules, read the inspector. The console's `run` command and
 * the hero button fire the same event.
 */
export function ScenarioSection() {
  const t = useTranslations("Workflow");
  const s = SCENARIOS.hero;

  return (
    <section
      id="scenario"
      data-module="02"
      data-module-name="scenario"
      className="mx-auto max-w-frame px-gutter pt-band"
    >
      <SectionHead
        title={t.rich("title", { em: (c) => <span className="text-accent">{c}</span> })}
        lede={t("subtitle")}
      />

      <Window
        title={`Make — ${s.name}`}
        icon={<Image src={`${R}/automation/make.svg`} alt="" width={14} height={14} className="h-3.5 w-3.5" />}
        bodyClassName="bg-white"
      >
        <div className="no-scrollbar overflow-x-auto">
          <ScenarioCanvas
            scenario={s}
            runEvent={SCENARIO_RUN_EVENT}
            className="min-w-[720px]"
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
      </Window>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <p className="max-w-prose text-fluid-base leading-relaxed text-muted text-pretty">{t("body")}</p>
        <ul className="flex flex-wrap gap-2 md:max-w-[20rem] md:justify-end">
          {TOOLS.map(([name, img]) => (
            <li key={name} className="pill !py-1.5 !pl-2">
              <Image src={img} alt="" width={16} height={16} className="h-4 w-4 object-contain" />
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
