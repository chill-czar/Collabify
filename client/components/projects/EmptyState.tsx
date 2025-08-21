// components/EmptyState.tsx
"use client";

import { Search, Plus, FolderOpen } from "lucide-react";

interface EmptyStateProps {
  isFiltered: boolean;
}

export function EmptyState({ isFiltered }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gray-100 border-2 border-gray-300 p-8 mb-6">
        {isFiltered ? (
          <Search className="w-16 h-16 text-gray-400" />
        ) : (
          <FolderOpen className="w-16 h-16 text-gray-400" />
        )}
      </div>

      <h3 className="text-2xl font-bold text-black mb-4">
        {isFiltered ? "No projects found" : "No projects yet"}
      </h3>

      <p className="text-gray-600 text-center mb-8 max-w-md leading-relaxed">
        {isFiltered ? (
          <>
            We couldn't find any projects matching your search criteria.{" "}
            <span className="font-medium">
              Try adjusting your filters or search terms.
            </span>
          </>
        ) : (
          <>
            Get started by creating your first project.{" "}
            <span className="font-medium">
              Collaborate with your team and bring ideas to life.
            </span>
          </>
        )}
      </p>

      {!isFiltered && (
        <button className="inline-flex items-center px-6 py-3 bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all duration-200 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Plus className="w-5 h-5 mr-2" />
          Create Your First Project
        </button>
      )}

      {isFiltered && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-white text-black font-bold border-2 border-black hover:bg-black hover:text-white transition-all duration-200"
          >
            Clear All Filters
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all duration-200">
            <Plus className="w-4 h-4 mr-2" />
            Create New Project
          </button>
        </div>
      )}
    </div>
  );
}
