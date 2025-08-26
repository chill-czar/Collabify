// components/files/SidebarDetails.tsx
import React from "react";
import {
  HardDrive,
  Tag,
  Eye,
  User,
  Calendar,
  Edit3,
  File,
  Folder,
} from "lucide-react";
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
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
          Preview
        </label>
        <div className="w-full aspect-[4/3] bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden">
          {type === "file" ? (
            <div className="text-center w-full h-full flex items-center justify-center">
              {isImageFile(item.fileType, item.fileName) ? (
                <div className="relative w-full h-full">
                  <img
                    src={item.fileUrl}
                    alt={item.fileName}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                  <div className="hidden w-full h-full flex-col items-center justify-center">
                    <File className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {item.fileType}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <File className="w-12 h-12 text-gray-400 mb-3" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide px-2 py-1 bg-gray-100 rounded-md">
                    {item.fileType}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Folder className="w-12 h-12 text-gray-400 mb-3" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide px-2 py-1 bg-gray-100 rounded-md">
                Folder
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Properties Section */}
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
          Properties
        </label>
        <div className="space-y-4">
          {type === "file" && (
            <>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                  <HardDrive className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">Size</div>
                  <div className="text-sm text-gray-600 truncate">
                    {formatFileSize(item.fileSize)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                  <Tag className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">Type</div>
                  <div className="text-sm text-gray-600 truncate uppercase">
                    {item.fileType}
                  </div>
                </div>
              </div>

              {item.category && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                    <Tag className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">
                      Category
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {item.category}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                  <Eye className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    Visibility
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        item.visibility === "Public"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.visibility || "Private"}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">
                {type === "file" ? "Uploaded by" : "Created by"}
              </div>
              <div className="text-sm text-gray-600 truncate">
                {type === "file"
                  ? item.uploadedBy || "Unknown User"
                  : "Unknown User"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
              <Calendar className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">Created</div>
              <div className="text-sm text-gray-600">
                {formatDetailedDate(item.createdAt)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
              <Calendar className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">Modified</div>
              <div className="text-sm text-gray-600">
                {formatDetailedDate(item.updatedAt)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      {((type === "file" && item.description) ||
        (type === "file" && item.tags && item.tags.length > 0)) && (
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
            Additional Information
          </label>
          <div className="space-y-4">
            {type === "file" && item.description && (
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg mt-0.5">
                  <Edit3 className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    Description
                  </div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </div>
                </div>
              </div>
            )}

            {type === "file" && item.tags && item.tags.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg mt-0.5">
                  <Tag className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    Tags
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-full transition-colors duration-150"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
