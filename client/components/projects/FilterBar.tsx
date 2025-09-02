"use client";

import { Search, Filter, Eye, EyeOff } from "lucide-react";
import { FilterState } from "@/types/project";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <Card className="bg-white shadow-sm border-0 mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter("searchQuery", e.target.value)}
              className="w-full pl-10 pr-4 h-9 border-0 bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-gray-300"
            />
          </div>

          {/* Desktop Filters */}
          <div className="hidden sm:flex items-center gap-6">
            {/* Project Type Filter */}
            <div className="flex items-center gap-3">
              <Label className="text-xs font-medium text-gray-600 whitespace-nowrap">
                Type
              </Label>
              <div className="flex gap-1">
                {typeOptions.map((type) => (
                  <Button
                    key={type.value}
                    onClick={() => updateFilter("selectedType", type.value)}
                    variant={
                      filters.selectedType === type.value ? "default" : "ghost"
                    }
                    size="sm"
                    className={`inline-flex items-center px-2.5 py-1.5 h-8 text-xs font-medium transition-colors border-0 ${
                      filters.selectedType === type.value
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <span className="mr-1">{type.icon}</span>
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-200"></div>

            {/* Visibility Filter */}
            <div className="flex items-center gap-3">
              <Label className="text-xs font-medium text-gray-600 whitespace-nowrap">
                Visibility
              </Label>
              <div className="flex gap-1">
                {visibilityOptions.map((visibility) => {
                  const IconComponent = visibility.icon;
                  return (
                    <Button
                      key={visibility.value}
                      onClick={() =>
                        updateFilter("selectedVisibility", visibility.value)
                      }
                      variant={
                        filters.selectedVisibility === visibility.value
                          ? "default"
                          : "ghost"
                      }
                      size="sm"
                      className={`inline-flex items-center px-2.5 py-1.5 h-8 text-xs font-medium transition-colors border-0 ${
                        filters.selectedVisibility === visibility.value
                          ? "bg-gray-900 text-white hover:bg-gray-800"
                          : "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <IconComponent className="w-3 h-3 mr-1" />
                      {visibility.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Collapsed Filters */}
          <div className="block sm:hidden">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                <Select
                  value={filters.selectedType}
                  onValueChange={(value) => updateFilter("selectedType", value)}
                >
                  <SelectTrigger className="w-full pl-10 pr-4 h-9 border-0 bg-gray-50 text-gray-900 font-medium focus:bg-white focus:ring-1 focus:ring-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-0 shadow-lg">
                    {typeOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-gray-900 hover:bg-gray-50 focus:bg-gray-50"
                      >
                        {option.icon} {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative flex-1">
                <Eye className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                <Select
                  value={filters.selectedVisibility}
                  onValueChange={(value) =>
                    updateFilter("selectedVisibility", value)
                  }
                >
                  <SelectTrigger className="w-full pl-10 pr-4 h-9 border-0 bg-gray-50 text-gray-900 font-medium focus:bg-white focus:ring-1 focus:ring-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-0 shadow-lg">
                    <SelectItem
                      value="all"
                      className="text-gray-900 hover:bg-gray-50 focus:bg-gray-50"
                    >
                      👁️ All Projects
                    </SelectItem>
                    <SelectItem
                      value="public"
                      className="text-gray-900 hover:bg-gray-50 focus:bg-gray-50"
                    >
                      👁️ Public
                    </SelectItem>
                    <SelectItem
                      value="private"
                      className="text-gray-900 hover:bg-gray-50 focus:bg-gray-50"
                    >
                      🚫 Private
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-700">{resultCount}</span> of{" "}
            <span className="font-medium text-gray-700">{totalCount}</span>{" "}
            projects
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
