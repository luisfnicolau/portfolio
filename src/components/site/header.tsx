import Link from "next/link";
import { getDictionary } from "@/content/ui";
import { homePath, htmlLang, otherLocale, sectionPath, type Locale } from "@/lib/i18n";
import { Container } from "../ui/container";
import { LocalClock } from "./local-clock";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";

/** `alternateHref` is this same page in the other language. */
export function Header({ locale, alternateHref }: { locale: Locale; alternateHref: string }) {
  const t = getDictionary(locale);
  const home = homePath(locale);
  const anchor = (id: string) => sectionPath(locale, id);
  const links = [
    { href: anchor("about"), label: t.nav.about },
    { href: anchor("work"), label: t.nav.work },
    { href: anchor("labs"), label: t.nav.labs },
    { href: anchor("experience"), label: t.nav.experience },
    { href: anchor("how-i-work"), label: t.nav.howIWork },
    { href: anchor("contact"), label: t.nav.contact },
  ];
  const other = otherLocale(locale);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-accent px-4 py-2 font-semibold text-on-accent focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {t.nav.skip}
      </a>
      <header className="sticky top-0 z-40 border-b border-line bg-bg/75 backdrop-blur-xl">
        <Container className="relative flex h-16 items-center gap-3">
          <Link href={home} className="group flex items-center gap-2.5" aria-label="Luis Nicolau">
            <span className="grid size-8 place-items-center rounded-lg bg-fg font-mono text-[0.7rem] font-bold tracking-tight text-bg transition-colors group-hover:bg-accent group-hover:text-on-accent">
              LN
            </span>
            <span className="hidden text-sm font-semibold tracking-tight sm:block">Luis Nicolau</span>
          </Link>

          <nav aria-label={t.nav.label} className="mx-auto hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-full px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-fg"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <LocalClock label={t.header.localTime} className="mr-2 hidden xl:inline-flex" />
            <a
              href={alternateHref}
              hrefLang={htmlLang[other]}
              lang={htmlLang[other]}
              aria-label={t.header.switchLanguageLabel}
              title={t.header.switchLanguage}
              className="inline-flex h-10 items-center rounded-full px-3 font-mono text-xs font-semibold tracking-wider text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              {other.toUpperCase()}
            </a>
            <ThemeToggle toDark={t.header.themeToDark} toLight={t.header.themeToLight} />
            <MobileMenu links={links} navLabel={t.nav.label} openLabel={t.nav.menu} closeLabel={t.nav.closeMenu} />
          </div>
        </Container>
      </header>
    </>
  );
}
