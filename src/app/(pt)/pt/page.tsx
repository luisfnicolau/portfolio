import type { Metadata } from "next";
import { HomePage } from "@/components/home/home-page";
import { profile } from "@/content/profile";
import { getDictionary } from "@/content/ui";
import { homePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "pt",
  path: homePath,
  title: getDictionary("pt").meta.homeTitle,
  description: profile.oneLiner.pt,
});

export default function Page() {
  return <HomePage locale="pt" />;
}
