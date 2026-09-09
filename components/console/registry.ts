import { IDENTITY, PROFILE, SOCIALS } from "@/constants/profile";
import { SKILL_GROUPS, type SkillGroup } from "@/constants/skill";
import { EXPERIENCES } from "@/constants/experiences";
import { EDUCATIONS } from "@/constants/educations";
import { featuredProjects, orderedProjects } from "@/constants/projects";
import { ISA_MAX, ISA_SAMPLES, spell } from "@/lib/isa";
import type { Command, Line } from "./types";

export const SCENARIO_RUN_EVENT = "scenario:run";
/** Set before navigating home so the canvas runs as soon as it mounts. */
export const SCENARIO_RUN_PENDING = "scenario:run-pending";

const jsonBlock = (obj: Record<string, string | string[]>): Line[] => {
  const keys = Object.keys(obj);
  return [
    { kind: "brace", value: "{" },
    ...keys.map<Line>((k, i) => ({
      kind: "json",
      key: k,
      value: obj[k],
      last: i === keys.length - 1,
    })),
    { kind: "brace", value: "}" },
  ];
};

const GROUP_ALIASES: Record<string, SkillGroup> = {
  auto: "auto",
  automation: "auto",
  ops: "auto",
  dev: "dev",
  code: "dev",
  data: "data",
  db: "data",
  ml: "ml",
  ai: "ml",
};

const GROUP_TITLE: Record<SkillGroup, string> = {
  auto: "Automation & AI ops",
  dev: "Development",
  data: "Databases",
  ml: "Machine learning",
};

