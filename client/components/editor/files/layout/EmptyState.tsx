import React from "react";
import { Trash2, FilePlus } from "lucide-react";
import { EmptyStateProps } from "../types";

export default function EmptyState({
  showTrash,
  onUploadClick,
}: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          {showTrash ? (
            <Trash2 className="w-12 h-12 text-gray-400" />
          ) : (
            <FilePlus className="w-12 h-12 text-gray-400" />
          )}
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {showTrash ? "Trash is empty" : "No files yet"}
        </h3>

        <p className="text-gray-500 mb-6 leading-relaxed">
          {showTrash
            ? "Deleted files will appear here and can be recovered for 30 days before being permanently deleted."
            : "Upload your first file or create a folder to get started. You can drag and drop files anywhere on this page."}
        </p>

        {!showTrash && (
          <button
            onClick={onUploadClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <FilePlus className="w-5 h-5" />
            Upload Files
          </button>
        )}
      </div>
    </div>
  );
}
