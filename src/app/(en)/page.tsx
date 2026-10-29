import type { Metadata } from "next";
import { HomePage } from "@/components/home/home-page";
import { profile } from "@/content/profile";
import { getDictionary } from "@/content/ui";
import { homePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "en",
  path: homePath,
  title: getDictionary("en").meta.homeTitle,
  description: profile.oneLiner.en,
});

export default function Page() {
  return <HomePage locale="en" />;
}
