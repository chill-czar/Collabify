// components/common/Loading.tsx
import React from 'react';

interface LoadingProps {
  message?: string;
  variant?: 'card' | 'sidebar' | 'grid';
  count?: number;
}

export const Loading: React.FC<LoadingProps> = ({ 
  message = "Loading...", 
  variant = 'card',
  count = 1
}) => {
  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="bg-white rounded-lg border shadow-sm p-4 animate-pulse">
            <div className="h-20 bg-gray-200 rounded-md mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="flex justify-between items-center">
              <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-20 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 animate-pulse">
      <div className="h-20 bg-gray-200 rounded-md mb-3"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
        <div className="h-3 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};