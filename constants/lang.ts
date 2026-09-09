export const EN = "en";
export const FR = "fr";

export const LOCALES = [EN, FR] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = EN;

export const isLocale = (v: string): v is Locale =>
  (LOCALES as readonly string[]).includes(v);
