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

        {/* Grid skeleton - matches exact FileCard/FolderTile dimensions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-1">
          {Array.from({ length: count }, (_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse w-full flex flex-col"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Header Section - Matches FileCard/FolderTile header */}
              <div className="flex items-start justify-between p-2 sm:p-3 pb-1 sm:pb-2 flex-shrink-0">
                <div className="flex-1 min-w-0 pr-1 sm:pr-2">
                  <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md w-3/4"></div>
                </div>
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex-shrink-0"></div>
              </div>

              {/* Main content area - Matches exact FileCard/FolderTile preview/icon height */}
              <div className="mx-2 sm:mx-3 mb-2 sm:mb-3 flex-1 flex items-center justify-center">
                <div className="w-full h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md"></div>
              </div>

              {/* Footer Section - Matches FileCard/FolderTile footer */}
              <div className="px-2 sm:px-3 pb-2 sm:pb-3 flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-2 sm:h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-2/3"></div>
                </div>
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

  // Default card variant - matches exact FileCard/FolderTile structure and dimensions
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse w-full flex flex-col">
      {/* Header Section - Matches FileCard/FolderTile header */}
      <div className="flex items-start justify-between p-2 sm:p-3 pb-1 sm:pb-2 flex-shrink-0">
        <div className="flex-1 min-w-0 pr-1 sm:pr-2">
          <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md w-3/4"></div>
        </div>
        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex-shrink-0"></div>
      </div>

      {/* Main content area - Matches exact FileCard/FolderTile preview/icon height */}
      <div className="mx-2 sm:mx-3 mb-2 sm:mb-3 flex-1 flex items-center justify-center">
        <div className="w-full h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md"></div>
      </div>

      {/* Footer Section - Matches FileCard/FolderTile footer */}
      <div className="px-2 sm:px-3 pb-2 sm:pb-3 flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex-shrink-0"></div>
        <div className="flex-1 min-w-0">
          <div className="h-2 sm:h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-2/3"></div>
        </div>
      </div>

      {/* Loading indicator with message */}
      <div className="flex items-center justify-center mt-2 pt-2 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
          <span className="text-xs font-medium text-gray-500">{message}</span>
        </div>
      </div>
    </div>
  );
};
