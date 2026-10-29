import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { RootDocument } from "@/components/site/root-document";
import { baseMetadata } from "@/lib/seo";

export const metadata: Metadata = baseMetadata;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f3" },
    { media: "(prefers-color-scheme: dark)", color: "#08080a" },
  ],
};

export default function PortugueseLayout({ children }: { children: ReactNode }) {
  return <RootDocument locale="pt">{children}</RootDocument>;
}
