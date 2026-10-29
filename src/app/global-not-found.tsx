import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { themeScript } from "@/components/site/root-document";
import { fontVariables } from "./fonts";

export const metadata: Metadata = {
  title: "404 · Luis Nicolau",
  robots: { index: false },
};

/** Unmatched URLs in either language land here, outside both root layouts, so it speaks both. */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="grid min-h-dvh place-items-center bg-bg px-6 font-sans text-fg">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <main className="max-w-xl text-center">
          <p className="kicker text-accent-ink">404</p>
          <h1 className="text-metal mt-4 text-5xl font-extrabold tracking-[-0.05em] sm:text-7xl">Not found.</h1>
          <p className="mt-6 text-lg text-muted">This page doesn&apos;t exist.</p>
          <p lang="pt-BR" className="mt-1 text-lg text-subtle">
            Esta página não existe.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/" className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-on-accent">
              Go to the home page
            </Link>
            <Link
              href="/pt"
              lang="pt-BR"
              className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 text-sm font-semibold"
            >
              Ir para o início
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
