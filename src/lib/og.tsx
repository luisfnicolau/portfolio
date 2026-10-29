import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

// Literal paths so output file tracing can follow them: some cards render on demand in production.
// next.config.ts also lists the folder in outputFileTracingIncludes.
const fonts = Promise.all([
  readFile(join(process.cwd(), "src/assets/fonts/inter-latin-500-normal.woff")),
  readFile(join(process.cwd(), "src/assets/fonts/inter-latin-800-normal.woff")),
  readFile(join(process.cwd(), "src/assets/fonts/instrument-serif-latin-400-italic.woff")),
  readFile(join(process.cwd(), "src/assets/fonts/jetbrains-mono-latin-500-normal.woff")),
]);

const colors = { bg: "#08080a", fg: "#f4f4f5", muted: "#a9a9b3", subtle: "#8c8c97", accent: "#ff7d43", line: "#222228" };

interface OgCard {
  kicker: string;
  title: string;
  /** Set in the accent serif under the title. */
  accent?: string;
  subtitle: string;
  footer: string;
}

/** The social card shared by every page: dark, one accent, the site's own fonts. */
export async function renderOg({ kicker, title, accent, subtitle, footer }: OgCard) {
  const [inter500, inter800, serif, mono] = await fonts;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px",
          backgroundColor: colors.bg,
          backgroundImage: `radial-gradient(circle at 12% 0%, rgba(255,107,44,0.24), transparent 52%), linear-gradient(${colors.line} 1px, transparent 1px), linear-gradient(90deg, ${colors.line} 1px, transparent 1px)`,
          backgroundSize: "100% 100%, 64px 64px, 64px 64px",
          color: colors.fg,
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 52,
              height: 52,
              borderRadius: 12,
              backgroundColor: colors.fg,
              color: colors.bg,
              fontFamily: "JetBrains Mono",
              fontSize: 20,
            }}
          >
            LN
          </div>
          <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 22, color: colors.subtle }}>lunico.dev</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "JetBrains Mono",
              fontSize: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: colors.accent,
            }}
          >
            {kicker}
          </div>
          <div style={{ display: "flex", marginTop: 16, fontSize: 88, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>
            {title}
          </div>
          {accent ? (
            <div
              style={{
                display: "flex",
                marginTop: 4,
                fontFamily: "Instrument Serif",
                fontStyle: "italic",
                fontSize: 52,
                lineHeight: 1.15,
                color: colors.accent,
              }}
            >
              {accent}
            </div>
          ) : null}
          <div style={{ display: "flex", marginTop: 24, maxWidth: 1040, fontSize: 28, lineHeight: 1.35, color: colors.muted }}>
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 40,
            paddingTop: 22,
            borderTop: `1px solid ${colors.line}`,
            fontSize: 22,
            color: colors.subtle,
          }}
        >
          {footer}
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Inter", data: inter500, weight: 500, style: "normal" },
        { name: "Inter", data: inter800, weight: 800, style: "normal" },
        { name: "Instrument Serif", data: serif, weight: 400, style: "italic" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
