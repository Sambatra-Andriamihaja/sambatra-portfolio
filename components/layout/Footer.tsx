import Link from "next/link";
import { useTranslations } from "next-intl";
import { PROFILE, SOCIALS } from "@/constants/profile";
import { navItems } from "@/constants/menu";
import { Github, LinkedIn, Mail } from "@/components/ui/icon";
import { Logo } from "@/components/os/logo";

/** Footer: name, routes, contact. Nothing that ticks, blinks or counts. */
export function Footer({ locale }: { locale: string }) {
  const t = useTranslations("Footer");
  const tn = useTranslations("NavBar");
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-band border-t border-line bg-raise/80">
      <div className="mx-auto flex max-w-frame flex-col gap-8 px-gutter py-12 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="flex items-center gap-2.5 font-display text-[1.25rem] font-semibold tracking-crush text-ink">
            <Logo className="h-7 w-7 text-ink" />
            <span>
              {PROFILE.handle}
              <span className="font-mono text-[0.95rem] font-medium text-accent">.os</span>
            </span>
          </p>
          <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-muted">{t("tagline")}</p>
        </div>

        <div className="flex flex-col gap-6 text-sm sm:flex-row sm:gap-14">
          <nav aria-label="Footer" className="flex flex-col gap-2">
            {navItems(locale).map((it) => (
              <Link key={it.url} href={it.url} className="link-underline text-muted hover:text-ink">
                {tn(it.title)}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.key}
                href={s.url}
                target={s.key === "email" ? undefined : "_blank"}
                rel="noreferrer noopener"
                className="link-underline inline-flex items-center gap-2 text-muted hover:text-ink"
              >
                {s.key === "github" ? <Github className="text-[15px]" /> : s.key === "linkedin" ? <LinkedIn className="text-[15px]" /> : <Mail className="text-[15px]" />}
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-frame flex-col gap-1 border-t border-line px-gutter py-4 text-[0.75rem] text-faint sm:flex-row sm:justify-between">
        <span>
          © {year} {PROFILE.name}. {t("rights")}
        </span>
        <span>{t("builtWith")}</span>
      </div>
    </footer>
  );
}
