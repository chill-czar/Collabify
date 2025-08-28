"use client";

import Activity from "@/components/projects/Activity";
import Members from "@/components/projects/Members";
import Overview from "@/components/projects/Overview";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
interface ProjectPageProps {
  params: {
    projectId: string;
  };
}
export default  function ProjectDetailPage({ params }: ProjectPageProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "members" | "activity"
  >("overview");
  const para = useParams()
  const { projectId } =  para

  // Mock data
  const project = {
    name: "Website Redesign",
    status: "active",
    createdDate: "1/15/2024",
    updatedDate: "1/20/2024",
    progress: 65,
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "members":
        return <Members />;
      case "activity":
        return <Activity />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className=" mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-black">
              {project.name}
            </h1>
            <span className="px-2 py-1 text-xs font-medium bg-black text-white rounded">
              {project.status}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/dashboard/projects/${projectId}/editor`}>
              <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Open Editor
              </button>
            </Link>
            <button className="px-4 py-2 border border-gray-300 text-black rounded hover:bg-gray-50 transition-colors flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </button>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Created {project.createdDate}
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Updated {project.updatedDate}
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-black">
              Project Progress
            </span>
            <span className="text-sm font-medium text-black">
              {project.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-black h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="relative mb-8">
          {/* Tabs Container */}
          <div className="border-b-2 border-black relative overflow-x-auto">
            <nav className="flex min-w-max sm:min-w-0">
              {[
                { id: "overview", label: "Overview", count: null },
                { id: "members", label: "Members", count: "12" },
                { id: "activity", label: "Activity", count: null },
              ].map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id as "overview" | "members" | "activity")
                  }
                  className={`group relative px-8 py-4 font-medium text-lg transition-all duration-200 ease-out whitespace-nowrap
                    ${
                      activeTab === tab.id
                        ? "text-black"
                        : "text-gray-400 hover:text-gray-700"
                    }
                    ${index !== 2 ? "border-r border-gray-300" : ""}
                  `}
                >
                  {/* Tab Content */}
                  <div className="flex items-center gap-2 relative z-10">
                    <span
                      className={`transition-all duration-200 ${
                        activeTab === tab.id
                          ? "font-bold tracking-tight"
                          : "font-normal"
                      }`}
                    >
                      {tab.label}
                    </span>
                    {tab.count && (
                      <span
                        className={`text-xs px-2 py-1 rounded transition-all duration-200 ${
                          activeTab === tab.id
                            ? "bg-black text-white"
                            : "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </div>

                  {/* Hover Effect */}
                  <div
                    className={`absolute inset-0 bg-gray-50 transition-all duration-200 ease-out ${
                      activeTab === tab.id
                        ? "opacity-0"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  />

                  {/* Active Tab Indicator */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-black transition-all duration-300 ease-out ${
                      activeTab === tab.id
                        ? "opacity-100 transform scale-x-100"
                        : "opacity-0 transform scale-x-0"
                    }`}
                  />

                  {/* Active Tab Background */}
                  <div
                    className={`absolute inset-0 bg-white border-l-2 border-r-2 border-t-2 border-black transition-all duration-200 ${
                      activeTab === tab.id ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      borderBottomColor: "white",
                      borderBottomWidth: "2px",
                    }}
                  />
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content Container */}
        <div className="relative bg-white border-2 border-black min-h-[500px] overflow-hidden">
          {/* Content Area with Animation */}
          <div
            key={activeTab}
            className="animate-fadeIn"
            style={{
              animation: "fadeInSlide 0.3s ease-out forwards",
            }}
          >
            {renderTabContent()}
          </div>

          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-8 h-8 bg-black clip-triangle" />
        </div>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes fadeInSlide {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeInSlide 0.3s ease-out forwards;
          }
          .clip-triangle {
            clip-path: polygon(100% 0%, 0% 100%, 100% 100%);
          }
        `}</style>
      </div>
    </div>
  );
}
