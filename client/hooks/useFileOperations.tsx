import { useState, useRef, useEffect } from "react";
import { useUploadFile, useCreateFolder } from "@/lib/files/api";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import type { CreateFolderRequest, UploadFileRequest } from "@/types/files";

export const useFileOperations = (projectId: string) => {
  const parentFolderId = useSelector(
    (state: RootState) => state.breadCrumb.currentFolderId
  );

  // State
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Optional metadata
  const [category] = useState<string>("OTHER");
  const [description] = useState<string | null>(null);

  // Upload mutation
  const uploadMutation = useUploadFile(projectId, parentFolderId);

  // Folder creation mutation
  const {
    mutate: createFolder,
    isPending: isFolderLoading,
    isSuccess: isFolderSuccess,
    isError: isFolderError,
    reset: resetFolder,
  } = useCreateFolder(projectId, parentFolderId);

  // Trigger hidden file input
  const handleUploadClick = () => fileInputRef.current?.click();

  // File upload
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
      onSuccess: () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });
  };

  // Folder creation
  const handleCreateFolder = () => {
    if (!folderName.trim()) return;
    resetFolder();

    const payload: CreateFolderRequest = {
      projectId,
      name: folderName.trim(),
      parentFolderId,
    };

    createFolder(payload);
  };

  const handleCloseModal = () => {
    setShowCreateFolderModal(false);
    setFolderName("");
    resetFolder();
  };

  const openCreateFolderModal = () => {
    setShowCreateFolderModal(true);
  };

  // Auto close modal on success
  useEffect(() => {
    if (isFolderSuccess) {
      setTimeout(handleCloseModal, 1500);
    }
  }, [isFolderSuccess]);

  // Reset upload button state after showing success message
  useEffect(() => {
    if (uploadMutation.isSuccess) {
      const timer = setTimeout(() => {
        uploadMutation.reset();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [uploadMutation.isSuccess]);

  // Reset upload button state after showing error message
  useEffect(() => {
    if (uploadMutation.isError) {
      const timer = setTimeout(() => {
        uploadMutation.reset();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadMutation.isError]);

  return {
    // State
    showCreateFolderModal,
    folderName,
    setFolderName,
    fileInputRef,

    // Upload state
    uploadMutation,

    // Folder creation state
    isFolderLoading,
    isFolderSuccess,
    isFolderError,

    // Handlers
    handleUploadClick,
    handleFileChange,
    handleCreateFolder,
    handleCloseModal,
    openCreateFolderModal,
  };
};
