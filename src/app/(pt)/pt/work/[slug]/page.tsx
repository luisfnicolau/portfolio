import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectPage } from "@/components/work/project-page";
import { getProject, projects } from "@/content/projects";
import { getDictionary } from "@/content/ui";
import { workPath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/pt/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return pageMetadata({
    locale: "pt",
    path: (locale) => workPath(locale, slug),
    title: `${project.name} · ${getDictionary("pt").meta.caseStudy} · Luis Nicolau`,
    description: project.tagline.pt,
  });
}

export default async function Page({ params }: PageProps<"/pt/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <ProjectPage project={project} locale="pt" />;
}
