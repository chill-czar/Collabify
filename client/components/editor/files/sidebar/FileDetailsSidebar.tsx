import React, { useState } from "react";
import { X } from "lucide-react";
import { FileDetailsSidebarProps } from "../types";
import FilePreview from "./FilePreview";
import FileActivityFeed from "./FileActivityFeed";
import {
  getFileTypeFromMime,
  formatFileSize,
  formatDate,
} from "../utils/fileTypes";

export default function FileDetailsSidebar({
  selectedFile,
  onClose,
}: FileDetailsSidebarProps) {
  const [activeTab, setActiveTab] = useState("details");

  const tabs = [
    { id: "details", label: "Details" },
    { id: "activity", label: "Activity" },
    { id: "comments", label: "Comments" },
  ];

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3
            className="font-semibold text-gray-900 truncate"
            title={selectedFile.name}
          >
            {selectedFile.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "details" && (
          <div className="p-4 space-y-6">
            {/* File Preview */}
            <FilePreview file={selectedFile} />

            {/* File Details */}
            <div className="space-y-4">
              <DetailRow
                label="Type"
                value={getFileTypeFromMime(selectedFile.mimeType)}
              />

              {selectedFile.size && (
                <DetailRow
                  label="Size"
                  value={formatFileSize(selectedFile.size)}
                />
              )}

              <DetailRow
                label="Created"
                value={formatDate(selectedFile.createdAt)}
              />

              <DetailRow
                label="Modified"
                value={formatDate(selectedFile.modifiedAt)}
              />

              <DetailRow label="Created by" value={selectedFile.createdBy} />

              {selectedFile.mimeType && (
                <DetailRow label="MIME Type" value={selectedFile.mimeType} />
              )}

              {/* File Actions */}
              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 text-left text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                    Open
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    Download
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="p-4">
            <FileActivityFeed file={selectedFile} />
          </div>
        )}

        {activeTab === "comments" && (
          <div className="p-4">
            <CommentsSection file={selectedFile} />
          </div>
        )}
      </div>
    </div>
  );
}

// Detail Row Component
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      <p className="text-sm text-gray-900 mt-1" title={value}>
        {value}
      </p>
    </div>
  );
}

// Comments Section Component
function CommentsSection({ file }: { file: any }) {
  const [newComment, setNewComment] = useState("");
  const [comments] = useState([
    // Mock comments - TODO: Replace with actual API data
    {
      id: "1",
      user: "John Doe",
      avatar: "/api/placeholder/32/32",
      comment: "This looks great! Love the color scheme.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: "2",
      user: "Jane Smith",
      avatar: "/api/placeholder/32/32",
      comment: "Can we adjust the font size in the header?",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    },
  ]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      // TODO: Replace with actual API call
      console.log("Adding comment:", newComment);
      setNewComment("");
    }
  };

  return (
    <div className="space-y-4">
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <img
                src={comment.avatar}
                alt={comment.user}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-gray-900">
                      {comment.user}
                    </span>
                    <span className="text-xs text-gray-500">
                      {comment.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <X className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">No comments yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Start a conversation about this file
          </p>
        </div>
      )}

      {/* Add Comment */}
      <div className="border-t border-gray-200 pt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
        <button
          onClick={handleAddComment}
          disabled={!newComment.trim()}
          className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Comment
        </button>
      </div>
    </div>
  );
}
