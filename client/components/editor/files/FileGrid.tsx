// components/files/FileGrid.tsx
import React from "react";
import { FileCard } from "./FileCard";
import { FolderTile } from "./FolderTile";
import { EmptyState } from "./EmptyState";
import { useFiles } from "@/lib/files/api";
import { Loading } from "@/components/editor/files/Loading";
import Breadcrumbs from "./Breadcrumbs";

interface FileGridProps {
  projectId: string;
  folderId?: string | null;
  onItemSelect?: (item: any, type: "file" | "folder") => void;
  selectedItem?: any;
  selectedType?: "file" | "folder" | null;
  onUpload?: () => void;
  onCreateFolder?: () => void;
  searchQuery?: string;
}

export const FileGrid: React.FC<FileGridProps> = ({
  projectId,
  folderId = null,
  onItemSelect,
  selectedItem,
  selectedType,
  onUpload,
  onCreateFolder,
  searchQuery,
}) => {
  const { data, isLoading, error } = useFiles(projectId, folderId);

  const handleFileSelect = (file: any) => {
    onItemSelect?.(file, "file");
  };

  const handleFolderSelect = (folder: any) => {
    onItemSelect?.(folder, "folder");
  };

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[400px] bg-white">
        <div className="p-4 sm:p-6 lg:p-8">
          <Loading variant="grid" count={8} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full min-h-[400px] bg-white">
        <div className="flex items-center justify-center p-8 sm:p-12">
          <div className="text-center max-w-md">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error loading files
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {error instanceof Error
                ? error.message
                : "Something went wrong loading your files. Please try again."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const files = data?.files || [];
  const folders = data?.folders || [];

  // Filter items based on search query
  const filteredFiles = searchQuery
    ? files.filter(
        (file) =>
          file.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : files;

  const filteredFolders = searchQuery
    ? folders.filter((folder) =>
        folder.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : folders;

  const hasItems = filteredFiles.length > 0 || filteredFolders.length > 0;

  if (!hasItems) {
    const emptyStateType = searchQuery
      ? "search"
      : folderId
      ? "folder"
      : "files";
    return (
      <div className="w-full h-full min-h-[500px] bg-white">
        <div className="flex items-center justify-center p-8 sm:p-12">
          <EmptyState
            type={emptyStateType}
            onUploadClick={onUpload}
            onCreateFolderClick={onCreateFolder}
            showActions={!searchQuery}
          />
        </div>
      </div>
    );
  }

  const totalItems = filteredFiles.length + filteredFolders.length;

  return (
    <div className="w-full h-full bg-white">
      <Breadcrumbs />
      {/* Grid Container */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {/* Render Folders First */}
          {filteredFolders.map((folder) => (
            <div
              key={`folder-${folder.id}`}
              className="group relative transition-all duration-200 hover:scale-[1.02]"
            >
              <FolderTile
                folder={folder}
                onSelect={handleFolderSelect}
                isSelected={
                  selectedType === "folder" && selectedItem?.id === folder.id
                }
              />
            </div>
          ))}

          {/* Render Files */}
          {filteredFiles.map((file) => (
            <div
              key={`file-${file.id}`}
              className="group relative transition-all duration-200 hover:scale-[1.02]"
            >
              <FileCard
                file={file}
                onSelect={handleFileSelect}
                isSelected={
                  selectedType === "file" && selectedItem?.id === file.id
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom spacing for better visual balance */}
      <div className="h-6 sm:h-8" />
    </div>
  );
};
