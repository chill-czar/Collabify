// components/files/RightSidebar.tsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  useDeleteFile,
  useUpdateFile,
  useDeleteFolder,
  useUpdateFolder,
} from "@/lib/files/api";
import { SidebarDetails } from "./SidebarDetails";

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

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!item) return null;

  
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


  const isLoading =
    deleteFile.isPending ||
    updateFile.isPending ||
    deleteFolder.isPending ||
    updateFolder.isPending;

  return (
    <>
      {/* Backdrop - Only visible on mobile */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-all duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white border-l border-gray-200 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } lg:relative lg:translate-x-0 lg:w-80 lg:shadow-none lg:border-gray-200`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900"></div>
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-2 border-b border-gray-200 bg-gray-50/50">
              <h2
                id="sidebar-title"
                className="text-lg font-semibold text-gray-900 tracking-tight"
              >
                {type === "file" ? "File Details" : "Folder Details"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 -mr-2 hover:bg-gray-200 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-6 space-y-8">
                {/* Name Section */}
                <div>
                  {isRenaming ? (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        {type === "file" ? "File Name" : "Folder Name"}
                      </label>
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
                        className="w-full px-3 py-2 text-lg font-semibold text-gray-900 bg-white border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        autoFocus
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Press Enter to save, Escape to cancel
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        {type === "file" ? "File Name" : "Folder Name"}
                      </label>
                      <h1 className="text-lg font-semibold text-gray-900 break-words leading-tight">
                        {type === "file" ? item.fileName : item.name}
                      </h1>
                    </div>
                  )}
                </div>

                {/* Details */}
                <SidebarDetails item={item} type={type} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};