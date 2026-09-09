import Image from "next/image";
import { useTranslations } from "next-intl";
import { Cpu, Database, Route } from "@/components/ui/icon";

const R = "/images/svgs/tech-stack";

const ROUTES = [
  {
    key: "auto",
    icon: Route,
    tools: [
      ["Make", `${R}/automation/make.svg`],
      ["Python", `${R}/languages/python-original-wordmark.svg`],
      ["Supabase", `${R}/automation/supabase.svg`],
      ["LangChain", `${R}/automation/langchain.svg`],
      ["Dust", `${R}/automation/dust.svg`],
      ["Brevo", `${R}/automation/brevo.svg`],
    ],
  },
  {
    key: "product",
    icon: Cpu,
    tools: [
      ["TypeScript", `${R}/languages/typescript.svg`],
      ["Next.js", `${R}/frontend-development/nextjs-original.svg`],
      ["React Native", `${R}/mobile-app-development/react-native.svg`],
      ["Flutter", `${R}/mobile-app-development/flutter-original.svg`],
      ["Elixir", `${R}/languages/elixir-original-wordmark.svg`],
      ["GraphQL", `${R}/backend-development/graphql.svg`],
    ],
  },
  {
    key: "data",
    icon: Database,
    tools: [
      ["PostgreSQL", `${R}/db/postgresql-original-wordmark.svg`],
      ["Prisma", `${R}/backend-development/prisma.svg`],
      ["Pandas", `${R}/ai-ml/pandas-original-wordmark.svg`],
      ["scikit-learn", `${R}/ai-ml/scikit-learn-seeklogo.com.svg`],
      ["Docker", `${R}/devops/docker-original-wordmark.svg`],
      ["Nginx", `${R}/backend-development/nginx-original.svg`],
    ],
  },
] as const;

/**
 * The router. A statement on the left; on the right the three routes a
 * request can take, as a list — each with its filter, what it covers, and
 * the tools that carry it.
 */
export function Routes() {
  const t = useTranslations("Routes");

  return (
    <section
      id="router"
      data-module="01"
      data-module-name="router"
      className="mx-auto max-w-frame px-gutter pt-band"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:self-start">
          <h2 className="display text-display-md text-ink text-balance">
            {t.rich("title", { em: (c) => <span className="text-accent">{c}</span> })}
          </h2>
          <p className="mt-4 max-w-prose text-fluid-base leading-relaxed text-muted text-pretty">
            {t("subtitle")}
          </p>
        </div>

        <ol className="divide-y divide-line border-y border-line">
          {ROUTES.map((r, i) => {
            const Icon = r.icon;
            return (
              <li key={r.key} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-5 gap-y-3 py-8 first:pt-6 last:pb-6 md:grid-cols-[2.5rem_minmax(0,1fr)_auto]">
                <span className="grid h-10 w-10 place-items-center rounded-ctl bg-accent/10 text-accent">
                  <Icon className="text-[20px]" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-[1.35rem] font-semibold leading-tight tracking-crush text-ink">
                    {t(`${r.key}.title`)}
                  </h3>
                  <p className="mt-2 max-w-prose text-[0.95rem] leading-relaxed text-muted">
                    {t(`${r.key}.body`)}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {r.tools.map(([name, img]) => (
                      <li key={name} className="pill !py-1 !pl-1.5">
                        <Image src={img} alt="" width={14} height={14} className="h-3.5 w-3.5 object-contain" />
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
                <code className="col-start-2 self-start whitespace-nowrap rounded-[4px] bg-inset px-2 py-1 font-mono text-[0.72rem] text-muted md:col-start-3">
                  <span className="text-accent">if</span> {t(`${r.key}.filter`)}
                  <span className="sr-only"> route {i + 1}</span>
                </code>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
