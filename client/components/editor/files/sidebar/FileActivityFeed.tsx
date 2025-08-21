import React from "react";
import {
  Upload,
  Edit3,
  Star,
  Share2,
  Download,
  Move,
  Copy,
  Eye,
  MessageCircle,
} from "lucide-react";
import { FileItem } from "../types";
import { formatRelativeDate } from "../utils/fileTypes";

interface FileActivityFeedProps {
  file: FileItem;
}

interface ActivityItem {
  id: string;
  type:
    | "upload"
    | "edit"
    | "star"
    | "share"
    | "download"
    | "move"
    | "copy"
    | "view"
    | "comment";
  user: string;
  avatar?: string;
  timestamp: Date;
  description: string;
}

export default function FileActivityFeed({ file }: FileActivityFeedProps) {
  // Mock activity data - TODO: Replace with actual API data
  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "upload",
      user: file.createdBy,
      timestamp: file.createdAt,
      description: "uploaded this file",
    },
    {
      id: "2",
      type: "edit",
      user: "Jane Smith",
      timestamp: file.modifiedAt,
      description: "modified this file",
    },
    {
      id: "3",
      type: "view",
      user: "Mike Johnson",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      description: "viewed this file",
    },
    {
      id: "4",
      type: "share",
      user: "Sarah Wilson",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      description: "shared this file with the team",
    },
    {
      id: "5",
      type: "download",
      user: "Alex Chen",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      description: "downloaded this file",
    },
    {
      id: "6",
      type: "comment",
      user: "Emily Brown",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      description: "added a comment",
    },
  ];

  const getActivityIcon = (type: ActivityItem["type"]) => {
    const iconProps = { className: "w-4 h-4" };

    switch (type) {
      case "upload":
        return <Upload {...iconProps} />;
      case "edit":
        return <Edit3 {...iconProps} />;
      case "star":
        return <Star {...iconProps} />;
      case "share":
        return <Share2 {...iconProps} />;
      case "download":
        return <Download {...iconProps} />;
      case "move":
        return <Move {...iconProps} />;
      case "copy":
        return <Copy {...iconProps} />;
      case "view":
        return <Eye {...iconProps} />;
      case "comment":
        return <MessageCircle {...iconProps} />;
      default:
        return <Eye {...iconProps} />;
    }
  };

  const getActivityColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "upload":
        return "bg-blue-100 text-blue-600";
      case "edit":
        return "bg-green-100 text-green-600";
      case "star":
        return "bg-yellow-100 text-yellow-600";
      case "share":
        return "bg-purple-100 text-purple-600";
      case "download":
        return "bg-indigo-100 text-indigo-600";
      case "move":
        return "bg-orange-100 text-orange-600";
      case "copy":
        return "bg-teal-100 text-teal-600";
      case "view":
        return "bg-gray-100 text-gray-600";
      case "comment":
        return "bg-pink-100 text-pink-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Eye className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-sm text-gray-500">No activity yet</p>
        <p className="text-xs text-gray-400 mt-1">
          File activity will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900 mb-4">
        Recent Activity
      </h4>

      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex items-start gap-3">
            {/* Activity Icon */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(
                activity.type
              )}`}
            >
              {getActivityIcon(activity.type)}
            </div>

            {/* Activity Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.user}</span>{" "}
                <span className="text-gray-600">{activity.description}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatRelativeDate(activity.timestamp)}
              </p>
            </div>

            {/* Timeline connector */}
            {index < activities.length - 1 && (
              <div className="absolute left-[15px] w-px h-6 bg-gray-200 mt-8 ml-px" />
            )}
          </div>
        ))}
      </div>

      {/* Load More */}
      {activities.length >= 5 && (
        <div className="pt-4 border-t border-gray-200">
          <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
            Load more activity
          </button>
        </div>
      )}
    </div>
  );
}
