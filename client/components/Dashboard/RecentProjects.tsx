import React from "react";
import { ArrowRight, FileText } from "lucide-react";

interface Project {
  id: number;
  title: string;
  status: "active" | "completed";
  description: string;
  avatars: string[];
  time: string;
}

interface File {
  id: number;
  name: string;
  size: string;
  author: string;
  time: string;
}

interface StatusBadgeProps {
  status: "active" | "completed";
}

interface AvatarGroupProps {
  avatars: string[];
}

const Dashboard: React.FC = () => {
  const projects: Project[] = [
    {
      id: 1,
      title: "Website Redesign",
      status: "active",
      description: "Complete overhaul of company website",
      avatars: [
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
      ],
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Mobile App Development",
      status: "active",
      description: "iOS and Android app for customer portal",
      avatars: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
      ],
      time: "5 hours ago",
    },
    {
      id: 3,
      title: "Marketing Campaign",
      status: "completed",
      description: "Q1 2024 product launch campaign",
      avatars: [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face",
      ],
      time: "1 day ago",
    },
  ];

  const files: File[] = [
    {
      id: 1,
      name: "Design System.figma",
      size: "2.4 MB",
      author: "John Doe",
      time: "1 hour ago",
    },
    {
      id: 2,
      name: "Project Requirements.pdf",
      size: "856 kB",
      author: "Jane Smith",
      time: "3 hours ago",
    },
    {
      id: 3,
      name: "API Documentation.md",
      size: "124 kB",
      author: "Mike Johnson",
      time: "6 hours ago",
    },
  ];

  const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    const statusClasses: Record<"active" | "completed", string> = {
      active: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
    };

    return (
      <span className={`${baseClasses} ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  const AvatarGroup: React.FC<AvatarGroupProps> = ({ avatars }) => (
    <div className="flex -space-x-2">
      {avatars.map((avatar, index) => (
        <img
          key={index}
          src={avatar}
          alt=""
          className="w-6 h-6 rounded-full border-2 border-white"
        />
      ))}
    </div>
  );

  return (
    <div className=" bg-gray-50 p-4 md:p-8">
      <div className=" mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Recent Projects
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Your most recently updated projects
                  </p>
                </div>
                <button className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all
                  <ArrowRight className="ml-1 w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900 truncate">
                          {project.title}
                        </h3>
                        <StatusBadge status={project.status} />
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-3">
                        <AvatarGroup avatars={project.avatars} />
                        <span className="text-xs text-gray-500">
                          {project.time}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors ml-4 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Files */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Recent Files
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Recently uploaded files
                  </p>
                </div>
                <button className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all
                  <ArrowRight className="ml-1 w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate mb-1">
                          {file.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{file.size}</span>
                          <span>•</span>
                          <span>by {file.author}</span>
                          <span>•</span>
                          <span>{file.time}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors ml-4 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
