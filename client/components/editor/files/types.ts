// Core Types
export interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  mimeType?: string;
  createdAt: Date;
  modifiedAt: Date;
  createdBy: string;
  isStarred: boolean;
  parentId?: string;
  isSelected?: boolean;
  thumbnail?: string;
  isDeleted?: boolean;
  deletedAt?: Date;
}

export interface UploadProgress {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "completed" | "error";
}

export interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

// Component Props Types
export interface FileItemProps {
  file: FileItem;
  isSelected: boolean;
  isEditing: boolean;
  editingName: string;
  onSelect: (file: FileItem) => void;
  onContextMenu: (e: React.MouseEvent, file: FileItem) => void;
  onStarToggle: (id: string) => void;
  onStartEdit: (id: string, name: string) => void;
  onFinishEdit: (id: string, name: string) => void;
  onCancelEdit: () => void;
  onNameChange: (name: string) => void;
  showTrash: boolean;
}

export interface FilesGridProps {
  files: FileItem[];
  selectedFile: FileItem | null;
  editingFile: string | null;
  editingName: string;
  onFileSelect: (file: FileItem) => void;
  onContextMenu: (e: React.MouseEvent, file: FileItem) => void;
  onStarToggle: (id: string) => void;
  onStartEdit: (id: string, name: string) => void;
  onFinishEdit: (id: string, name: string) => void;
  onCancelEdit: () => void;
  onNameChange: (name: string) => void;
  showTrash: boolean;
}

export interface FilesListProps extends FilesGridProps {}

export interface FilesTopBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  showTrash: boolean;
  setShowTrash: (show: boolean) => void;
  onUploadClick: () => void;
  onCreateFolder: () => void;
}

export interface FileDetailsSidebarProps {
  selectedFile: FileItem;
  onClose: () => void;
}

export interface FileContextMenuProps {
  x: number;
  y: number;
  file: FileItem;
  onClose: () => void;
  onAction: (action: string, file: FileItem) => void;
}

export interface ShareModalProps {
  isOpen: boolean;
  file: FileItem | null;
  onClose: () => void;
}

export interface FileUploadZoneProps {
  onFileUpload: (files: FileList) => void;
  isDragOver: boolean;
  setIsDragOver: (isDragOver: boolean) => void;
  children: React.ReactNode;
}

export interface EmptyStateProps {
  showTrash: boolean;
  onUploadClick: () => void;
}

export interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

// Utility Types
export type ViewMode = "grid" | "list";
export type FileType =
  | "all"
  | "folder"
  | "document"
  | "pdf"
  | "image"
  | "video";
export type ToastType = "success" | "error" | "info";
export type UploadStatus = "uploading" | "completed" | "error";
