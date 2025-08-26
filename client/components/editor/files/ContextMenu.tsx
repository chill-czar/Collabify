// components/files/ContextMenu.tsx
import React from "react";
import {
  ExternalLink,
  Edit3,
  Download,
  Copy,
  Move,
  Share,
  Trash2,
} from "lucide-react";

interface ContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position?: "top-right" | "bottom-right";
  type: "file" | "folder";
  onOpen?: () => void;
  onRename: () => void;
  onDownload?: () => void;
  onCopy: () => void;
  onMove: () => void;
  onShare: () => void;
  onDelete: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  isOpen,
  onClose,
  position = "top-right",
  type,
  onOpen,
  onRename,
  onDownload,
  onCopy,
  onMove,
  onShare,
  onDelete,
}) => {
  if (!isOpen) return null;

  const positionClasses = {
    "top-right": "absolute top-10 right-2 z-50",
    "bottom-right": "absolute bottom-10 right-2 z-50",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu */}
      <div
        className={`${positionClasses[position]} bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[180px] max-w-[220px]`}
        role="menu"
        aria-orientation="vertical"
      >
        {/* Open action - only for files */}
        {type === "file" && onOpen && (
          <button
            onClick={onOpen}
            className="w-full px-3 py-2.5 text-sm text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors duration-150 first:rounded-t-lg"
            role="menuitem"
          >
            <ExternalLink className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Open</span>
          </button>
        )}

        {/* Rename */}
        <button
          onClick={onRename}
          className="w-full px-3 py-2.5 text-sm text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors duration-150"
          role="menuitem"
        >
          <Edit3 className="w-4 h-4 text-gray-500" />
          <span className="font-medium">Rename</span>
        </button>

        {/* Download - only for files */}
        {type === "file" && onDownload && (
          <button
            onClick={onDownload}
            className="w-full px-3 py-2.5 text-sm text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors duration-150"
            role="menuitem"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Download</span>
          </button>
        )}

        {/* Copy */}
        <button
          onClick={onCopy}
          className="w-full px-3 py-2.5 text-sm text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors duration-150"
          role="menuitem"
        >
          <Copy className="w-4 h-4 text-gray-500" />
          <span className="font-medium">Copy</span>
        </button>

        {/* Move */}
        <button
          onClick={onMove}
          className="w-full px-3 py-2.5 text-sm text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors duration-150"
          role="menuitem"
        >
          <Move className="w-4 h-4 text-gray-500" />
          <span className="font-medium">Move</span>
        </button>

        {/* Share */}
        <button
          onClick={onShare}
          className="w-full px-3 py-2.5 text-sm text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors duration-150"
          role="menuitem"
        >
          <Share className="w-4 h-4 text-gray-500" />
          <span className="font-medium">Share</span>
        </button>

        {/* Divider */}
        <div className="my-1 h-px bg-gray-200" />

        {/* Delete */}
        <button
          onClick={onDelete}
          className="w-full px-3 py-2.5 text-sm text-left hover:bg-red-50 text-red-600 flex items-center gap-3 transition-colors duration-150 last:rounded-b-lg"
          role="menuitem"
        >
          <Trash2 className="w-4 h-4" />
          <span className="font-medium">Delete</span>
        </button>
      </div>
    </>
  );
};
