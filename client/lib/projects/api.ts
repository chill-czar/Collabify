// lib/projectsApi.ts
import api from "@/lib/axios";
import { Project, ApiResponse } from "@/types/project";

// Mock data
export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete redesign of company website with modern UI/UX",
    projectType: "design",
    visibility: "private",
    startDate: "2024-01-15",
    dueDate: "2024-03-20",
    tags: ["ui/ux", "web", "branding"],
    color: "#3B82F6",
    status: "active",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-02-10T15:30:00Z",
    membersCount: 3,
    progress: 65,
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Native mobile app for iOS and Android platforms",
    projectType: "development",
    visibility: "public",
    startDate: "2024-02-01",
    dueDate: "2024-05-18",
    tags: ["mobile", "react-native", "ios", "android"],
    color: "#10B981",
    status: "active",
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2024-02-15T12:45:00Z",
    membersCount: 5,
    progress: 40,
  },
  {
    id: "3",
    name: "Market Research Analysis",
    description: "Comprehensive market analysis for Q2 product launch",
    projectType: "research",
    visibility: "private",
    startDate: "2024-03-01",
    dueDate: "2024-04-15",
    tags: ["research", "market-analysis", "strategy"],
    color: "#8B5CF6",
    status: "completed",
    createdAt: "2024-03-01T14:20:00Z",
    updatedAt: "2024-03-10T11:15:00Z",
    membersCount: 2,
    progress: 100,
  },
  {
    id: "4",
    name: "Brand Identity Refresh",
    description: "Updated brand guidelines and visual identity system",
    projectType: "design",
    visibility: "public",
    startDate: "2024-01-20",
    dueDate: "2024-02-28",
    tags: ["branding", "design", "guidelines"],
    color: "#F59E0B",
    status: "active",
    createdAt: "2024-01-20T16:30:00Z",
    updatedAt: "2024-02-05T09:20:00Z",
    membersCount: 4,
    progress: 80,
  },
  {
    id: "5",
    name: "E-commerce Platform",
    description: "Full-stack e-commerce solution with payment integration",
    projectType: "development",
    visibility: "private",
    startDate: "2024-02-15",
    dueDate: "2024-06-30",
    tags: ["e-commerce", "full-stack", "payments"],
    color: "#EF4444",
    status: "active",
    createdAt: "2024-02-15T13:45:00Z",
    updatedAt: "2024-03-01T10:30:00Z",
    membersCount: 6,
    progress: 25,
  },
];

// Typed API calls
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await api.get<Project[]>("/projects");
    console.log(response.data)
    return response.data

    // Mock implementation:
    // return new Promise((resolve) => setTimeout(() => resolve(mockProjects), 500));
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const fetchProjectById = async (id: string): Promise<Project> => {
  try {
    const response = await api.get<ApiResponse<Project>>(`/projects/${id}`);
    return response.data.data;

    // Mock:
    // return new Promise((resolve) => setTimeout(() => resolve(mockProjects.find(p => p.id === id)!), 300));
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

    // Mock:
    // return new Promise((resolve) =>
    //   setTimeout(() => resolve({ ...project, id: 'mock-id', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Project), 300)
    // );
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

    // Mock:
    // return new Promise((resolve) =>
    //   setTimeout(() => resolve({ ...project, id, updatedAt: new Date().toISOString() } as Project), 300)
    // );
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    await api.delete(`/projects/${id}`);

    // Mock:
    // return new Promise((resolve) => setTimeout(() => resolve(), 300));
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
