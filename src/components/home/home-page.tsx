import { homePath, otherLocale, type Locale } from "@/lib/i18n";
import { jsonLdScript, personJsonLd } from "@/lib/seo";
import { AvailabilityTab } from "../site/availability-tab";
import { Footer } from "../site/footer";
import { Header } from "../site/header";
import { LanguageHint } from "../site/language-hint";
import { About } from "./about";
import { Background } from "./background";
import { Contact } from "./contact";
import { Experience } from "./experience";
import { Hero } from "./hero";
import { HowIWork } from "./how-i-work";
import { Labs } from "./labs";
import { Marquee } from "./marquee";
import { SelectedWork } from "./selected-work";
import { Skills } from "./skills";

export function HomePage({ locale }: { locale: Locale }) {
  const alternateHref = homePath(otherLocale(locale));
  return (
    <>
      <Header locale={locale} alternateHref={alternateHref} />
      <AvailabilityTab locale={locale} />
      <main id="main">
        <Hero locale={locale} />
        <Marquee />
        <About locale={locale} />
        <SelectedWork locale={locale} />
        <Labs locale={locale} />
        <Experience locale={locale} />
        <HowIWork locale={locale} />
        <Skills locale={locale} />
        <Background locale={locale} />
        <Contact locale={locale} />
      </main>
      <Footer locale={locale} alternateHref={alternateHref} />
      <LanguageHint locale={locale} alternateHref={alternateHref} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(personJsonLd(locale)) }} />
    </>
  );
}
