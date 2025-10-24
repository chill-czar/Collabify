// components/files/FileMeta.tsx
import React, { memo } from "react";
import { formatDate } from "@/utils/fileUtils";

interface FileMetaProps {
  uploaderName: string;
  uploaderAvatar?: string;
  createdAt: string;
}

export const FileMeta = memo<FileMetaProps>(({
  uploaderName,
  uploaderAvatar,
  createdAt,
}) => {
  return (
    <div className="px-2 sm:px-3 pb-2 sm:pb-3 flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
      {/* User Avatar */}
      <div className="flex-shrink-0">
        {uploaderAvatar ? (
          <img
            src={uploaderAvatar}
            alt={uploaderName}
            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full"
          />
        ) : (
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-400 flex items-center justify-center">
            <span className="text-xs text-white font-medium">
              {uploaderName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Context Text */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-600 truncate">
          You opened • {formatDate(createdAt)}
        </p>
      </div>
    </div>
  );
});

FileMeta.displayName = "FileMeta";
