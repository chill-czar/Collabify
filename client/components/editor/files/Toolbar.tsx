"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  FolderPlus,
  X,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import type { CreateFolderRequest, UploadFileRequest } from "@/app/types/files";
import { useUploadFile, useCreateFolder } from "@/lib/files/api";

export type ToolbarProps = {
  projectId: string;
  parentFolderId: string | null;
};

const Toolbar: React.FC<ToolbarProps> = ({ projectId, parentFolderId }) => {
  // Folder creation state
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [folderName, setFolderName] = useState("");

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Optional file metadata
  const [category, setCategory] = useState<string>("OTHER");
  const [description, setDescription] = useState<string | null>(null);

  // ✅ Use the fixed upload hook
  const uploadMutation = useUploadFile(projectId, parentFolderId);

  // Folder creation hook
  const {
    mutate: createFolder,
    isPending: isFolderLoading, // ✅ Changed from isLoading to isPending
    isSuccess: isFolderSuccess,
    isError: isFolderError,
    reset: resetFolder,
  } = useCreateFolder(projectId, parentFolderId);

  // Trigger hidden file input
  const handleUploadClick = () => fileInputRef.current?.click();

  // Handle file selection and upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const payload: UploadFileRequest = {
      file,
      fileName: file.name,
      projectId,
      folderId: parentFolderId ?? null,
      category,
      description,
      tags: [],
    };

    uploadMutation.mutate(payload, {
      onSuccess: (res) => {
        console.log("File uploaded:", res.data);
        if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
      },
      onError: (err) => console.error("Upload error:", err),
    });
  };

  // Folder creation handler
  const handleCreateFolder = () => {
    if (!folderName.trim()) return;
    resetFolder();

    const payload: CreateFolderRequest = {
      projectId,
      name: folderName.trim(),
      parentFolderId,
      description: undefined,
      metadata: undefined,
    };

    createFolder(payload);
  };

  const handleCloseModal = () => {
    setShowCreateFolderModal(false);
    setFolderName("");
    resetFolder();
  };

  React.useEffect(() => {
    if (isFolderSuccess) {
      setTimeout(handleCloseModal, 1500);
    }
  }, [isFolderSuccess]);

  return (
    <>
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900">Files</h1>
          <div className="flex items-center gap-3">
            {/* Upload File Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUploadClick}
              disabled={uploadMutation.isPending} // ✅ Changed from isLoading to isPending
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${
                  uploadMutation.isPending // ✅ Changed from isLoading to isPending
                    ? "bg-blue-400 cursor-not-allowed"
                    : uploadMutation.isSuccess
                    ? "bg-green-600 hover:bg-green-700"
                    : uploadMutation.isError
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white
              `}
            >
              {uploadMutation.isPending ? ( // ✅ Changed from isLoading to isPending
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : uploadMutation.isSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Uploaded!
                </>
              ) : uploadMutation.isError ? (
                <>
                  <AlertCircle className="w-4 h-4" />
                  Upload Failed
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload
                </>
              )}
            </motion.button>

            {/* Create Folder Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateFolderModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <FolderPlus className="w-4 h-4" />
              New Folder
            </motion.button>
          </div>
        </div>

        {/* Upload Error */}
        {uploadMutation.isError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Upload failed. Please try again.</span>
          </motion.div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Folder Modal */}
      {showCreateFolderModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Content */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Create New Folder
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateFolder();
                if (e.key === "Escape") handleCloseModal();
              }}
              autoFocus
            />

            {isFolderError && (
              <div className="text-red-600 mb-2">Failed to create folder.</div>
            )}
            {isFolderSuccess && (
              <div className="text-green-600 mb-2">Folder created!</div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleCreateFolder}
                disabled={
                  !folderName.trim() || isFolderLoading || isFolderSuccess
                }
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
              >
                {isFolderLoading
                  ? "Creating..."
                  : isFolderSuccess
                  ? "Created!"
                  : "Create Folder"}
              </button>
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Toolbar;
