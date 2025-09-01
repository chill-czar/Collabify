"use client";

import React, { useState, useEffect } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Editor } from "./Editor";
import { Canvas } from "./Canvas";
import { ViewMode } from "@/app/types/whiteboard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Id } from "@/convex/_generated/dataModel";

export const WhiteboardLayout: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("both");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [boardTitle, setBoardTitle] = useState("");

  const currentBoardId = useSelector(
    (state: RootState) => state.currentBoard.currentBoardId
  );

  // ✅ Always call hook
  const board = useQuery(
    api.board.getBoardById,
    currentBoardId !== null ? { currentBoardId: currentBoardId as Id<"board"> } : "skip" // convex convention for skipping query
  );

  // ✅ Update title when board changes
  useEffect(() => {
    if (board) {
      setBoardTitle(board.title);
    } else {
      setBoardTitle("Select Board");
    }
  }, [board]);

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <Header
        viewMode={viewMode}
        initialTitle={boardTitle}
        onViewModeChange={setViewMode}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onToggleMobileSidebar={() =>
          setIsMobileSidebarOpen(!isMobileSidebarOpen)
        }
        isSidebarCollapsed={isSidebarCollapsed}
      />

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex min-h-0">
          {/* Document Editor */}
          {(viewMode === "document" || viewMode === "both") && (
            <div
              className={`${viewMode === "both" ? "flex-1" : "w-full"} ${
                viewMode === "both" ? "border-r border-gray-200" : ""
              } min-h-0`}
            >
              <Editor />
            </div>
          )}

          {/* Canvas */}
          {(viewMode === "canvas" || viewMode === "both") && (
            <div
              className={`${viewMode === "both" ? "flex-1" : "w-full"} min-h-0`}
            >
              <Canvas />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
