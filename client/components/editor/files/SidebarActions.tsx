// components/files/SidebarActions.tsx
import React from "react";
import {
  ExternalLink,
  Download,
  Edit3,
  Copy,
  Move,
  Share,
  Trash2,
} from "lucide-react";

interface SidebarActionsProps {
  type: "file" | "folder";
  onOpen?: () => void;
  onDownload?: () => void;
  onRename: () => void;
  onCopy: () => void;
  onMove: () => void;
  onShare: () => void;
  onDelete: () => void;
}

export const SidebarActions: React.FC<SidebarActionsProps> = ({
  type,
  onOpen,
  onDownload,
  onRename,
  onCopy,
  onMove,
  onShare,
  onDelete,
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Actions</h3>

      {type === "file" && (
        <>
          {onOpen && (
            <button
              onClick={onOpen}
              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-gray-500" />
              Open file
            </button>
          )}

          {onDownload && (
            <button
              onClick={onDownload}
              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors"
            >
              <Download className="w-4 h-4 text-gray-500" />
              Download
            </button>
          )}
        </>
      )}

      <button
        onClick={onRename}
        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors"
      >
        <Edit3 className="w-4 h-4 text-gray-500" />
        Rename
      </button>

      <button
        onClick={onCopy}
        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors"
      >
        <Copy className="w-4 h-4 text-gray-500" />
        Copy
      </button>

      <button
        onClick={onMove}
        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors"
      >
        <Move className="w-4 h-4 text-gray-500" />
        Move
      </button>

      <button
        onClick={onShare}
        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors"
      >
        <Share className="w-4 h-4 text-gray-500" />
        Share
      </button>

      <hr className="my-4" />

      <button
        onClick={onDelete}
        className="w-full px-4 py-2 text-sm text-left hover:bg-red-50 text-red-600 rounded-lg flex items-center gap-3 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        Delete {type}
      </button>
    </div>
  );
};
