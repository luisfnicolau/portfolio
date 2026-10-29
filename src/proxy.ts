import { NextResponse, type NextRequest } from "next/server";
import { LANGUAGE_COOKIE, preferredLocale } from "@/lib/language";

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Chooses the language on the default (English) URLs: a visitor who prefers Portuguese is sent to
 * the same page under /pt. The language switch links carry `?lang=`, remembered in a cookie that
 * wins over detection from then on. /pt URLs are never redirected, so both languages stay indexable.
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl;

  const chosen = url.searchParams.get("lang");
  if (chosen === "en" || chosen === "pt") {
    const clean = url.clone();
    clean.searchParams.delete("lang");
    const response = NextResponse.redirect(clean);
    response.cookies.set(LANGUAGE_COOKIE, chosen, { path: "/", maxAge: ONE_YEAR, sameSite: "lax" });
    return response;
  }

  if (url.pathname === "/pt" || url.pathname.startsWith("/pt/")) return NextResponse.next();

  const saved = request.cookies.get(LANGUAGE_COOKIE)?.value;
  const locale =
    saved === "en" || saved === "pt"
      ? saved
      : preferredLocale(request.headers.get("accept-language"), request.headers.get("x-vercel-ip-country"));
  if (locale === "en") return NextResponse.next();

  const portuguese = url.clone();
  portuguese.pathname = url.pathname === "/" ? "/pt" : `/pt${url.pathname}`;
  return NextResponse.redirect(portuguese);
}

export const config = {
  matcher: ["/", "/work/:slug", "/pt", "/pt/work/:slug"],
};
