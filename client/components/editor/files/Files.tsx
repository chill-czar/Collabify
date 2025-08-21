"use client";

import React, { useState, useRef, useCallback } from "react";
import { FileItem, UploadProgress, Toast } from "./types";
import { mockFiles, mockTrashFiles } from "./utils/mockData";
import FilesTopBar from "./layout/FilesTopBar";
import FilesGrid from "./layout/FilesGrid";
import FilesList from "./layout/FilesList";
import EmptyState from "./layout/EmptyState";
import FileDetailsSidebar from "./sidebar/FileDetailsSidebar";
import FileContextMenu from "./actions/FileContextMenu";
import ShareModal from "./actions/ShareModal";
import FileUploadZone from "./actions/FileUploadZone";
import ToastContainer from "./components/ToastContainer";

export default function Files() {
  // Core state
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [trashFiles, setTrashFiles] = useState<FileItem[]>(mockTrashFiles);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showTrash, setShowTrash] = useState(false);

  // UI state
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    file: FileItem;
  } | null>(null);
  const [shareModal, setShareModal] = useState<{
    isOpen: boolean;
    file: FileItem | null;
  }>({ isOpen: false, file: null });
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Edit state
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  // Navigation state
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast management
  const addToast = useCallback(
    (type: "success" | "error" | "info", message: string) => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => removeToast(id), 3000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // File upload handler
  const handleFileUpload = useCallback(
    (uploadedFiles: FileList) => {
      Array.from(uploadedFiles).forEach((file, index) => {
        const uploadId = `upload-${Date.now()}-${index}`;
        const upload: UploadProgress = {
          id: uploadId,
          name: file.name,
          progress: 0,
          status: "uploading",
        };

        setUploads((prev) => [...prev, upload]);

        // Simulate upload progress - TODO: Replace with actual API call
        const interval = setInterval(() => {
          setUploads((prev) =>
            prev.map((u) => {
              if (u.id === uploadId) {
                const newProgress = Math.min(
                  u.progress + Math.random() * 30,
                  100
                );
                if (newProgress >= 100) {
                  clearInterval(interval);

                  // TODO: Replace with actual API call to create file
                  const newFile: FileItem = {
                    id: `file-${Date.now()}-${index}`,
                    name: file.name,
                    type: "file",
                    size: file.size,
                    mimeType: file.type,
                    createdAt: new Date(),
                    modifiedAt: new Date(),
                    createdBy: "You",
                    isStarred: false,
                  };

                  setFiles((prev) => [...prev, newFile]);
                  addToast("success", `${file.name} uploaded successfully`);

                  setTimeout(() => {
                    setUploads((prev) => prev.filter((u) => u.id !== uploadId));
                  }, 1000);

                  return { ...u, progress: 100, status: "completed" as const };
                }
                return { ...u, progress: newProgress };
              }
              return u;
            })
          );
        }, 200);
      });
    },
    [addToast]
  );

  // File operations
  const handleFileSelect = useCallback(
    (file: FileItem) => {
      setSelectedFile(selectedFile?.id === file.id ? null : file);
    },
    [selectedFile]
  );

  const handleStarToggle = useCallback((fileId: string) => {
    // TODO: Replace with actual API call
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, isStarred: !f.isStarred } : f))
    );
  }, []);

  const handleRename = useCallback(
    (fileId: string, newName: string) => {
      if (newName.trim()) {
        // TODO: Replace with actual API call
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, name: newName.trim() } : f
          )
        );
        addToast("success", "File renamed successfully");
      }
      setEditingFile(null);
      setEditingName("");
    },
    [addToast]
  );

  // Context menu handlers
  const handleContextMenu = useCallback(
    (e: React.MouseEvent, file: FileItem) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY, file });
    },
    []
  );

  const handleContextAction = useCallback(
    (action: string, file: FileItem) => {
      switch (action) {
        case "open":
          setSelectedFile(file);
          break;
        case "share":
          setShareModal({ isOpen: true, file });
          break;
        case "rename":
          setEditingFile(file.id);
          setEditingName(file.name);
          break;
        case "delete":
          // TODO: Replace with actual API call
          setFiles((prev) => prev.filter((f) => f.id !== file.id));
          setTrashFiles((prev) => [
            ...prev,
            { ...file, isDeleted: true, deletedAt: new Date() },
          ]);
          addToast("success", `${file.name} moved to trash`);
          break;
        case "download":
          // TODO: Replace with actual API call
          addToast("info", `Downloading ${file.name}...`);
          break;
      }
      setContextMenu(null);
    },
    [addToast]
  );

  // Folder operations
  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  }, []);

  // Filter files
  const filteredFiles = files.filter((file) => {
    if (showTrash) return false;

    const matchesSearch = file.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "all" ||
      (selectedType === "folder" && file.type === "folder") ||
      (selectedType === "document" && file.mimeType?.includes("document")) ||
      (selectedType === "pdf" && file.mimeType?.includes("pdf")) ||
      (selectedType === "image" && file.mimeType?.startsWith("image/")) ||
      (selectedType === "video" && file.mimeType?.startsWith("video/"));

    return matchesSearch && matchesType;
  });

  const displayFiles = showTrash ? trashFiles : filteredFiles;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <FilesTopBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          viewMode={viewMode}
          setViewMode={setViewMode}
          showTrash={showTrash}
          setShowTrash={setShowTrash}
          onUploadClick={() => fileInputRef.current?.click()}
          onCreateFolder={() => {
            // TODO: Implement create folder
            addToast("info", "Create folder feature coming soon");
          }}
        />

        {/* File Upload Zone */}
        <FileUploadZone
          onFileUpload={handleFileUpload}
          isDragOver={isDragOver}
          setIsDragOver={setIsDragOver}
        >
          {/* File Area Content */}
          {displayFiles.length === 0 ? (
            <EmptyState
              showTrash={showTrash}
              onUploadClick={() => fileInputRef.current?.click()}
            />
          ) : (
            <div className="flex-1 p-6 overflow-auto">
              {/* Breadcrumb */}
              {currentPath.length > 0 && (
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                  <button
                    onClick={() => setCurrentPath([])}
                    className="hover:text-gray-900 transition-colors"
                  >
                    Files
                  </button>
                  {/* TODO: Implement breadcrumb navigation */}
                </div>
              )}

              {/* Files Display */}
              {viewMode === "grid" ? (
                <FilesGrid
                  files={displayFiles}
                  selectedFile={selectedFile}
                  editingFile={editingFile}
                  editingName={editingName}
                  onFileSelect={handleFileSelect}
                  onContextMenu={handleContextMenu}
                  onStarToggle={handleStarToggle}
                  onStartEdit={(id, name) => {
                    setEditingFile(id);
                    setEditingName(name);
                  }}
                  onFinishEdit={handleRename}
                  onCancelEdit={() => {
                    setEditingFile(null);
                    setEditingName("");
                  }}
                  onNameChange={setEditingName}
                  showTrash={showTrash}
                />
              ) : (
                <FilesList
                  files={displayFiles}
                  selectedFile={selectedFile}
                  editingFile={editingFile}
                  editingName={editingName}
                  onFileSelect={handleFileSelect}
                  onContextMenu={handleContextMenu}
                  onStarToggle={handleStarToggle}
                  onStartEdit={(id, name) => {
                    setEditingFile(id);
                    setEditingName(name);
                  }}
                  onFinishEdit={handleRename}
                  onCancelEdit={() => {
                    setEditingFile(null);
                    setEditingName("");
                  }}
                  onNameChange={setEditingName}
                  showTrash={showTrash}
                />
              )}
            </div>
          )}
        </FileUploadZone>
      </div>

      {/* Right Sidebar */}
      {selectedFile && (
        <FileDetailsSidebar
          selectedFile={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <FileContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          file={contextMenu.file}
          onClose={() => setContextMenu(null)}
          onAction={handleContextAction}
        />
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModal.isOpen}
        file={shareModal.file}
        onClose={() => setShareModal({ isOpen: false, file: null })}
      />

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 z-40">
          <h4 className="font-medium text-gray-900 mb-3">Uploading Files</h4>
          <div className="space-y-3">
            {uploads.map((upload) => (
              <div key={upload.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 truncate">{upload.name}</span>
                  <span className="text-gray-500">{upload.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      upload.status === "completed"
                        ? "bg-green-500"
                        : upload.status === "error"
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            handleFileUpload(e.target.files);
          }
        }}
      />
    </div>
  );
}
