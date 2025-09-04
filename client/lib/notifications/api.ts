import api from "@/lib/axios";
import { Notification, ApiResponse, Invite } from "@/types/notifications";


// Typed API calls for Next.js
export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    // Uncomment when your API is ready
    const response = await api.get<Notification[]>("/users/notifications");
    return response.data;

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

  } catch (error) {
    console.error("Error declining invite:", error);
    throw error;
  }
};
