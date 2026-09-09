/**
 * Single source of truth for identity. The console, the hero, the about
 * page and the OG image all read from here — nothing is retyped in JSX.
 */

export const PROFILE = {
  name: "Sambatra Andriamihaja",
  firstName: "Sambatra",
  handle: "sambatra",
  initial: "S",
  role: "Growth Engineer & Full-Stack Developer",
  roleFr: "Growth Engineer & Développeur Full-Stack",
  located: "Antananarivo, Madagascar",
  timezone: "Indian/Antananarivo",
  utcOffset: "+03:00",
  /** Current engagement — a Valano Tech consultant placed with Brevo. */
  company: "Brevo",
  companyUrl: "https://www.brevo.com/",
  agency: "Valano Tech",
  agencyUrl: "https://valanotech.com/",
  team: "RevOps / Tech",
  email: "sambatra.andriamihaja@outlook.com",
  cv: "/CV-Sambatra.pdf",
  since: 2020,
} as const;

export const SOCIALS = [
  {
    key: "github",
    label: "GitHub",
    handle: "@Sambatra-Andriamihaja",
    url: "https://github.com/Sambatra-Andriamihaja",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    handle: "in/sambatra-andriamihaja",
    url: "https://www.linkedin.com/in/sambatra-andriamihaja-8bb37421b/",
  },
  {
    key: "email",
    label: "Email",
    handle: PROFILE.email,
    url: `mailto:${PROFILE.email}`,
  },
] as const;

/** Rendered by the console `whois` command. */
export const IDENTITY: Record<string, string | string[]> = {
  name: PROFILE.name,
  located_in: PROFILE.located,
  role: PROFILE.role,
  currently: "Growth Engineer @ Brevo (RevOps / Tech), via Valano Tech",
  education: [
    "MSc — Big Data Intelligence for Human Augmented Reality, ESTIA × ITUniversity",
    "BSc — Computer Science (Development), ITUniversity Antananarivo",
  ],
  builds: [
    "Web & mobile products, end to end",
    "Make / n8n automations between business tools",
    "Python APIs and AI agents (LangChain, Dust)",
    "Data mirrors and pipelines (Supabase, PostgreSQL)",
  ],
  writes: ["TypeScript", "Python", "Elixir", "Dart", "SQL"],
  speaks: ["Malagasy", "French", "English"],
  off_screen: ["Drawing", "Music", "Travel", "Gaming"],
};

/** Years since the first professional line of code shipped. */
export const yearsOfExperience = () =>
  Math.max(1, new Date().getFullYear() - PROFILE.since);
