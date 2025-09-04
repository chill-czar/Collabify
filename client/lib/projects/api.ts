// lib/projectsApi.ts
import api from "@/lib/axios";
import { Project, ApiResponse } from "@/types/project";

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await api.get<Project[]>("/projects");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const fetchProjectById = async (id: string): Promise<Project> => {
  try {
    const response = await api.get<ApiResponse<Project>>(`/projects/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

export const createProject = async (
  project: Partial<Project>
): Promise<Project> => {
  try {
    const response = await api.post<ApiResponse<Project>>("/projects", project);
    return response.data.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const updateProject = async (
  id: string,
  project: Partial<Project>
): Promise<Project> => {
  try {
    const response = await api.put<ApiResponse<Project>>(
      `/projects/${id}`,
      project
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    await api.delete(`/projects/${id}`);
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
