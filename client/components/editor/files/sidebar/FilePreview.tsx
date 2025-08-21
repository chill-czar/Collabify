import React from "react";
import { FileItem } from "../types";
import { getFileIcon, getFileTypeColor } from "../utils/fileTypes";

interface FilePreviewProps {
  file: FileItem;
}

export default function FilePreview({ file }: FilePreviewProps) {
  const Icon = getFileIcon(file.mimeType, file.type);
  const colorClass = getFileTypeColor(file.mimeType, file.type);

  // Image preview
  if (file.mimeType?.startsWith("image/") && file.thumbnail) {
    return (
      <div className="w-full">
        <img
          src={file.thumbnail}
          alt={file.name}
          className="w-full h-48 object-contain bg-gray-50 rounded-lg border border-gray-200"
          onError={(e) => {
            // Fallback to icon if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const fallback = document.createElement("div");
            fallback.className =
              "w-full h-48 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center";
            fallback.innerHTML = `
              <div class="text-center">
                <div class="w-16 h-16 ${colorClass} mb-2 mx-auto">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <p class="text-sm text-gray-500">Preview not available</p>
              </div>
            `;
            target.parentElement?.appendChild(fallback);
          }}
        />
      </div>
    );
  }

  // PDF preview placeholder
  if (file.mimeType === "application/pdf") {
    return (
      <div className="w-full h-48 bg-red-50 rounded-lg border border-red-200 flex items-center justify-center">
        <div className="text-center">
          <Icon className="w-16 h-16 text-red-500 mb-3 mx-auto" />
          <p className="text-sm text-gray-700 font-medium">PDF Document</p>
          <p className="text-xs text-gray-500 mt-1">Click to open preview</p>
        </div>
      </div>
    );
  }

  // Video preview placeholder
  if (file.mimeType?.startsWith("video/")) {
    return (
      <div className="w-full h-48 bg-purple-50 rounded-lg border border-purple-200 flex items-center justify-center">
        <div className="text-center">
          <Icon className="w-16 h-16 text-purple-500 mb-3 mx-auto" />
          <p className="text-sm text-gray-700 font-medium">Video File</p>
          <p className="text-xs text-gray-500 mt-1">Click to play</p>
        </div>
      </div>
    );
  }

  // Audio preview placeholder
  if (file.mimeType?.startsWith("audio/")) {
    return (
      <div className="w-full h-48 bg-orange-50 rounded-lg border border-orange-200 flex items-center justify-center">
        <div className="text-center">
          <Icon className="w-16 h-16 text-orange-500 mb-3 mx-auto" />
          <p className="text-sm text-gray-700 font-medium">Audio File</p>
          <p className="text-xs text-gray-500 mt-1">Click to play</p>
        </div>
      </div>
    );
  }

  // Document preview placeholder
  if (
    file.mimeType?.includes("document") ||
    file.mimeType?.includes("sheet") ||
    file.mimeType?.includes("presentation")
  ) {
    return (
      <div className="w-full h-48 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-center">
        <div className="text-center">
          <Icon className="w-16 h-16 text-blue-500 mb-3 mx-auto" />
          <p className="text-sm text-gray-700 font-medium">Office Document</p>
          <p className="text-xs text-gray-500 mt-1">Click to open</p>
        </div>
      </div>
    );
  }

  // Folder preview
  if (file.type === "folder") {
    return (
      <div className="w-full h-48 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-center">
        <div className="text-center">
          <Icon className="w-16 h-16 text-blue-500 mb-3 mx-auto" />
          <p className="text-sm text-gray-700 font-medium">Folder</p>
          <p className="text-xs text-gray-500 mt-1">Double-click to open</p>
        </div>
      </div>
    );
  }

  // Code file preview placeholder
  if (
    file.mimeType?.includes("javascript") ||
    file.mimeType?.includes("typescript") ||
    file.mimeType?.includes("json") ||
    file.mimeType?.includes("html") ||
    file.mimeType?.includes("css")
  ) {
    return (
      <div className="w-full h-48 bg-indigo-50 rounded-lg border border-indigo-200 flex items-center justify-center">
        <div className="text-center">
          <Icon className="w-16 h-16 text-indigo-500 mb-3 mx-auto" />
          <p className="text-sm text-gray-700 font-medium">Code File</p>
          <p className="text-xs text-gray-500 mt-1">Click to view source</p>
        </div>
      </div>
    );
  }

  // Archive preview placeholder
  if (file.mimeType?.includes("zip") || file.mimeType?.includes("archive")) {
    return (
      <div className="w-full h-48 bg-yellow-50 rounded-lg border border-yellow-200 flex items-center justify-center">
        <div className="text-center">
          <Icon className="w-16 h-16 text-yellow-600 mb-3 mx-auto" />
          <p className="text-sm text-gray-700 font-medium">Archive File</p>
          <p className="text-xs text-gray-500 mt-1">Click to extract</p>
        </div>
      </div>
    );
  }

  // Generic file preview
  return (
    <div className="w-full h-48 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
      <div className="text-center">
        <Icon className={`w-16 h-16 ${colorClass} mb-3 mx-auto`} />
        <p className="text-sm text-gray-700 font-medium">File</p>
        <p className="text-xs text-gray-500 mt-1">No preview available</p>
      </div>
    </div>
  );
}
