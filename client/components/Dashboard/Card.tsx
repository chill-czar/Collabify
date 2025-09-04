"use client";

import { FolderOpen, FileText, Users, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "@/lib/projects/api";
import { listFiles } from "@/lib/files/api";

export default function DashboardCards() {
  // ✅ Fetch projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  // ✅ Fetch files (loop through projects)
  const { data: files = [], isLoading: filesLoading } = useQuery({
    queryKey: ["files", projects.map((p) => p.id)],
    queryFn: async () => {
      if (!projects.length) return [];
      const allFiles = await Promise.all(
        projects.map((project) => listFiles({ projectId: project.id }))
      );
      return allFiles.flat();
    },
    enabled: projects.length > 0, // only fetch when projects loaded
  });

  const cards = [
    {
      title: "Total Projects",
      value: projectsLoading ? "…" : projects.length.toString(),
      subtitle: "Projects you’re working on",
      icon: FolderOpen,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50",
    },
    {
      title: "Files Uploaded",
      value: filesLoading ? "…" : files.length.toString(),
      subtitle: "Across all projects",
      icon: FileText,
      iconColor: "text-green-500",
      iconBg: "bg-green-50",
    },
  ];

  return (
    <div className="flex gap-6 p-6 bg-gray-50 h-50">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex-1 min-w-0"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
            <div className={`p-2 rounded-lg ${card.iconBg}`}>
              <card.icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-gray-900">{card.value}</div>
            <div className="text-sm text-gray-500">{card.subtitle}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
