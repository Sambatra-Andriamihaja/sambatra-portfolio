export const KW = "kw";

export const PERSONAL = "personal";
export const PROFESSIONAL = "professional";
export const STUDIES = "studies";
export const ALL = "all";

export const CATEGORIES = [ALL, PROFESSIONAL, PERSONAL, STUDIES] as const;
export type TProjectCategory = (typeof CATEGORIES)[number];

/**
 * Every project ships as a playable window. `demo` names the interactive
 * component that renders inside it (see components/demos/registry.tsx).
 *
 *  scenario  live Make-style automation canvas, drawn from `scenario`
 *  enrich    waterfall enrichment — type an email, watch providers answer
 *  agent     Dust-style agent chat with visible tool calls
 *  isa       the published npm module, spelling numbers in Malagasy
 *  color     a working colour picker (hex / rgb / hsl)
 *  barcode   Odoo reference + Code 128 barcode generator
 *  print     Odoo print template preview (variant: sheet | bill)
 *  biogas    sensor dashboard + burner control + depletion forecast
 *  shop      packaging catalogue search + quote builder
 *  board     project monitoring board with blockers
 *  docs      versioned document search
 *  graphql   one GraphQL query feeding a web and a mobile surface
 *  landing   section builder for a live marketing page
 */
export type TDemo =
  | "scenario"
  | "enrich"
  | "agent"
  | "isa"
  | "color"
  | "barcode"
  | "print"
  | "biogas"
  | "shop"
  | "board"
  | "docs"
  | "graphql"
  | "landing";

/** Ids of scenarios declared in components/scenario/scenarios.ts */
export type TScenarioId =
  "hero" | "sync" | "enrich" | "mirror" | "agents" | "platform";

export interface ITag {
  name: string;
  img: string;
}

export interface IProject {
  id: number;
  slug: string;
  category: Exclude<TProjectCategory, "all">;
  /** Interactive demo rendered inside the project window. */
  demo: TDemo;
  /** Sub-mode for demos that cover several projects (print: sheet | bill). */
  demoVariant?: string;
  /** One-line "what to try" hint shown on the window's status bar. */
  tryEn?: string;
  tryFr?: string;
  year: string;
  /** Still in production / still being extended. */
  ongoing?: boolean;
  client?: string;
  /** Umbrella employer when delivered through an agency. */
  via?: string;
  titleEn: string;
  titleFr: string;
  descEn: string;
  descFr: string;
  /** Primary (desktop) screenshot. */
  shot?: string;
  /** Handset screenshot, used by `mobile` and `duo`. */
  shotMobile?: string;
  /** Icon-led artefact cards. */
  icon?: string;
  /** Make scenario behind the work — drives the `scenario` demo and the detail view. */
  scenario?: TScenarioId;
  live?: string;
  source?: string;
  /** npm package name, when the project is published. */
  npm?: string;
  tags: ITag[];
}

const R = "/images/svgs/tech-stack";

