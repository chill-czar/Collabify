// api/files.ts
import {
  UploadFileResponse,
  GetProjectFilesResponse,
  GetFileResponse,
  PatchFileUpdateResponse,
  DeleteFileSuccessResponse,
  CreateFolderSuccessResponse,
  FolderResponse,
  FileResponse,
  SubfolderResponse,
  GetFolderSuccessResponse,
  PatchFolderSuccessResponse,
  DeleteFolderSuccess,
  DeleteFileErrorResponse,
  CreateFolderErrorResponse,
  PatchFolderErrorResponse,
  DeleteFolderError,
  UploadFileRequest,
} from "@/types/files";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import { apiClient } from "../apiClient";

// ==========================
// API CLIENT FUNCTIONS
// ==========================

/**
 * Upload a file to a project (optionally inside a folder)
 */
export const uploadFile = async (
  data: UploadFileRequest
): Promise<UploadFileResponse> => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("fileName", data.fileName);
  formData.append("projectId", data.projectId);
  if (data.folderId) formData.append("folderId", data.folderId);
  if (data.category) formData.append("category", data.category);
  if (data.description) formData.append("description", data.description);
  if (data.tags) formData.append("tags", JSON.stringify(data.tags));

  const res = await apiClient.post<UploadFileResponse>(
    "/files/upload",
    formData,
  );

  // ✅ Ensure the return type matches UploadFileResponse
  return {
    success: res.success,
    data: res.data,
  };
};


/**
 * List files in a project (optionally filtered by folder)
 */
export const listFiles = async (args: {
  projectId: string;
  folderId?: string | null;
}): Promise<GetProjectFilesResponse["data"]> => {
  const query = args.folderId ? `?folderId=${args.folderId}` : "";
  const res = await apiClient.get<GetProjectFilesResponse>(
    `/files/project/${args.projectId}${query}`
  );
  if (!res.success) throw new Error("Failed to fetch files");
  return res.data;
};

/**
 * Get all files for the current user across all projects (batched)
 */
export const getAllFilesForUser = async (): Promise<FileResponse[]> => {
  const res = await apiClient.get<{ success: boolean; data: FileResponse[] }>(
    "/files/user/all"
  );
  if (!res.success) throw new Error("Failed to fetch user files");
  return res.data;
};

/**
 * Get single file details
 */
export const getFile = async (
  fileId: string
): Promise<GetFileResponse["data"]["file"]> => {
  const res = await apiClient.get<GetFileResponse>(`/files/${fileId}`);
  if (!res.success) throw new Error("Failed to fetch file");
  return res.data.file;
};

/**
 * Update a file (rename, star/unstar, metadata)
 */
export const updateFile = async (args: {
  id: string;
  fileName?: string;
  description?: string | null;
  tags?: string[];
  category?: string;
  visibility?: "PRIVATE" | "PROJECT_MEMBERS" | "PUBLIC";
}): Promise<NonNullable<PatchFileUpdateResponse["data"]>> => {
  const { id, ...updateData } = args;
  const res = await apiClient.patch<PatchFileUpdateResponse>(
    `/files/${id}/update`,
    updateData
  );
  if (!res.success || !res.data)
    throw new Error(res.error || "Failed to update file");
  return res.data;
};

/**
 * Delete a file
 */
export const deleteFile = async (
  fileId: string
): Promise<{ success: true; message: string }> => {
  const res = await apiClient.delete<
    DeleteFileSuccessResponse | DeleteFileErrorResponse
  >(`/files/${fileId}/delete`);
  if (!res.success) throw new Error(res.error || "Failed to delete file");
  return { success: true, message: res.message };
};

/**
 * Create a new folder
 */
export const createFolder = async (args: {
  name: string;
  parentId?: string | null;
  projectId: string;
  description?: string;
  metadata?: Record<string, any>;
}): Promise<CreateFolderSuccessResponse["data"]> => {
  const res = await apiClient.post<
    CreateFolderSuccessResponse | CreateFolderErrorResponse
  >("/folders", {
    name: args.name,
    parentFolderId: args.parentId,
    projectId: args.projectId,
    description: args.description,
    metadata: args.metadata,
  });
  if (!res.success) throw new Error(res.error || "Failed to create folder");
  return res.data;
};

/**
 * Get folder details and its contents
 */
export const getFolder = async (
  folderId: string
): Promise<{
  folder: FolderResponse;
  parents: FolderResponse[];
  files: FileResponse[];
  folders: SubfolderResponse[];
}> => {
  const res = await apiClient.get<GetFolderSuccessResponse>(
    `/folders/${folderId}?include=children&types=file,folder`
  );
  if (!res.success) throw new Error("Failed to fetch folder");
  return {
    folder: res.data,
    parents: [], // TODO(api): Implement parents if needed
    files: res.data.files,
    folders: res.data.subfolders,
  };
};

/**
 * Update folder (rename, star/unstar)
 */
export const updateFolder = async (args: {
  id: string;
  name?: string;
  description?: string;
  parentFolderId?: string | null;
  metadata?: Record<string, unknown>;
  color?: string;
}): Promise<PatchFolderSuccessResponse["data"]> => {
  const { id, ...updateData } = args;
  const res = await apiClient.patch<
    PatchFolderSuccessResponse | PatchFolderErrorResponse
  >(`/folders/${id}/update`, updateData);
  if (!res.success)
    throw new Error(res.error?.message || "Failed to update folder");
  return res.data;
};

/**
 * Delete folder and all its contents
 */
