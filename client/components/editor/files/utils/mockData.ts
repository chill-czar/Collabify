import { FileItem } from "../types";

export const mockFiles: FileItem[] = [
  {
    id: "1",
    name: "Homepage_Design.figma",
    type: "file",
    size: 2400000,
    mimeType: "application/figma",
    createdAt: new Date("2024-01-15"),
    modifiedAt: new Date("2024-01-15"),
    createdBy: "John Doe",
    isStarred: false,
    thumbnail: "/api/placeholder/120/80",
  },
  {
    id: "2",
    name: "Brand_Guidelines.pdf",
    type: "file",
    size: 1800000,
    mimeType: "application/pdf",
    createdAt: new Date("2024-01-14"),
    modifiedAt: new Date("2024-01-14"),
    createdBy: "Jane Smith",
    isStarred: true,
    thumbnail: "/api/placeholder/120/80",
  },
  {
    id: "3",
    name: "User_Research.xlsx",
    type: "file",
    size: 856000,
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    createdAt: new Date("2024-01-13"),
    modifiedAt: new Date("2024-01-13"),
    createdBy: "Mike Johnson",
    isStarred: false,
    thumbnail: "/api/placeholder/120/80",
  },
  {
    id: "4",
    name: "Logo_Variations.png",
    type: "file",
    size: 1200000,
    mimeType: "image/png",
    createdAt: new Date("2024-01-12"),
    modifiedAt: new Date("2024-01-12"),
    createdBy: "Sarah Wilson",
    isStarred: false,
    thumbnail: "/api/placeholder/120/80",
  },
  {
    id: "5",
    name: "Assets",
    type: "folder",
    createdAt: new Date("2024-01-10"),
    modifiedAt: new Date("2024-01-15"),
    createdBy: "Team",
    isStarred: true,
  },
  {
    id: "6",
    name: "Documentation",
    type: "folder",
    createdAt: new Date("2024-01-08"),
    modifiedAt: new Date("2024-01-14"),
    createdBy: "Team",
    isStarred: false,
  },
  {
    id: "7",
    name: "Project_Presentation.pptx",
    type: "file",
    size: 5200000,
    mimeType:
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    createdAt: new Date("2024-01-11"),
    modifiedAt: new Date("2024-01-16"),
    createdBy: "Alex Chen",
    isStarred: false,
  },
  {
    id: "8",
    name: "Demo_Video.mp4",
    type: "file",
    size: 15600000,
    mimeType: "video/mp4",
    createdAt: new Date("2024-01-09"),
    modifiedAt: new Date("2024-01-09"),
    createdBy: "Emily Brown",
    isStarred: true,
  },
  {
    id: "9",
    name: "Meeting_Notes.docx",
    type: "file",
    size: 245000,
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    createdAt: new Date("2024-01-17"),
    modifiedAt: new Date("2024-01-17"),
    createdBy: "David Lee",
    isStarred: false,
  },
  {
    id: "10",
    name: "Archive",
    type: "folder",
    createdAt: new Date("2023-12-01"),
    modifiedAt: new Date("2024-01-05"),
    createdBy: "System",
    isStarred: false,
  },
];

export const mockTrashFiles: FileItem[] = [
  {
    id: "trash1",
    name: "Old_Design.psd",
    type: "file",
    size: 5600000,
    mimeType: "image/vnd.adobe.photoshop",
    createdAt: new Date("2024-01-01"),
    modifiedAt: new Date("2024-01-01"),
    createdBy: "John Doe",
    isStarred: false,
    isDeleted: true,
    deletedAt: new Date("2024-01-20"),
  },
  {
    id: "trash2",
    name: "Outdated_Specs.pdf",
    type: "file",
    size: 1200000,
    mimeType: "application/pdf",
    createdAt: new Date("2023-12-15"),
    modifiedAt: new Date("2023-12-15"),
    createdBy: "Jane Smith",
    isStarred: false,
    isDeleted: true,
    deletedAt: new Date("2024-01-18"),
  },
  {
    id: "trash3",
    name: "Temp_Folder",
    type: "folder",
    createdAt: new Date("2024-01-05"),
    modifiedAt: new Date("2024-01-07"),
    createdBy: "Mike Johnson",
    isStarred: false,
    isDeleted: true,
    deletedAt: new Date("2024-01-19"),
  },
];

// Helper function to generate more mock files if needed
export const generateMockFile = (
  name: string,
  type: "file" | "folder",
  mimeType?: string,
  size?: number
): FileItem => ({
  id: `mock-${Date.now()}-${Math.random()}`,
  name,
  type,
  size,
  mimeType,
  createdAt: new Date(),
  modifiedAt: new Date(),
  createdBy: "Mock User",
  isStarred: false,
});

// Mock API response structure for future backend integration
export interface MockApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

// Mock API endpoints structure for future reference
export const mockApiEndpoints = {
  files: {
    list: "/api/files",
    create: "/api/files",
    update: (id: string) => `/api/files/${id}`,
    delete: (id: string) => `/api/files/${id}`,
    upload: "/api/files/upload",
    download: (id: string) => `/api/files/${id}/download`,
    share: (id: string) => `/api/files/${id}/share`,
  },
  folders: {
    list: "/api/folders",
    create: "/api/folders",
    update: (id: string) => `/api/folders/${id}`,
    delete: (id: string) => `/api/folders/${id}`,
  },
  trash: {
    list: "/api/trash",
    restore: (id: string) => `/api/trash/${id}/restore`,
    permanentDelete: (id: string) => `/api/trash/${id}/permanent`,
  },
};
