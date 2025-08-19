import React, { useState, MouseEvent } from "react";
import { Check, X } from "lucide-react";
import { InviteNotification } from "@/app/types/notifications";
import { acceptInvite, declineInvite } from "@/lib/notifications/api";

interface NotificationActionsProps {
  notification: InviteNotification;
  onMarkRead: (id: string) => Promise<void>;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

const NotificationActions: React.FC<NotificationActionsProps> = ({
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
      await acceptInvite(notification.id, notification.invite);
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
      await declineInvite(notification.id, notification.invite);
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
      <div className="space-y-2">
        <p className="text-xs text-gray-500">
          Invite ID: {notification.invite.id}
        </p>
        <p className="text-xs text-gray-500">
          Status:{" "}
          <span className="font-medium capitalize">
            {notification.invite.status}
          </span>
        </p>
      </div>
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

export default NotificationActions;