export const deleteFolder = async (
  folderId: string,
  force?: boolean
): Promise<DeleteFolderSuccess["data"]> => {
  const query = force ? "?force=true" : "";
  const res = await apiClient.delete<DeleteFolderSuccess | DeleteFolderError>(
    `/folders/${folderId}/delete`
  );
  if (!res.success) throw new Error(res.error || "Failed to delete folder");
  return res.data;
};

// ==========================
// REACT QUERY HOOKS
// ==========================
// Cache invalidation strategy:
// - Use specific keys: ["projects", projectId, "files", folderId]
// - Use predicates to selectively invalidate related queries
// - Avoid broad invalidation (e.g., just ["files"])

export const useUploadFile = (
  projectId: string,
  parentId?: string | null
): UseMutationResult<UploadFileResponse, Error, UploadFileRequest> => {
  const queryClient = useQueryClient();

  return useMutation<UploadFileResponse, Error, UploadFileRequest>({
    mutationFn: (payload: UploadFileRequest) => uploadFile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "files", parentId ?? null],
      });
    },
  });
};

export const useFiles = (
  projectId: string,
  folderId?: string | null,
  options?: UseQueryOptions<GetProjectFilesResponse["data"], unknown>
) =>
  useQuery({
    queryKey: ["projects", projectId, "files", folderId ?? null],
    queryFn: () => listFiles({ projectId, folderId }),
    staleTime: 1000 * 60, // 1 minute - files change moderately
    ...options,
  });

export const useAllUserFiles = (
  options?: UseQueryOptions<FileResponse[], unknown>
) =>
  useQuery({
    queryKey: ["user", "files"],
    queryFn: getAllFilesForUser,
    staleTime: 1000 * 60, // 1 minute - files change moderately
    ...options,
  });

export const useFile = (
  fileId: string,
  options?: UseQueryOptions<GetFileResponse["data"]["file"], unknown>
) =>
  useQuery({
    queryKey: ["files", fileId],
    queryFn: () => getFile(fileId),
    staleTime: 1000 * 60, // 1 minute - file details change moderately
    ...options,
  });

export const useUpdateFile = (
  options?: UseMutationOptions<
    NonNullable<PatchFileUpdateResponse["data"]>,
    unknown,
    {
      id: string;
      fileName?: string;
      description?: string | null;
      tags?: string[];
      category?: string;
      visibility?: "PRIVATE" | "PROJECT_MEMBERS" | "PUBLIC";
    }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFile,
    onSuccess: (data) => {
      if (data?.id) {
        queryClient.invalidateQueries({
          queryKey: ["files", data.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["projects"],
          predicate: (query) =>
            query.queryKey[0] === "projects" && query.queryKey[2] === "files"
        });
      }
    },
    ...options,
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { success: true; message: string },
    unknown,
    string // variables = fileId
  >({
    mutationFn: deleteFile,
    onSuccess: (_, fileId) => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
        predicate: (query) =>
          query.queryKey[0] === "projects" && query.queryKey[2] === "files"
      });
      queryClient.removeQueries({ queryKey: ["files", fileId] });
    },
  });
};

// ----------------- FOLDER HOOKS -----------------

export const useCreateFolder = (
  projectId: string,
  parentId?: string | null
) => {
  const queryClient = useQueryClient();
  return useMutation<
    CreateFolderSuccessResponse["data"],
    unknown,
    {
      name: string;
      description?: string;
      metadata?: Record<string, any>;
    }
  >({
    mutationFn: (args) => createFolder({ ...args, parentId, projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "folders", parentId ?? null],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "files", parentId ?? null],
      });
    },
  });
};

export const useFolder = (
  folderId: string,
  options?: UseQueryOptions<
    {
      folder: FolderResponse;
      parents: FolderResponse[];
      files: FileResponse[];
      folders: SubfolderResponse[];
    },
    unknown
  >
) =>
  useQuery({
    queryKey: ["folders", folderId],
    queryFn: () => getFolder(folderId),
    staleTime: 1000 * 60 * 2, // 2 minutes - folders change less frequently
    ...options,
  });

export const useUpdateFolder = () => {
  const queryClient = useQueryClient();
  return useMutation<
    PatchFolderSuccessResponse["data"],
    unknown,
    {
      id: string;
      name?: string;
      description?: string;
      parentFolderId?: string | null;
      metadata?: Record<string, unknown>;
      color?: string;
    }
  >({
    mutationFn: updateFolder,
    onSuccess: (data) => {
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ["folders", data.id] });
        queryClient.invalidateQueries({
          queryKey: ["projects"],
          predicate: (query) =>
            query.queryKey[0] === "projects" && (query.queryKey[2] === "files" || query.queryKey[2] === "folders")
        });
      }
    },
  });
};

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();
  return useMutation<
    DeleteFolderSuccess["data"],
    unknown,
    { folderId: string; force?: boolean }
  >({
    mutationFn: ({ folderId, force }) => deleteFolder(folderId, force),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
        predicate: (query) =>
          query.queryKey[0] === "projects" && (query.queryKey[2] === "files" || query.queryKey[2] === "folders")
      });
    },
  });
};

export const useFolderContents = (
  folderId: string,
  options?: UseQueryOptions<
    {
      folder: FolderResponse;
      parents: FolderResponse[];
      files: FileResponse[];
      folders: SubfolderResponse[];
    },
    unknown
  >
) =>
  useQuery({
    queryKey: ["folders", folderId],
    queryFn: () => getFolder(folderId),
    staleTime: 1000 * 60 * 2, // 2 minutes - folders change less frequently
    ...options,
  });
