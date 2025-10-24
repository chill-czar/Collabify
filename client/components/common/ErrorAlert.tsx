// components/common/ErrorAlert.tsx
import React from "react";
import { AlertCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorAlertProps {
  title?: string;
  message: string;
  type?: "error" | "warning" | "info";
  onRetry?: () => void;
  onDismiss?: () => void;
  fullScreen?: boolean;
}

export function ErrorAlert({
  title,
  message,
  type = "error",
  onRetry,
  onDismiss,
  fullScreen = false,
}: ErrorAlertProps) {
  const config = {
    error: {
      icon: XCircle,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      textColor: "text-red-900",
      buttonColor: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-100",
      textColor: "text-yellow-900",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700",
    },
    info: {
      icon: AlertCircle,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      textColor: "text-blue-900",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const currentConfig = config[type];
  const Icon = currentConfig.icon;

  const alert = (
    <div
      className={`max-w-md w-full ${currentConfig.bgColor} border ${currentConfig.borderColor} rounded-lg shadow-lg p-6`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 ${currentConfig.iconBg} rounded-full flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${currentConfig.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={`text-sm font-semibold ${currentConfig.textColor} mb-1`}>
              {title}
            </h3>
          )}
          <p className={`text-sm ${currentConfig.textColor}`}>{message}</p>
          {(onRetry || onDismiss) && (
            <div className="flex gap-2 mt-4">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className={`inline-flex items-center gap-2 px-3 py-2 ${currentConfig.buttonColor} text-white rounded-md transition-colors text-sm`}
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-4">
        {alert}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[200px] p-4">
      {alert}
    </div>
  );
}
