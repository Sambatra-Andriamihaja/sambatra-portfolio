"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Frame } from "@/components/ui/section";
import { ActionLink, ActionButton } from "@/components/ui/action";
import { Terminal } from "@/components/ui/icon";
import { useConsole } from "@/components/console/console-provider";

export default function LocaleNotFound() {
  const t = useTranslations("NotFound");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const { show } = useConsole();

  return (
    <Frame className="grid min-h-[100svh] place-items-center py-band">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-2xl text-center"
      >
        <p className="text-gradient text-display-xl font-bold leading-none tracking-tightest">
          {t("code")}
        </p>
        <h1 className="mt-4 text-balance text-display-sm font-bold tracking-crush text-ink">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-prose text-pretty text-fluid-base leading-relaxed text-muted">
          {t("body")}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <ActionLink
            href={`/${locale}`}
            variant="primary"
            size="lg"
            trailing={false}
          >
            {t("cta")}
          </ActionLink>
          <ActionButton
            onClick={() => show("goto home")}
            variant="outline"
            size="lg"
            icon={<Terminal />}
            trailing={false}
          >
            {t("console")}
          </ActionButton>
        </div>
      </motion.div>
    </Frame>
  );
}
