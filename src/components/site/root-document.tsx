import type { ReactNode } from "react";
import { fontVariables } from "@/app/fonts";
import { htmlLang, type Locale } from "@/lib/i18n";

// The first thing in <body>, so it runs before anything paints and the page never flashes the
// wrong theme. A saved choice wins over the system setting.
export const themeScript = `(function(){try{var t=localStorage.getItem("theme");document.documentElement.dataset.theme=t==="light"||t==="dark"?t:matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch(e){}})()`;

export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={htmlLang[locale]} className={fontVariables} suppressHydrationWarning>
      <body className="min-h-dvh bg-bg font-sans text-fg">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
