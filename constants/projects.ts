export const KW = "kw";

export const PERSONAL = "personal";
export const PROFESSIONAL = "professional";
export const STUDIES = "studies";
export const ALL = "all";

export type TProductCategory =
  | typeof PERSONAL
  | typeof PROFESSIONAL
  | typeof STUDIES
  | typeof ALL;

export interface ITag {
  name: string;
  img: string;
}

export interface IProject {
  id: number;
  category: TProductCategory;
  isWeb?: boolean;
  isMobile?: boolean;
  isBothMobileAndWebCard?: boolean;
  isSpecial?: boolean;
  is1sa?: boolean;
  titleEn: string;
  titleFr: string;
  descEn: string;
  descFr: string;
  img: string;
  link?: string;
  tags: ITag[];
}

const projects: IProject[] = [
  {
    id: 0,
    category: STUDIES,
    isWeb: true,
    titleEn: "WikIT - Document management system",
    titleFr: "WikIT - Système de gestion des documents",
    descEn:
      "Complete overhaul of TELMA S.A.'s Information Systems documentation management system.",
    descFr:
      "Refonte complète du système de gestion de la documentation des systèmes d'information de TELMA S.A.",
    img: `/images/test.png`,
    link: "www.google.com",
    tags: [
      { name: "PHP", img: "/images/svgs/tech-stack/languages/php-plain.svg" },
      {
        name: "CodeIgniter",
        img: "/images/svgs/tech-stack/frameworks/codeigniter-plain-wordmark.svg",
      },
      {
        name: "Angular JS",
        img: "/images/svgs/tech-stack/frontend-development/angularjs-original-wordmark.svg",
      },
      {
        name: "HTML",
        img: "/images/svgs/tech-stack/frontend-development/html5-original-wordmark.svg",
      },
      {
        name: "CSS",
        img: "/images/svgs/tech-stack/frontend-development/css3-original-wordmark.svg",
      },
      {
        name: "Bootstrap",
        img: "/images/svgs/tech-stack/frontend-development/bootstrap-plain-wordmark.svg",
      },
      {
        name: "MySQL",
        img: "/images/svgs/tech-stack/db/mysql-original-wordmark.svg",
      },
    ],
  },
  {
    id: 1,
    category: STUDIES,
    isMobile: true,
    titleEn: "Biogas Smart App",
    titleFr: "Biogas Smart App",
    descEn:
      "Development of an application for the Orange Summer Challenge 2022, showcasing technology at the service of good. The application allows medium-range remote interaction with a gas production kit, enabling the user to see the details of the kit, turn the gas fire on and off, and even make a prediction of when the gas stock in the kit will run out.",
    descFr:
      "Développement d'une application lors de l'Orange Summer Challenge 2022, mettant en avant la technologie au service du bien. L'application permet une interaction à distance de moyenne portée avec un kit de production de gaz, permettant à l'utilisateur de voir les détails du kit, d'allumer et d'éteindre le feu à gaz, et même de prédire quand le stock de gaz dans le kit sera épuisé.",
    img: `/images/test.png`,
    link: "www.google.com",
    tags: [
      {
        name: "Flutter",
        img: "/images/svgs/tech-stack/mobile-app-development/flutter-original.svg",
      },
      {
        name: "Dart",
        img: "/images/svgs/tech-stack/mobile-app-development/dart-original-wordmark.svg",
      },
      {
        name: "Arduino",
        img: "/images/svgs/tech-stack/other-tools/arduino.svg",
      },
      {
        name: "Embedded C",
        img: "/images/svgs/tech-stack/languages/embeddedc-original-wordmark.svg",
      },
      { name: "ObjectBox", img: "/images/svgs/tech-stack/db/objectbox.svg" },
      { name: "Json", img: "/images/svgs/tech-stack/other-tools/json.svg" },
    ],
  },
  {
    id: 2,
    category: PROFESSIONAL,
    titleEn: "Odoo Module - Generate item reference and barcode",
    titleFr:
      "Module Odoo - Génération de référence et de code-barres d'articles",
    descEn:
      "Development of a customized module for automatic barcode and reference generation. The module automatically generates the barcode and/or part number of a target product.",
    descFr:
      "Développement d'un module personnalisé pour la génération automatique de codes-barres et de références. Le module génère automatiquement le code-barres et/ou le numéro de pièce d'un produit cible.",
    img: `/images/test.png`,
    tags: [
      {
        name: "Odoo",
        img: "/images/svgs/tech-stack/other-tools/Odoo-Logo.wine.svg",
      },
      {
        name: "Python",
        img: "/images/svgs/tech-stack/languages/python-original-wordmark.svg",
      },
      {
        name: "Docker",
        img: "/images/svgs/tech-stack/devops/docker-original-wordmark.svg",
      },
      {
        name: "SSH",
        img: "/images/svgs/tech-stack/other-tools/ssh-original-wordmark.svg",
      },
      {
        name: "PostgreSQL",
        img: "/images/svgs/tech-stack/db/postgresql-original-wordmark.svg",
      },
    ],
  },
  {
    id: 3,
    category: PROFESSIONAL,
    titleEn: "FOCICOM Réunion",
    titleFr: "FOCICOM Réunion",
    isWeb: true,
    descEn:
      "Contributed to the development of an e-commerce site for a client on Reunion Island. The site is based on packaging items, and allows users to search for items and make purchases online via the platform.",
    descFr:
      "Contribution au développement d'un site de e-commerce pour le compte d' un client de l'île de la Réunion. Le site est basé sur les articles d'emballage et permet aux utilisateurs de rechercher des articles et d'effectuer des achats en ligne via la plateforme.",
    img: `/images/test.png`,
    link: "https://focicom.re/",
    tags: [
      {
        name: "Phoenix",
        img: "/images/svgs/tech-stack/frameworks/phoenix-original-wordmark.svg",
      },
      {
        name: "Elixir",
        img: "/images/svgs/tech-stack/languages/elixir-original-wordmark.svg",
      },
      {
        name: "SSH",
        img: "/images/svgs/tech-stack/other-tools/ssh-original-wordmark.svg",
      },
      {
        name: "Nginx",
        img: "/images/svgs/tech-stack/backend-development/nginx-original.svg",
      },
      {
        name: "PostgreSQL",
        img: "/images/svgs/tech-stack/db/postgresql-original-wordmark.svg",
      },
    ],
  },
  {
    id: 4,
    category: PROFESSIONAL,
    titleEn: "MGBI Project Monitoring",
    titleFr: "MGBI Project Monitoring",
    descEn:
      "Contribution to the redesign of a project monitoring system used by MGBI's internal team.  This is a system for managing all projects issued from inception to closure, including the bodies involved, and an interface enabling everyone to see tasks still to be completed and validated.",
    descFr:
      "Contribution à la refonte d'un système de suivi de projet utilisé par l'équipe interne de MGBI.  Il s'agit d'un système de gestion de tous les projets émis depuis le début jusqu'à la clôture, y compris les organismes impliqués, et d'une interface permettant à chacun de voir les tâches restant à accomplir et à valider.",
    img: `/images/test.png`,
    link: "https://monitoring.phidia.fr/",
    tags: [
      {
        name: "Phoenix",
        img: "/images/svgs/tech-stack/frameworks/phoenix-original-wordmark.svg",
      },
      {
        name: "Elixir",
        img: "/images/svgs/tech-stack/languages/elixir-original-wordmark.svg",
      },
      {
        name: "PostgreSQL",
        img: "/images/svgs/tech-stack/db/postgresql-original-wordmark.svg",
      },
    ],
  },
  {
    id: 5,
    category: PERSONAL,
    is1sa: true,
    titleEn: "1sa",
    titleFr: "1sa",
    descEn:
      "Development of a javascript module to transcribe a number into Malagasy letters.",
    descFr:
      "Développement d'un module javascript pour transcrire un nombre en lettres malgaches.",
    img: `/images/test.png`,
    link: "https://github.com/Sambatra-Andriamihaja/1sa",
    tags: [
      {
        name: "JavaScript",
        img: "/images/svgs/tech-stack/languages/javascript-original.svg",
      },
      {
        name: "NPM",
        img: "/images/svgs/tech-stack/other-tools/npm-original-wordmark.svg",
      },
    ],
  },
  {
    id: 6,
    category: PROFESSIONAL,
    titleEn: "Odoo Module - Article master print template",
    titleFr: "Module Odoo - Modèle d'impression de fiche article",
    descEn:
      "Development of an item sheet printing module. The module allows you to download a PDF of the item for sale with all its details.",
    descFr:
      "Développement d'un module d'impression de fiches articles. Le module permet de télécharger un PDF de l'article à vendre avec tous ses détails.",
    img: `/images/test.png`,
    tags: [
      {
        name: "Odoo",
        img: "/images/svgs/tech-stack/other-tools/Odoo-Logo.wine.svg",
      },
      {
        name: "Python",
        img: "/images/svgs/tech-stack/languages/python-original-wordmark.svg",
      },
      {
        name: "Docker",
        img: "/images/svgs/tech-stack/devops/docker-original-wordmark.svg",
      },
      {
        name: "SSH",
        img: "/images/svgs/tech-stack/other-tools/ssh-original-wordmark.svg",
      },
      {
        name: "PostgreSQL",
        img: "/images/svgs/tech-stack/db/postgresql-original-wordmark.svg",
      },
    ],
  },
  {
    id: 7,
    category: PROFESSIONAL,
    titleEn: "Odoo Module - Bill print template",
    titleFr: "Module Odoo - Modèle d'impression de facture",
    descEn:
      "Development of a draft printing module. The module allows you to download PDF drafts of one (or more) invoice(s).",
    descFr:
      "Développement d'un module d'impression de brouillons. Ce module permet de télécharger des brouillons PDF d'une (ou plusieurs) facture(s).",
    img: `/images/test.png`,
    tags: [
      {
        name: "Odoo",
        img: "/images/svgs/tech-stack/other-tools/Odoo-Logo.wine.svg",
      },
      {
        name: "Python",
        img: "/images/svgs/tech-stack/languages/python-original-wordmark.svg",
      },
      {
        name: "Docker",
        img: "/images/svgs/tech-stack/devops/docker-original-wordmark.svg",
      },
      {
        name: "SSH",
        img: "/images/svgs/tech-stack/other-tools/ssh-original-wordmark.svg",
      },
      {
        name: "PostgreSQL",
        img: "/images/svgs/tech-stack/db/postgresql-original-wordmark.svg",
      },
    ],
  },
  {
    id: 8,
    category: PROFESSIONAL,
    isBothMobileAndWebCard: true,
    titleEn: "Wimtim Orizon",
    titleFr: "Wimtim Orizon",
    descEn:
      "Contributed to the development of the backend of the Wimtim Orizon platform and the development of the corresponding mobile version.",
    descFr:
      "Contribution au développement du backend de la plateforme Wimtim Orizon et au développement de la version mobile correspondante.",
    img: `/images/test.png`,
    tags: [
      {
        name: "React Native",
        img: "/images/svgs/tech-stack/mobile-app-development/react-native.svg",
      },
      {
        name: "React",
        img: "/images/svgs/tech-stack/frontend-development/react-original-wordmark.svg",
      },
      {
        name: "GraphQL",
        img: "/images/svgs/tech-stack/backend-development/graphql.svg",
      },
      {
        name: "Prisma",
        img: "/images/svgs/tech-stack/backend-development/prisma.svg",
      },
    ],
  },
];

export const allTags: ITag[] = [];

projects.forEach((project) => {
  project.tags.forEach(
    (tag: ITag) => !allTags.includes(tag) && allTags.push(tag)
  );
});

export default projects;
