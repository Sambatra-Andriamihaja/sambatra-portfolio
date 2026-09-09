import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE } from "@/constants/site";

/**
 * The real document shell lives in app/[locale]/layout.tsx because the
 * <html lang> attribute depends on the resolved locale. This root exists
 * so that app/not-found.tsx has a parent, and so that metadataBase is
 * resolved for every branch of the tree.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
