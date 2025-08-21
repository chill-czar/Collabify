import React from "react";
import {
  Upload,
  FolderPlus,
  Grid3X3,
  List,
  Search,
  Trash2,
} from "lucide-react";
import { FilesTopBarProps } from "../types";
import { fileTypeFilters } from "../utils/fileTypes";

export default function FilesTopBar({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  viewMode,
  setViewMode,
  showTrash,
  setShowTrash,
  onUploadClick,
  onCreateFolder,
}: FilesTopBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {showTrash ? "Trash" : "Files"}
          </h1>

          {!showTrash && (
            <div className="flex items-center gap-2">
              <button
                onClick={onUploadClick}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>

              <button
                onClick={onCreateFolder}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FolderPlus className="w-4 h-4" />
                New Folder
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTrash(!showTrash)}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              showTrash
                ? "bg-red-100 text-red-700"
                : "border border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Trash2 className="w-4 h-4" />
            {showTrash ? "Back to Files" : "Trash"}
          </button>

          <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1 rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="Grid view"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search files and folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {fileTypeFilters.map((filter) => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
