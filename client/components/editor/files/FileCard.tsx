// components/files/FileCard.tsx
import React, { useState, useCallback } from "react";
import { MoreVertical } from "lucide-react";
import { useDeleteFile, useUpdateFile } from "@/lib/files/api";
import { Loading } from "@/components/editor/files/Loading";
import { FileIcon } from "./FileIcon";
import { ContextMenu } from "./ContextMenu";
import { formatDate } from "@/utils/fileUtils";

interface FileCardProps {
  file: {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    fileUrl: string;
    category: string;
    tags: string[];
    description: string | null;
    uploadedBy: string;
    createdAt: string;
    updatedAt: string;
    isStarred?: boolean;
    visibility: string;
  };
  onSelect?: (file: any) => void;
  isSelected?: boolean;
  uploaderName?: string;
  uploaderAvatar?: string;
}

const FileCardComponent: React.FC<FileCardProps> = ({
  file,
  onSelect,
  isSelected = false,
  uploaderName = "Unknown User",
  uploaderAvatar,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newFileName, setNewFileName] = useState(file.fileName);
  const [imageError, setImageError] = useState(false);

  const deleteFile = useDeleteFile();
  const updateFile = useUpdateFile();

  const handleMenuClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  }, []);

  const handleCardClick = useCallback(() => {
    onSelect?.(file);
  }, [onSelect, file]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteFile.mutateAsync(file.id);
      setShowMenu(false);
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  }, [deleteFile, file.id]);

  const handleRename = useCallback(async () => {
    if (newFileName.trim() && newFileName !== file.fileName) {
      try {
        await updateFile.mutateAsync({
          id: file.id,
          fileName: newFileName.trim(),
        });
        setIsRenaming(false);
        setShowMenu(false);
      } catch (error) {
        console.error("Failed to rename file:", error);
      }
    } else {
      setIsRenaming(false);
    }
  }, [newFileName, file.fileName, file.id, updateFile]);

  const handleDownload = useCallback(() => {
    window.open(file.fileUrl, "_blank");
    setShowMenu(false);
  }, [file.fileUrl]);

  const handleOpen = useCallback(() => {
    window.open(file.fileUrl, "_blank");
    setShowMenu(false);
  }, [file.fileUrl]);

  // Dummy handlers for features not yet implemented
  const handleCopy = useCallback(() => {
    console.log("Copy file:", file.id);
    setShowMenu(false);
  }, [file.id]);

  const handleMove = useCallback(() => {
    console.log("Move file:", file.id);
    setShowMenu(false);
  }, [file.id]);

  const handleShare = useCallback(() => {
    console.log("Share file:", file.id);
    setShowMenu(false);
  }, [file.id]);

  const isImage = file.fileType.startsWith("image/");
  const isVideo = file.fileType.startsWith("video/");
  const isPDF = file.fileType === "application/pdf";
  const isDocument =
    file.fileType.includes("document") ||
    file.fileType.includes("text") ||
    file.fileType.includes("sheet");

  const getPreviewContent = () => {
    // Show thumbnail for images (if available and not errored)
    if (isImage && file.fileUrl && !imageError) {
      return (
        <img
          src={file.fileUrl}
          alt={file.fileName}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      );
    }

    // Show video thumbnail with play icon
    if (isVideo) {
      return (
        <div className="w-full h-full bg-black flex items-center justify-center relative">
          {file.fileUrl && !imageError ? (
            <>
              <video
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              >
                <source src={file.fileUrl} />
              </video>
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-2 sm:border-l-3 md:border-l-4 border-l-gray-800 border-t-1 border-b-1 sm:border-t-2 sm:border-b-2 border-t-transparent border-b-transparent ml-0.5 sm:ml-1"></div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 text-white">
              <FileIcon fileType={file.fileType} category={file.category} />
            </div>
          )}
        </div>
      );
    }

    // Document preview placeholder
    if (isPDF || isDocument) {
      return (
        <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center p-2 sm:p-3 md:p-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 mb-1 sm:mb-2">
            <FileIcon fileType={file.fileType} category={file.category} />
          </div>
          <div className="w-full h-12 sm:h-16 md:h-20 bg-white border border-gray-200 rounded shadow-sm flex flex-col justify-center px-2 sm:px-3 space-y-1">
            <div className="h-0.5 sm:h-1 bg-gray-200 rounded"></div>
            <div className="h-0.5 sm:h-1 bg-gray-200 rounded w-4/5"></div>
            <div className="h-0.5 sm:h-1 bg-gray-200 rounded"></div>
            <div className="h-0.5 sm:h-1 bg-gray-200 rounded w-3/5"></div>
          </div>
        </div>
      );
    }

    // Default file icon
    return (
      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28">
          <FileIcon fileType={file.fileType} category={file.category} />
        </div>
      </div>
    );
  };

  if (deleteFile.isPending || updateFile.isPending) {
    return <Loading variant="card" />;
  }

  return (
    <div className="relative group w-full">
      <div
        className={`
          bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200 cursor-pointer 
          hover:shadow-md hover:scale-[1.02] w-full h-full flex flex-col
          ${isSelected ? "ring-2 ring-blue-500 shadow-md" : ""}
        `}
        onClick={handleCardClick}
      >
        {/* Header Row */}
        <div className="flex items-start justify-between p-2 sm:p-3 pb-1 sm:pb-2 flex-shrink-0">
          <div className="flex-1 min-w-0 pr-1 sm:pr-2">
            {isRenaming ? (
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename();
                  if (e.key === "Escape") {
                    setIsRenaming(false);
                    setNewFileName(file.fileName);
                  }
                }}
                className="w-full text-xs sm:text-sm font-medium text-gray-900 bg-transparent border-b border-blue-500 px-0 py-1 outline-none"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h3
                className="text-xs sm:text-sm font-medium text-gray-900 truncate leading-tight"
                title={file.fileName}
              >
                {file.fileName}
              </h3>
            )}
          </div>

          {/* Three-dots Menu */}
          <button
            onClick={handleMenuClick}
            className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all duration-200 flex-shrink-0"
            aria-label="File options"
          >
            <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
          </button>
        </div>

        {/* Preview Section - Matches folder icon height exactly */}
        <div className="mx-2 sm:mx-3 mb-2 sm:mb-3 flex-1 flex items-center justify-center">
          <div className="w-full h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
            {getPreviewContent()}
          </div>
        </div>

        {/* Footer Section */}
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
              You opened • {formatDate(file.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      <ContextMenu
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        type="file"
        onOpen={handleOpen}
        onRename={() => {
          setIsRenaming(true);
          setShowMenu(false);
        }}
        onDownload={handleDownload}
        onCopy={handleCopy}
        onMove={handleMove}
        onShare={handleShare}
        onDelete={handleDelete}
      />
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const FileCard = React.memo(FileCardComponent, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return (
    prevProps.file.id === nextProps.file.id &&
    prevProps.file.fileName === nextProps.file.fileName &&
    prevProps.file.updatedAt === nextProps.file.updatedAt &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.uploaderName === nextProps.uploaderName &&
    prevProps.uploaderAvatar === nextProps.uploaderAvatar
  );
});
