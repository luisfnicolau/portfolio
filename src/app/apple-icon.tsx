import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** The favicon's LN mark, full-bleed for the iOS home screen (iOS rounds the corners itself). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", backgroundColor: "#0d0c0b" }}>
        <svg viewBox="0 0 32 32" width="180" height="180">
          <path d="M6 9h3.2v11.6H13V24H6z" fill="#f4f4f5" />
          <path d="M15 24V9h3l4.8 9.2V9H26v15h-3l-4.8-9.2V24z" fill="#ff6b2c" />
        </svg>
      </div>
    ),
    size,
  );
}
