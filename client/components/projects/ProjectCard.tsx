// components/ProjectCard.tsx
"use client";

import { useRouter } from "next/navigation";
import { Calendar, Tag, Eye, EyeOff, Users } from "lucide-react";
import { Project } from "@/types/project";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs font-medium px-2 py-0.5">
            {status}
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs font-medium px-2 py-0.5">
            {status}
          </Badge>
        );
      case "paused":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs font-medium px-2 py-0.5">
            {status}
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs font-medium px-2 py-0.5">
            {status}
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="text-xs font-medium px-2 py-0.5"
          >
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card
      onClick={handleClick}
      className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 bg-white border border-gray-200 h-full"
    >
      <CardContent className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: project.color }}
            />
            <span className="text-lg flex-shrink-0">
              {getTypeIcon(project.projectType)}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-base group-hover:text-black transition-colors truncate">
                {project.name}
              </h3>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            {project.visibility === "private" ? (
              <EyeOff className="w-4 h-4 text-gray-400" />
            ) : (
              <Eye className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Progress */}
        {project.progress !== undefined && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Progress</span>
              <span className="text-xs font-medium text-gray-900">
                {project.progress}%
              </span>
            </div>
            <Progress value={project.progress} className="h-1.5 bg-gray-100" />
          </div>
        )}

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tags.slice(0, 4).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs px-2 py-0.5 bg-gray-50 border-gray-200 text-gray-700"
              >
                {tag}
              </Badge>
            ))}
            {project.tags.length > 4 && (
              <Badge
                variant="outline"
                className="text-xs px-2 py-0.5 bg-gray-50 border-gray-200 text-gray-500"
              >
                +{project.tags.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            {project.membersCount && (
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{project.membersCount}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(project.startDate)}</span>
            </div>
          </div>
          {project.dueDate && (
            <div className="text-right">
              <span className="text-gray-400">
                Due {formatDate(project.dueDate)}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <div>{getStatusBadge(project.status)}</div>
          <span className="text-xs text-gray-400">
            {formatDate(project.updatedAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
