// app/dashboard/projects/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, AlertCircle, RefreshCw } from "lucide-react";
import { Project, FilterState } from "@/types/project";
import { fetchProjects } from "@/lib/projects/api";
import { FilterBar } from "@/components/projects/FilterBar";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { Spinner } from "@/components/spinner";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/projects/new`);
  };
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
      <div className="h-full w-full flex justify-center items-center bg-white">
        <Spinner size="lg" />
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
            <button
              onClick={handleClick}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-colors cursor-pointer"
            >
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage and collaborate on your team projects
            </p>
          </div>
          <button onClick={handleClick} className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors duration-200 cursor-pointer">
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
