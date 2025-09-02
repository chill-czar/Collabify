import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Image,
  Archive,
  Calendar,
  Users,
  CheckCircle,
  Clock,
} from "lucide-react";
type FileType = "pdf" | "figma" | "zip" | "sql" | "markdown" | string;

const Overview = () => {
  const projectStats = [
    {
      title: "Total Members",
      value: "12",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Total Files",
      value: "48",
      icon: FileText,
      color: "text-green-600",
    },
    {
      title: "Tasks Completed",
      value: "23/31",
      icon: CheckCircle,
      color: "text-purple-600",
    },
    {
      title: "Last Activity",
      value: "2 hours ago",
      icon: Clock,
      color: "text-orange-600",
    },
  ];

  const recentFiles = [
    {
      name: "Project Requirements.pdf",
      type: "pdf",
      uploadedBy: "Sarah Chen",
      avatar: "/api/placeholder/32/32",
      date: "2 hours ago",
      icon: FileText,
    },
    {
      name: "UI Mockups.fig",
      type: "figma",
      uploadedBy: "John Smith",
      avatar: "/api/placeholder/32/32",
      date: "4 hours ago",
      icon: Image,
    },
    {
      name: "Database Schema.sql",
      type: "sql",
      uploadedBy: "Mike Johnson",
      avatar: "/api/placeholder/32/32",
      date: "1 day ago",
      icon: FileText,
    },
    {
      name: "Assets.zip",
      type: "zip",
      uploadedBy: "Emma Wilson",
      avatar: "/api/placeholder/32/32",
      date: "2 days ago",
      icon: Archive,
    },
    {
      name: "Meeting Notes.md",
      type: "markdown",
      uploadedBy: "David Brown",
      avatar: "/api/placeholder/32/32",
      date: "3 days ago",
      icon: FileText,
    },
  ];

  const recentActivity = [
    {
      user: "Sarah Chen",
      action: "uploaded Project Requirements.pdf",
      time: "2 hours ago",
      avatar: "/api/placeholder/32/32",
    },
    {
      user: "John Smith",
      action: "commented on UI Design Review",
      time: "4 hours ago",
      avatar: "/api/placeholder/32/32",
    },
    {
      user: "Mike Johnson",
      action: "completed Database Setup task",
      time: "6 hours ago",
      avatar: "/api/placeholder/32/32",
    },
    {
      user: "Emma Wilson",
      action: "joined the project",
      time: "1 day ago",
      avatar: "/api/placeholder/32/32",
    },
    {
      user: "David Brown",
      action: "updated project timeline",
      time: "2 days ago",
      avatar: "/api/placeholder/32/32",
    },
  ];

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "figma":
        return <Image className="h-4 w-4 text-purple-500" />;
      case "zip":
        return <Archive className="h-4 w-4 text-yellow-500" />;
      default:
        return <FileText className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Project Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                E-Commerce Platform Redesign
              </CardTitle>
              <CardDescription className="mt-2">
                Complete redesign of the customer-facing e-commerce platform
                with improved UX and performance optimizations.
              </CardDescription>
            </div>
            <Badge
              variant="default"
              className="bg-green-100 text-green-800 hover:bg-green-100"
            >
              In Progress
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Started: Jan 15, 2024
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Due: Apr 30, 2024</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Progress: 74%</span>
            </div>
          </div>
          <Progress value={74} className="h-2" />
        </CardContent>
      </Card>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {projectStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Files Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Files</CardTitle>
            <CardDescription>
              Latest files uploaded to the project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={file.avatar} />
                        <AvatarFallback className="text-xs">
                          {file.uploadedBy.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-500">
                        {file.uploadedBy}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{file.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest project updates and changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.avatar} />
                    <AvatarFallback className="text-xs">
                      {activity.user.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{" "}
                      <span className="text-gray-600">{activity.action}</span>
                    </p>
                    <span className="text-xs text-gray-500">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
