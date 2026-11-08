import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS, getProjectBySlug } from "@/data/projects";
import { ProjectHeaderNav, ProjectNavigation } from "@/components/projects/ProjectNavigation";
import { ProjectHero } from "@/components/projects/ProjectHero";
import { ProjectCapabilities } from "@/components/projects/ProjectCapabilities";
import { ProjectArchitecture } from "@/components/projects/ProjectArchitecture";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found — THE ABDUCTION CLUB",
    };
  }

  return {
    title: `${project.number} ${project.name} — ${project.category} | THE ABDUCTION CLUB`,
    description: `${project.headline} ${project.shortDescription}`,
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen w-full bg-[#F3F0E8] text-[#181818] selection:bg-[#3155F4] selection:text-[#F3F0E8]">
      <ProjectHeaderNav currentProject={project} />
      <ProjectHero project={project} />
      <ProjectCapabilities project={project} />
      <ProjectArchitecture project={project} />
      <ProjectNavigation currentProject={project} />
    </main>
  );
}
