export interface ITimelineNode {
  /** i18n key under About.Experiences / About.Educations */
  key: string;
  org: string;
  /** Umbrella employer when the work was delivered through an agency. */
  via?: string;
  viaLogo?: string;
  viaUrl?: string;
  /** Square-ish mark used in the timeline card header. */
  logo?: string;
  /** Brand colour for the timeline node and card edge. */
  color: string;
  url?: string;
  /** how many bullet points exist in the message bundle */
  points: number;
  /** diploma scan, education only */
  diploma?: string;
  location?: string;
  /** stack chips rendered under the bullets */
  stack?: string[];
  current?: boolean;
}

/** Newest first. */
export const EXPERIENCES: ITimelineNode[] = [
  {
    key: "BREVO",
    org: "Brevo",
    via: "Valano Tech",
    viaLogo: "/images/experiences/valano-logo.svg",
    viaUrl: "https://valanotech.com/",
    logo: "/images/experiences/brevo-logo.svg",
    color: "#0B996E",
    url: "https://www.brevo.com/",
    location: "Paris, FR · remote",
    points: 5,
    current: true,
    stack: [
      "Make",
      "Python",
      "LangChain",
      "Supabase",
      "Dust",
      "Slack",
      "PandaDoc",
      "Planhat",
      "Qobra",
      "Gong",
      "Chili Piper",
    ],
  },
  {
    key: "MOZAR",
    org: "Mozar",
    via: "Valano Tech",
    viaLogo: "/images/experiences/valano-logo.svg",
    viaUrl: "https://valanotech.com/",
    logo: "/images/experiences/mozar-icon.png",
    color: "#2E7DF6",
    url: "https://mozar.io/",
    location: "Paris, FR · remote",
    points: 1,
    stack: ["JavaScript", "HTML", "CSS"],
  },
  {
    key: "SP",
    org: "Smart Predict",
    logo: "/images/experiences/sp-favicon.png",
    color: "#2563EB",
    url: "https://www.smartpredictservices.com/en/",
    location: "Antananarivo, MG",
    points: 2,
    stack: ["React Native", "React", "GraphQL", "Prisma", "PostgreSQL"],
  },
  {
    key: "MGBI",
    org: "MGBI",
    logo: "/images/experiences/mgbi-favicon.png",
    color: "#3FA7E2",
    url: "https://mgbi.mg/",
    location: "Antananarivo, MG",
    points: 2,
    stack: ["Elixir", "Phoenix", "Odoo", "PostgreSQL", "Nginx"],
  },
  {
    key: "ODC",
    org: "Orange Digital Center",
    logo: "/images/experiences/orange-favicon.png",
    color: "#FF7900",
    url: "https://www.orangedigitalcenters.com/country/MG/home",
    location: "Antananarivo, MG",
    points: 1,
    stack: ["Flutter", "Dart", "Arduino", "Embedded C"],
  },
  {
    key: "TELMA",
    org: "TELMA",
    logo: "/images/experiences/telma-favicon.png",
    color: "#006F3B",
    url: "https://www.telma.mg/",
    location: "Antananarivo, MG",
    points: 1,
    stack: ["PHP", "CodeIgniter", "AngularJS", "MySQL"],
  },
];