export const T = {
  php: { name: "PHP", img: `${R}/languages/php-plain.svg` },
  codeigniter: {
    name: "CodeIgniter",
    img: `${R}/frameworks/codeigniter-plain-wordmark.svg`,
  },
  angularjs: {
    name: "AngularJS",
    img: `${R}/frontend-development/angularjs-original-wordmark.svg`,
  },
  html: {
    name: "HTML",
    img: `${R}/frontend-development/html5-original-wordmark.svg`,
  },
  css: {
    name: "CSS",
    img: `${R}/frontend-development/css3-original-wordmark.svg`,
  },
  bootstrap: {
    name: "Bootstrap",
    img: `${R}/frontend-development/bootstrap-plain-wordmark.svg`,
  },
  mysql: { name: "MySQL", img: `${R}/db/mysql-original-wordmark.svg` },
  flutter: {
    name: "Flutter",
    img: `${R}/mobile-app-development/flutter-original.svg`,
  },
  dart: {
    name: "Dart",
    img: `${R}/mobile-app-development/dart-original-wordmark.svg`,
  },
  arduino: { name: "Arduino", img: `${R}/other-tools/arduino.svg` },
  embeddedC: {
    name: "Embedded C",
    img: `${R}/languages/embeddedc-original-wordmark.svg`,
  },
  objectbox: { name: "ObjectBox", img: `${R}/db/objectbox.svg` },
  json: { name: "JSON", img: `${R}/other-tools/json.svg` },
  odoo: { name: "Odoo", img: `${R}/other-tools/Odoo-Logo.wine.svg` },
  python: {
    name: "Python",
    img: `${R}/languages/python-original-wordmark.svg`,
  },
  docker: { name: "Docker", img: `${R}/devops/docker-original-wordmark.svg` },
  ssh: { name: "SSH", img: `${R}/other-tools/ssh-original-wordmark.svg` },
  postgres: {
    name: "PostgreSQL",
    img: `${R}/db/postgresql-original-wordmark.svg`,
  },
  phoenix: {
    name: "Phoenix",
    img: `${R}/frameworks/phoenix-original-wordmark.svg`,
  },
  elixir: {
    name: "Elixir",
    img: `${R}/languages/elixir-original-wordmark.svg`,
  },
  nginx: { name: "Nginx", img: `${R}/backend-development/nginx-original.svg` },
  javascript: {
    name: "JavaScript",
    img: `${R}/languages/javascript-original.svg`,
  },
  typescript: { name: "TypeScript", img: `${R}/languages/typescript.svg` },
  npm: { name: "npm", img: `${R}/other-tools/npm-original-wordmark.svg` },
  electron: { name: "Electron", img: `${R}/frameworks/electron-original.svg` },
  reactNative: {
    name: "React Native",
    img: `${R}/mobile-app-development/react-native.svg`,
  },
  react: {
    name: "React",
    img: `${R}/frontend-development/react-original-wordmark.svg`,
  },
  graphql: { name: "GraphQL", img: `${R}/backend-development/graphql.svg` },
  prisma: { name: "Prisma", img: `${R}/backend-development/prisma.svg` },
  // Automation & AI ops
  make: { name: "Make", img: `${R}/automation/make.svg` },
  brevo: { name: "Brevo", img: `${R}/automation/brevo.svg` },
  supabase: { name: "Supabase", img: `${R}/automation/supabase.svg` },
  langchain: { name: "LangChain", img: `${R}/automation/langchain.svg` },
  dust: { name: "Dust", img: `${R}/automation/dust.svg` },
  slack: { name: "Slack", img: `${R}/automation/slack.svg` },
  pandadoc: { name: "PandaDoc", img: `${R}/automation/pandadoc.svg` },
  planhat: { name: "Planhat", img: `${R}/automation/planhat.svg` },
  qobra: { name: "Qobra", img: `${R}/automation/qobra.svg` },
  gong: { name: "Gong", img: `${R}/automation/gong.svg` },
  chilipiper: { name: "Chili Piper", img: `${R}/automation/chilipiper.svg` },
  webhook: { name: "Webhooks", img: `${R}/automation/webhook.svg` },
} satisfies Record<string, ITag>;

const VIA = "Valano Tech";

