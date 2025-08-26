// utils/fileUtils.ts

/**
 * Format file size in bytes to human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

/**
 * Format date string to human readable format
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Format date string to detailed format for sidebar
 */
export const formatDetailedDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.split(".").pop()?.toLowerCase() || "";
};

/**
 * Check if file is an image based on type or extension
 */
export const isImageFile = (fileType: string, fileName?: string): boolean => {
  if (fileType.startsWith("image/")) return true;
  if (!fileName) return false;

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
  const extension = getFileExtension(fileName);
  return imageExtensions.includes(extension);
};

/**
 * Truncate filename for display
 */
export const truncateFileName = (
  fileName: string,
  maxLength: number = 30
): string => {
  if (fileName.length <= maxLength) return fileName;

  const extension = getFileExtension(fileName);
  const nameWithoutExtension = fileName.slice(0, fileName.lastIndexOf("."));
  const truncateLength = maxLength - extension.length - 4; // -4 for "..." and "."

  return `${nameWithoutExtension.slice(0, truncateLength)}...${
    extension ? `.${extension}` : ""
  }`;
};
