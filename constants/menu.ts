export interface IMenu {
  title: string;
  url: string;
  submenu?: IMenu[];
}

export const menuItemsData = (lang: string): IMenu[] => [
  {
    title: "home",
    url: `/${lang}`,
  },
  {
    title: "about",
    url: `/${lang}/about`,
  },
  {
    title: "projects",
    url: `/${lang}/projects`,
  },
];

export const aboutSubMenu: IMenu[] = [
  {
    title: "intro",
    url: "#hello",
  },
  {
    title: "skills",
    url: "#skills",
  },
  {
    title: "experience",
    url: "#experience",
  },
  {
    title: "education",
    url: "#education",
  },
];
