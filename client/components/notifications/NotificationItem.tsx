import React, { ReactElement } from "react";
import { Users, MessageCircle, Bell } from "lucide-react";
import {
  Notification,
  InviteNotification,
  MessageNotification,
  UpdateNotification,
  BaseNotification,
} from "@/app/types/notifications";
import { getRelativeTime } from "@/lib/notifications/utils";
import NotificationActions from "./NotificationActions";

interface NotificationItemProps {
  notification: Notification;
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

// MessageNotification Component
const MessageNotificationContent: React.FC<MessageNotificationProps> = ({
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
const UpdateNotificationContent: React.FC<UpdateNotificationProps> = ({
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
          <NotificationActions
            notification={notification as InviteNotification}
            onMarkRead={onMarkRead}
            onAccept={onAccept}
            onDecline={onDecline}
          />
        );
      case "message":
        return (
          <MessageNotificationContent
            notification={notification as MessageNotification}
          />
        );
      case "update":
        return (
          <UpdateNotificationContent
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

export default NotificationItem;
