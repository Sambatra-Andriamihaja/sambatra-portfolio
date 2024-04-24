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
  title: string;
  desc: string;
  img: string;
  link?: string;
  tags: ITag[];
}

const projects: IProject[] = [
  {
    id: 0,
    category: STUDIES,
    isWeb: true,
    title: "WikIT - Document management system",
    desc: "Complete overhaul of TELMA S.A.'s Information Systems documentation management system.",
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
    title: "Biogas Smart App",
    desc: "Development of an application for the Orange Summer Challenge 2022, showcasing technology at the service of good. The application allows medium-range remote interaction with a gas production kit, enabling the user to see the details of the kit, turn the gas fire on and off, and even make a prediction of when the gas stock in the kit will run out.",
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
    title: "Odoo Module - Generate item reference and barcode",
    desc: "Development of a customized module for automatic barcode and reference generation. The module automatically generates the barcode and/or part number of a target product.",
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
    title: "FOCICOM Réunion",
    isWeb: true,
    desc: "Contributed to the development of an e-commerce site for a client on Reunion Island. The site is based on packaging items, and allows users to search for items and make purchases online via the platform.",
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
    title: "MGBI Project Monitoring",
    desc: "Contribution to the redesign of a project monitoring system used by MGBI's internal team.  This is a system for managing all projects issued from inception to closure, including the bodies involved, and an interface enabling everyone to see tasks still to be completed and validated.",
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
    title: "1sa",
    desc: "Development of a javascript module to transcribe a number into Malagasy letters.",
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
    title: "Odoo Module - Article master print template",
    desc: "Development of an item sheet printing module. The module allows you to download a PDF of the item for sale with all its details.",
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
    title: "Odoo Module - Bill print template",
    desc: "Development of a draft printing module. The module allows you to download PDF drafts of one (or more) invoice(s).",
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
    title: "Wimtim Orizon",
    desc: "Contributed to the development of the backend of the Wimtim Orizon platform and the development of the corresponding mobile version ",
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
