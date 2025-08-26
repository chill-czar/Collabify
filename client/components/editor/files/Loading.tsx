// components/common/Loading.tsx
import React from "react";

interface LoadingProps {
  message?: string;
  variant?: "card" | "sidebar" | "grid";
  count?: number;
}

export const Loading: React.FC<LoadingProps> = ({
  message = "Loading...",
  variant = "card",
  count = 1,
}) => {
  if (variant === "grid") {
    return (
      <div className="w-full">
        {/* Loading message */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-gray-600">{message}</span>
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-1">
          {Array.from({ length: count }, (_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse shadow-sm hover:shadow-md transition-shadow duration-200"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Main content area */}
              <div className="h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg mb-4"></div>

              {/* Title */}
              <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md mb-3"></div>

              {/* Bottom row */}
              <div className="flex justify-between items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full"></div>
                <div className="h-3 w-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        {/* Header section */}
        <div className="space-y-3">
          <div className="h-7 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg w-3/4"></div>
          <div className="h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl"></div>
        </div>

        {/* Content lines */}
        <div className="space-y-3">
          <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md"></div>
          <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md w-4/5"></div>
          <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md w-3/5"></div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-3 pt-4">
          <div className="h-9 w-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg"></div>
          <div className="h-9 w-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse shadow-sm hover:shadow-md transition-shadow duration-200 w-full max-w-sm">
      {/* Main content area */}
      <div className="h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg mb-4"></div>

      {/* Title */}
      <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md mb-3"></div>

      {/* Bottom row */}
      <div className="flex justify-between items-center">
        <div className="w-8 h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full"></div>
        <div className="h-3 w-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full"></div>
      </div>

      {/* Loading indicator with message */}
      <div className="flex items-center justify-center mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
          <span className="text-xs font-medium text-gray-500">{message}</span>
        </div>
      </div>
    </div>
  );
};
