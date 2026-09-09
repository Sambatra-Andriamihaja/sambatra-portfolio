import { JetBrains_Mono, Open_Sans, Ubuntu, Ubuntu_Mono } from "next/font/google";

/**
 * Type system — sambatra.os. Each OS types in its own face; the active one
 * is selected in CSS (`--font-ui`, `--font-ui-display`, `--font-code`).
 *
 *  Ubuntu   Ubuntu (Canonical's UI face) for display and body,
 *           Ubuntu Mono for the terminal and code.
 *  Windows  Segoe UI Variable (Display for headings, Text for body) when the
 *           visitor is on Windows; Open Sans stands in elsewhere. Cascadia
 *           Mono / Consolas for code, JetBrains Mono as the fallback.
 *
 * Off-platform fallbacks are not preloaded: a browser only fetches a face
 * once rendered text asks for it, so Ubuntu visitors never download the
 * Windows fallbacks and vice versa.
 */

export const ubuntu = Ubuntu({
  subsets: ["latin"],
  variable: "--font-ubuntu",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const ubuntuMono = Ubuntu_Mono({
  subsets: ["latin"],
  variable: "--font-ubuntu-mono",
  display: "swap",
  weight: ["400", "700"],
});

export const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
  weight: "variable",
  preload: false,
});

export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: "variable",
  preload: false,
});

export const fontVariables = [
  ubuntu.variable,
  ubuntuMono.variable,
  openSans.variable,
  jetbrains.variable,
].join(" ");
