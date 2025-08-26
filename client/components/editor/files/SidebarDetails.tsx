// components/files/SidebarDetails.tsx
import React from "react";
import { HardDrive, Tag, Eye, User, Calendar, Edit3 } from "lucide-react";
import {
  formatFileSize,
  formatDetailedDate,
  isImageFile,
} from "@/utils/fileUtils";

interface SidebarDetailsProps {
  item: any;
  type: "file" | "folder";
}

export const SidebarDetails: React.FC<SidebarDetailsProps> = ({
  item,
  type,
}) => {
  return (
    <>
      {/* Preview/Icon Section */}
      <div className="mb-6">
        <div className="w-full h-32 bg-gray-50 rounded-lg flex items-center justify-center">
          {type === "file" ? (
            <div className="text-center">
              {isImageFile(item.fileType, item.fileName) ? (
                <img
                  src={item.fileUrl}
                  alt={item.fileName}
                  className="max-w-full max-h-28 rounded object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <>
                  <div className="text-4xl mb-2">📄</div>
                  <div className="text-sm text-gray-500">{item.fileType}</div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="text-4xl mb-2">📁</div>
              <div className="text-sm text-gray-500">Folder</div>
            </div>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="space-y-4 mb-6">
        {type === "file" && (
          <>
            <div className="flex items-start gap-3">
              <HardDrive className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900">Size</div>
                <div className="text-sm text-gray-500">
                  {formatFileSize(item.fileSize)}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900">Type</div>
                <div className="text-sm text-gray-500">{item.fileType}</div>
              </div>
            </div>

            {item.category && (
              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Category
                  </div>
                  <div className="text-sm text-gray-500">{item.category}</div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Visibility
                </div>
                <div className="text-sm text-gray-500">
                  {item.visibility || "Private"}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex items-start gap-3">
          <User className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-gray-900">
              {type === "file" ? "Uploaded by" : "Created by"}
            </div>
            <div className="text-sm text-gray-500">
              {type === "file" ? item.uploadedBy : "Unknown User"}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-gray-900">Created</div>
            <div className="text-sm text-gray-500">
              {formatDetailedDate(item.createdAt)}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-gray-900">Modified</div>
            <div className="text-sm text-gray-500">
              {formatDetailedDate(item.updatedAt)}
            </div>
          </div>
        </div>

        {type === "file" && item.description && (
          <div className="flex items-start gap-3">
            <Edit3 className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                Description
              </div>
              <div className="text-sm text-gray-500">{item.description}</div>
            </div>
          </div>
        )}

        {type === "file" && item.tags && item.tags.length > 0 && (
          <div className="flex items-start gap-3">
            <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-900">Tags</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {item.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
