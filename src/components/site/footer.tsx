import { profile, site } from "@/content/profile";
import { getDictionary } from "@/content/ui";
import { htmlLang, otherLocale, switchHref, type Locale } from "@/lib/i18n";
import { Container } from "../ui/container";

export function Footer({ locale, alternateHref }: { locale: Locale; alternateHref: string }) {
  const t = getDictionary(locale);
  const other = otherLocale(locale);
  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-6 py-10 text-sm text-subtle sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <p className="font-medium text-fg">© {profile.name}</p>
          <p>
            {t.footer.built}{" "}
            <a href={site.repo} className="underline decoration-line-strong underline-offset-4 hover:text-fg">
              {t.footer.source}
            </a>
          </p>
        </div>
        <div className="flex items-center gap-5">
          <p>
            {t.footer.updated} {site.updated[locale]}
          </p>
          <a
            href={switchHref(alternateHref, other)}
            hrefLang={htmlLang[other]}
            lang={htmlLang[other]}
            className="font-medium text-muted underline decoration-line-strong underline-offset-4 hover:text-fg"
          >
            {t.header.switchLanguage}
          </a>
        </div>
      </Container>
    </footer>
  );
}