const projects: IProject[] = [
  {
    id: 0,
    slug: "wikit",
    category: STUDIES,
    demo: "docs",
    tryEn: "Search the index, open a file, browse its versions",
    tryFr: "Cherchez dans l'index, ouvrez un fichier, parcourez ses versions",
    year: "2021",
    client: "TELMA",
    titleEn: "WikIT — Document management system",
    titleFr: "WikIT — Système de gestion documentaire",
    descEn:
      "Full rebuild of the documentation platform used by TELMA's Information Systems department. Versioned documents, role-based access and a search index that finally returned the right file.",
    descFr:
      "Refonte complète de la plateforme documentaire de la direction des systèmes d'information de TELMA. Versionnement, accès par rôle et un index de recherche qui renvoyait enfin le bon fichier.",
    tags: [
      T.php,
      T.codeigniter,
      T.angularjs,
      T.html,
      T.css,
      T.bootstrap,
      T.mysql,
    ],
  },
  {
    id: 1,
    slug: "biogas-smart-app",
    category: STUDIES,
    demo: "biogas",
    tryEn: "Toggle the burner, change the consumption, read the forecast",
    tryFr: "Allumez le brûleur, changez la consommation, lisez la prévision",
    year: "2022",
    client: "Orange Summer Challenge",
    titleEn: "Biogas Smart App",
    titleFr: "Biogas Smart App",
    descEn:
      "Built in six weeks for the Orange Summer Challenge 2022 under a tech4good brief. The app pairs with a biogas production kit over short range: read the sensors, ignite or cut the burner remotely, and forecast the date the tank runs dry.",
    descFr:
      "Construite en six semaines pour l'Orange Summer Challenge 2022, sur un thème tech4good. L'application dialogue à courte portée avec un kit de production de biogaz : lecture des capteurs, allumage ou coupure à distance du brûleur, et prévision de la date d'épuisement du stock.",
    shot: "/images/projects/bgs.jpg",
    tags: [T.flutter, T.dart, T.arduino, T.embeddedC, T.objectbox, T.json],
  },
  {
    id: 2,
    slug: "odoo-barcode-generator",
    category: PROFESSIONAL,
    demo: "barcode",
    tryEn: "Pick a category and attributes — the reference and barcode derive live",
    tryFr: "Choisissez catégorie et attributs — référence et code-barres se dérivent en direct",
    year: "2023",
    client: "MGBI",
    titleEn: "Odoo — Reference & barcode generator",
    titleFr: "Odoo — Générateur de référence et code-barres",
    descEn:
      "A custom Odoo module that derives a product's internal reference and barcode automatically from its category and attributes, removing a manual step that was quietly producing duplicates.",
    descFr:
      "Module Odoo sur mesure qui dérive automatiquement la référence interne et le code-barres d'un produit à partir de sa catégorie et de ses attributs, supprimant une étape manuelle qui produisait discrètement des doublons.",
    icon: "/images/projects/barcode_and_ref_generator.png",
    tags: [T.odoo, T.python, T.docker, T.ssh, T.postgres],
  },
  {
    id: 3,
    slug: "focicom",
    category: PROFESSIONAL,
    demo: "shop",
    tryEn: "Search the catalogue and build a quote",
    tryFr: "Cherchez dans le catalogue et construisez un devis",
    year: "2023",
    client: "FOCICOM Réunion",
    titleEn: "FOCICOM Réunion — e-commerce",
    titleFr: "FOCICOM Réunion — e-commerce",
    descEn:
      "An e-commerce platform for a packaging supplier on Réunion Island. Catalogue search, quoting and online ordering, served from a Phoenix application behind Nginx.",
    descFr:
      "Plateforme e-commerce pour un fournisseur d'emballages à La Réunion. Recherche catalogue, devis et commande en ligne, servis par une application Phoenix derrière Nginx.",
    shot: "/images/projects/focicom.png",
    live: "https://focicom.re/",
    tags: [T.phoenix, T.elixir, T.ssh, T.nginx, T.postgres],
  },
  {
    id: 4,
    slug: "mgbi-monitoring",
    category: PROFESSIONAL,
    demo: "board",
    tryEn: "Move tasks along, and see who is blocking whom",
    tryFr: "Faites avancer les tâches et voyez qui bloque qui",
    year: "2023",
    client: "MGBI",
    titleEn: "Project monitoring",
    titleFr: "Suivi de projets",
    descEn:
      "Rebuild of the internal tool MGBI uses to track a project from intake to sign-off — the parties involved, the outstanding tasks, and who is blocking whom.",
    descFr:
      "Refonte de l'outil interne utilisé par MGBI pour suivre un projet de la prise en charge à la validation — les parties impliquées, les tâches restantes et qui bloque qui.",
    live: "https://monitoring.phidia.fr/",
    tags: [T.phoenix, T.elixir, T.postgres],
  },
  {
    id: 5,
    slug: "1sa",
    category: PERSONAL,
    demo: "isa",
    tryEn: "Type any number — the published module spells it in Malagasy",
    tryFr: "Tapez un nombre — le module publié l'écrit en malgache",
    year: "2023",
    titleEn: "1sa — numbers in Malagasy",
    titleFr: "1sa — les nombres en malgache",
    descEn:
      "A small npm module that spells any number out in Malagasy. Written because every invoice generator I touched could do it in French and English, and not in my own language. It is installed in this very site — open the console (⌘K) and type `1sa 1789`.",
    descFr:
      "Petit module npm qui écrit n'importe quel nombre en toutes lettres malgaches. Écrit parce que tous les générateurs de factures que j'ai croisés savaient le faire en français et en anglais, mais pas dans ma langue. Il est installé dans ce site : ouvrez la console (⌘K) et tapez `1sa 1789`.",
    source: "https://github.com/Sambatra-Andriamihaja/1sa",
    npm: "1sa",
    tags: [T.javascript, T.npm],
  },
  {
    id: 6,
    slug: "odoo-article-sheet",
    category: PROFESSIONAL,
    demo: "print",
    demoVariant: "sheet",
    tryEn: "Edit the product record — the PDF sheet re-renders",
    tryFr: "Modifiez la fiche produit — la fiche PDF se régénère",
    year: "2023",
    client: "MGBI",
    titleEn: "Odoo — Article sheet template",
    titleFr: "Odoo — Modèle de fiche article",
    descEn:
      "A print module that renders a sellable item as a one-page PDF spec sheet, pulling attributes, pricing and imagery straight from the product record.",
    descFr:
      "Module d'impression qui rend un article vendable sous forme de fiche PDF d'une page, en tirant attributs, tarifs et visuels directement de la fiche produit.",
    icon: "/images/projects/article_print_template_icon.png",
    shot: "/images/projects/Article_117_Pcs_tools_set.png",
    tags: [T.odoo, T.python, T.docker, T.ssh, T.postgres],
  },
  {
    id: 7,
    slug: "odoo-bill-template",
    category: PROFESSIONAL,
    demo: "print",
    demoVariant: "bill",
    tryEn: "Select invoices — one paginated draft comes out",
    tryFr: "Sélectionnez des factures — un seul brouillon paginé en sort",
    year: "2023",
    client: "MGBI",
    titleEn: "Odoo — Bill draft template",
    titleFr: "Odoo — Modèle de brouillon de facture",
    descEn:
      "Batch PDF drafting for invoices: select any number of records and get a single, correctly paginated document instead of one download per line.",
    descFr:
      "Génération PDF par lot pour les factures : sélectionnez autant d'enregistrements que nécessaire et obtenez un document unique correctement paginé, au lieu d'un téléchargement par ligne.",
    icon: "/images/projects/bill_print_icon.png",
    shot: "/images/projects/Impression_traites_18.png",
    tags: [T.odoo, T.python, T.docker, T.ssh, T.postgres],
  },
  {
    id: 8,
    slug: "color-picker",
    category: PERSONAL,
    demo: "color",
    tryEn: "Drag on the swatch, copy the value in hex, RGB or HSL",
    tryFr: "Glissez sur la palette, copiez la valeur en hex, RGB ou HSL",
    year: "2022",
    titleEn: "Color Picker",
    titleFr: "Color Picker",
    descEn:
      "An Electron utility that sits on the desktop and hands designers the exact value in whichever notation they need — hex, RGB, HSL — without opening a design tool.",
    descFr:
      "Utilitaire Electron posé sur le bureau, qui donne aux designers la valeur exacte dans la notation voulue — hex, RGB, HSL — sans ouvrir d'outil de design.",
    shot: "/images/projects/color_picker.png",
    tags: [T.electron, T.javascript],
  },
  {
    id: 9,
    slug: "wimtim-orizon",
    category: PROFESSIONAL,
    demo: "graphql",
    tryEn: "Run a query — the same response feeds the web and the phone",
    tryFr: "Lancez une requête — la même réponse alimente le web et le mobile",
    year: "2024",
    client: "Smart Predict",
    titleEn: "Orizon — web & mobile",
    titleFr: "Orizon — web & mobile",
    descEn:
      "Backend work on the Orizon platform and the matching React Native client. One GraphQL schema feeding both surfaces, with Prisma holding the data model together.",
    descFr:
      "Travail backend sur la plateforme Orizon et sur le client React Native correspondant. Un seul schéma GraphQL alimente les deux surfaces, avec Prisma pour tenir le modèle de données.",
    shot: "/images/projects/wimtim.png",
    shotMobile: "/images/projects/wimtim_mobile.png",
    tags: [T.reactNative, T.react, T.graphql, T.prisma],
  },
  {
    id: 10,
    slug: "mozar-landing",
    category: PROFESSIONAL,
    demo: "landing",
    tryEn: "Toggle and reorder sections — the page rebuilds without a reload",
    tryFr: "Activez et réordonnez les sections — la page se reconstruit sans recharger",
    year: "2024",
    client: "Mozar",
    via: VIA,
    titleEn: "Mozar — landing page",
    titleFr: "Mozar — landing page",
    descEn:
      "Four months on Mozar's public landing page as a JS developer through Valano Tech — updating what was there and shipping the new sections and features the team needed, on a live marketing site that could not afford downtime.",
    descFr:
      "Quatre mois sur la landing page publique de Mozar comme développeur JS via Valano Tech — mise à jour de l'existant et livraison des nouvelles sections et fonctionnalités demandées par l'équipe, sur un site marketing en production qui ne pouvait pas se permettre d'interruption.",
    tags: [T.javascript, T.html, T.css],
  },
  {
    id: 11,
    slug: "brevo-sync",
    category: PROFESSIONAL,
    demo: "scenario",
    scenario: "sync",
    tryEn: "Run the scenario, drag modules, hover for the inspector",
    tryFr: "Exécutez le scénario, déplacez les modules, survolez pour l'inspecteur",
    year: "2024",
    ongoing: true,
    client: "Brevo",
    via: VIA,
    titleEn: "Brevo ⇄ revenue stack — Make scenarios",
    titleFr: "Brevo ⇄ stack revenue — scénarios Make",
    descEn:
      "Real-time synchronisation between the Brevo CRM and the tools the RevOps team lives in: PandaDoc, Planhat, Qobra, Gong, Chili Piper, Slack. Dozens of Make scenarios with routers, filters, error handlers and retry paths — designed so a failed bundle is a notification, not a silent data gap.",
    descFr:
      "Synchronisation en temps réel entre le CRM Brevo et les outils de l'équipe RevOps : PandaDoc, Planhat, Qobra, Gong, Chili Piper, Slack. Des dizaines de scénarios Make avec routeurs, filtres, gestion d'erreurs et reprises — conçus pour qu'un bundle en échec soit une notification, pas un trou silencieux dans les données.",
    tags: [
      T.make,
      T.brevo,
      T.pandadoc,
      T.planhat,
      T.qobra,
      T.gong,
      T.chilipiper,
      T.slack,
    ],
  },
  {
    id: 12,
    slug: "enrichment-apis",
    category: PROFESSIONAL,
    demo: "enrich",
    scenario: "enrich",
    tryEn: "Enter an email and watch the waterfall try each provider",
    tryFr: "Saisissez un email et regardez la cascade interroger chaque fournisseur",
    year: "2024",
    ongoing: true,
    client: "Brevo",
    via: VIA,
    titleEn: "AI data-enrichment APIs",
    titleFr: "APIs d'enrichissement de données par IA",
    descEn:
      "Internal Python APIs that enrich CRM records automatically — contact, email, waterfall phone, company and tech-stack enrichment — built with Brevo's Data team. LangChain orchestrates the model calls; every provider sits behind the same contract so one can be swapped without touching the scenarios that call it.",
    descFr:
      "APIs Python internes qui enrichissent automatiquement les fiches CRM — contact, email, téléphone en cascade, entreprise et stack technologique — construites avec l'équipe Data de Brevo. LangChain orchestre les appels aux modèles ; chaque fournisseur est derrière le même contrat, pour en changer sans toucher aux scénarios qui l'appellent.",
    tags: [T.python, T.langchain, T.brevo, T.webhook],
  },
  {
    id: 13,
    slug: "supabase-mirror",
    category: PROFESSIONAL,
    demo: "scenario",
    scenario: "mirror",
    tryEn: "Run it — webhook path and the 15-minute backfill both land in Postgres",
    tryFr: "Exécutez — le webhook et le rattrapage toutes les 15 min finissent dans Postgres",
    year: "2025",
    ongoing: true,
    client: "Brevo",
    via: VIA,
    titleEn: "Supabase mirror of the Brevo CRM",
    titleFr: "Miroir Supabase du CRM Brevo",
    descEn:
      "A maintained mirror of the CRM on Supabase, built to get around filters the Brevo API does not expose. It is the data source for the internal platforms, and it cuts the number of Make operations a scenario needs — the credits bill went down, the queries got faster.",
    descFr:
      "Un miroir maintenu du CRM sur Supabase, construit pour contourner les filtres que l'API Brevo n'expose pas. C'est la source de données des plateformes internes, et il réduit le nombre d'opérations Make nécessaires à un scénario — la facture de crédits a baissé, les requêtes se sont accélérées.",
    tags: [T.supabase, T.postgres, T.brevo, T.make, T.python],
  },
  {
    id: 14,
    slug: "internal-platform",
    category: PROFESSIONAL,
    demo: "scenario",
    scenario: "platform",
    tryEn: "Run it — three services feed one platform, three consumers draw from it",
    tryFr: "Exécutez — trois services alimentent une plateforme, trois consommateurs y puisent",
    year: "2025",
    ongoing: true,
    client: "Brevo",
    via: VIA,
    titleEn: "Internal enrichment & automation platform",
    titleFr: "Plateforme interne d'enrichissement et d'automatisation",
    descEn:
      "The house for the APIs: one internal platform where enrichment and automation tools are hosted, documented and metered, so teams stop paying per-seat for point solutions and ops cost stays visible.",
    descFr:
      "La maison des APIs : une plateforme interne où les outils d'enrichissement et d'automatisation sont hébergés, documentés et mesurés, pour que les équipes cessent de payer des solutions ponctuelles au siège et que le coût opérationnel reste visible.",
    tags: [T.python, T.supabase, T.docker, T.webhook],
  },
  {
    id: 15,
    slug: "dust-agents",
    category: PROFESSIONAL,
    demo: "agent",
    scenario: "agents",
    tryEn: "Ask the agent about the pipeline — watch it call the CRM and the mirror",
    tryFr: "Interrogez l'agent sur le pipeline — regardez-le appeler le CRM et le miroir",
    year: "2025",
    ongoing: true,
    client: "Brevo",
    via: VIA,
    titleEn: "Dust AI agents for RevOps",
    titleFr: "Agents IA Dust pour la RevOps",
    descEn:
      "Custom agents on Dust that let Brevo teams ask the CRM and the surrounding tools questions in plain language — and act on the answers. Fewer tickets to the tech team, faster decisions on the sales floor.",
    descFr:
      "Agents sur mesure sur Dust qui permettent aux équipes Brevo d'interroger le CRM et les outils périphériques en langage naturel — et d'agir sur les réponses. Moins de tickets pour l'équipe tech, des décisions plus rapides côté ventes.",
    tags: [T.dust, T.slack, T.brevo, T.python],
  },
];

/** Newest first — the order the work index and the console both use. */
export const orderedProjects = [...projects].reverse();

/**
 * Featured builds. The first three land on the home page — one automation,
 * one product, one platform — so the site reads as more than the current job.
 */
export const FEATURED_SLUGS = [
  "brevo-sync",
  "wimtim-orizon",
  "focicom",
  "enrichment-apis",
  "biogas-smart-app",
  "1sa",
] as const;

export const featuredProjects = FEATURED_SLUGS.map((slug) =>
  projects.find((p) => p.slug === slug)!,
).filter(Boolean);

export const PROJECT_COUNT = projects.length;

export default projects;
