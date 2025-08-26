// components/files/FolderTile.tsx
import React, { useState } from "react";
import { Folder, MoreVertical } from "lucide-react";
import { useDeleteFolder, useUpdateFolder } from "@/lib/files/api";
import { Loading } from "@/components/editor/Loading";
import { ContextMenu } from "./ContextMenu";
import { formatDate } from "@/utils/fileUtils";

interface FolderTileProps {
  folder: {
    id: string;
    name: string;
    parentFolderId: string | null;
    color: string | null;
    createdAt: string;
    updatedAt: string;
  };
  onSelect?: (folder: any) => void;
  isSelected?: boolean;
  creatorName?: string;
  creatorAvatar?: string;
}

export const FolderTile: React.FC<FolderTileProps> = ({
  folder,
  onSelect,
  isSelected = false,
  creatorName = "Unknown User",
  creatorAvatar,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newFolderName, setNewFolderName] = useState(folder.name);

  const deleteFolder = useDeleteFolder();
  const updateFolder = useUpdateFolder();

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleTileClick = () => {
    onSelect?.(folder);
  };

  const handleDelete = async () => {
    try {
      await deleteFolder.mutateAsync({ folderId: folder.id, force: true });
      setShowMenu(false);
    } catch (error) {
      console.error("Failed to delete folder:", error);
    }
  };

  const handleRename = async () => {
    if (newFolderName.trim() && newFolderName !== folder.name) {
      try {
        await updateFolder.mutateAsync({
          id: folder.id,
          name: newFolderName.trim(),
        });
        setIsRenaming(false);
        setShowMenu(false);
      } catch (error) {
        console.error("Failed to rename folder:", error);
      }
    } else {
      setIsRenaming(false);
    }
  };

  const handleMove = () => {
    console.log("Move folder:", folder.id);
    setShowMenu(false);
  };

  const handleShare = () => {
    console.log("Share folder:", folder.id);
    setShowMenu(false);
  };

  const handleCopy = () => {
    console.log("Copy folder:", folder.id);
    setShowMenu(false);
  };

  if (deleteFolder.isPending || updateFolder.isPending) {
    return <Loading variant="card" />;
  }

  return (
    <div
      className={`relative bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-105 group ${
        isSelected ? "ring-2 ring-blue-500 shadow-lg scale-105" : ""
      }`}
      onClick={handleTileClick}
    >
      <div className="p-4">
        {/* Folder Icon */}
        <div className="flex items-center justify-center h-20">
          <Folder
            className="w-12 h-12 text-blue-500"
            style={{ color: folder.color || "#3B82F6" }}
            fill="currentColor"
          />
        </div>

        {/* Folder Name */}
        <div className="mt-3 mb-4">
          {isRenaming ? (
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") {
                  setIsRenaming(false);
                  setNewFolderName(folder.name);
                }
              }}
              className="w-full text-sm font-medium text-gray-900 border-b border-blue-500 outline-none bg-transparent"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h3
              className="text-sm font-medium text-gray-900 truncate"
              title={folder.name}
            >
              {folder.name}
            </h3>
          )}
        </div>

        {/* Bottom Info */}
        <div className="flex items-center justify-between">
          {/* Creator Avatar */}
          <div className="flex items-center">
            {creatorAvatar ? (
              <img
                src={creatorAvatar}
                alt={creatorName}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs text-gray-600">
                  {creatorName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Date */}
          <div className="text-xs text-gray-500">
            {formatDate(folder.createdAt)}
          </div>
        </div>
      </div>

      {/* Three-dot Menu Button */}
      <button
        onClick={handleMenuClick}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-label="Folder options"
      >
        <MoreVertical className="w-4 h-4 text-gray-600" />
      </button>

      {/* Context Menu */}
      <ContextMenu
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        type="folder"
        onRename={() => {
          setIsRenaming(true);
          setShowMenu(false);
        }}
        onCopy={handleCopy}
        onMove={handleMove}
        onShare={handleShare}
        onDelete={handleDelete}
      />
    </div>
  );
};
