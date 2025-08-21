// components/FilterBar.tsx
"use client";

import { Search, Filter, Eye, EyeOff } from "lucide-react";
import { FilterState } from "@/app/types/project";

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  resultCount: number;
  totalCount: number;
}

export function FilterBar({
  filters,
  onFilterChange,
  resultCount,
  totalCount,
}: FilterBarProps) {
  const updateFilter = (key: keyof FilterState, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const typeOptions = [
    { value: "all", label: "All", icon: "📁" },
    { value: "design", label: "Design", icon: "🎨" },
    { value: "development", label: "Dev", icon: "💻" },
    { value: "research", label: "Research", icon: "🔍" },
    { value: "marketing", label: "Marketing", icon: "📈" },
    { value: "other", label: "Other", icon: "⚡" },
  ];

  const visibilityOptions = [
    { value: "all", label: "All Projects", icon: Eye },
    { value: "public", label: "Public", icon: Eye },
    { value: "private", label: "Private", icon: EyeOff },
  ];

  return (
    <div className="bg-white border-2 border-black p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Search Bar */}
        <div className="relative flex-1 lg:max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects..."
            value={filters.searchQuery}
            onChange={(e) => updateFilter("searchQuery", e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 bg-white text-black placeholder-gray-500 focus:border-black focus:outline-none transition-all duration-200 font-medium"
          />
        </div>

        {/* Desktop Filters */}
        <div className="hidden sm:flex flex-col sm:flex-row gap-4 lg:gap-6">
          {/* Project Type Filter */}
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-black mb-2">
              Type
            </label>
            <div className="flex flex-wrap gap-1">
              {typeOptions.map((type) => (
                <button
                  key={type.value}
                  onClick={() => updateFilter("selectedType", type.value)}
                  className={`inline-flex items-center px-3 py-2 text-sm font-bold border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
                    filters.selectedType === type.value
                      ? "bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-white text-black border-gray-300 hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"
                  }`}
                >
                  <span className="mr-1">{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px bg-gray-300 self-stretch mt-6"></div>

          {/* Visibility Filter */}
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-black mb-2">
              Visibility
            </label>
            <div className="flex gap-1">
              {visibilityOptions.map((visibility) => {
                const IconComponent = visibility.icon;
                return (
                  <button
                    key={visibility.value}
                    onClick={() =>
                      updateFilter("selectedVisibility", visibility.value)
                    }
                    className={`inline-flex items-center px-3 py-2 text-sm font-bold border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
                      filters.selectedVisibility === visibility.value
                        ? "bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        : "bg-white text-black border-gray-300 hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-1" />
                    {visibility.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Collapsed Filters */}
        <div className="block sm:hidden mt-4 pt-4 border-t-2 border-gray-200">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
              <select
                value={filters.selectedType}
                onChange={(e) => updateFilter("selectedType", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 bg-white text-black font-bold focus:border-black focus:outline-none appearance-none"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative flex-1">
              <Eye className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
              <select
                value={filters.selectedVisibility}
                onChange={(e) =>
                  updateFilter("selectedVisibility", e.target.value)
                }
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 bg-white text-black font-bold focus:border-black focus:outline-none appearance-none"
              >
                <option value="all">👁️ All Projects</option>
                <option value="public">👁️ Public</option>
                <option value="private">🚫 Private</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-4 pt-4 border-t-2 border-gray-200">
        <p className="text-sm font-bold text-gray-700">
          Showing <span className="text-black">{resultCount}</span> of{" "}
          <span className="text-black">{totalCount}</span> projects
        </p>
      </div>
    </div>
  );
}
