"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import { fetchProjects } from "@/lib/projects/api";
import type { Project } from "@/types/project";

interface StatusBadgeProps {
  status: Project["status"];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";

  const statusClasses: Record<Project["status"], string> = {
    active: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
    paused: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>
  );
};

const RecentProjects: React.FC = () => {
  const router = useRouter();

  const {
    data: projects = [],
    isLoading,
    isError,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Projects
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Your most recently updated projects
            </p>
          </div>
          <button
            className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
            onClick={() => router.push("/projects")}
          >
            View all
            <ArrowRight className="ml-1 w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4">
          {isLoading && (
            <p className="text-gray-500 text-sm">Loading projects...</p>
          )}

          {isError && (
            <p className="text-red-500 text-sm">Failed to load projects.</p>
          )}

          {!isLoading &&
            !isError &&
            projects.length > 0 &&
            projects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                onClick={() => router.push(`dashboard/projects/${project.id}`)}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {project.name}
                    </h3>
                    <StatusBadge status={project.status} />
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                    {project.description || "No description provided"}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      Members: {project.membersCount ?? 0}
                    </span>
                    <span className="text-xs text-gray-500">
                      Progress: {project.progress ?? 0}%
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors ml-4 flex-shrink-0" />
              </div>
            ))}

          {!isLoading && !isError && projects.length === 0 && (
            <p className="text-gray-500 text-sm">No projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentProjects;
