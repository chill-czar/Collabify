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
 * Get all files for the current user across all projects
 */
export const getAllFilesForUser = async (): Promise<FileResponse[]> => {
  try {
    const res = await apiClient.get<{ success: boolean; data: FileResponse[] }>(
      "/files/bulk"
    );
    if (!res.success) throw new Error("Failed to fetch all files");
    return res.data;
  } catch (error) {
    console.error("Error fetching all user files:", error);
    throw error;
  }
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

export const useUploadFile = (
  projectId: string,
  parentId?: string | null
): UseMutationResult<UploadFileResponse, Error, UploadFileRequest> => {
  const queryClient = useQueryClient();

  return useMutation<UploadFileResponse, Error, UploadFileRequest>({
    mutationFn: (payload: UploadFileRequest) => uploadFile(payload),
    onSuccess: (data) => {
      // Invalidate specific project/folder files query
      queryClient.invalidateQueries({
        queryKey: ["files", projectId, parentId ?? null],
      });
      // Invalidate the specific folder if uploading inside one
      if (parentId) {
        queryClient.invalidateQueries({
          queryKey: ["folders", parentId],
        });
      }
    },
  });
};

export const useFiles = (
  projectId: string,
  folderId?: string | null,
  options?: UseQueryOptions<GetProjectFilesResponse["data"], unknown>
) =>
  useQuery({
    queryKey: ["files", projectId, folderId ?? null],
    queryFn: () => listFiles({ projectId, folderId }),
    staleTime: 1000 * 60, // 1 min - files change frequently
    ...options,
  });

export const useAllUserFiles = (
  options?: UseQueryOptions<FileResponse[], unknown>
) =>
  useQuery({
    queryKey: ["files", "all"],
    queryFn: getAllFilesForUser,
    staleTime: 1000 * 60, // 1 min - files change frequently
    ...options,
  });

export const useFile = (
  fileId: string,
  options?: UseQueryOptions<GetFileResponse["data"]["file"], unknown>
) =>
  useQuery({
    queryKey: ["files", fileId],
    queryFn: () => getFile(fileId),
    staleTime: 1000 * 60, // 1 min - file details change frequently
    ...options,
  });

export const useUpdateFile = (
  projectId?: string,
  folderId?: string | null,
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
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["files", variables.id] });

      // Snapshot previous value
      const previousFile = queryClient.getQueryData(["files", variables.id]);

      // Optimistically update to the new value
      if (previousFile) {
        queryClient.setQueryData(["files", variables.id], (old: any) => ({
          ...old,
          ...variables,
        }));
      }

      // Return context with snapshot
      return { previousFile };
    },
    onError: (err, variables, context) => {
      // Rollback to previous value on error
      if (context?.previousFile) {
        queryClient.setQueryData(["files", variables.id], context.previousFile);
      }
      // Call custom onError if provided
      options?.onError?.(err, variables, context);
    },
    onSettled: (data) => {
      if (data?.id) {
        // Invalidate specific file
        queryClient.invalidateQueries({
          queryKey: ["files", data.id],
        });
        // Invalidate specific project/folder list if known
        if (projectId) {
          queryClient.invalidateQueries({
            queryKey: ["files", projectId, folderId ?? null],
          });
        } else {
          // Fallback to broader invalidation
          queryClient.invalidateQueries({
            queryKey: ["files"],
          });
        }
      }
    },
    ...options,
  });
};

export const useDeleteFile = (projectId?: string, folderId?: string | null) => {
  const queryClient = useQueryClient();
  return useMutation<
    { success: true; message: string },
    unknown,
    string // variables = fileId
  >({
    mutationFn: deleteFile,
    onMutate: async (fileId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["files"] });

      // Snapshot previous values
      const previousFile = queryClient.getQueryData(["files", fileId]);
      const previousList = projectId
        ? queryClient.getQueryData(["files", projectId, folderId ?? null])
        : null;

      // Optimistically remove from list
      if (previousList && projectId) {
        queryClient.setQueryData(
          ["files", projectId, folderId ?? null],
          (old: any) => {
            if (Array.isArray(old)) {
              return old.filter((file: any) => file.id !== fileId);
            }
            return old;
          }
        );
      }

      return { previousFile, previousList };
    },
    onError: (err, fileId, context) => {
      // Rollback on error
      if (context?.previousFile) {
        queryClient.setQueryData(["files", fileId], context.previousFile);
      }
      if (context?.previousList && projectId) {
        queryClient.setQueryData(
          ["files", projectId, folderId ?? null],
          context.previousList
        );
      }
    },
    onSettled: (_, __, fileId) => {
      // Remove specific file from cache
      queryClient.removeQueries({ queryKey: ["files", fileId] });
      // Invalidate specific project/folder list if known
      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: ["files", projectId, folderId ?? null],
        });
      } else {
        // Fallback to broader invalidation
        queryClient.invalidateQueries({ queryKey: ["files"] });
      }
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
        queryKey: ["folders", projectId, parentId ?? null],
      });
      queryClient.invalidateQueries({
        queryKey: ["files", projectId, parentId ?? null],
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
    staleTime: 1000 * 60 * 2, // 2 min - folders are more static
    ...options,
  });

export const useUpdateFolder = (projectId?: string, parentFolderId?: string | null) => {
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
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["folders", variables.id] });

      // Snapshot previous value
      const previousFolder = queryClient.getQueryData(["folders", variables.id]);

      // Optimistically update to the new value
      if (previousFolder) {
        queryClient.setQueryData(["folders", variables.id], (old: any) => ({
          ...old,
          ...variables,
        }));
      }

      return { previousFolder };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousFolder) {
        queryClient.setQueryData(["folders", variables.id], context.previousFolder);
      }
    },
    onSettled: (data) => {
      if (data?.id) {
        // Invalidate specific folder
        queryClient.invalidateQueries({ queryKey: ["folders", data.id] });
        // Invalidate parent folder's contents
        if (projectId) {
          queryClient.invalidateQueries({
            queryKey: ["folders", projectId, parentFolderId ?? null],
          });
          queryClient.invalidateQueries({
            queryKey: ["files", projectId, parentFolderId ?? null],
          });
        } else {
          // Fallback to broader invalidation
          queryClient.invalidateQueries({ queryKey: ["files"] });
        }
      }
    },
  });
};

export const useDeleteFolder = (projectId?: string, parentFolderId?: string | null) => {
  const queryClient = useQueryClient();
  return useMutation<
    DeleteFolderSuccess["data"],
    unknown,
    { folderId: string; force?: boolean }
  >({
    mutationFn: ({ folderId, force }) => deleteFolder(folderId, force),
    onSuccess: (_, { folderId }) => {
      // Remove specific folder from cache
      queryClient.removeQueries({ queryKey: ["folders", folderId] });
      // Invalidate parent folder's contents
      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: ["folders", projectId, parentFolderId ?? null],
        });
        queryClient.invalidateQueries({
          queryKey: ["files", projectId, parentFolderId ?? null],
        });
      } else {
        // Fallback to broader invalidation
        queryClient.invalidateQueries({ queryKey: ["folders"] });
        queryClient.invalidateQueries({ queryKey: ["files"] });
      }
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
    queryKey: ["folders", folderId, "contents"],
    queryFn: () => getFolder(folderId),
    staleTime: 1000 * 60 * 2, // 2 min - folder contents are relatively static
    ...options,
  });
