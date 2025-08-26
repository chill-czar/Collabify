// components/files/FileCard.tsx
import React, { useState } from "react";
import { MoreVertical } from "lucide-react";
import { useDeleteFile, useUpdateFile } from "@/lib/files/api";
import { Loading } from "@/components/editor/Loading";
import { FileIcon } from "./FileIcon";
import { ContextMenu } from "./ContextMenu";
import { formatFileSize, formatDate } from "@/utils/fileUtils";

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

  if (deleteFile.isPending || updateFile.isPending) {
    return <Loading variant="card" />;
  }

  return (
    <div
      className={`relative bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-105 group ${
        isSelected ? "ring-2 ring-blue-500 shadow-lg scale-105" : ""
      }`}
      onClick={handleCardClick}
    >
      <div className="p-4">
        {/* File Icon */}
        <FileIcon fileType={file.fileType} category={file.category} />

        {/* File Name */}
        <div className="mt-3 mb-4">
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
              className="w-full text-sm font-medium text-gray-900 border-b border-blue-500 outline-none bg-transparent"
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

        {/* Bottom Info */}
        <div className="flex items-center justify-between">
          {/* Uploader Avatar */}
          <div className="flex items-center">
            {uploaderAvatar ? (
              <img
                src={uploaderAvatar}
                alt={uploaderName}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs text-gray-600">
                  {uploaderName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="text-xs text-gray-500">
            <div>{formatFileSize(file.fileSize)}</div>
            <div>{formatDate(file.createdAt)}</div>
          </div>
        </div>
      </div>

      {/* Three-dot Menu Button */}
      <button
        onClick={handleMenuClick}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-label="File options"
      >
        <MoreVertical className="w-4 h-4 text-gray-600" />
      </button>

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
