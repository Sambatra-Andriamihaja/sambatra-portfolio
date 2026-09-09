export interface IMenu {
  /** i18n key under the NavBar namespace */
  title: string;
  url: string;
}

export const navItems = (lang: string): IMenu[] => [
  { title: "home", url: `/${lang}` },
  { title: "about", url: `/${lang}/about` },
  { title: "projects", url: `/${lang}/projects` },
];

/** In-page anchors surfaced on the about route. */
export const aboutSections: IMenu[] = [
  { title: "intro", url: "#intro" },
  { title: "skills", url: "#skills" },
  { title: "experience", url: "#timeline" },
];
