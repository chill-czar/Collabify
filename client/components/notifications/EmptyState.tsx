import React from "react";
import { Bell } from "lucide-react";

const EmptyState: React.FC = () => {
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
};

export default EmptyState;
