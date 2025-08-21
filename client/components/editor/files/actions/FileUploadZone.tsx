import React, { useCallback, useRef } from "react";
import { Upload } from "lucide-react";
import { FileUploadZoneProps } from "../types";

export default function FileUploadZone({
  onFileUpload,
  isDragOver,
  setIsDragOver,
  children,
}: FileUploadZoneProps) {
  const dragCounter = useRef(0);

  // Drag and drop handlers
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    },
    [setIsDragOver]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragCounter.current--;
      if (dragCounter.current === 0) {
        setIsDragOver(false);
      }
    },
    [setIsDragOver]
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragCounter.current++;
      setIsDragOver(true);
    },
    [setIsDragOver]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      dragCounter.current = 0;

      if (e.dataTransfer.files.length > 0) {
        onFileUpload(e.dataTransfer.files);
      }
    },
    [onFileUpload, setIsDragOver]
  );

  return (
    <div
      className={`flex-1 relative ${
        isDragOver ? "bg-blue-50" : ""
      } transition-colors duration-200`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEnter={handleDragEnter}
      onDrop={handleDrop}
    >
      {/* Drag Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-50 bg-opacity-90 flex items-center justify-center z-30 pointer-events-none border-2 border-dashed border-blue-300">
          <div className="text-center">
            <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <p className="text-xl font-semibold text-blue-700">
              Drop files here to upload
            </p>
            <p className="text-sm text-blue-600 mt-2">
              Release to start uploading
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      {children}
    </div>
  );
}
