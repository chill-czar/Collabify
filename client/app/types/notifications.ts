// TypeScript interfaces for notifications
export interface Project {
  id: string;
  name: string;
}

export interface BaseNotification {
  id: string;
  content: string;
  read: boolean;
  createdAt: string;
  project?: Project;
}

export interface Invite {
  id: string;
  projectId: string;
  inviterId: string;
  status: "pending" | "accepted" | "declined";
  expiresAt: string | null;
  acceptedAt: string | null;
}

export interface InviteNotification extends BaseNotification {
  type: "invite";
  invite: Invite;
}

export interface MessageNotification extends BaseNotification {
  type: "message";
}

export interface UpdateNotification extends BaseNotification {
  type: "update";
}

export type Notification =
  | InviteNotification
  | MessageNotification
  | UpdateNotification;

export type NotificationType = "invite" | "message" | "update";
export type FilterType = "all" | "unread";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
