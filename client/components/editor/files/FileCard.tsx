// components/files/FileCard.tsx
import React, { useState, useCallback, useMemo } from "react";
import { MoreVertical } from "lucide-react";
import { useDeleteFile, useUpdateFile } from "@/lib/files/api";
import { Loading } from "@/components/editor/files/Loading";
import { ContextMenu } from "./ContextMenu";
import { FilePreview } from "./FilePreview";
import { FileMeta } from "./FileMeta";

interface FileCardProps {
  file: {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    fileUrl: string;
    category: string;
    tags: string[];
    description: string | null;
    uploadedBy: string;
    createdAt: string;
    updatedAt: string;
    isStarred?: boolean;
    visibility: string;
  };
  onSelect?: (file: any) => void;
  isSelected?: boolean;
  uploaderName?: string;
  uploaderAvatar?: string;
}

const FileCardComponent: React.FC<FileCardProps> = ({
  file,
  onSelect,
  isSelected = false,
  uploaderName = "Unknown User",
  uploaderAvatar,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newFileName, setNewFileName] = useState(file.fileName);
  const [imageError, setImageError] = useState(false);

  const deleteFile = useDeleteFile();
  const updateFile = useUpdateFile();

  const handleMenuClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  }, []);

  const handleCardClick = useCallback(() => {
    onSelect?.(file);
  }, [onSelect, file]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteFile.mutateAsync(file.id);
      setShowMenu(false);
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  }, [deleteFile, file.id]);

  const handleRename = useCallback(async () => {
    if (newFileName.trim() && newFileName !== file.fileName) {
      try {
        await updateFile.mutateAsync({
          id: file.id,
          fileName: newFileName.trim(),
        });
        // React 18 automatically batches these setState calls
        setIsRenaming(false);
        setShowMenu(false);
      } catch (error) {
        console.error("Failed to rename file:", error);
      }
    } else {
      setIsRenaming(false);
    }
  }, [newFileName, file.fileName, file.id, updateFile]);

  const handleDownload = useCallback(() => {
    window.open(file.fileUrl, "_blank");
    setShowMenu(false);
  }, [file.fileUrl]);

  const handleOpen = useCallback(() => {
    window.open(file.fileUrl, "_blank");
    setShowMenu(false);
  }, [file.fileUrl]);

  // Dummy handlers for features not yet implemented
  const handleCopy = useCallback(() => {
    console.log("Copy file:", file.id);
    setShowMenu(false);
  }, [file.id]);

  const handleMove = useCallback(() => {
    console.log("Move file:", file.id);
    setShowMenu(false);
  }, [file.id]);

  const handleShare = useCallback(() => {
    console.log("Share file:", file.id);
    setShowMenu(false);
  }, [file.id]);

  // Memoize file type checks
  const fileTypeChecks = useMemo(() => ({
    isImage: file.fileType.startsWith("image/"),
    isVideo: file.fileType.startsWith("video/"),
    isPDF: file.fileType === "application/pdf",
    isDocument:
      file.fileType.includes("document") ||
      file.fileType.includes("text") ||
      file.fileType.includes("sheet"),
  }), [file.fileType]);

  const { isImage, isVideo, isPDF, isDocument } = fileTypeChecks;

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  if (deleteFile.isPending || updateFile.isPending) {
    return <Loading variant="card" />;
  }

  return (
    <div className="relative group w-full">
      <div
        className={`
          bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200 cursor-pointer 
          hover:shadow-md hover:scale-[1.02] w-full h-full flex flex-col
          ${isSelected ? "ring-2 ring-blue-500 shadow-md" : ""}
        `}
        onClick={handleCardClick}
      >
        {/* Header Row */}
        <div className="flex items-start justify-between p-2 sm:p-3 pb-1 sm:pb-2 flex-shrink-0">
          <div className="flex-1 min-w-0 pr-1 sm:pr-2">
            {isRenaming ? (
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename();
                  if (e.key === "Escape") {
                    setIsRenaming(false);
                    setNewFileName(file.fileName);
                  }
                }}
                className="w-full text-xs sm:text-sm font-medium text-gray-900 bg-transparent border-b border-blue-500 px-0 py-1 outline-none"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h3
                className="text-xs sm:text-sm font-medium text-gray-900 truncate leading-tight"
                title={file.fileName}
              >
                {file.fileName}
              </h3>
            )}
          </div>

          {/* Three-dots Menu */}
          <button
            onClick={handleMenuClick}
            className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all duration-200 flex-shrink-0"
            aria-label="File options"
          >
            <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
          </button>
        </div>

        {/* Preview Section - Matches folder icon height exactly */}
        <div className="mx-2 sm:mx-3 mb-2 sm:mb-3 flex-1 flex items-center justify-center">
          <div className="w-full h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
            <FilePreview
              file={file}
              isImage={isImage}
              isVideo={isVideo}
              isPDF={isPDF}
              isDocument={isDocument}
              imageError={imageError}
              onImageError={handleImageError}
            />
          </div>
        </div>

        {/* Footer Section */}
        <FileMeta
          uploaderName={uploaderName}
          uploaderAvatar={uploaderAvatar}
          createdAt={file.createdAt}
        />
      </div>

      {/* Context Menu */}
      <ContextMenu
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        type="file"
        onOpen={handleOpen}
        onRename={() => {
          setIsRenaming(true);
          setShowMenu(false);
        }}
        onDownload={handleDownload}
        onCopy={handleCopy}
        onMove={handleMove}
        onShare={handleShare}
        onDelete={handleDelete}
      />
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export const FileCard = React.memo(FileCardComponent, (prevProps, nextProps) => {
  // Custom comparison function for better control over re-renders
  return (
    prevProps.file.id === nextProps.file.id &&
    prevProps.file.fileName === nextProps.file.fileName &&
    prevProps.file.updatedAt === nextProps.file.updatedAt &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.onSelect === nextProps.onSelect
  );
});
