import {
  File,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Folder,
  FolderOpen,
  Code,
  Database,
  Package,
} from "lucide-react";

// Get appropriate icon for file type
export const getFileIcon = (mimeType?: string, type?: string) => {
  if (type === "folder") return Folder;
  if (!mimeType) return File;

  // Image files
  if (mimeType.startsWith("image/")) return Image;

  // Video files
  if (mimeType.startsWith("video/")) return Video;

  // Audio files
  if (mimeType.startsWith("audio/")) return Music;

  // Document files
  if (mimeType.includes("pdf")) return FileText;
  if (
    mimeType.includes("document") ||
    mimeType.includes("sheet") ||
    mimeType.includes("presentation")
  )
    return FileText;

  // Code files
  if (
    mimeType.includes("javascript") ||
    mimeType.includes("typescript") ||
    mimeType.includes("json") ||
    mimeType.includes("html") ||
    mimeType.includes("css")
  )
    return Code;

  // Archive files
  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("archive") ||
    mimeType.includes("tar") ||
    mimeType.includes("gzip")
  )
    return Archive;

  // Database files
  if (mimeType.includes("sql") || mimeType.includes("database"))
    return Database;

  // Application files
  if (mimeType.includes("application/")) return Package;

  return File;
};

// Get file type category from mime type
export const getFileTypeFromMime = (mimeType?: string): string => {
  if (!mimeType) return "File";

  if (mimeType.startsWith("image/")) return "Image";
  if (mimeType.startsWith("video/")) return "Video";
  if (mimeType.startsWith("audio/")) return "Audio";
  if (mimeType.includes("pdf")) return "PDF";
  if (
    mimeType.includes("document") ||
    mimeType.includes("sheet") ||
    mimeType.includes("presentation")
  )
    return "Document";
  if (mimeType.includes("zip") || mimeType.includes("archive"))
    return "Archive";
  if (
    mimeType.includes("javascript") ||
    mimeType.includes("typescript") ||
    mimeType.includes("json") ||
    mimeType.includes("html") ||
    mimeType.includes("css")
  )
    return "Code";

  return "File";
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

// Format date consistently
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Get human readable date
export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  if (diffInHours < 24 * 7) {
    const days = Math.floor(diffInHours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
  return date.toLocaleDateString();
};

// Check if file type is supported for preview
export const isPreviewable = (mimeType?: string): boolean => {
  if (!mimeType) return false;

  return (
    mimeType.startsWith("image/") ||
    mimeType === "application/pdf" ||
    mimeType.startsWith("text/") ||
    mimeType.includes("json")
  );
};

// Get color class for file type
export const getFileTypeColor = (mimeType?: string, type?: string): string => {
  if (type === "folder") return "text-blue-500";
  if (!mimeType) return "text-gray-400";

  if (mimeType.startsWith("image/")) return "text-green-500";
  if (mimeType.startsWith("video/")) return "text-purple-500";
  if (mimeType.startsWith("audio/")) return "text-orange-500";
  if (mimeType.includes("pdf")) return "text-red-500";
  if (
    mimeType.includes("document") ||
    mimeType.includes("sheet") ||
    mimeType.includes("presentation")
  )
    return "text-blue-600";
  if (mimeType.includes("zip") || mimeType.includes("archive"))
    return "text-yellow-600";
  if (
    mimeType.includes("javascript") ||
    mimeType.includes("typescript") ||
    mimeType.includes("json") ||
    mimeType.includes("html") ||
    mimeType.includes("css")
  )
    return "text-indigo-500";

  return "text-gray-400";
};

// File type filters for search
export const fileTypeFilters = [
  { value: "all", label: "All Files" },
  { value: "folder", label: "Folders" },
  { value: "document", label: "Documents" },
  { value: "pdf", label: "PDFs" },
  { value: "image", label: "Images" },
  { value: "video", label: "Videos" },
  { value: "audio", label: "Audio" },
  { value: "code", label: "Code" },
  { value: "archive", label: "Archives" },
];

// Allowed file types for upload
export const allowedFileTypes = [
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",

  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  // Text files
  "text/plain",
  "text/csv",
  "application/json",

  // Code files
  "text/html",
  "text/css",
  "text/javascript",
  "application/javascript",
  "application/typescript",

  // Media
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "audio/mpeg",
  "audio/wav",
  "audio/mp3",

  // Archives
  "application/zip",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/gzip",
];

// Maximum file size (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
