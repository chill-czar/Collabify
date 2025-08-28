// components/files/FileManagerDemo.tsx
import React, { useState } from "react";
import { FileGrid } from "./FileGrid";
import { RightSidebar } from "./RightSidebar";
import Breadcrumbs from "./Breadcrumbs";

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
    console.log("Upload files - to be implemented");
    // TODO: Implement file upload modal/functionality
  };

  const handleCreateFolder = () => {
    console.log("Create folder - to be implemented");
    // TODO: Implement folder creation modal/functionality
  };

  return (
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
  );
};
