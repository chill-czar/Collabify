"use client";

import React, { useState, useEffect, MouseEvent, ReactElement } from "react";
import {
  Users,
  MessageCircle,
  Bell,
  Check,
  X,
  Filter,
  RotateCcw,
} from "lucide-react";
import api from "@/lib/axios";

// TypeScript interfaces
interface Project {
  id: string;
  name: string;
}

interface BaseNotification {
  id: string;
  content: string;
  read: boolean;
  createdAt: string;
  project?: Project;
}

interface InviteNotification extends BaseNotification {
  type: "invite";
  inviteId: string;
}

interface MessageNotification extends BaseNotification {
  type: "message";
}

interface UpdateNotification extends BaseNotification {
  type: "update";
}

type Notification =
  | InviteNotification
  | MessageNotification
  | UpdateNotification;

type NotificationType = "invite" | "message" | "update";
type FilterType = "all" | "unread";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => Promise<void>;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

interface InviteNotificationProps {
  notification: InviteNotification;
  onMarkRead: (id: string) => Promise<void>;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

interface MessageNotificationProps {
  notification: MessageNotification;
}

interface UpdateNotificationProps {
  notification: UpdateNotification;
}

interface NotificationListProps {
  notifications: Notification[];
  onMarkRead: (id: string) => Promise<void>;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

// Mock data with proper typing
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "invite",
    content: 'You have been invited to join the "Mobile App Redesign" project',
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    inviteId: "inv-1",
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
    content: 'You have been invited to join the "E-commerce Platform" project',
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    inviteId: "inv-2",
    project: { id: "proj-4", name: "E-commerce Platform" },
  },
];

// Utility function for relative timestamps
const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

// Typed API calls for Next.js
const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    // Replace with actual Next.js API route
    // const response = await fetch('/api/notifications');
    // const data: ApiResponse<Notification[]> = await response.json();
    // if (!data.success) throw new Error(data.error);
    // return data.data || [];
    const response = await api.get<Notification[]>("/users/notifications");
    const notifications: Notification[] = response.data;



    // Mock implementation
    return notifications
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

const markAsRead = async (id: string): Promise<ApiResponse<null>> => {
  try {
    // Replace with actual Next.js API route
    // const response = await fetch(`/api/notifications/${id}/read`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' }
    // });
    // return await response.json();

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 200);
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

const acceptInvite = async (inviteId: string): Promise<ApiResponse<null>> => {
  try {
    // Replace with actual Next.js API route
    // const response = await fetch('/api/project-invite/accept', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ inviteId })
    // });
    // return await response.json();

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 300);
    });
  } catch (error) {
    console.error("Error accepting invite:", error);
    throw error;
  }
};

const declineInvite = async (inviteId: string): Promise<ApiResponse<null>> => {
  try {
    // Replace with actual Next.js API route
    // const response = await fetch('/api/project-invite/decline', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ inviteId })
    // });
    // return await response.json();

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 300);
    });
  } catch (error) {
    console.error("Error declining invite:", error);
    throw error;
  }
};

