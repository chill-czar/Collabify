"use client";

import React from "react";
import {
  Upload,
  FolderPlus,
  X,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useFileOperations } from "@/hooks/useFileOperations";

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

export type ToolbarProps = {
  projectId: string;
};

const Toolbar: React.FC<ToolbarProps> = ({ projectId }) => {
  const {
    showCreateFolderModal,
    folderName,
    setFolderName,
    fileInputRef,
    uploadMutation,
    isFolderLoading,
    isFolderSuccess,
    isFolderError,
    handleUploadClick,
    handleFileChange,
    handleCreateFolder,
    handleCloseModal,
    openCreateFolderModal,
  } = useFileOperations(projectId);

  return (
    <>
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-4">
            {/* Title */}
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
              Files
            </h1>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Upload Button */}
              <Button
                onClick={handleUploadClick}
                disabled={uploadMutation.isPending}
                className={`min-w-[120px] justify-center ${
                  uploadMutation.isPending
                    ? "bg-gray-900 text-white cursor-not-allowed opacity-80"
                    : uploadMutation.isSuccess
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : uploadMutation.isError
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : ""
                }`}
              >
                {uploadMutation.isPending ? (
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
                    Failed
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload File
                  </>
                )}
              </Button>

              {/* New Folder Button */}
              <Button
                variant="outline"
                onClick={openCreateFolderModal}
                className="min-w-[120px] justify-center"
              >
                <FolderPlus className="w-4 h-4" />
                New Folder
              </Button>
            </div>
          </div>
        </div>

        {/* Upload Error Banner */}
        {uploadMutation.isError && (
          <Alert variant="destructive" className="rounded-none border-t">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Upload failed. Please check your file and try again.
            </AlertDescription>
          </Alert>
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
      <Dialog open={showCreateFolderModal} onOpenChange={handleCloseModal}>
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
              if (e.key === "Enter") handleCreateFolder();
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
              onClick={handleCreateFolder}
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

export default Toolbar;
