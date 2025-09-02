// components/whiteboard/Sidebar.tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhiteboardCard } from "./WhiteboardCard";
import { Whiteboard } from "@/types/whiteboard";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { setCurrentBoardId } from "@/lib/slices/currentBoardId";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  isMobileOpen,
  onCloseMobile,
}) => {
  const create = useMutation(api.board.createBoard);
  const params = useParams();
  const projectId = params?.projectId as string;
  const dispatch = useDispatch();
  const boards = useQuery(api.board.getProjectBoard, {
    projectId,
  });
    
 const currentBoardId = useSelector(
       (state: RootState) => state.currentBoard.currentBoardId
     );

  const handleAddBoard = () => {
    const promise = create({
      title: "Untitled",
      projectId,
    }).then((boardId) => {
      dispatch(setCurrentBoardId(boardId));
    });

    toast.promise(promise, {
      loading: "Creating new board...",
      success: "New board created!",
      error: "Failed to create baord.",
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onCloseMobile}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 0 : 320 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:flex flex-col bg-white border-r border-gray-200 overflow-hidden"
      >
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Boards</h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-none p-2 min-h-0">
          <div className="space-y-2">
            {boards?.map((board) => (
              <WhiteboardCard
                key={board._id}
                whiteboard={board}
                isSelected={board._id === currentBoardId}
                onClick={() => dispatch(setCurrentBoardId(board._id))}
              />
            ))}
          </div>
        </div>

        {/* Add Board Button - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <Button
            onClick={handleAddBoard}
            className="w-full flex items-center gap-2"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            Add Board
          </Button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 z-50 md:hidden flex flex-col"
          >
            {/* Header - Fixed */}
            <div className="flex-shrink-0 p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Boards</h2>
              <Button variant="ghost" size="sm" onClick={onCloseMobile}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto scrollbar-none p-2 min-h-0">
              <div className="space-y-2">
                {boards?.map((board) => (
                  <WhiteboardCard
                    key={board._id}
                    whiteboard={board}
                    isSelected={board._id === currentBoardId}
                    onClick={() => {
                      dispatch(setCurrentBoardId(board._id));
                      onCloseMobile();
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Add Board Button - Fixed at bottom */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200">
              <Button
                onClick={handleAddBoard}
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
                Add Board
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
