"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import Toolbar from "./Toolbar";
import Breadcrumbs from "./Breadcrumbs";
import FiltersBar from "./FiltersBar";
import FileGrid from "./FileGrid";
import RightSidebar from "./RightSidebar";
import { useParams } from "next/navigation";

const FilesTab = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { projectId: rawProjectId } = useParams();
  const projectId = Array.isArray(rawProjectId)
    ? rawProjectId[0]
    : rawProjectId;

  // Track the current folder (root folder = null)
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  // Optional: handle folder navigation (update currentFolderId)
  // const handleFolderClick = (folderId: string) => setCurrentFolderId(folderId);

  if (!projectId) return <div>Error: projectId is required</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Toolbar projectId={projectId} parentFolderId={currentFolderId} />
      <Breadcrumbs
      // currentFolderId={currentFolderId}
      // setCurrentFolderId={setCurrentFolderId}
      />
      <FiltersBar />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          <FileGrid
          // currentFolderId={currentFolderId}
          />
        </div>

        <RightSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white border border-gray-300 rounded-lg shadow-lg hover:bg-gray-50 transition-colors z-10"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default FilesTab;
