import React from "react";
import { FilesListProps } from "../types";
import { FileListItem } from "./FileItem";

export default function FilesList({
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
}: FilesListProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
        <div className="col-span-6">Name</div>
        <div className="col-span-2">Size</div>
        <div className="col-span-2">{showTrash ? "Deleted" : "Modified"}</div>
        <div className="col-span-2">Created by</div>
      </div>

      {/* File Items */}
      {files.map((file) => (
        <FileListItem
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
