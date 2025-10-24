// components/files/FilePreview.tsx
import React, { memo } from "react";
import { FileIcon } from "./FileIcon";

interface FilePreviewProps {
  file: {
    fileUrl: string;
    fileName: string;
    fileType: string;
    category: string;
  };
  imageError: boolean;
  onImageError: () => void;
}

export const FilePreview = memo<FilePreviewProps>(({ file, imageError, onImageError }) => {
  const isImage = file.fileType.startsWith("image/");
  const isVideo = file.fileType.startsWith("video/");
  const isPDF = file.fileType === "application/pdf";
  const isDocument =
    file.fileType.includes("document") ||
    file.fileType.includes("text") ||
    file.fileType.includes("sheet");

  // Show thumbnail for images (if available and not errored)
  if (isImage && file.fileUrl && !imageError) {
    return (
      <img
        src={file.fileUrl}
        alt={file.fileName}
        className="w-full h-full object-cover"
        onError={onImageError}
      />
    );
  }

  // Show video thumbnail with play icon
  if (isVideo) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center relative">
        {file.fileUrl && !imageError ? (
          <>
            <video
              className="w-full h-full object-cover"
              onError={onImageError}
            >
              <source src={file.fileUrl} />
            </video>
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-2 sm:border-l-3 md:border-l-4 border-l-gray-800 border-t-1 border-b-1 sm:border-t-2 sm:border-b-2 border-t-transparent border-b-transparent ml-0.5 sm:ml-1"></div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 text-white">
            <FileIcon fileType={file.fileType} category={file.category} />
          </div>
        )}
      </div>
    );
  }

  // Document preview placeholder
  if (isPDF || isDocument) {
    return (
      <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center p-2 sm:p-3 md:p-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 mb-1 sm:mb-2">
          <FileIcon fileType={file.fileType} category={file.category} />
        </div>
        <div className="w-full h-12 sm:h-16 md:h-20 bg-white border border-gray-200 rounded shadow-sm flex flex-col justify-center px-2 sm:px-3 space-y-1">
          <div className="h-0.5 sm:h-1 bg-gray-200 rounded"></div>
          <div className="h-0.5 sm:h-1 bg-gray-200 rounded w-4/5"></div>
          <div className="h-0.5 sm:h-1 bg-gray-200 rounded"></div>
          <div className="h-0.5 sm:h-1 bg-gray-200 rounded w-3/5"></div>
        </div>
      </div>
    );
  }

  // Default file icon
  return (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28">
        <FileIcon fileType={file.fileType} category={file.category} />
      </div>
    </div>
  );
});

FilePreview.displayName = "FilePreview";
