import React from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { ToastContainerProps } from "../types";

export default function ToastContainer({
  toasts,
  removeToast,
}: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: { id: string; type: "success" | "error" | "info"; message: string };
  onRemove: () => void;
}) {
  const getToastIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <AlertCircle className="w-5 h-5" />;
      case "info":
        return <Info className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border transition-all duration-300 min-w-[300px] max-w-[400px] ${getToastStyles()}`}
    >
      {getToastIcon()}
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button
        onClick={onRemove}
        className="ml-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
