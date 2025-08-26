// components/files/EmptyState.tsx
import React from "react";
import { FileText, FolderPlus, Upload } from "lucide-react";

interface EmptyStateProps {
  type?: "files" | "search" | "folder";
  title?: string;
  message?: string;
  onUploadClick?: () => void;
  onCreateFolderClick?: () => void;
  showActions?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = "files",
  title,
  message,
  onUploadClick,
  onCreateFolderClick,
  showActions = true,
}) => {
  const getDefaultContent = () => {
    switch (type) {
      case "search":
        return {
          icon: <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />,
          title: "No results found",
          message:
            "Try adjusting your search terms or filters to find what you're looking for.",
        };
      case "folder":
        return {
          icon: <FolderPlus className="w-16 h-16 mx-auto mb-4 text-gray-300" />,
          title: "Empty folder",
          message:
            "This folder is empty. Upload files or create subfolders to get started.",
        };
      default:
        return {
          icon: <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />,
          title: "No files yet",
          message:
            "Upload your first file or create a folder to get started organizing your content.",
        };
    }
  };

  const defaultContent = getDefaultContent();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-gray-400 mb-4">{defaultContent.icon}</div>

      <h3 className="text-xl font-medium text-gray-900 mb-2">
        {title || defaultContent.title}
      </h3>

      <p className="text-gray-500 text-center max-w-sm mb-6">
        {message || defaultContent.message}
      </p>

      {showActions && type !== "search" && (
        <div className="flex gap-3">
          <button
            onClick={onUploadClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Files
          </button>

          <button
            onClick={onCreateFolderClick}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <FolderPlus className="w-4 h-4" />
            New Folder
          </button>
        </div>
      )}
    </div>
  );
};
