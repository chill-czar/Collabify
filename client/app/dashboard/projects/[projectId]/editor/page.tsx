"use client";

import React, { useEffect } from "react";
import {
  FileText,
  PenTool,
  Video,
  Calendar1,
  KanbanSquare,
  MessageSquare,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import WhiteBoard from "@/components/editor/WhiteBoard";
import VideoCall from "@/components/editor/VideoCall";
import Files from "@/components/editor/files/Files";
import { useDispatch, useSelector } from "react-redux";
import { hideHeader } from "@/lib/slices/headerSlice";
import { closeSidebar } from "@/lib/slices/sidebarSlice";
import { RootState } from "@/lib/slices/tabSlice";
import { setActiveTab } from "@/lib/slices/tabSlice";
import Calender from "@/components/editor/Calender";
import NotesLayout from "@/components/editor/notes/NotesLayout";
import Notes from "@/components/editor/notes/Notes";

const Editor = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.tabs.activeTab);

  // Hide header & sidebar when inside editor
  useEffect(() => {
    dispatch(hideHeader());
    dispatch(closeSidebar());
  }, [dispatch]);

  const tabs = [
    { name: "Files", icon: FileText, content: <Files /> },
    {
      name: "Notes",
      icon: PenTool,
      content: (
        <NotesLayout>
          <Notes />
        </NotesLayout>
      ),
    },
    { name: "Board", icon: PenTool, content: <WhiteBoard /> },
    { name: "Meet", icon: Video, content: <VideoCall /> },
    { name: "Flow", icon: KanbanSquare, content: <Calender /> },
    { name: "Calender", icon: Calendar1, content: <Calender /> },
    { name: "Chats", icon: MessageSquare, content: <Calender /> },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden">
      <Tabs
        value={activeTab}
        onValueChange={(val) => dispatch(setActiveTab(val))}
        className="flex flex-col flex-1 h-full w-full overflow-hidden"
      >
        {/* Sticky Tab List */}
        <div className="shrink-0 sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
          <TabsList className="flex gap-5">
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
        </div>

        {/* Full-height Tab Contents */}
        <div className="flex-1 relative overflow-hidden">
          {tabs.map((tab) => (
            <TabsContent
              key={tab.name}
              value={tab.name}
              className="absolute inset-0 w-full h-full overflow-y-auto"
            >
              {tab.content}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default Editor;