export const COMMANDS: Command[] = [
  {
    name: "help",
    aliases: ["?"],
    summary: "Show this help message",
    run: () => [
      { kind: "title", value: "Available commands" },
      ...COMMANDS.filter((c) => !c.hidden).map<Line>((c) => ({
        kind: "kv",
        key: c.args ? `${c.name} ${c.args}` : c.name,
        value: c.summary,
      })),
    ],
  },
  {
    name: "whois",
    summary: "Learn about Sambatra",
    run: () => jsonBlock(IDENTITY),
  },
  {
    name: "skills",
    aliases: ["stack"],
    args: "[auto|dev|data|ml]",
    summary: "View technical skills",
    run: (_ctx, args) => {
      const raw = (args[0] ?? "").toLowerCase();
      if (!raw) {
        return [
          { kind: "title", value: "Technical skills" },
          ...(Object.keys(SKILL_GROUPS) as SkillGroup[]).map<Line>((g) => ({
            kind: "kv",
            key: GROUP_TITLE[g],
            value: SKILL_GROUPS[g].map((s) => s.skill_name).join(", "),
          })),
          {
            kind: "text",
            value: "skills <group> for one group only",
            dim: true,
          },
        ];
      }
      const group = GROUP_ALIASES[raw];
      if (!group) {
        return [
          { kind: "error", value: `unknown group "${raw}"` },
          { kind: "text", value: "groups: auto · dev · data · ml", dim: true },
        ];
      }
      const set = SKILL_GROUPS[group];
      return [
        { kind: "title", value: `${GROUP_TITLE[group]} — ${set.length}` },
        { kind: "chips", values: set.map((s) => s.skill_name) },
      ];
    },
  },
  {
    name: "projects",
    aliases: ["work"],
    args: "[--all]",
    summary: "Browse featured projects",
    run: (ctx, args) => {
      const all = args.includes("--all");
      const list = all ? orderedProjects : featuredProjects;
      return [
        { kind: "title", value: all ? "All projects" : "Featured projects" },
        ...list.map<Line>((p) => ({
          kind: "kv",
          key: ctx.locale === "fr" ? p.titleFr : p.titleEn,
          value: `[${p.tags
            .slice(0, 3)
            .map((t) => t.name)
            .join(", ")}]${p.client ? ` — ${p.client}` : ""}`,
        })),
        { kind: "rule" },
        ...(all
          ? []
          : [
              {
                kind: "text",
                value: "projects --all for the full list",
                dim: true,
              } as Line,
            ]),
        {
          kind: "link",
          label: `/${ctx.locale}/projects`,
          href: `/${ctx.locale}/projects`,
        },
      ];
    },
  },
  {
    name: "experience",
    summary: "Career timeline",
    run: (ctx) => [
      { kind: "title", value: "Career experience" },
      ...EXPERIENCES.map<Line>((e) => ({
        kind: "kv",
        key: `${e.org}${e.via ? ` (via ${e.via})` : ""}`,
        value: `${ctx.t(`About.Experiences.${e.key}.experienceTitle`)} · ${ctx.t(`About.Experiences.${e.key}.date`)}`,
      })),
    ],
  },
  {
    name: "education",
    summary: "Academic background",
    run: (ctx) => [
      { kind: "title", value: "Education" },
      ...EDUCATIONS.map<Line>((e) => ({
        kind: "kv",
        key: e.org,
        value: `${ctx.t(`About.Educations.${e.key}.educationLevel`)} · ${ctx.t(`About.Educations.${e.key}.date`)}`,
      })),
    ],
  },
  {
    name: "timeline",
    summary: "Full timeline, newest first",
    run: (ctx) => {
      const rows = [
        ...EXPERIENCES.map((e) => ({
          date: ctx.t(`About.Experiences.${e.key}.date`),
          label: `${ctx.t(`About.Experiences.${e.key}.experienceTitle`)} @ ${e.org}`,
        })),
        ...EDUCATIONS.map((e) => ({
          date: ctx.t(`About.Educations.${e.key}.date`),
          label: `${ctx.t(`About.Educations.${e.key}.educationLevel`)} @ ${e.org}`,
        })),
      ];
      return [
        { kind: "title", value: "Timeline" },
        ...rows.map<Line>((r) => ({ kind: "kv", key: r.date, value: r.label })),
      ];
    },
  },
  {
    name: "automation",
    summary: "Automation & workflow expertise",
    run: () => [
      { kind: "title", value: "Automation & workflow" },
      {
        kind: "kv",
        key: "Tools",
        value: "Make (Integromat), n8n, Odoo, Zapier-style webhooks",
      },
      {
        kind: "kv",
        key: "Data",
        value: "Supabase mirrors, PostgreSQL, enrichment APIs in Python",
      },
      {
        kind: "kv",
        key: "AI",
        value: "LangChain pipelines, Dust agents for business teams",
      },
      { kind: "kv", key: "Now", value: "Brevo RevOps / Tech, via Valano Tech" },
      { kind: "rule" },
      {
        kind: "text",
        value: "type run to execute the scenario on the home page",
        dim: true,
      },
    ],
  },
  {
    name: "run",
    aliases: ["scenario"],
    summary: "Execute the workflow scenario",
    run: (ctx) => {
      const onHome = /^\/[a-z]{2}\/?$/.test(ctx.pathname);
      if (!onHome) {
        try {
          sessionStorage.setItem(SCENARIO_RUN_PENDING, "1");
        } catch {
          /* private mode */
        }
        ctx.navigate("");
      } else {
        ctx.emit(SCENARIO_RUN_EVENT);
      }
      ctx.close();
      return [{ kind: "ok", value: "scenario started" }];
    },
  },
  {
    name: "1sa",
    aliases: ["isa"],
    args: "<number>",
    summary: "Spell a number in Malagasy (my npm module)",
    run: (_ctx, args) => {
      const raw = args.join(" ");
      if (!raw.trim()) {
        return [
          { kind: "text", value: "usage: 1sa <number>", dim: true },
          {
            kind: "text",
            value: `try: ${ISA_SAMPLES.map((n) => `1sa ${n}`).join(" · ")}`,
            dim: true,
          },
        ];
      }
      const r = spell(raw);
      if (!r.ok) {
        const why: Record<typeof r.reason, string> = {
          empty: "usage: 1sa <number>",
          nan: `"${raw}" is not a number`,
          range: `out of range — 0 to ${ISA_MAX.toLocaleString("en")}`,
          error: "the module choked on that one — try another number",
        };
        return [{ kind: "error", value: why[r.reason] }];
      }
      return [
        {
          kind: "result",
          value: r.words,
          caption: `isa(${r.input}) — npm i 1sa`,
        },
      ];
    },
  },
  {
    name: "quote",
    summary: "A line I work by",
    run: (ctx) => [
      { kind: "text", value: `"${ctx.t("About.quote")}"` },
      { kind: "text", value: `— ${PROFILE.name}`, dim: true },
    ],
  },
  {
    name: "contact",
    aliases: ["hire"],
    summary: "Get in touch",
    run: (ctx) => {
      ctx.hire();
      return [
        { kind: "title", value: "Get in touch" },
        ...SOCIALS.map<Line>((s) => ({
          kind: "link",
          label: `${s.label.padEnd(9, " ")} ${s.handle}`,
          href: s.url,
          external: true,
        })),
      ];
    },
  },
  {
    name: "resume",
    aliases: ["cv"],
    summary: "Download the CV",
    run: () => [
      { kind: "ok", value: "CV-Sambatra.pdf" },
      { kind: "link", label: "download", href: PROFILE.cv, external: true },
    ],
  },
  {
    name: "goto",
    args: "<home|about|projects>",
    summary: "Navigate",
    run: (ctx, args) => {
      const map: Record<string, string> = {
        home: "",
        about: "/about",
        projects: "/projects",
        work: "/projects",
      };
      const target = map[(args[0] ?? "").toLowerCase()];
      if (target === undefined) {
        return [{ kind: "error", value: "usage: goto <home|about|projects>" }];
      }
      ctx.navigate(target);
      ctx.close();
      return [{ kind: "ok", value: `→ ${args[0]}` }];
    },
  },
  {
    name: "theme",
    args: "[dark|light]",
    summary: "Toggle the theme",
    run: (ctx, args) => {
      const next =
        args[0] === "dark" || args[0] === "light"
          ? args[0]
          : ctx.theme === "dark"
            ? "light"
            : "dark";
      ctx.setTheme(next);
      return [{ kind: "ok", value: `theme → ${next}` }];
    },
  },
  {
    name: "lang",
    args: "[en|fr]",
    summary: "Switch language",
    run: (ctx, args) => {
      const next = args[0] === "fr" ? "fr" : args[0] === "en" ? "en" : null;
      if (!next) return [{ kind: "error", value: "usage: lang <en|fr>" }];
      if (next === ctx.locale)
        return [{ kind: "text", value: `already ${next}`, dim: true }];
      ctx.navigate(`__locale__:${next}`);
      return [{ kind: "ok", value: `locale → ${next}` }];
    },
  },
  {
    name: "clear",
    summary: "Clear the terminal",
    run: (ctx) => {
      ctx.clear();
    },
  },
  {
    name: "sudo",
    hidden: true,
    summary: "",
    run: () => [
      { kind: "error", value: "sambatra is not in the sudoers file." },
      { kind: "text", value: "This incident will be reported.", dim: true },
    ],
  },
  {
    name: "exit",
    hidden: true,
    summary: "",
    run: (ctx) => {
      ctx.close();
    },
  },
];

export const COMMAND_NAMES = COMMANDS.filter((c) => !c.hidden).map(
  (c) => c.name,
);

export function resolve(raw: string) {
  const [first, ...args] = raw.trim().split(/\s+/);
  const name = first.toLowerCase();
  const cmd = COMMANDS.find(
    (c) => c.name === name || c.aliases?.includes(name),
  );
  return { cmd, name: first, args };
}
