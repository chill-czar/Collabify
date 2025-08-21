import React from "react";
import { FilesGridProps } from "../types";
import { FileGridItem } from "./FileItem";

export default function FilesGrid({
  files,
  selectedFile,
  editingFile,
  editingName,
  onFileSelect,
  onContextMenu,
  onStarToggle,
  onStartEdit,
  onFinishEdit,
  onCancelEdit,
  onNameChange,
  showTrash,
}: FilesGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {files.map((file) => (
        <FileGridItem
          key={file.id}
          file={file}
          isSelected={selectedFile?.id === file.id}
          isEditing={editingFile === file.id}
          editingName={editingName}
          onSelect={onFileSelect}
          onContextMenu={onContextMenu}
          onStarToggle={onStarToggle}
          onStartEdit={onStartEdit}
          onFinishEdit={onFinishEdit}
          onCancelEdit={onCancelEdit}
          onNameChange={onNameChange}
          showTrash={showTrash}
        />
      ))}
    </div>
  );
}
