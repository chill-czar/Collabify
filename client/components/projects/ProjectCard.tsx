// components/ProjectCard.tsx
"use client";

import { useRouter } from "next/navigation";
import { Calendar, Tag, Eye, EyeOff, Users, TrendingUp } from "lucide-react";
import { Project } from "@/app/types/project";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/projects/${project.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "design":
        return "🎨";
      case "development":
        return "💻";
      case "research":
        return "🔍";
      case "marketing":
        return "📈";
      default:
        return "📁";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white border-2 border-gray-300 p-6 cursor-pointer transition-all duration-200 hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
      style={{ borderLeftColor: project.color, borderLeftWidth: "6px" }}
    >
      {/* Project Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center min-w-0 flex-1">
          <span className="text-2xl mr-3 flex-shrink-0">
            {getTypeIcon(project.projectType)}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-black text-lg group-hover:underline truncate">
              {project.name}
            </h3>
            <p className="text-sm text-gray-600 font-medium capitalize mt-1">
              {project.projectType}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
          {project.visibility === "private" ? (
            <EyeOff className="w-4 h-4 text-gray-500" />
          ) : (
            <Eye className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-gray-700 text-sm mb-4 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      )}

      {/* Progress Bar */}
      {project.progress !== undefined && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Progress
            </span>
            <span className="text-xs font-bold text-black">
              {project.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 h-2 border border-gray-300">
            <div
              className="bg-black h-full transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 bg-gray-100 border border-gray-300 text-gray-800 text-xs font-bold uppercase tracking-wider"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 bg-gray-100 border border-gray-300 text-gray-800 text-xs font-bold">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Project Stats */}
      <div className="flex items-center justify-between text-sm mb-4">
        <div className="flex items-center space-x-4">
          {project.membersCount && (
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              <span className="font-medium">{project.membersCount}</span>
            </div>
          )}
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="font-medium">{formatDate(project.startDate)}</span>
          </div>
        </div>
        {project.dueDate && (
          <div className="text-right">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Due
            </span>
            <div className="font-bold text-black">
              {formatDate(project.dueDate)}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t-2 border-gray-200">
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center px-3 py-1 border-2 text-xs font-bold uppercase tracking-wider ${getStatusColor(
              project.status
            )}`}
          >
            {project.status}
          </span>
          <span className="text-xs text-gray-500 font-medium">
            Updated {formatDate(project.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
