import api from "@/lib/axios";
import { Notification, ApiResponse, Invite } from "@/types/notifications";

// Mock data with proper typing
export const mockNotifications: Notification[] = [
  {
    id: "68a381d7a000cd082926c519",
    type: "invite",
    content: 'You have been invited to join project "Mobile App Redesign".',
    read: false,
    createdAt: "2025-08-18T19:41:11.290Z",
    invite: {
      id: "68a381d7a000cd082926c518",
      projectId: "68a381d6a000cd082926c514",
      inviterId: "68a1daa6b1d17fbf383ac8e0",
      status: "pending",
      expiresAt: null,
      acceptedAt: null,
    },
    project: { id: "proj-1", name: "Mobile App Redesign" },
  },
  {
    id: "2",
    type: "message",
    content: "Sarah commented on your design mockup",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    project: { id: "proj-2", name: "Design System" },
  },
  {
    id: "3",
    type: "update",
    content: 'Project "Website Refresh" has been updated with new requirements',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    project: { id: "proj-3", name: "Website Refresh" },
  },
  {
    id: "4",
    type: "invite",
    content: 'You have been invited to join project "E-commerce Platform".',
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    invite: {
      id: "inv-2",
      projectId: "proj-4",
      inviterId: "user-123",
      status: "pending",
      expiresAt: null,
      acceptedAt: null,
    },
    project: { id: "proj-4", name: "E-commerce Platform" },
  },
];

// Typed API calls for Next.js
export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    // Uncomment when your API is ready
    const response = await api.get<Notification[]>("/users/notifications");
    return response.data;

    // Mock implementation - simulating API delay
    // return new Promise((resolve) => {
    //   setTimeout(() => resolve(mockNotifications), 500);
    // });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const markAsRead = async (id: string): Promise<ApiResponse<null>> => {
  try {
    // Uncomment when your API is ready
    console.log("Notification Id",id)
    const response = await api.post(`/users/notifications/${id}/read`);
    return response.data;

    // Mock implementation
    // return new Promise((resolve) => {
    //   setTimeout(() => resolve({ success: true }), 200);
    // });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

export const acceptInvite = async (
  notificationId: string,
  invite: Invite
): Promise<ApiResponse<null>> => {
  try {
    // Real API call to accept invite
    const response = await api.post("/users/notifications/accept", {
      notificationId,
      inviteId: invite.id,
      projectId: invite.projectId,
      inviterId: invite.inviterId,
    });
    return response.data;

    // Mock implementation - uncomment above and remove this when API is ready
    // console.log("Accepting invite:", { notificationId, invite });
    // return new Promise((resolve) => {
    //   setTimeout(() => resolve({ success: true }), 300);
    // });
  } catch (error) {
    console.error("Error accepting invite:", error);
    throw error;
  }
};

export const declineInvite = async (
  notificationId: string,
  invite: Invite
): Promise<ApiResponse<null>> => {
  try {
    // Real API call to decline invite
    const response = await api.post("/users/notifications/decline", {
      notificationId,
      inviteId: invite.id,
      projectId: invite.projectId,
      inviterId: invite.inviterId,
    });
    return response.data;

    // Mock implementation - uncomment above and remove this when API is ready
    // console.log("Declining invite:", { notificationId, invite });
    // return new Promise((resolve) => {
    //   setTimeout(() => resolve({ success: true }), 300);
    // });
  } catch (error) {
    console.error("Error declining invite:", error);
    throw error;
  }
};
