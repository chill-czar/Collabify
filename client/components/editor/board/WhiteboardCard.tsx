// components/whiteboard/WhiteboardCard.tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Copy, Share, Trash2 } from "lucide-react";
import { Whiteboard } from "@/app/types/whiteboard";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  clearCurrentBoardId,
} from "@/lib/slices/currentBoardId";
import { toast } from "sonner";

interface WhiteboardCardProps {
  whiteboard: Whiteboard;
  isSelected: boolean;
  onClick: () => void;
}

const formatLastEdited = (timestamp?: number): string => {
  if (!timestamp) return "Never";

  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

export const WhiteboardCard: React.FC<WhiteboardCardProps> = ({
  whiteboard,
  isSelected,
  onClick,
}) => {
  const [isContextMenuOpen, setIsContextMenuOpen] = React.useState(false);
  const archive = useMutation(api.board.updateBoard);
  const dispatch = useDispatch();

  const currentBoardId = useSelector(
    (state: RootState) => state.currentBoard.currentBoardId
  );
  // Action handlers - implement your logic here
  const handleDuplicate = () => {
    // TODO: Implement duplicate logic
    console.log("Duplicate whiteboard:", whiteboard._id);
  };

  const handleShare = () => {
    // TODO: Implement share logic
    console.log("Share whiteboard:", whiteboard._id);
  };

  const handleDelete = (e?: React.MouseEvent<HTMLDivElement>) => {
    e?.stopPropagation();
    if (!whiteboard) return;
    const promise = archive({
      id: whiteboard._id as Id<"board">,
      isArchived: true,
    }).then(() =>
      currentBoardId === whiteboard._id ? dispatch(clearCurrentBoardId()) : null
    );

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Board moved to trash!",
      error: "Failed to archive Board",
    });
    console.log("Delete whiteboard:", whiteboard._id);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger onClick when clicking the dropdown menu
    if ((e.target as Element).closest("[data-dropdown-trigger]")) {
      return;
    }
    onClick();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsContextMenuOpen(true);
  };

  const handleMenuAction = (action: () => void) => {
    action();
    setIsContextMenuOpen(false);
  };

  return (
    <DropdownMenu open={isContextMenuOpen} onOpenChange={setIsContextMenuOpen}>
      <Card
        className={`p-3 cursor-pointer transition-all hover:shadow-md relative group ${
          isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
        }`}
        onClick={handleCardClick}
        onContextMenu={handleContextMenu}
      >
        <div className="space-y-2">
          {/* Header with title and menu button */}
          <div className="flex items-start justify-between">
            {/* Thumbnail placeholder */}
            <div className="w-full h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-md flex items-center justify-center mr-2">
              <div className="text-xs text-gray-500 font-medium">Preview</div>
            </div>

            {/* Menu button */}
            <DropdownMenuTrigger asChild>
              <button
                data-dropdown-trigger
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded-sm flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsContextMenuOpen(true);
                }}
              >
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
          </div>

          {/* Title */}
          <h3 className="font-medium text-sm text-gray-900 truncate">
            {whiteboard.title}
          </h3>

          {/* Last edited */}
          <p className="text-xs text-gray-500">
            {formatLastEdited(whiteboard.lastEdited)}
          </p>
        </div>
      </Card>

      <DropdownMenuContent
        className="w-48"
        align="end"
        side="bottom"
        sideOffset={4}
      >
        <DropdownMenuItem
          onClick={() => handleMenuAction(handleDuplicate)}
          className="cursor-pointer"
        >
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleMenuAction(handleShare)}
          className="cursor-pointer"
        >
          <Share className="mr-2 h-4 w-4" />
          Share
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => handleMenuAction(handleDelete)}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
