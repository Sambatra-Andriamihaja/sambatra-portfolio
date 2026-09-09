import Image from "next/image";
import { useTranslations } from "next-intl";
import { SKILL_GROUPS, type SkillGroup } from "@/constants/skill";
import { SectionHead } from "@/components/flow/section-head";
import { Cpu, Database, Layers, Route } from "@/components/ui/icon";

const ICONS: Record<SkillGroup, typeof Route> = {
  auto: Route,
  dev: Layers,
  data: Database,
  ml: Cpu,
};

/**
 * Connections. The stack, one row per group, laid out like Make's
 * Connections page — no cards inside cards, just rows.
 */
export function Connections({ index = "04" }: { index?: string }) {
  const t = useTranslations("About.Skills");
  const tc = useTranslations("Connections");
  const groups = Object.keys(SKILL_GROUPS) as SkillGroup[];

  return (
    <section
      id="connections"
      data-module={index}
      data-module-name="connections"
      className="mx-auto max-w-frame px-gutter pt-band"
    >
      <SectionHead
        title={tc.rich("title", { em: (c) => <span className="text-accent">{c}</span> })}
        lede={tc("subtitle")}
      />

      <div className="divide-y divide-line border-y border-line">
        {groups.map((g) => {
          const Icon = ICONS[g];
          const set = SKILL_GROUPS[g];
          return (
            <div key={g} className="grid grid-cols-1 gap-5 py-7 md:grid-cols-[260px_minmax(0,1fr)] md:gap-10">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-ctl bg-accent/10 text-accent">
                  <Icon className="text-[18px]" />
                </span>
                <div>
                  <h3 className="font-display text-[1.05rem] font-semibold tracking-crush text-ink">
                    {t(`${g}.title`)}
                  </h3>
                  <p className="mt-1 text-[0.8rem] leading-relaxed text-muted">{t(`${g}.description`)}</p>
                  <p className="caption mt-2 tnum">{set.length} {tc("verified")}</p>
                </div>
              </div>
              <ul className="flex flex-wrap content-start items-start gap-1.5">
                {set.map((s) => (
                  <li key={s.skill_name} className="pill !py-1 !pl-1.5">
                    <Image src={s.Image} alt="" width={16} height={16} className="h-4 w-4 object-contain" />
                    {s.skill_name}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
