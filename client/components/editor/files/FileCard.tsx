// components/files/FileCard.tsx
import React, { useState } from "react";
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

export const FileCard: React.FC<FileCardProps> = ({
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

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleCardClick = () => {
    onSelect?.(file);
  };

  const handleDelete = async () => {
    try {
      await deleteFile.mutateAsync(file.id);
      setShowMenu(false);
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };

  const handleRename = async () => {
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
  };

  const handleDownload = () => {
    window.open(file.fileUrl, "_blank");
    setShowMenu(false);
  };

  const handleOpen = () => {
    window.open(file.fileUrl, "_blank");
    setShowMenu(false);
  };

  // Dummy handlers for features not yet implemented
  const handleCopy = () => {
    console.log("Copy file:", file.id);
    setShowMenu(false);
  };

  const handleMove = () => {
    console.log("Move file:", file.id);
    setShowMenu(false);
  };

  const handleShare = () => {
    console.log("Share file:", file.id);
    setShowMenu(false);
  };

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
                <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-4 border-l-gray-800 border-t-2 border-b-2 border-t-transparent border-b-transparent ml-1"></div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-16 h-16 text-white">
              <FileIcon fileType={file.fileType} category={file.category} />
            </div>
          )}
        </div>
      );
    }

    // Document preview placeholder
    if (isPDF || isDocument) {
      return (
        <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center p-4">
          <div className="w-16 h-16 mb-2">
            <FileIcon fileType={file.fileType} category={file.category} />
          </div>
          <div className="w-full h-20 bg-white border border-gray-200 rounded shadow-sm flex flex-col justify-center px-3">
            <div className="h-1 bg-gray-200 rounded mb-1"></div>
            <div className="h-1 bg-gray-200 rounded mb-1 w-4/5"></div>
            <div className="h-1 bg-gray-200 rounded mb-1"></div>
            <div className="h-1 bg-gray-200 rounded w-3/5"></div>
          </div>
        </div>
      );
    }

    // Default file icon
    return (
      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16">
          <FileIcon fileType={file.fileType} category={file.category} />
        </div>
      </div>
    );
  };

  if (deleteFile.isPending || updateFile.isPending) {
    return <Loading variant="card" />;
  }

  return (
    <div className="relative group">
      <div
        className={`
          bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200 cursor-pointer 
          hover:shadow-md hover:scale-[1.02]
          ${isSelected ? "ring-2 ring-blue-500 shadow-md" : ""}
        `}
        onClick={handleCardClick}
      >
        {/* Header Row */}
        <div className="flex items-start justify-between p-3 pb-2">
          <div className="flex-1 min-w-0 pr-2">
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
                className="w-full text-sm font-medium text-gray-900 bg-transparent border-b border-blue-500 px-0 py-1 outline-none"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h3
                className="text-sm font-medium text-gray-900 truncate"
                title={file.fileName}
              >
                {file.fileName}
              </h3>
            )}
          </div>

          {/* Three-dots Menu */}
          <button
            onClick={handleMenuClick}
            className="w-6 h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all duration-200 flex-shrink-0"
            aria-label="File options"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Preview Section */}
        <div className="mx-3 mb-3 h-32 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
          {getPreviewContent()}
        </div>

        {/* Footer Section */}
        <div className="px-3 pb-3 flex items-center space-x-2">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            {uploaderAvatar ? (
              <img
                src={uploaderAvatar}
                alt={uploaderName}
                className="w-5 h-5 rounded-full"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center">
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
