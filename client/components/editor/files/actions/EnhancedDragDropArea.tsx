import React, { useState, useRef, useCallback } from "react";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import {
  getFileIcon,
  formatFileSize,
  allowedFileTypes,
  MAX_FILE_SIZE,
} from "../utils/fileTypes";

// Types for drag and drop functionality
interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: "uploading" | "completed" | "error";
  preview?: string | null;
}

interface DragDropAreaProps {
  onFilesUploaded?: (files: File[]) => void;
  maxFiles?: number;
  className?: string;
}

// Utility function to create file preview
const createFilePreview = (file: File): Promise<string | null> => {
  return new Promise((resolve) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    } else {
      resolve(null);
    }
  });
};

// File Preview Component for uploaded files
const FileUploadPreview: React.FC<{
  file: UploadedFile;
  onRemove: (id: string) => void;
}> = ({ file, onRemove }) => {
  const Icon = getFileIcon(file.type);

  return (
    <div className="relative bg-white rounded-lg border border-gray-200 p-3 group hover:shadow-md transition-shadow">
      <button
        onClick={() => onRemove(file.id)}
        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
      >
        <X className="w-3 h-3" />
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {file.preview ? (
            <img
              src={file.preview}
              alt={file.name}
              className="w-10 h-10 object-cover rounded"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
              <Icon className="w-5 h-5 text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.name}
          </p>
          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>

          {/* Progress Bar */}
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>
                {file.status === "completed"
                  ? "Completed"
                  : file.status === "error"
                  ? "Error"
                  : "Uploading"}
              </span>
              <span>{file.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  file.status === "completed"
                    ? "bg-green-500"
                    : file.status === "error"
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
                style={{ width: `${file.progress}%` }}
              />
            </div>
          </div>
        </div>

        {file.status === "completed" && (
          <CheckCircle className="w-4 h-4 text-green-500" />
        )}
        {file.status === "error" && (
          <AlertCircle className="w-4 h-4 text-red-500" />
        )}
      </div>
    </div>
  );
};

// Main Enhanced Drag and Drop Component
export default function EnhancedDragDropArea({
  onFilesUploaded,
  maxFiles = 10,
  className = "",
}: DragDropAreaProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // Simulate file upload with progress
  const simulateUpload = useCallback(async (file: File): Promise<void> => {
    const id = `${Date.now()}-${Math.random()}`;
    const preview = await createFilePreview(file);

    const uploadedFile: UploadedFile = {
      id,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: "uploading",
      preview,
    };

    setUploadedFiles((prev) => [...prev, uploadedFile]);

    // Simulate upload progress
    const updateProgress = () => {
      setUploadedFiles((prev) =>
        prev.map((f) => {
          if (f.id === id) {
            const newProgress = Math.min(f.progress + Math.random() * 25, 100);
            const isCompleted = newProgress >= 100;

            return {
              ...f,
              progress: newProgress,
              status: isCompleted ? ("completed" as const) : f.status,
            };
          }
          return f;
        })
      );
    };

    const interval = setInterval(() => {
      setUploadedFiles((prev) => {
        const currentFile = prev.find((f) => f.id === id);
        if (!currentFile || currentFile.progress >= 100) {
          clearInterval(interval);
          return prev;
        }

        updateProgress();
        return prev;
      });
    }, 200);
  }, []);

  // Process files for upload
  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      // Check file limits
      if (uploadedFiles.length + fileArray.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const validFiles: File[] = [];

      for (const file of fileArray) {
        // Size validation
        if (file.size > MAX_FILE_SIZE) {
          alert(
            `${file.name} is too large. Maximum size is ${formatFileSize(
              MAX_FILE_SIZE
            )}.`
          );
          continue;
        }

        // Type validation
        if (!allowedFileTypes.includes(file.type)) {
          alert(`${file.name} has an unsupported file type.`);
          continue;
        }

        validFiles.push(file);
        await simulateUpload(file);
      }

      // Call callback with valid files
      if (onFilesUploaded && validFiles.length > 0) {
        onFilesUploaded(validFiles);
      }
    },
    [simulateUpload, onFilesUploaded, uploadedFiles.length, maxFiles]
  );

  // Drag and Drop Handlers
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragActive(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
      dragCounter.current = 0;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFiles(files);
      }
    },
    [processFiles]
  );

  // File Input Handler
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFiles(files);
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [processFiles]
  );

  // Remove uploaded file
  const removeFile = useCallback((id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  // Handle click to open file dialog
  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Main Drop Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
          isDragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {/* Upload Icon */}
        <div
          className={`mb-4 transition-colors duration-200 ${
            isDragActive ? "text-blue-500" : "text-gray-400"
          }`}
        >
          <Upload className="w-12 h-12 mx-auto" />
        </div>

        {/* Main Text */}
        <h3
          className={`text-lg font-semibold mb-2 transition-colors duration-200 ${
            isDragActive ? "text-blue-700" : "text-gray-700"
          }`}
        >
          {isDragActive ? "Drop files here" : "Drag and drop files here"}
        </h3>

        {/* Subtext */}
        <p className="text-gray-500 mb-6">
          or click to browse and upload • Max {maxFiles} files •{" "}
          {formatFileSize(MAX_FILE_SIZE)} per file
        </p>

        {/* Choose Files Button */}
        <button
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            isDragActive
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-800 text-white hover:bg-gray-900 shadow-md hover:shadow-lg"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          <Upload className="w-4 h-4" />
          Choose Files
        </button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept={allowedFileTypes.join(",")}
          onChange={handleFileInputChange}
        />
      </div>

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900">
              Uploaded Files ({uploadedFiles.length})
            </h4>
            <button
              onClick={() => setUploadedFiles([])}
              className="text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {uploadedFiles.map((file) => (
              <FileUploadPreview
                key={file.id}
                file={file}
                onRemove={removeFile}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upload Statistics */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {uploadedFiles.filter((f) => f.status === "completed").length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {uploadedFiles.filter((f) => f.status === "uploading").length}
              </p>
              <p className="text-sm text-gray-600">Uploading</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {uploadedFiles.filter((f) => f.status === "error").length}
              </p>
              <p className="text-sm text-gray-600">Failed</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Total size:{" "}
              {formatFileSize(
                uploadedFiles.reduce((acc, f) => acc + f.size, 0)
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
