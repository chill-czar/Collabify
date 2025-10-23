// components/files/FileManagerDemo.tsx
import React, { useState } from "react";
import { FileGrid } from "./FileGrid";
import { RightSidebar } from "./RightSidebar";
import Breadcrumbs from "./Breadcrumbs";
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

  // Use the shared file operations hook
  const {
    showCreateFolderModal,
    folderName,
    setFolderName,
    fileInputRef,
    isFolderLoading,
    isFolderSuccess,
    isFolderError,
    handleUploadClick,
    handleFileChange,
    handleCreateFolder,
    handleCloseModal,
    openCreateFolderModal,
  } = useFileOperations(projectId);

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
            onUpload={handleUploadClick}
            onCreateFolder={openCreateFolderModal}
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
