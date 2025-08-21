// app/dashboard/projects/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, AlertCircle, RefreshCw } from "lucide-react";
import { Project, FilterState } from "@/app/types/project";
import { fetchProjects, mockProjects } from "@/lib/projects/api";
import { FilterBar } from "@/components/projects/FilterBar";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    selectedType: "all",
    selectedVisibility: "all",
  });

  // Fetch projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchProjects(); // ✅ await directly
        console.log(data);
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);

        if (err && typeof err === "object" && "message" in err) {
          setError((err as Error).message);
        } else if (typeof err === "string") {
          setError(err);
        } else {
          setError("Failed to load projects. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProjects(); // ✅ call async function inside useEffect
  }, []);

  // Filter and search logic
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search filter
      const matchesSearch =
        filters.searchQuery === "" ||
        project.name
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase()) ||
        project.description
          ?.toLowerCase()
          .includes(filters.searchQuery.toLowerCase()) ||
        project.tags.some((tag) =>
          tag.toLowerCase().includes(filters.searchQuery.toLowerCase())
        );

      // Type filter
      const matchesType =
        filters.selectedType === "all" ||
        project.projectType === filters.selectedType;

      // Visibility filter
      const matchesVisibility =
        filters.selectedVisibility === "all" ||
        project.visibility === filters.selectedVisibility;

      return matchesSearch && matchesType && matchesVisibility;
    });
  }, [projects, filters]);

  // Check if filters are active
  const isFiltered =
    filters.searchQuery !== "" ||
    filters.selectedType !== "all" ||
    filters.selectedVisibility !== "all";

  const handleRetry = () => {
    window.location.reload();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-black">Projects</h1>
              <p className="text-gray-600 mt-1">
                Manage and collaborate on your team projects
              </p>
            </div>
            <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-black text-white font-bold border-2 border-black opacity-50 cursor-not-allowed">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </button>
          </div>

          {/* Loading Skeleton */}
          <div className="bg-white border-2 border-gray-300 p-6 mb-8">
            <div className="animate-pulse">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="h-12 bg-gray-200 rounded lg:max-w-md flex-1"></div>
                <div className="flex gap-4">
                  <div className="h-12 w-32 bg-gray-200 rounded"></div>
                  <div className="h-12 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white border-2 border-gray-300 p-6 animate-pulse"
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded mr-3"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-black">Projects</h1>
              <p className="text-gray-600 mt-1">
                Manage and collaborate on your team projects
              </p>
            </div>
            <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </button>
          </div>

          {/* Error State */}
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-red-100 border-2 border-red-300 p-8 mb-6">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">
              Failed to load projects
            </h3>
            <p className="text-gray-600 text-center mb-8 max-w-md leading-relaxed">
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center px-6 py-3 bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all duration-200 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Projects</h1>
            <p className="text-gray-600 mt-1">
              Manage and collaborate on your team projects
            </p>
          </div>
          <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all duration-200 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </button>
        </div>

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          resultCount={filteredProjects.length}
          totalCount={projects.length}
        />

        {/* Projects Grid */}
        <ProjectsGrid projects={filteredProjects} isFiltered={isFiltered} />
      </div>
    </div>
  );
}
