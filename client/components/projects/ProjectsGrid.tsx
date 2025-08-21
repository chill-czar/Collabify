// components/ProjectsGrid.tsx
"use client";

import { Project } from "@/app/types/project";
import { ProjectCard } from "./ProjectCard";
import { EmptyState } from "./EmptyState";

interface ProjectsGridProps {
  projects: Project[];
  isFiltered: boolean;
}

export function ProjectsGrid({ projects, isFiltered }: ProjectsGridProps) {
  if (projects.length === 0) {
    return <EmptyState isFiltered={isFiltered} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
