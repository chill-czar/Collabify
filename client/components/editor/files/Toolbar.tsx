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
    isPending: isFolderLoading,
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
        if (fileInputRef.current) fileInputRef.current.value = "";
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
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-4">
            {/* Title Section */}
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Files</h1>
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Upload File Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUploadClick}
                disabled={uploadMutation.isPending}
                className={`
                  inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg
                  transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                  min-w-[120px] justify-center
                  ${
                    uploadMutation.isPending
                      ? "bg-gray-900 text-white cursor-not-allowed opacity-80"
                      : uploadMutation.isSuccess
                      ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
                      : uploadMutation.isError
                      ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                      : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500"
                  }
                `}
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : uploadMutation.isSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Uploaded!</span>
                  </>
                ) : uploadMutation.isError ? (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    <span>Failed</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload File</span>
                  </>
                )}
              </motion.button>

              {/* Create Folder Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreateFolderModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900
                         transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                         min-w-[120px] justify-center"
              >
                <FolderPlus className="w-4 h-4" />
                <span>New Folder</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Upload Error Banner */}
        {uploadMutation.isError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-red-200 bg-red-50"
          >
            <div className="px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800 font-medium">
                  Upload failed. Please check your file and try again.
                </p>
              </div>
            </div>
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                Create New Folder
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Enter folder name..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                           placeholder:text-gray-400"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateFolder();
                    if (e.key === "Escape") handleCloseModal();
                  }}
                  autoFocus
                />
              </div>

              {/* Status Messages */}
              {isFolderError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Failed to create folder. Please try again.</span>
                </motion.div>
              )}

              {isFolderSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg"
                >
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>Folder created successfully!</span>
                </motion.div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={handleCreateFolder}
                disabled={!folderName.trim() || isFolderLoading || isFolderSuccess}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium
                         bg-gray-900 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 
                         focus:ring-gray-500 focus:ring-offset-2 transition-colors
                         disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                {isFolderLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isFolderLoading
                  ? "Creating..."
                  : isFolderSuccess
                  ? "Created!"
                  : "Create Folder"}
              </button>
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                         rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 
                         focus:ring-offset-2 transition-colors"
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