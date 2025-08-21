import React, { useEffect, useRef } from "react";
import {
  Eye,
  Share2,
  Edit3,
  Move,
  Download,
  Trash2,
  Copy,
  Star,
  StarOff,
} from "lucide-react";
import { FileContextMenuProps } from "../types";

export default function FileContextMenu({
  x,
  y,
  onClose,
  file,
  onAction,
}: FileContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const menuItems = [
    {
      label: "Open",
      action: "open",
      icon: Eye,
      shortcut: "Enter",
    },
    {
      label: file.isStarred ? "Remove from Starred" : "Add to Starred",
      action: "star",
      icon: file.isStarred ? StarOff : Star,
      shortcut: "S",
    },
    {
      label: "Share",
      action: "share",
      icon: Share2,
      shortcut: "Ctrl+S",
    },
    {
      label: "Rename",
      action: "rename",
      icon: Edit3,
      shortcut: "F2",
    },
    {
      label: "Make a copy",
      action: "copy",
      icon: Copy,
      shortcut: "Ctrl+D",
    },
    {
      label: "Move",
      action: "move",
      icon: Move,
    },
    {
      label: "Download",
      action: "download",
      icon: Download,
      shortcut: "Ctrl+⇧+S",
    },
    {
      label: "Delete",
      action: "delete",
      icon: Trash2,
      danger: true,
      shortcut: "Delete",
    },
  ];

  // Adjust menu position to stay within viewport
  const adjustPosition = (x: number, y: number) => {
    const menuWidth = 200;
    const menuHeight = menuItems.length * 40 + 20;

    let adjustedX = x;
    let adjustedY = y;

    if (x + menuWidth > window.innerWidth) {
      adjustedX = x - menuWidth;
    }

    if (y + menuHeight > window.innerHeight) {
      adjustedY = y - menuHeight;
    }

    return { x: Math.max(10, adjustedX), y: Math.max(10, adjustedY) };
  };

  const { x: adjustedX, y: adjustedY } = adjustPosition(x, y);

  const handleAction = (action: string) => {
    if (action === "star") {
      onAction("star", file);
    } else {
      onAction(action, file);
    }
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-[200px] max-w-[250px]"
      style={{ left: adjustedX, top: adjustedY }}
    >
      {menuItems.map((item, index) => (
        <React.Fragment key={item.action}>
          {index === 2 && <div className="h-px bg-gray-200 my-2" />}
          {index === 5 && <div className="h-px bg-gray-200 my-2" />}
          <button
            onClick={() => handleAction(item.action)}
            className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-gray-50 transition-colors ${
              item.danger ? "text-red-600 hover:bg-red-50" : "text-gray-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </div>
            {item.shortcut && (
              <span className="text-xs text-gray-400 font-mono">
                {item.shortcut}
              </span>
            )}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}
