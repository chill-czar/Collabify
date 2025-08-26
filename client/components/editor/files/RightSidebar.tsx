// components/files/RightSidebar.tsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  useDeleteFile,
  useUpdateFile,
  useDeleteFolder,
  useUpdateFolder,
} from "@/lib/files/api";
import { Loading } from "@/components/editor/Loading";
import { SidebarDetails } from "./SidebarDetails";
import { SidebarActions } from "./SidebarActions";

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  type: "file" | "folder";
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  isOpen,
  onClose,
  item,
  type,
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState("");

  const deleteFile = useDeleteFile();
  const updateFile = useUpdateFile();
  const deleteFolder = useDeleteFolder();
  const updateFolder = useUpdateFolder();

  useEffect(() => {
    if (item) {
      setNewName(type === "file" ? item.fileName : item.name);
    }
  }, [item, type]);

  if (!item) return null;

  const handleDelete = async () => {
    try {
      if (type === "file") {
        await deleteFile.mutateAsync(item.id);
      } else {
        await deleteFolder.mutateAsync({ folderId: item.id, force: true });
      }
      onClose();
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
    }
  };

  const handleRename = async () => {
    if (
      newName.trim() &&
      newName !== (type === "file" ? item.fileName : item.name)
    ) {
      try {
        if (type === "file") {
          await updateFile.mutateAsync({
            id: item.id,
            fileName: newName.trim(),
          });
        } else {
          await updateFolder.mutateAsync({
            id: item.id,
            name: newName.trim(),
          });
        }
        setIsRenaming(false);
      } catch (error) {
        console.error(`Failed to rename ${type}:`, error);
      }
    } else {
      setIsRenaming(false);
    }
  };

  const handleDownload = () => {
    if (type === "file" && item.fileUrl) {
      window.open(item.fileUrl, "_blank");
    }
  };

  const handleOpen = () => {
    if (type === "file" && item.fileUrl) {
      window.open(item.fileUrl, "_blank");
    }
  };

  // Dummy handlers
  const handleCopy = () => console.log(`Copy ${type}:`, item.id);
  const handleMove = () => console.log(`Move ${type}:`, item.id);
  const handleShare = () => console.log(`Share ${type}:`, item.id);

  const isLoading =
    deleteFile.isPending ||
    updateFile.isPending ||
    deleteFolder.isPending ||
    updateFolder.isPending;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 z-30 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-white border-l shadow-lg z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } lg:relative lg:translate-x-0 lg:w-80`}
      >
        {isLoading ? (
          <Loading variant="sidebar" />
        ) : (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                {type === "file" ? "File Details" : "Folder Details"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Name Section */}
              <div className="mb-6">
                {isRenaming ? (
                  <div className="mb-4">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onBlur={handleRename}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRename();
                        if (e.key === "Escape") {
                          setIsRenaming(false);
                          setNewName(
                            type === "file" ? item.fileName : item.name
                          );
                        }
                      }}
                      className="w-full text-lg font-semibold text-gray-900 border-b border-blue-500 outline-none bg-transparent"
                      autoFocus
                    />
                  </div>
                ) : (
                  <h1 className="text-lg font-semibold text-gray-900 mb-2">
                    {type === "file" ? item.fileName : item.name}
                  </h1>
                )}
              </div>

              {/* Details */}
              <SidebarDetails item={item} type={type} />

              {/* Actions */}
              <SidebarActions
                type={type}
                onOpen={type === "file" ? handleOpen : undefined}
                onDownload={type === "file" ? handleDownload : undefined}
                onRename={() => setIsRenaming(true)}
                onCopy={handleCopy}
                onMove={handleMove}
                onShare={handleShare}
                onDelete={handleDelete}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
