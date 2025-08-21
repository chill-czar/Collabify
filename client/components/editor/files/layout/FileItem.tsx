import React from "react";
import { Star, StarOff } from "lucide-react";
import { FileItemProps } from "../types";
import {
  getFileIcon,
  formatFileSize,
  getFileTypeColor,
} from "../utils/fileTypes";

// Grid Item Component
export function FileGridItem({
  file,
  isSelected,
  isEditing,
  editingName,
  onSelect,
  onContextMenu,
  onStarToggle,
  onStartEdit,
  onFinishEdit,
  onCancelEdit,
  onNameChange,
  showTrash,
}: FileItemProps) {
  const Icon = getFileIcon(file.mimeType, file.type);
  const colorClass = getFileTypeColor(file.mimeType, file.type);

  return (
    <div
      className={`group relative bg-white rounded-lg border border-gray-200 p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? "ring-2 ring-blue-500 border-blue-500" : ""
      }`}
      onClick={() => onSelect(file)}
      onContextMenu={(e) => onContextMenu(e, file)}
    >
      {/* Star Button */}
      {!showTrash && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStarToggle(file.id);
          }}
          className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${
            file.isStarred ? "opacity-100" : ""
          }`}
        >
          {file.isStarred ? (
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
          ) : (
            <StarOff className="w-4 h-4 text-gray-400 hover:text-yellow-500" />
          )}
        </button>
      )}

      {/* File Preview/Icon */}
      <div className="flex justify-center mb-3">
        {file.mimeType?.startsWith("image/") && file.thumbnail ? (
          <img
            src={file.thumbnail}
            alt={file.name}
            className="w-16 h-12 object-cover rounded"
            onError={(e) => {
              // Fallback to icon if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.parentElement!.innerHTML = `
                <div class="w-16 h-12 rounded flex items-center justify-center bg-gray-50">
                  <svg class="w-8 h-8 ${colorClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
              `;
            }}
          />
        ) : (
          <div
            className={`w-16 h-12 rounded flex items-center justify-center ${
              file.type === "folder" ? "bg-blue-50" : "bg-gray-50"
            }`}
          >
            <Icon className={`w-8 h-8 ${colorClass}`} />
          </div>
        )}
      </div>

      {/* File Name */}
      {isEditing ? (
        <input
          type="text"
          value={editingName}
          onChange={(e) => onNameChange(e.target.value)}
          onBlur={() => onFinishEdit(file.id, editingName)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onFinishEdit(file.id, editingName);
            if (e.key === "Escape") onCancelEdit();
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-full text-sm font-medium text-center bg-white border border-blue-500 rounded px-2 py-1 focus:outline-none"
          autoFocus
        />
      ) : (
        <h3
          className="text-sm font-medium text-gray-900 text-center truncate"
          onDoubleClick={() => !showTrash && onStartEdit(file.id, file.name)}
          title={file.name}
        >
          {file.name}
        </h3>
      )}

      {/* File Details */}
      <div className="mt-2 text-center">
        {file.size && (
          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
        )}
        <p className="text-xs text-gray-400">
          {file.modifiedAt.toDateString()}
        </p>
        {showTrash && file.deletedAt && (
          <p className="text-xs text-red-500">
            Deleted {file.deletedAt.toDateString()}
          </p>
        )}
      </div>
    </div>
  );
}

// List Item Component
export function FileListItem({
  file,
  isSelected,
  isEditing,
  editingName,
  onSelect,
  onContextMenu,
  onStarToggle,
  onStartEdit,
  onFinishEdit,
  onCancelEdit,
  onNameChange,
  showTrash,
}: FileItemProps) {
  const Icon = getFileIcon(file.mimeType, file.type);
  const colorClass = getFileTypeColor(file.mimeType, file.type);

  return (
    <div
      className={`grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors group ${
        isSelected ? "bg-blue-50 border-blue-200" : ""
      }`}
      onClick={() => onSelect(file)}
      onContextMenu={(e) => onContextMenu(e, file)}
    >
      <div className="col-span-6 flex items-center gap-3">
        <Icon className={`w-5 h-5 ${colorClass}`} />

        {isEditing ? (
          <input
            type="text"
            value={editingName}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={() => onFinishEdit(file.id, editingName)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onFinishEdit(file.id, editingName);
              if (e.key === "Escape") onCancelEdit();
            }}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 text-sm bg-white border border-blue-500 rounded px-2 py-1 focus:outline-none"
            autoFocus
          />
        ) : (
          <span
            className="text-sm font-medium text-gray-900 truncate flex-1"
            onDoubleClick={() => !showTrash && onStartEdit(file.id, file.name)}
            title={file.name}
          >
            {file.name}
          </span>
        )}

        {!showTrash && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStarToggle(file.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {file.isStarred ? (
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
            ) : (
              <StarOff className="w-4 h-4 text-gray-400 hover:text-yellow-500" />
            )}
          </button>
        )}
      </div>

      <div className="col-span-2 flex items-center text-sm text-gray-500">
        {file.size ? formatFileSize(file.size) : "—"}
      </div>

      <div className="col-span-2 flex items-center text-sm text-gray-500">
        {showTrash && file.deletedAt
          ? file.deletedAt.toDateString()
          : file.modifiedAt.toDateString()}
      </div>

      <div className="col-span-2 flex items-center text-sm text-gray-500">
        {file.createdBy}
      </div>
    </div>
  );
}
