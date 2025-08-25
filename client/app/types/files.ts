// contracts/files.ts
// ==========================
// FILES & FOLDERS API CONTRACTS
// ==========================

// ==========================
// 📌 Endpoint: POST /api/files/upload
// ==========================
export interface UploadFileRequest {
  file: File;
  fileName: string;
  projectId: string;
  folderId?: string | null;
  category?: string; // IMAGE | VIDEO | DOCUMENT | OTHER
  description?: string | null;
  tags?: string[];
}

export interface UploadFileResponse {
  success: true;
  data: {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    fileUrl: string;
    projectId: string;
    folderId?: string | null;
    uploadedBy: string;
    category: string;
    description?: string | null;
    tags: string[];
    status: "ACTIVE" | "INACTIVE";
    visibility: "PROJECT_MEMBERS" | "PUBLIC";
    createdAt: string;
    updatedAt: string;
  };
}

// ==========================
// 📌 Endpoint: GET /api/files/project/:projectId
// ==========================
export interface GetProjectFilesQuery {
  folderId?: string;
}

export interface GetProjectFilesParams {
  projectId: string;
}

export interface GetProjectFilesResponse {
  success: true;
  data: {
    files: {
      id: string;
      fileName: string;
      fileType: string;
      fileSize: number;
      folderId: string | null;
      createdAt: string;
      updatedAt: string;
      fileUrl: string;
      category: string;
      tags: string[];
      description: string | null;
      uploadedBy: string;
      parentFileId: string | null;
      parentFile: any | null;
      status: string;
      isStarred: boolean;
      downloadCount: number;
      visibility: string;
      accessUsers: any[];
      shareLinks: any[];
    }[];
    folders: {
      id: string;
      name: string;
      parentFolderId: string | null;
      color: string | null;
      createdAt: string;
      updatedAt: string;
    }[];
  };
}

// ==========================
// 📌 Endpoint: GET /api/files/:fileId
// ==========================
export interface GetFileParams {
  fileId: string;
}

export interface GetFileResponse {
  success: true;
  data: {
    file: {
      id: string;
      fileName: string;
      fileType: string;
      fileSize: number;
      fileUrl: string;
      category: string;
      version: number;
      isStarred: boolean;
      downloadCount: number;
      status: string;
      visibility: "PUBLIC" | "PRIVATE" | "SPECIFIC_USERS" | "PROJECT_MEMBERS";
      description?: string;
      tags: string[];
      projectId: string;
      uploadedBy: {
        id: string;
        displayName: string;
        email: string;
        avatar?: string;
      };
      folder?: {
        id: string;
        name: string;
        description?: string;
        color?: string;
        parentFolderId?: string;
      };
      parentFile?: {
        id: string;
        fileName: string;
        version: number;
      };
      versions: {
        id: string;
        version: number;
        createdAt: string;
      }[];
      accessUsers: {
        id: string;
        userId: string;
        permission: string;
      }[];
      shareLinks: {
        id: string;
        shareToken: string;
        permission: string;
        expiresAt?: string;
      }[];
      createdAt: string;
      updatedAt: string;
    };
  };
  timestamp: string;
}

// ==========================
// 📌 PATCH /api/files/:fileId/update
// ==========================
export interface PatchFileUpdateRequest {
  fileName?: string;
  description?: string | null;
  tags?: string[];
  category?: string;
  visibility?: "PRIVATE" | "PROJECT_MEMBERS" | "PUBLIC";
}

export interface PatchFileUpdateResponse {
  success: boolean;
  data?: {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    fileUrl: string;
    projectId: string;
    folderId: string | null;
    uploadedBy: string;
    category: string;
    description: string | null;
    tags: string[];
    status: "ACTIVE" | "ARCHIVED" | "DELETED";
    visibility: "PRIVATE" | "PROJECT_MEMBERS" | "PUBLIC";
    createdAt: string;
    updatedAt: string;
  };
  error?: string;
}

// ==========================
// 📌 DELETE /api/files/:fileId/delete
// ==========================
export interface DeleteFileSuccessResponse {
  success: true;
  message: string;
  timestamp: string;
}

export interface DeleteFileErrorResponse {
  success: false;
  error: string;
  details?: any;
  timestamp: string;
}

// ==========================
// 📌 POST /api/folders
// ==========================
export interface CreateFolderRequest {
  projectId: string;
  name: string;
  parentFolderId?: string | null;
  description?: string;
  metadata?: Record<string, any>;
}

export interface CreateFolderSuccessResponse {
  success: true;
  message: "Folder created successfully";
  data: {
    id: string;
    name: string;
    projectId: string;
    parentFolderId: string | null;
    description: string | null;
    metadata: Record<string, unknown> | null;
    createdBy: {
      id: string;
      name: string | null;
    };
    createdAt: string;
    updatedAt: string;
  };
  timestamp: string;
}

export interface CreateFolderErrorResponse {
  success: false;
  error: string;
  details?: any;
  timestamp: string;
}

// ==========================
// 📌 GET /api/folders/:folderId
// ==========================
export interface GetFolderParams {
  folderId: string;
}

export interface FileResponse {
  id: string;
  name: string;
  size: number;
  presignedUrl?: string;
}

export interface SubfolderResponse {
  id: string;
  name: string;
}

export interface FolderResponse {
  id: string;
  name: string;
  projectId: string;
  parentFolderId?: string | null;
  description?: string | null;
  metadata?: Record<string, any>;
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  files: FileResponse[];
  subfolders: SubfolderResponse[];
}

export interface GetFolderSuccessResponse {
  success: true;
  data: FolderResponse;
  timestamp: string;
}

export interface GetFolderErrorResponse {
  success?: false;
  error: string | object;
  timestamp?: string;
}

// ==========================
// 📌 PATCH /api/folders/:folderId/update
// ==========================
export interface PatchFolderParams {
  folderId: string;
}

export interface PatchFolderRequestBody {
  name?: string;
  description?: string;
  parentFolderId?: string | null;
  metadata?: Record<string, unknown>;
  color?: string;
}

export interface PatchFolderSuccessResponse {
  success: true;
  data: {
    id: string;
    name: string;
    projectId: string;
    parentFolderId: string | null;
    description: string | null;
    metadata: Record<string, unknown> | null;
    color: string | null;
    createdBy: {
      id: string | null;
      name: string | null;
    };
    createdAt: string;
    updatedAt: string;
  };
  message: string;
  timestamp: string;
}

export interface PatchFolderErrorResponse {
  success: false;
  error: {
    code:
      | "invalid_path_params"
      | "unauthenticated"
      | "invalid_json"
      | "invalid_body"
      | "user_not_found"
      | "folder_not_found"
      | "forbidden"
      | "parent_not_found"
      | "parent_different_project"
      | "circular_hierarchy"
      | "invalid_hierarchy"
      | "nothing_to_update"
      | "not_found"
      | "internal_error";
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

// ==========================
// 📌 DELETE /api/folders/:folderId
// ==========================
export interface DeleteFolderParams {
  folderId: string;
}

export interface DeleteFolderQuery {
  force?: boolean;
}

export interface DeleteFolderSuccess {
  success: true;
  message: string;
  data: {
    folderId: string;
    deletedFilesCount: number;
    deletedSubfoldersCount: number;
    s3DeletedObjectsCount: number;
  };
  timestamp: string;
}

export interface DeleteFolderError {
  success: false;
  error: string;
  details?: unknown;
}

export type DeleteFolderResponse = DeleteFolderSuccess | DeleteFolderError;
