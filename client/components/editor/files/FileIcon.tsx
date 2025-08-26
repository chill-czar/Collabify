// components/files/FileIcon.tsx
import React from "react";
import {
  FileText,
  Image,
  Video,
  File,
  Music,
  Archive,
  Code,
} from "lucide-react";

interface FileIconProps {
  fileType: string;
  category: string;
  className?: string;
}

export const FileIcon: React.FC<FileIconProps> = ({
  fileType,
  category,
  className = "w-8 h-8",
}) => {
  const getIcon = () => {
    // Category-based icons
    if (category === "IMAGE" || fileType.startsWith("image/")) {
      return <Image className={`${className} text-blue-500`} />;
    }
    if (category === "VIDEO" || fileType.startsWith("video/")) {
      return <Video className={`${className} text-red-500`} />;
    }

    // File type-based icons
    if (fileType.includes("pdf")) {
      return <FileText className={`${className} text-red-600`} />;
    }
    if (
      fileType.startsWith("audio/") ||
      fileType.includes("mp3") ||
      fileType.includes("wav")
    ) {
      return <Music className={`${className} text-purple-500`} />;
    }
    if (
      fileType.includes("zip") ||
      fileType.includes("rar") ||
      fileType.includes("tar")
    ) {
      return <Archive className={`${className} text-orange-500`} />;
    }
    if (
      fileType.includes("javascript") ||
      fileType.includes("typescript") ||
      fileType.includes("json") ||
      fileType.includes("html") ||
      fileType.includes("css")
    ) {
      return <Code className={`${className} text-green-500`} />;
    }

    // Default file icon
    return <File className={`${className} text-gray-500`} />;
  };

  return (
    <div className="flex items-center justify-center h-20">{getIcon()}</div>
  );
};
