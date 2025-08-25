"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import Toolbar from "./Toolbar";
import Breadcrumbs from "./Breadcrumbs";
import FiltersBar from "./FiltersBar";
import FileGrid from "./FileGrid";
import RightSidebar from "./RightSidebar";

// Main FilesTab Component
const FilesTab = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Toolbar />
      <Breadcrumbs />
      <FiltersBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <FileGrid />
        </div>

        {/* Right Sidebar */}
        <RightSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Toggle sidebar button - positioned absolutely */}
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
