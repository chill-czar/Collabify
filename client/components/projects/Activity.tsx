import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Filter,
  Calendar,
  FileText,
  MessageSquare,
  Users,
  Upload,
  Download,
  Edit,
  Plus,
  Trash,
} from "lucide-react";
type FilterOption =
  | "All Activities"
  | "Files"
  | "Comments"
  | "Tasks"
  | "Members"
  | "Milestones";

const Activity = () => {
  const [selectedFilter, setSelectedFilter] =
    useState<FilterOption>("All Activities");

  const activityData = [
    {
      id: 1,
      user: "Sarah Chen",
      avatar: "/api/placeholder/40/40",
      action: "uploaded",
      target: "Project Requirements.pdf",
      type: "file",
      timestamp: "2 hours ago",
      details:
        "Added comprehensive requirements document with user stories and acceptance criteria",
      icon: Upload,
    },
    {
      id: 2,
      user: "John Smith",
      avatar: "/api/placeholder/40/40",
      action: "commented on",
      target: "UI Design Review",
      type: "comment",
      timestamp: "4 hours ago",
      details:
        "Great work on the color scheme! I think we should consider accessibility improvements.",
      icon: MessageSquare,
    },
    {
      id: 3,
      user: "Mike Johnson",
      avatar: "/api/placeholder/40/40",
      action: "completed task",
      target: "Database Schema Design",
      type: "task",
      timestamp: "6 hours ago",
      details:
        "Finished designing the complete database schema with all relationships",
      icon: Edit,
    },
    {
      id: 4,
      user: "Emma Wilson",
      avatar: "/api/placeholder/40/40",
      action: "joined",
      target: "the project",
      type: "member",
      timestamp: "1 day ago",
      details: "Welcome to the team! Emma has been added as a project viewer.",
      icon: Plus,
    },
    {
      id: 5,
      user: "David Brown",
      avatar: "/api/placeholder/40/40",
      action: "updated",
      target: "project timeline",
      type: "project",
      timestamp: "1 day ago",
      details: "Extended deadline by one week due to scope changes",
      icon: Calendar,
    },
    {
      id: 6,
      user: "Lisa Garcia",
      avatar: "/api/placeholder/40/40",
      action: "downloaded",
      target: "Assets.zip",
      type: "file",
      timestamp: "2 days ago",
      details: "Downloaded project assets for local development setup",
      icon: Download,
    },
    {
      id: 7,
      user: "Alex Kim",
      avatar: "/api/placeholder/40/40",
      action: "created",
      target: "Frontend Development milestone",
      type: "milestone",
      timestamp: "2 days ago",
      details:
        "Added new milestone for frontend development phase with 12 tasks",
      icon: Plus,
    },
    {
      id: 8,
      user: "Rachel Taylor",
      avatar: "/api/placeholder/40/40",
      action: "removed",
      target: "old-design.fig",
      type: "file",
      timestamp: "3 days ago",
      details: "Cleaned up outdated design files to reduce project clutter",
      icon: Trash,
    },
    {
      id: 9,
      user: "Sarah Chen",
      avatar: "/api/placeholder/40/40",
      action: "assigned",
      target: "API Integration task to Mike Johnson",
      type: "task",
      timestamp: "3 days ago",
      details: "Assigned backend API integration work to Mike for next sprint",
      icon: Edit,
    },
    {
      id: 10,
      user: "John Smith",
      avatar: "/api/placeholder/40/40",
      action: "uploaded",
      target: "UI Mockups v2.fig",
      type: "file",
      timestamp: "4 days ago",
      details:
        "Updated UI mockups based on stakeholder feedback from last review",
      icon: Upload,
    },
  ];

  const filterOptions = [
    "All Activities",
    "Files",
    "Comments",
    "Tasks",
    "Members",
    "Milestones",
  ];

  const getActivityIcon = (type: string) => {
    const iconClass = "h-4 w-4";
    switch (type) {
      case "file":
        return <FileText className={`${iconClass} text-blue-500`} />;
      case "comment":
        return <MessageSquare className={`${iconClass} text-green-500`} />;
      case "task":
        return <Edit className={`${iconClass} text-purple-500`} />;
      case "member":
        return <Users className={`${iconClass} text-orange-500`} />;
      case "milestone":
        return <Calendar className={`${iconClass} text-red-500`} />;
      default:
        return <FileText className={`${iconClass} text-gray-500`} />;
    }
  };

  const getActivityBadgeColor = (type: string) => {
    switch (type) {
      case "file":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "comment":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "task":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "member":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "milestone":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };
const filterMap: Record<Exclude<FilterOption, "All Activities">, string> = {
  Files: "file",
  Comments: "comment",
  Tasks: "task",
  Members: "member",
  Milestones: "milestone",
};
const filteredActivities =
  selectedFilter === "All Activities"
    ? activityData
    : activityData.filter((activity) => {
        return (
          activity.type ===
          filterMap[selectedFilter as Exclude<FilterOption, "All Activities">]
        );
    });
  
  
  return (
    <div className="space-y-6">
      {/* Filter/Sort Toolbar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Filter by:</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <span>{selectedFilter}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {filterOptions.map((option) => (
                    <DropdownMenuItem
                      key={option}
                      onClick={() => setSelectedFilter(option as FilterOption)}
                    >
                      {option}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Input type="date" className="w-40" placeholder="Start date" />
              <span className="text-gray-500">to</span>
              <Input type="date" className="w-40" placeholder="End date" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
          <CardDescription>
            {filteredActivities.length} activities • Showing{" "}
            {selectedFilter.toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredActivities.map((activity, index) => (
              <div key={activity.id} className="relative">
                {/* Timeline connector line */}
                {index !== filteredActivities.length - 1 && (
                  <div className="absolute left-5 top-12 w-0.5 h-6 bg-gray-200"></div>
                )}

                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activity.avatar} />
                      <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {activity.user}
                        </span>
                        <span className="text-gray-600">{activity.action}</span>
                        <span className="font-medium text-gray-900">
                          {activity.target}
                        </span>
                        <Badge
                          variant="secondary"
                          className={`${getActivityBadgeColor(activity.type)} text-xs`}
                        >
                          {activity.type}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">
                        {activity.timestamp}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mt-1">
                      {activity.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Load More / Pagination */}
      <div className="flex justify-center">
        <Button variant="outline" className="px-8">
          Load More Activities
        </Button>
      </div>

      {/* Activity Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">
              {activityData.filter((a) => a.type === "file").length}
            </p>
            <p className="text-sm text-gray-600">File Activities</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">
              {activityData.filter((a) => a.type === "comment").length}
            </p>
            <p className="text-sm text-gray-600">Comments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Edit className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">
              {activityData.filter((a) => a.type === "task").length}
            </p>
            <p className="text-sm text-gray-600">Task Updates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">
              {activityData.filter((a) => a.type === "member").length}
            </p>
            <p className="text-sm text-gray-600">Member Changes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Activity;
