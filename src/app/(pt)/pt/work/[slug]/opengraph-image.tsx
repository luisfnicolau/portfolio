import { projects } from "@/content/projects";
import { projectOg } from "@/lib/og-cards";

export { ogSize as size } from "@/lib/og";
export const alt = "Estudo de caso · Luis Nicolau";
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return projectOg("pt", slug);
}
