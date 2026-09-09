/**
 * Contract shared by every playable project demo.
 *
 * A demo renders *inside* a project window (`components/work/project-window`)
 * — it never draws its own chrome. The wrapper fixes the height; the demo
 * fills it (`h-full w-full`) and scrolls internally when it must.
 */
export type DemoProps = {
  locale: "en" | "fr";
  /** Sub-mode for demos shared by several projects (print: sheet | bill). */
  variant?: string;
  /** True inside the grid card (≈340px tall); false in the detail window. */
  compact?: boolean;
};
