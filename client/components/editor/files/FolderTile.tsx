// components/files/FolderTile.tsx
import React, { useState, useRef, useEffect } from "react";
import { Folder, MoreVertical } from "lucide-react";
import { useDeleteFolder, useUpdateFolder } from "@/lib/files/api";
import { Loading } from "@/components/editor/files/Loading";
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
  const [renameError, setRenameError] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const deleteFolder = useDeleteFolder();
  const updateFolder = useUpdateFolder();

  // Update newFolderName when folder.name changes (e.g., from external updates)
  useEffect(() => {
    if (!isRenaming) {
      setNewFolderName(folder.name);
    }
  }, [folder.name, isRenaming]);

  // Auto-clear error after 3 seconds
  useEffect(() => {
    if (renameError) {
      // Clear any existing timeout
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }

      // Set new timeout to clear error after 3 seconds
      errorTimeoutRef.current = setTimeout(() => {
        setRenameError(null);
      }, 3000);
    }

    // Cleanup timeout on unmount or when error is cleared
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [renameError]);

  // Handle clicking outside to close context menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Don't close if clicking on the menu button or inside the menu
      if (
        showMenu &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(target) &&
        !buttonRef.current.contains(target)
      ) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showMenu]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showMenu) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("keydown", handleEscapeKey);
      return () => {
        document.removeEventListener("keydown", handleEscapeKey);
      };
    }
  }, [showMenu]);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleTileClick = () => {
    // Don't trigger selection if menu is open or we're renaming
    if (!showMenu && !isRenaming) {
      onSelect?.(folder);
    }
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
    const trimmedName = newFolderName.trim();

    if (!trimmedName) {
      setRenameError("Folder name cannot be empty");
      return;
    }

    if (trimmedName === folder.name) {
      // No change, just exit rename mode
      setIsRenaming(false);
      setRenameError(null);
      return;
    }

    // Clear previous error
    setRenameError(null);

    updateFolder.mutate(
      {
        id: folder.id,
        name: trimmedName,
      },
      {
        onError: (error: any) => {
          // Handle rename error
          const errorMessage = error?.message || "Failed to rename folder";
          setRenameError(errorMessage);

          // Revert folder name to original value on error
          setNewFolderName(folder.name);

          // Exit rename mode to return to normal display
          setIsRenaming(false);

          console.error("Failed to rename folder:", error);
        },
        onSuccess: () => {
          // Clear any previous errors on success
          setRenameError(null);
          setIsRenaming(false);
          setShowMenu(false);
        },
      }
    );
  };

  const handleRenameCancel = () => {
    setIsRenaming(false);
    setNewFolderName(folder.name); // Revert to original name
    setRenameError(null);

    // Clear error timeout if exists
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
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

  if (deleteFolder.isPending) {
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
        onClick={handleTileClick}
      >
        {/* Header Row */}
        <div className="flex items-start justify-between p-2 sm:p-3 pb-1 sm:pb-2 flex-shrink-0">
          <div className="flex-1 min-w-0 pr-1 sm:pr-2">
            {isRenaming ? (
              <div className="space-y-1">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onBlur={handleRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename();
                    if (e.key === "Escape") handleRenameCancel();
                  }}
                  className={`w-full text-xs sm:text-sm font-medium text-gray-900 bg-transparent border-b outline-none px-0 py-1 ${
                    renameError ? "border-red-500" : "border-blue-500"
                  }`}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  disabled={updateFolder.isPending}
                />
                {updateFolder.isPending && (
                  <p className="text-xs text-blue-500">Renaming...</p>
                )}
              </div>
            ) : (
              <h3
                className="text-xs sm:text-sm font-medium text-gray-900 truncate leading-tight"
                title={folder.name}
              >
                {folder.name}
              </h3>
            )}
          </div>

          {/* Three-dots Menu */}
          <button
            ref={buttonRef}
            onClick={handleMenuClick}
            className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all duration-200 flex-shrink-0"
            aria-label="Folder options"
            aria-expanded={showMenu}
          >
            <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
          </button>
        </div>

        {/* Folder Icon Section - Matches file preview height exactly */}
        <div className="mx-2 sm:mx-3 mb-2 sm:mb-3 flex-1 flex items-center justify-center">
          <div className="h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36 flex items-center justify-center">
            <Folder
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 transition-colors duration-150"
              style={{ color: folder.color || "#4285F4" }}
              fill="currentColor"
            />
          </div>
        </div>

        {/* Footer Section */}
        <div className="px-2 sm:px-3 pb-2 sm:pb-3 flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          {/* Creator Avatar */}
          <div className="flex-shrink-0">
            {creatorAvatar ? (
              <img
                src={creatorAvatar}
                alt={creatorName}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full"
              />
            ) : (
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-400 flex items-center justify-center">
                <span className="text-xs text-white font-medium">
                  {creatorName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Context Text */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-600 truncate">
              You created • {formatDate(folder.createdAt)}
            </p>
          </div>
        </div>

        {/* Error Display */}
        {renameError && !isRenaming && (
          <div className="px-2 sm:px-3 pb-2">
            <p className="text-xs text-red-500">{renameError}</p>
          </div>
        )}
      </div>

      {/* Context Menu */}
      <div ref={menuRef}>
        <ContextMenu
          isOpen={showMenu}
          onClose={() => setShowMenu(false)}
          type="folder"
          onRename={() => {
            setIsRenaming(true);
            setShowMenu(false);
            setRenameError(null);
            // Clear any existing error timeout when starting rename
            if (errorTimeoutRef.current) {
              clearTimeout(errorTimeoutRef.current);
              errorTimeoutRef.current = null;
            }
          }}
          onCopy={handleCopy}
          onMove={handleMove}
          onShare={handleShare}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};