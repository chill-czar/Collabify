// components/files/FileManagerDemo.tsx
import React, { useState, useRef, useEffect } from "react";
import { FileGrid } from "./FileGrid";
import { RightSidebar } from "./RightSidebar";
import Breadcrumbs from "./Breadcrumbs";
import { useUploadFile, useCreateFolder } from "@/lib/files/api";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import type { CreateFolderRequest, UploadFileRequest } from "@/types/files";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Check, Loader2 } from "lucide-react";

interface FileManagerDemoProps {
  projectId: string;
  folderId?: string | null;
  searchQuery?: string;
}

export const FileManagerDemo: React.FC<FileManagerDemoProps> = ({
  projectId,
  folderId = null,
  searchQuery,
}) => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<"file" | "folder" | null>(
    null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Folder modal state
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current folder from Redux
  const parentFolderId = useSelector(
    (state: RootState) => state.breadCrumb.currentFolderId
  );

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

  const handleItemSelect = (item: any, type: "file" | "folder") => {
    setSelectedItem(item);
    setSelectedType(type);
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setSelectedItem(null);
    setSelectedType(null);
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

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

  const handleCreateFolder = () => {
    setShowCreateFolderModal(true);
  };

  const handleCreateFolderSubmit = () => {
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

  // Auto close modal on success
  useEffect(() => {
    if (isFolderSuccess) {
      setTimeout(handleCloseModal, 1500);
    }
  }, [isFolderSuccess]);

  return (
    <>
      <div className="flex h-screen">
        <div className="flex-1  overflow-hidden">
          <Breadcrumbs />
          <FileGrid
            projectId={projectId}
            folderId={folderId}
            onItemSelect={handleItemSelect}
            selectedItem={selectedItem}
            selectedType={selectedType}
            onUpload={handleUpload}
            onCreateFolder={handleCreateFolder}
            searchQuery={searchQuery}
          />
        </div>

        {/* Right Sidebar */}
        {selectedItem && selectedType && (
          <RightSidebar
            isOpen={sidebarOpen}
            onClose={handleSidebarClose}
            item={selectedItem}
            type={selectedType}
          />
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Folder Dialog */}
      <Dialog
        open={showCreateFolderModal}
        onOpenChange={setShowCreateFolderModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter a name for your new folder.
            </DialogDescription>
          </DialogHeader>

          <Input
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter folder name..."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateFolderSubmit();
              if (e.key === "Escape") handleCloseModal();
            }}
            autoFocus
          />

          {/* Status Messages */}
          {isFolderError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to create folder. Please try again.
              </AlertDescription>
            </Alert>
          )}

          {isFolderSuccess && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <Check className="h-4 w-4" />
              <AlertDescription>Folder created successfully!</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              onClick={handleCreateFolderSubmit}
              disabled={
                !folderName.trim() || isFolderLoading || isFolderSuccess
              }
            >
              {isFolderLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isFolderLoading
                ? "Creating..."
                : isFolderSuccess
                ? "Created!"
                : "Create"}
            </Button>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
