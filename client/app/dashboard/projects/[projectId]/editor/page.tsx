"use client";
import React, { useState } from "react";
import {
  Upload,
  FileText,
  PenTool,
  Video,
  Search,
  Users,
  Share2,
} from "lucide-react";
import Notes from "@/components/editor/Notes";
import WhiteBoard from "@/components/editor/WhiteBoard";
import VideoCall from "@/components/editor/VideoCall";
import Files from "@/components/editor/files/Files";

type FileType = "figma" | "pdf" | "excel" | "image";

interface FileItem {
  name: string;
  size: string;
  author: string;
  date: string;
  type: FileType;
}

const FileManagerTabs = () => {
  const [activeTab, setActiveTab] = useState<string>("Files");

  const tabs = [
    { name: "Files", icon: FileText },
    { name: "Notes", icon: PenTool },
    { name: "Whiteboard", icon: PenTool },
    { name: "Video Call", icon: Video },
  ];

  const files: FileItem[] = [
    {
      name: "Homepage_Design.figma",
      size: "2.4 MB",
      author: "John Doe",
      date: "2024-01-15",
      type: "figma",
    },
    {
      name: "Brand_Guidelines.pdf",
      size: "1.8 MB",
      author: "Jane Smith",
      date: "2024-01-14",
      type: "pdf",
    },
    {
      name: "User_Research.xlsx",
      size: "856 KB",
      author: "Mike Johnson",
      date: "2024-01-13",
      type: "excel",
    },
    {
      name: "Logo_Variations.png",
      size: "1.2 MB",
      author: "Sarah Wilson",
      date: "2024-01-12",
      type: "image",
    },
  ];

  return (
    <div className="w-full mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">
          Website Redesign Project
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>4 members</span>
          </div>
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.name
                  ? "border-black text-white bg-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "Files" && <Files />}
        {activeTab === "Notes" && <Notes />}
        {activeTab === "Whiteboard" && <WhiteBoard />}
        {activeTab === "Video Call" && <VideoCall />}
      </div>
    </div>
  );
};

export default FileManagerTabs;
