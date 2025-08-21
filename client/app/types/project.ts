// types/project.ts
export interface Project {
  id: string;
  name: string;
  description?: string;
  projectType: "design" | "development" | "research" | "marketing" | "other";
  visibility: "public" | "private";
  startDate: string;
  dueDate?: string;
  tags: string[];
  color: string;
  status: "active" | "completed" | "paused" | "cancelled";
  createdAt: string;
  updatedAt: string;
  membersCount?: number;
  progress?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface FilterState {
  searchQuery: string;
  selectedType: string;
  selectedVisibility: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
