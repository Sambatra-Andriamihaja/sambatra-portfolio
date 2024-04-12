export interface IEducations {
  key: string;
  schoolName: string;
  iconBg: string;
  iconSrc: string;
  borderBottomColor: string;
  websiteLink: string;
  logoSrc?: string;
  logoWidth?: number;
}

export const ESTIA: IEducations = {
  key: "ESTIA",
  schoolName: "ESTIA",
  iconBg: "#ffffff",
  iconSrc: "/images/educations/estia-favicon.png",
  borderBottomColor: "#52bbe6",
  websiteLink: "https://www.estia.fr/",
  logoSrc: "/images/educations/estia-logo.png",
  logoWidth: 150,
};

export const ITU: IEducations = {
  key: "ITU",
  schoolName: "IT University",
  iconBg: "#273d91",
  iconSrc: "/images/educations/itu-favicon.png",
  borderBottomColor: "#bbcc08",
  websiteLink: "https://www.ituniversity-mg.com/page/",
  logoSrc: "/images/educations/itu-logo.png",
  logoWidth: 220,
};

export const STGAB: IEducations = {
  key: "STGAB",
  schoolName: "Lycée Saint Gabriel",
  iconBg: "#ffffff",
  iconSrc: "/images/educations/st-gab-favicon.png",
  borderBottomColor: "#fdfd7a",
  websiteLink: "https://www.montfort-stgabrielmahajanga.mg/lycee/",
};
