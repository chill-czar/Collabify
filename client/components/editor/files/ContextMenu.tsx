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
    "top-right": "absolute top-8 right-2 z-20",
    "bottom-right": "absolute bottom-8 right-2 z-20",
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-10" onClick={onClose} />

      {/* Menu */}
      <div
        className={`${positionClasses[position]} bg-white rounded-lg shadow-lg border py-2 min-w-[160px]`}
      >
        {/* Open action - only for files */}
        {type === "file" && onOpen && (
          <button
            onClick={onOpen}
            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-3"
          >
            <ExternalLink className="w-4 h-4" />
            Open
          </button>
        )}

        {/* Rename */}
        <button
          onClick={onRename}
          className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-3"
        >
          <Edit3 className="w-4 h-4" />
          Rename
        </button>

        {/* Download - only for files */}
        {type === "file" && onDownload && (
          <button
            onClick={onDownload}
            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-3"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        )}

        {/* Copy */}
        <button
          onClick={onCopy}
          className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-3"
        >
          <Copy className="w-4 h-4" />
          Copy
        </button>

        {/* Move */}
        <button
          onClick={onMove}
          className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-3"
        >
          <Move className="w-4 h-4" />
          Move
        </button>

        {/* Share */}
        <button
          onClick={onShare}
          className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-3"
        >
          <Share className="w-4 h-4" />
          Share
        </button>

        <hr className="my-2" />

        {/* Delete */}
        <button
          onClick={onDelete}
          className="w-full px-4 py-2 text-sm text-left hover:bg-red-50 text-red-600 flex items-center gap-3"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </>
  );
};
