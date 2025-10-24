"use client";


export const dynamic = "force-dynamic";
import Activity from "@/components/projects/Activity";
import Members from "@/components/projects/Members";
import Overview from "@/components/projects/Overview";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Edit, Settings, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ProjectPageProps {
  params: {
    projectId: string;
  };
}

export default function ProjectDetailPage({ params }: ProjectPageProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "members" | "activity"
  >("overview");
  const para = useParams();
  const { projectId } = para;

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
    <div className="min-h-screen bg-gray-50/30 p-4 md:p-6">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              {project.name}
            </h1>
            <Badge variant="secondary" className="text-xs">
              {project.status}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/dashboard/projects/${projectId}/editor`}>
              <Button className="bg-gray-900 text-white hover:bg-gray-800">
                <Edit className="w-4 h-4 mr-2" />
                Open Editor
              </Button>
            </Link>
            <Button variant="outline" className="border-gray-200">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Project Metadata */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Created {project.createdDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Updated {project.updatedDate}</span>
          </div>
        </div>
        {/* Tabs Section */}
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "overview" | "members" | "activity")
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 bg-gray-100/50 p-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="members"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2"
            >
              Members
              {/* <Badge variant="secondary" className="text-xs ml-1">
                12
              </Badge> */}
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card className="shadow-sm border-gray-100 min-h-[500px]">
              <CardContent className="p-6">
                <Overview />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="mt-6">
            <Card className="shadow-sm border-gray-100 min-h-[500px]">
              <CardContent className="p-6">
                <Members />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card className="shadow-sm border-gray-100 min-h-[500px]">
              <CardContent className="p-6">
                <Activity />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
