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
          icon: (
            <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400/60" />
          ),
          title: "No results found",
          message:
            "Try adjusting your search terms or filters to find what you're looking for.",
        };
      case "folder":
        return {
          icon: (
            <FolderPlus className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400/60" />
          ),
          title: "Empty folder",
          message:
            "This folder is empty. Upload files or create subfolders to get started.",
        };
      default:
        return {
          icon: (
            <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400/60" />
          ),
          title: "No files yet",
          message:
            "Upload your first file or create a folder to get started organizing your content.",
        };
    }
  };

  const defaultContent = getDefaultContent();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4 py-12 sm:py-16">
      {/* Icon Container */}
      <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-50 mb-6">
        {defaultContent.icon}
      </div>

      {/* Content */}
      <div className="text-center max-w-md space-y-3">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight">
          {title || defaultContent.title}
        </h3>
        <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
          {message || defaultContent.message}
        </p>
      </div>

      {/* Actions */}
      {showActions && type !== "search" && (
        <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full max-w-sm">
          <button
            onClick={onUploadClick}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 active:bg-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            <Upload className="w-4 h-4" />
            Upload Files
          </button>
          <button
            onClick={onCreateFolderClick}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            <FolderPlus className="w-4 h-4" />
            New Folder
          </button>
        </div>
      )}
    </div>
  );
};
