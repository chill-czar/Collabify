// components/whiteboard/Header.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  Palette,
  SplitSquareHorizontal,
} from "lucide-react";
import { ViewMode, Whiteboard } from "@/app/types/whiteboard";

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleSidebar: () => void;
  onToggleMobileSidebar: () => void;
  isSidebarCollapsed: boolean;
  selectedWhiteboard?: Whiteboard;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  onToggleSidebar,
  onToggleMobileSidebar,
  isSidebarCollapsed,
  selectedWhiteboard,
}) => {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        {/* Mobile sidebar toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleMobileSidebar}
          className="md:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Desktop sidebar toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="hidden md:flex"
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>

        {/* Current whiteboard title */}
        <div className="font-medium text-gray-900">
          {selectedWhiteboard?.title || "Select a whiteboard"}
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center bg-gray-100 rounded-lg p-1">
        <Button
          variant={viewMode === "document" ? "default" : "ghost"}
          size="sm"
          
          onClick={() => onViewModeChange("document")}
          className="flex items-center gap-2 h-8"
        >
          <FileText className="h-3 w-3" />
          <span className="hidden sm:inline">Document</span>
        </Button>
        <Button
          variant={viewMode === "both" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("both")}
          className="flex items-center gap-2 h-8"
        >
          <SplitSquareHorizontal className="h-3 w-3" />
          <span className="hidden sm:inline">Both</span>
        </Button>
        <Button
          variant={viewMode === "canvas" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("canvas")}
          className="flex items-center gap-2 h-8"
        >
          <Palette className="h-3 w-3" />
          <span className="hidden sm:inline">Canvas</span>
        </Button>
      </div>
    </header>
  );
};
