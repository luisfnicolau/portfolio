import type { Metadata } from "next";
import { contact, profile, site } from "@/content/profile";
import { languageAlternates, ogLocale, otherLocale, type Locale } from "./i18n";

/** Canonical URL, hreflang alternates and social-card text for one page in one language. */
export function pageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: (locale: Locale) => string;
  title: string;
  description: string;
}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path(locale), languages: languageAlternates(path) },
    openGraph: {
      type: "website",
      siteName: profile.shortName,
      url: path(locale),
      title,
      description,
      locale: ogLocale[locale],
      alternateLocale: [ogLocale[otherLocale(locale)]],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** Shared by both root layouts. Pages fill in title, description and alternates. */
export const baseMetadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: profile.shortName,
  authors: [{ name: profile.name, url: site.url }],
  creator: profile.name,
  formatDetection: { telephone: false, email: false, address: false },
};

/** schema.org Person for the home pages. */
export function personJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: profile.shortName,
    jobTitle: profile.jobTitle[locale],
    description: profile.oneLiner[locale],
    url: site.url,
    email: `mailto:${contact.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Campo Grande",
      addressRegion: "MS",
      addressCountry: "BR",
    },
    sameAs: [contact.linkedin, contact.github],
    knowsLanguage: ["pt-BR", "en", "es"],
    knowsAbout: [
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "pgvector",
      "Large language models",
      "Retrieval-augmented generation",
      "AWS Lambda",
      "Serverless architecture",
    ],
  };
}

/** Serialize JSON-LD for a <script> tag without letting "</script>" break out. */
export const jsonLdScript = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");
