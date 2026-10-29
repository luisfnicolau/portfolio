import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";
import { projectSlugs } from "./src/content/slugs";

// Project pages are prerendered for known slugs. Any other slug is rewritten to a path no route or
// file matches, so it gets a real 404 status (with Partial Prerendering, notFound() in the page would
// arrive after a 200 had already started streaming). Not "/404": Vercel serves that prerendered page
// as a plain file, with status 200.
const knownSlug = `(?!(?:${projectSlugs.join("|")})$)[^/]+`;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // A stray lockfile in the home folder would otherwise widen the workspace root.
  outputFileTracingRoot: __dirname,
  // Social cards that render on demand read these fonts and the headshot from disk (src/lib/og.tsx).
  outputFileTracingIncludes: { "/**": ["./src/assets/fonts/*.woff", "./src/assets/photo/avatar.jpg"] },
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
        { source: `/work/:slug(${knownSlug})`, destination: "/_unknown-project" },
        { source: `/pt/work/:slug(${knownSlug})`, destination: "/_unknown-project" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        // Everything but BotID's proxied challenge path, which sets its own framing headers.
        source: "/((?!149e9513-01fa-4fb0-aad4-566afd725d1b/).*)",
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

// BotID proxies its challenge script through this site; see src/instrumentation-client.ts.
export default withBotId(nextConfig);
