// Main Components
export { default as Files } from "./Files";

// Layout Components
export { default as FilesTopBar } from "./layout/FilesTopBar";
export { default as FilesGrid } from "./layout/FilesGrid";
export { default as FilesList } from "./layout/FilesList";
export { FileGridItem, FileListItem } from "./layout/FileItem";
export { default as EmptyState } from "./layout/EmptyState";

// Action Components
export { default as FileContextMenu } from "./actions/FileContextMenu";
export { default as ShareModal } from "./actions/ShareModal";
export { default as FileUploadZone } from "./actions/FileUploadZone";
export { default as EnhancedDragDropArea } from "./actions/EnhancedDragDropArea";

// Sidebar Components
export { default as FileDetailsSidebar } from "./sidebar/FileDetailsSidebar";
export { default as FilePreview } from "./sidebar/FilePreview";
export { default as FileActivityFeed } from "./sidebar/FileActivityFeed";

// Utility Components
export { default as ToastContainer } from "./components/ToastContainer";

// Types
export * from "./types";

// Utilities
export * from "./utils/fileTypes";
export * from "./utils/mockData";

// Usage Example:
/*
import { Files } from './components/files';

function App() {
  return <Files />;
}

// Or import individual components:
import { 
  FilesTopBar, 
  FilesGrid, 
  FileDetailsSidebar,
  EnhancedDragDropArea 
} from './components/files';
*/
