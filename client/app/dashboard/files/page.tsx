"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Image,
  Video,
  File as FileIcon,
  MoreHorizontal,
  Search,
  Upload,
  Star,
  Trash2,
  Download,
  Edit,
  Move,
  ChevronDown,
  FolderOpen,
  Calendar,
  HardDrive,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

// Mock data types
interface FileItem {
  id: string;
  name: string;
  type: "document" | "image" | "video" | "other";
  extension: string;
  project: string;
  projectColor: string;
  size: string;
  lastModified: string;
  isStarred: boolean;
  isDeleted: boolean;
  deletedOn?: string;
}

// Mock files data
const mockFiles: FileItem[] = [
  {
    id: "1",
    name: "Project Requirements.pdf",
    type: "document",
    extension: "pdf",
    project: "Marketing Campaign",
    projectColor: "bg-blue-100 text-blue-800",
    size: "2.4 MB",
    lastModified: "2 hours ago",
    isStarred: true,
    isDeleted: false,
  },
  {
    id: "2",
    name: "Hero Banner.jpg",
    type: "image",
    extension: "jpg",
    project: "Website Redesign",
    projectColor: "bg-green-100 text-green-800",
    size: "5.7 MB",
    lastModified: "1 day ago",
    isStarred: false,
    isDeleted: false,
  },
  {
    id: "3",
    name: "Demo Video.mp4",
    type: "video",
    extension: "mp4",
    project: "Product Launch",
    projectColor: "bg-purple-100 text-purple-800",
    size: "127 MB",
    lastModified: "3 days ago",
    isStarred: true,
    isDeleted: false,
  },
  {
    id: "4",
    name: "Database Schema.sql",
    type: "other",
    extension: "sql",
    project: "Backend API",
    projectColor: "bg-orange-100 text-orange-800",
    size: "15 KB",
    lastModified: "1 week ago",
    isStarred: false,
    isDeleted: false,
  },
  {
    id: "5",
    name: "User Research.docx",
    type: "document",
    extension: "docx",
    project: "UX Research",
    projectColor: "bg-pink-100 text-pink-800",
    size: "890 KB",
    lastModified: "2 weeks ago",
    isStarred: true,
    isDeleted: false,
  },
  {
    id: "6",
    name: "Logo Variations.png",
    type: "image",
    extension: "png",
    project: "Brand Identity",
    projectColor: "bg-indigo-100 text-indigo-800",
    size: "3.2 MB",
    lastModified: "5 days ago",
    isStarred: false,
    isDeleted: false,
  },
  {
    id: "7",
    name: "Meeting Notes.txt",
    type: "document",
    extension: "txt",
    project: "Marketing Campaign",
    projectColor: "bg-blue-100 text-blue-800",
    size: "12 KB",
    lastModified: "1 day ago",
    isStarred: false,
    isDeleted: false,
  },
  {
    id: "8",
    name: "Wireframes.fig",
    type: "other",
    extension: "fig",
    project: "Website Redesign",
    projectColor: "bg-green-100 text-green-800",
    size: "45 MB",
    lastModified: "4 days ago",
    isStarred: true,
    isDeleted: false,
  },
  {
    id: "9",
    name: "Old Presentation.pptx",
    type: "document",
    extension: "pptx",
    project: "Product Launch",
    projectColor: "bg-purple-100 text-purple-800",
    size: "8.9 MB",
    lastModified: "1 month ago",
    isStarred: false,
    isDeleted: true,
    deletedOn: "2 days ago",
  },
  {
    id: "10",
    name: "Backup Data.zip",
    type: "other",
    extension: "zip",
    project: "Backend API",
    projectColor: "bg-orange-100 text-orange-800",
    size: "234 MB",
    lastModified: "2 weeks ago",
    isStarred: false,
    isDeleted: true,
    deletedOn: "1 week ago",
  },
  {
    id: "11",
    name: "Style Guide.pdf",
    type: "document",
    extension: "pdf",
    project: "Brand Identity",
    projectColor: "bg-indigo-100 text-indigo-800",
    size: "1.8 MB",
    lastModified: "6 days ago",
    isStarred: true,
    isDeleted: false,
  },
  {
    id: "12",
    name: "Screenshot.png",
    type: "image",
    extension: "png",
    project: "UX Research",
    projectColor: "bg-pink-100 text-pink-800",
    size: "456 KB",
    lastModified: "3 hours ago",
    isStarred: false,
    isDeleted: false,
  },
];

// File type icon component
const FileTypeIcon = ({
  type,
  extension,
}: {
  type: string;
  extension: string;
}) => {
  const iconProps = { className: "h-4 w-4" };

  switch (type) {
    case "document":
      return <FileText {...iconProps} />;
    case "image":
      return <Image {...iconProps} />;
    case "video":
      return <Video {...iconProps} />;
    default:
      return <FileIcon {...iconProps} />;
  }
};