// InviteNotification Component
const InviteNotification: React.FC<InviteNotificationProps> = ({
  notification,
  onMarkRead,
  onAccept,
  onDecline,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<"accepted" | "declined" | null>(null);

  const handleAccept = async (
    e: MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.stopPropagation();
    setLoading(true);
    try {
      await acceptInvite(notification.inviteId);
      await onMarkRead(notification.id);
      setStatus("accepted");
      onAccept(notification.id);
    } catch (error) {
      console.error("Failed to accept invite:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async (
    e: MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.stopPropagation();
    setLoading(true);
    try {
      await declineInvite(notification.inviteId);
      await onMarkRead(notification.id);
      setStatus("declined");
      onDecline(notification.id);
    } catch (error) {
      console.error("Failed to decline invite:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "accepted") {
    return (
      <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
        <div className="flex items-center">
          <Check className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-green-800 font-medium">
            Invite accepted! You&apos;ve joined {notification.project?.name}
          </span>
        </div>
      </div>
    );
  }

  if (status === "declined") {
    return (
      <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-lg opacity-75">
        <div className="flex items-center">
          <X className="w-5 h-5 text-gray-600 mr-2" />
          <span className="text-gray-600">Invite declined</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-gray-900">{notification.content}</p>
      <p className="text-sm text-gray-600">
        Project:{" "}
        <span className="font-medium">{notification.project?.name}</span>
      </p>
      <div className="flex space-x-3">
        <button
          onClick={handleAccept}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Accepting..." : "Accept"}
        </button>
        <button
          onClick={handleDecline}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Declining..." : "Decline"}
        </button>
      </div>
    </div>
  );
};

// MessageNotification Component
const MessageNotification: React.FC<MessageNotificationProps> = ({
  notification,
}) => {
  return (
    <div className="space-y-2">
      <p className="text-gray-900">{notification.content}</p>
      {notification.project && (
        <p className="text-sm text-gray-600">
          Project:{" "}
          <span className="font-medium">{notification.project.name}</span>
        </p>
      )}
    </div>
  );
};

// UpdateNotification Component
const UpdateNotification: React.FC<UpdateNotificationProps> = ({
  notification,
}) => {
  return (
    <div className="space-y-2">
      <p className="text-gray-900">{notification.content}</p>
      {notification.project && (
        <p className="text-sm text-gray-600">
          Project:{" "}
          <span className="font-medium">{notification.project.name}</span>
        </p>
      )}
    </div>
  );
};

// NotificationItem Component
const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkRead,
  onAccept,
  onDecline,
}) => {
  const handleClick = async (): Promise<void> => {
    if (!notification.read && notification.type !== "invite") {
      await onMarkRead(notification.id);
    }
  };

  const getIcon = (): ReactElement => {
    switch (notification.type) {
      case "invite":
        return <Users className="w-5 h-5" />;
      case "message":
        return <MessageCircle className="w-5 h-5" />;
      case "update":
        return <Bell className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const renderContent = (): ReactElement => {
    switch (notification.type) {
      case "invite":
        return (
          <InviteNotification
            notification={notification as InviteNotification}
            onMarkRead={onMarkRead}
            onAccept={onAccept}
            onDecline={onDecline}
          />
        );
      case "message":
        return (
          <MessageNotification
            notification={notification as MessageNotification}
          />
        );
      case "update":
        return (
          <UpdateNotification
            notification={notification as UpdateNotification}
          />
        );
      default:
        // This should never happen, but we need to satisfy TypeScript
        const fallbackNotification = notification as BaseNotification;
        return <div>{fallbackNotification.content}</div>;
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-sm cursor-pointer bg-white ${
        notification.read ? "border-gray-200" : "border-gray-200"
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          <div
            className={`p-2 rounded-full ${
              notification.type === "invite"
                ? "bg-blue-100 text-blue-600"
                : notification.type === "message"
                ? "bg-green-100 text-green-600"
                : "bg-orange-100 text-orange-600"
            }`}
          >
            {getIcon()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded text-white ${
                notification.type === "invite"
                  ? "bg-gray-800"
                  : notification.type === "message"
                  ? "bg-gray-800"
                  : "bg-gray-800"
              }`}
            >
              {notification.type}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {getRelativeTime(notification.createdAt)}
              </span>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// NotificationList Component
const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkRead,
  onAccept,
  onDecline,
}) => {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No notifications
        </h3>
        <p className="text-gray-500">
          You&apos;re all caught up! New notifications will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkRead={onMarkRead}
          onAccept={onAccept}
          onDecline={onDecline}
        />
      ))}
    </div>
  );
};

// Main NotificationPage Component
const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      setError("Failed to load notifications");
      console.error("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string): Promise<void> => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleAccept = (id: string): void => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleDecline = (id: string): void => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleFilterToggle = (): void => {
    setFilter((prev) => (prev === "all" ? "unread" : "all"));
  };

  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-64"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Error loading notifications
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadNotifications}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        {/* <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Collabify Notifications
          </h1>
          <p className="text-gray-600">
            Stay updated with your project invitations and messages
          </p>
        </div> */}

        {/* Filter Controls */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={handleFilterToggle}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 border ${
                    filter === "unread"
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>{filter === "unread" ? "Unread Only" : "All"}</span>
                </button>
              </div>
              <button
                onClick={loadNotifications}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh notifications"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <NotificationList
          notifications={filteredNotifications}
          onMarkRead={handleMarkRead}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      </div>
    </div>
  );
};

export default NotificationPage;
