"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

import Canvas from "./Canvas";
import { ViewMode } from "@/app/types/whiteboard";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Id } from "@/convex/_generated/dataModel";
import { Editor as EmptyEditor } from "./Editor";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/spinner";
import { EmptyCanvas } from "./EmptyCanvas";

export const WhiteboardLayout: React.FC = () => {
  const { isLoading } = useConvexAuth();

  const [viewMode, setViewMode] = useState<ViewMode>("both");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [boardTitle, setBoardTitle] = useState("");

  const currentBoardId = useSelector(
    (state: RootState) => state.currentBoard.currentBoardId
  ) as Id<"board"> | null;

  console.log("current board id", currentBoardId);
  const board = useQuery(
    api.board.getBoardById,
    currentBoardId ? { currentBoardId: currentBoardId } : "skip"
  );

  const update = useMutation(api.board.updateBoard);
  const Editor = useMemo(
    () => dynamic(() => import("../notes/Editor"), { ssr: false }),
    []
  );

  const onChange = (content: string) => {
    if (!currentBoardId) return;
    update({ id: currentBoardId as Id<"board">, document: content });
  };
  const onBoardUpdate = (content: string) => {
    if (!currentBoardId) return;
    update({ id: currentBoardId as Id<"board">, whiteboard: content });
  };

  useEffect(() => {
    if (board) {
      setBoardTitle(board.title);
    } else {
      setBoardTitle("Select Board");
    }
  }, [board]);

  if (isLoading) {
    return (
      <div className="h-full h-screen flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
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
              {board ? (
                <Editor
                  onChange={onChange}
                  initialContent={board.document}
                  editable={true}
                />
              ) : currentBoardId ? (
                <div className="h-full w-full flex justify-center items-center">
                  <Spinner size="lg" />
                </div>
              ) : (
                <EmptyEditor />
              )}
            </div>
          )}
          {/* Canvas */}
          {(viewMode === "canvas" || viewMode === "both") && (
            <div
              className={`${viewMode === "both" ? "flex-1" : "w-full"} min-h-0`}
            >
              {board ? (
                <Canvas
                  onSaveTrigger={onBoardUpdate}
                  fileId={currentBoardId}
                  fileData={board.whiteboard ?? ""}
                />
              ) : currentBoardId ? (
                <div className="h-full w-full flex justify-center items-center">
                  <Spinner size="lg" />
                </div>
              ) : (
                <EmptyCanvas />
              )}
            </div>
          )}{" "}
        </div>
      </div>
    </div>
  );
};
