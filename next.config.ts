import type { NextConfig } from "next";
import { projectSlugs } from "./src/content/slugs";

// Project pages are prerendered for known slugs. Any other slug is rewritten to a path no route
// matches, so it gets a real 404 status (with Partial Prerendering, notFound() in the page would
// arrive after a 200 had already started streaming).
const knownSlug = `(?!(?:${projectSlugs.join("|")})$)[^/]+`;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // A stray lockfile in the home folder would otherwise widen the workspace root.
  outputFileTracingRoot: __dirname,
  // Social cards that render on demand read these fonts from disk (src/lib/og.tsx).
  outputFileTracingIncludes: { "/**": ["./src/assets/fonts/*.woff"] },
  experimental: {
    // Two root layouts (English at /, Portuguese at /pt) need one 404 for both.
    globalNotFound: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: `/work/:slug(${knownSlug})`, destination: "/404" },
        { source: `/pt/work/:slug(${knownSlug})`, destination: "/404" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
