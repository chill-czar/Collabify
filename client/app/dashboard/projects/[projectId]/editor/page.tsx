"use client";

import React, { useEffect } from "react";
import { FileText, PenTool, Video, Calendar1 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Notes from "@/components/editor/Notes";
import WhiteBoard from "@/components/editor/WhiteBoard";
import VideoCall from "@/components/editor/VideoCall";
import Files from "@/components/editor/files/Files";
import { useDispatch, useSelector } from "react-redux";
import { hideHeader } from "@/lib/slices/headerSlice";
import { closeSidebar } from "@/lib/slices/sidebarSlice";
import { RootState } from "@/lib/slices/tabSlice";
import { setActiveTab } from "@/lib/slices/tabSlice";
import Calender from "@/components/editor/Calender";

const FileManagerTabs = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.tabs.activeTab);

  // Hide header & sidebar when inside editor
  useEffect(() => {
    dispatch(hideHeader());
    dispatch(closeSidebar());
  }, [dispatch]);

  const tabs = [
    { name: "Files", icon: FileText, content: <Files /> },
    { name: "Notes", icon: PenTool, content: <Notes /> },
    { name: "Whiteboard", icon: PenTool, content: <WhiteBoard /> },
    { name: "Video Call", icon: Video, content: <VideoCall /> },
    { name: "Calender", icon: Calendar1, content: <Calender /> },
  ];

  return (
    <div className="w-full flex flex-col bg-white">
      <Tabs
        value={activeTab}
        onValueChange={(val) => dispatch(setActiveTab(val))}
        className="flex flex-col flex-1"
      >
        {/* Sticky Tab List */}
        <TabsList className="flex gap-5 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.name}
                value={tab.name}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium 
                  data-[state=active]:bg-black data-[state=active]:text-white 
                  data-[state=active]:border-black border-b-2 border-transparent 
                  transition-colors"
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Scrollable Tab Contents */}
        <div className="flex-1 overflow-y-auto">
          {tabs.map((tab) => (
            <TabsContent key={tab.name} value={tab.name} className="min-h-full">
              {tab.content}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default FileManagerTabs;
