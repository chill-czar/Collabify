export interface Whiteboard {
    _id: string;
  title: string;
  createdBy: string;
  projectId: string;
  document?: string;
  whiteboard?: string;
  lastEdited?: number;
  isArchived: boolean;
}

export type ViewMode = "document" | "canvas" | "both";