// Empty state component
const EmptyState = ({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <Icon className="h-12 w-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 max-w-sm">{description}</p>
  </div>
);

export default function FilesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [activeTab, setActiveTab] = useState("all");

  // Filter and sort logic
  const activeFiles = mockFiles.filter((file) => !file.isDeleted);
  const starredFiles = activeFiles.filter((file) => file.isStarred);
  const recentFiles = activeFiles.slice(0, 6);
  const trashedFiles = mockFiles.filter((file) => file.isDeleted);

  // Group files by project
  const filesByProject = activeFiles.reduce(
    (acc, file) => {
      if (!acc[file.project]) {
        acc[file.project] = {
          files: [],
          color: file.projectColor,
        };
      }
      acc[file.project].files.push(file);
      return acc;
    },
    {} as Record<string, { files: FileItem[]; color: string }>
  );

  const handleAction = (action: string, fileId: string) => {
    console.log(`${action} file with ID: ${fileId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Files</h1>
              <p className="text-gray-600 mt-1">
                Manage all your files across projects in one place.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search files…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy("name")}>
                    Name
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("size")}>
                    Size
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("date")}>
                    Date
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("type")}>
                    Type
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Files</TabsTrigger>
            <TabsTrigger value="project">By Project</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="starred">Starred</TabsTrigger>
            <TabsTrigger value="trash">Trash</TabsTrigger>
          </TabsList>

          {/* All Files Tab */}
          <TabsContent value="all" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeFiles.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <FileTypeIcon
                              type={file.type}
                              extension={file.extension}
                            />
                            <span>{file.name}</span>
                            {file.isStarred && (
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={file.projectColor}
                          >
                            {file.project}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {file.size}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {file.lastModified}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleAction("download", file.id)
                                }
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleAction("rename", file.id)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleAction("move", file.id)}
                              >
                                <Move className="mr-2 h-4 w-4" />
                                Move
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleAction("star", file.id)}
                              >
                                <Star className="mr-2 h-4 w-4" />
                                {file.isStarred ? "Unstar" : "Star"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleAction("delete", file.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* By Project Tab */}
          <TabsContent value="project" className="mt-6">
            <div className="space-y-4">
              {Object.entries(filesByProject).map(
                ([projectName, projectData]) => (
                  <Card key={projectName}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FolderOpen className="h-5 w-5" />
                          {projectName}
                        </CardTitle>
                        <Badge variant="outline">
                          {projectData.files.length} files
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {projectData.files.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              <FileTypeIcon
                                type={file.type}
                                extension={file.extension}
                              />
                              <span className="font-medium">{file.name}</span>
                              {file.isStarred && (
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-gray-500">
                                {file.size}
                              </span>
                              <span className="text-sm text-gray-500">
                                {file.lastModified}
                              </span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleAction("download", file.id)
                                    }
                                  >
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleAction("rename", file.id)
                                    }
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Rename
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleAction("move", file.id)
                                    }
                                  >
                                    <Move className="mr-2 h-4 w-4" />
                                    Move
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleAction("star", file.id)
                                    }
                                  >
                                    <Star className="mr-2 h-4 w-4" />
                                    {file.isStarred ? "Unstar" : "Star"}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleAction("delete", file.id)
                                    }
                                    className="text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </TabsContent>

          {/* Recent Tab */}
          <TabsContent value="recent" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentFiles.map((file) => (
                <Card
                  key={file.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-gray-100 rounded">
                        <FileTypeIcon
                          type={file.type}
                          extension={file.extension}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <Badge
                          variant="secondary"
                          className={`${file.projectColor} text-xs`}
                        >
                          {file.project}
                        </Badge>
                      </div>
                      {file.isStarred && (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{file.size}</span>
                      <span>{file.lastModified}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Starred Tab */}
          <TabsContent value="starred" className="mt-6">
            {starredFiles.length === 0 ? (
              <Card>
                <CardContent>
                  <EmptyState
                    title="No starred files"
                    description="Star important files to find them quickly here."
                    icon={Star}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {starredFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-4 border border-yellow-200 bg-yellow-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <FileTypeIcon
                            type={file.type}
                            extension={file.extension}
                          />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant="secondary"
                                className={`${file.projectColor} text-xs`}
                              >
                                {file.project}
                              </Badge>
                              <span className="text-sm text-gray-500">•</span>
                              <span className="text-sm text-gray-500">
                                {file.size}
                              </span>
                              <span className="text-sm text-gray-500">•</span>
                              <span className="text-sm text-gray-500">
                                {file.lastModified}
                              </span>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleAction("download", file.id)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction("rename", file.id)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction("move", file.id)}
                            >
                              <Move className="mr-2 h-4 w-4" />
                              Move
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction("star", file.id)}
                            >
                              <Star className="mr-2 h-4 w-4" />
                              Unstar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleAction("delete", file.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Trash Tab */}
          <TabsContent value="trash" className="mt-6">
            {trashedFiles.length === 0 ? (
              <Card>
                <CardContent>
                  <EmptyState
                    title="Trash is empty"
                    description="Deleted files will appear here for recovery."
                    icon={Trash2}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File Name</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Deleted On</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trashedFiles.map((file) => (
                        <TableRow key={file.id} className="opacity-75">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <FileTypeIcon
                                type={file.type}
                                extension={file.extension}
                              />
                              <span>{file.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={file.projectColor}
                            >
                              {file.project}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {file.size}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {file.deletedOn}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAction("restore", file.id)}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleAction("permanent-delete", file.id)
                                }
                                className="text-red-600 hover:text-red-700"
                              >
                                <AlertCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
