// components/files/FileGrid.tsx
import React from "react";
import { FileCard } from "./FileCard";
import { FolderTile } from "./FolderTile";
import { EmptyState } from "./EmptyState";
import { useFiles } from "@/lib/files/api";
import { Loading } from "@/components/editor/Loading";

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
    return <Loading variant="grid" count={8} />;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 mb-2">Error loading files</div>
        <div className="text-sm text-gray-500">
          {error instanceof Error ? error.message : "Something went wrong"}
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
      <EmptyState
        type={emptyStateType}
        onUploadClick={onUpload}
        onCreateFolderClick={onCreateFolder}
        showActions={!searchQuery}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Render Folders First */}
        {filteredFolders.map((folder) => (
          <div key={`folder-${folder.id}`} className="group">
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
          <div key={`file-${file.id}`} className="group">
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
  );
};
