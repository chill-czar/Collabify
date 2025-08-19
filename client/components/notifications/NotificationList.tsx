import React from "react";
import { Notification } from "@/app/types/notifications";
import NotificationItem from "./NotificationItem";
import EmptyState from "./EmptyState";

interface NotificationListProps {
  notifications: Notification[];
  onMarkRead: (id: string) => Promise<void>;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

// NotificationList Component
const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkRead,
  onAccept,
  onDecline,
}) => {
  if (notifications.length === 0) {
    return <EmptyState />;
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

export default NotificationList;
