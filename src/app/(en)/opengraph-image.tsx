import { homeOg, homeOgAlt } from "@/lib/og-cards";

export { ogSize as size } from "@/lib/og";
export const alt = homeOgAlt("en");
export const contentType = "image/png";

export default function Image() {
  return homeOg("en");
}
