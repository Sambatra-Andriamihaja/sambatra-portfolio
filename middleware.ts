import createMiddleware from "next-intl/middleware";
import { DEFAULT_LOCALE, LOCALES } from "@/constants/lang";

export default createMiddleware({
  locales: [...LOCALES],
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
});

export const config = {
  matcher: ["/", "/(fr|en)/:path*"],
};
