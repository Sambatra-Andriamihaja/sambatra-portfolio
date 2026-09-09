import { PROFILE } from "./profile";

export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sambatra.dev",
  name: PROFILE.name,
  shortName: "Sambatra",
  titleTemplate: `%s — ${PROFILE.name}`,
  defaultTitle: `${PROFILE.name} | ${PROFILE.role}`,
  description: {
    en: "Personal portfolio of Sambatra Andriamihaja — Growth Engineer and Full-Stack Developer from Antananarivo. Web & mobile products, workflow automation (Make, n8n), AI-assisted data enrichment and internal tooling.",
    fr: "Portfolio de Sambatra Andriamihaja — Growth Engineer et développeur full-stack basé à Antananarivo. Produits web & mobiles, automatisation de workflows (Make, n8n), enrichissement de données assisté par IA et outillage interne.",
  },
  keywords: [
    "full-stack developer",
    "growth engineer",
    "workflow automation",
    "Make",
    "Integromat",
    "n8n",
    "Brevo",
    "Supabase",
    "LangChain",
    "React",
    "Next.js",
    "Python",
    "Madagascar developer",
    "Sambatra Andriamihaja",
  ],
} as const;
