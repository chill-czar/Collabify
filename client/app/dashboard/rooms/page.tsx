"use client";


export const dynamic = "force-dynamic";
import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Search,
  Filter,
  Plus,
  Play,
  Download,
  Share2,
  MoreHorizontal,
  Copy,
  Edit,
  Trash2,
  Grid3X3,
  List,
  Video,
  VideoOff,
  CirclePlay,
  ExternalLink,
} from "lucide-react";

// Shadcn UI Components (assumed to be installed)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// TypeScript Interfaces
interface Meeting {
  id: string;
  title: string;
  host: {
    name: string;
    avatar: string;
    initials: string;
  };
  status: "upcoming" | "live" | "ended";
  date: string;
  time: string;
  duration: string;
  participantsCount: number;
}

interface Recording {
  id: string;
  title: string;
  thumbnailUrl: string;
  host: {
    name: string;
    avatar: string;
    initials: string;
  };
  duration: string;
  date: string;
  size: string;
}

// Mock Data
const mockMeetings: Meeting[] = [
  {
    id: "1",
    title: "Weekly Team Standup",
    host: { name: "Sarah Johnson", avatar: "", initials: "SJ" },
    status: "upcoming",
    date: "2024-09-03",
    time: "09:00 AM",
    duration: "30 min",
    participantsCount: 8,
  },
  {
    id: "2",
    title: "Product Design Review",
    host: { name: "Mike Chen", avatar: "", initials: "MC" },
    status: "live",
    date: "2024-09-02",
    time: "02:00 PM",
    duration: "60 min",
    participantsCount: 12,
  },
  {
    id: "3",
    title: "Client Presentation",
    host: { name: "Emma Wilson", avatar: "", initials: "EW" },
    status: "upcoming",
    date: "2024-09-04",
    time: "03:30 PM",
    duration: "45 min",
    participantsCount: 5,
  },
  {
    id: "4",
    title: "Q3 Planning Session",
    host: { name: "David Rodriguez", avatar: "", initials: "DR" },
    status: "ended",
    date: "2024-08-30",
    time: "10:00 AM",
    duration: "90 min",
    participantsCount: 15,
  },
  {
    id: "5",
    title: "Engineering Sync",
    host: { name: "Lisa Park", avatar: "", initials: "LP" },
    status: "ended",
    date: "2024-08-29",
    time: "11:00 AM",
    duration: "45 min",
    participantsCount: 6,
  },
];

const mockRecordings: Recording[] = [
  {
    id: "1",
    title: "Product Demo - August 2024",
    thumbnailUrl:
      "https://placehold.co/300x180/4f46e5/ffffff?text=Product+Demo",
    host: { name: "Sarah Johnson", avatar: "", initials: "SJ" },
    duration: "45:32",
    date: "2024-08-28",
    size: "1.2 GB",
  },
  {
    id: "2",
    title: "Onboarding Session Recording",
    thumbnailUrl: "https://placehold.co/300x180/7c3aed/ffffff?text=Onboarding",
    host: { name: "Mike Chen", avatar: "", initials: "MC" },
    duration: "32:18",
    date: "2024-08-25",
    size: "850 MB",
  },
  {
    id: "3",
    title: "Design Workshop Highlights",
    thumbnailUrl: "https://placehold.co/300x180/059669/ffffff?text=Workshop",
    host: { name: "Emma Wilson", avatar: "", initials: "EW" },
    duration: "28:45",
    date: "2024-08-22",
    size: "720 MB",
  },
  {
    id: "4",
    title: "All-Hands Meeting - August",
    thumbnailUrl: "https://placehold.co/300x180/dc2626/ffffff?text=All-Hands",
    host: { name: "David Rodriguez", avatar: "", initials: "DR" },
    duration: "62:15",
    date: "2024-08-20",
    size: "1.8 GB",
  },
];

const RoomsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Filter meetings and recordings based on search
  const filteredMeetings = mockMeetings.filter(
    (meeting) =>
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.host.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRecordings = mockRecordings.filter(
    (recording) =>
      recording.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recording.host.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingMeetings = filteredMeetings.filter(
    (m) => m.status === "upcoming" || m.status === "live"
  );
  const pastMeetings = filteredMeetings.filter((m) => m.status === "ended");

  const getStatusBadge = (status: Meeting["status"]) => {
    switch (status) {
      case "live":
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-700 hover:bg-red-200"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
            Live
          </Badge>
        );
      case "upcoming":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-700 hover:bg-blue-200"
          >
            Upcoming
          </Badge>
        );
      case "ended":
        return <Badge variant="outline">Ended</Badge>;
    }
  };

  const handleMockAction = (action: string, item: string) => {
    console.log(`Mock action: ${action} on ${item}`);
    // In a real app, this would handle actual actions
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Rooms</h1>
              <p className="text-gray-600 mt-2">
                Manage your meetings, recordings, and collaborative sessions in
                one place.
              </p>
            </div>
            <Button
              onClick={() => handleMockAction("create", "room")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Room
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search rooms and recordings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="meetings">Meetings</SelectItem>
                <SelectItem value="recordings">Recordings</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue="meetings" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="meetings"
                  className="flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  Meetings
                </TabsTrigger>
                <TabsTrigger
                  value="recordings"
                  className="flex items-center gap-2"
                >
                  <CirclePlay className="w-4 h-4" />
                  Recordings
                </TabsTrigger>
              </TabsList>

              {/* Meetings Tab */}
              <TabsContent value="meetings" className="space-y-6">
                {/* Upcoming/Live Meetings */}
                {upcomingMeetings.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Upcoming & Live Meetings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Room</TableHead>
                            <TableHead>Host</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Participants</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {upcomingMeetings.map((meeting) => (
                            <TableRow key={meeting.id}>
                              <TableCell className="font-medium">
                                {meeting.title}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={meeting.host.avatar} />
                                    <AvatarFallback className="text-xs">
                                      {meeting.host.initials}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">
                                    {meeting.host.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(meeting.status)}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div>{meeting.date}</div>
                                  <div className="text-gray-500">
                                    {meeting.time}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{meeting.duration}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4 text-gray-400" />
                                  {meeting.participantsCount}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant={
                                      meeting.status === "live"
                                        ? "default"
                                        : "outline"
                                    }
                                    onClick={() =>
                                      handleMockAction("join", meeting.title)
                                    }
                                  >
                                    {meeting.status === "live"
                                      ? "Join"
                                      : "Start"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      handleMockAction("copy", meeting.title)
                                    }
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleMockAction(
                                            "edit",
                                            meeting.title
                                          )
                                        }
                                      >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleMockAction(
                                            "delete",
                                            meeting.title
                                          )
                                        }
                                        className="text-red-600"
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}

                {/* Past Meetings */}
                {pastMeetings.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Past Meetings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Room</TableHead>
                            <TableHead>Host</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Participants</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pastMeetings.map((meeting) => (
                            <TableRow key={meeting.id}>
                              <TableCell className="font-medium">
                                {meeting.title}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={meeting.host.avatar} />
                                    <AvatarFallback className="text-xs">
                                      {meeting.host.initials}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">
                                    {meeting.host.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(meeting.status)}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div>{meeting.date}</div>
                                  <div className="text-gray-500">
                                    {meeting.time}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{meeting.duration}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4 text-gray-400" />
                                  {meeting.participantsCount}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleMockAction("view", meeting.title)
                                    }
                                  >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    View
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleMockAction(
                                            "delete",
                                            meeting.title
                                          )
                                        }
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}

                {filteredMeetings.length === 0 && (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <VideoOff className="w-12 h-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No meetings found
                      </h3>
                      <p className="text-gray-500 text-center mb-4">
                        {searchQuery
                          ? "No meetings match your search."
                          : "Get started by creating your first room."}
                      </p>
                      <Button
                        onClick={() => handleMockAction("create", "room")}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Room
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Recordings Tab */}
              <TabsContent value="recordings" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Your Recordings</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecordings.map((recording) => (
                      <Card key={recording.id} className="overflow-hidden">
                        <div className="relative aspect-video">
                          <img
                            src={recording.thumbnailUrl}
                            alt={recording.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleMockAction("play", recording.title)
                              }
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Play
                            </Button>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            {recording.duration}
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-medium text-sm mb-2">
                            {recording.title}
                          </h4>
                          <div className="flex items-center gap-2 mb-3">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={recording.host.avatar} />
                              <AvatarFallback className="text-xs">
                                {recording.host.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-600">
                              {recording.host.name}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <span>{recording.date}</span>
                            <span>{recording.size}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() =>
                                handleMockAction("play", recording.title)
                              }
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Play
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <MoreHorizontal className="w-3 h-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleMockAction(
                                      "download",
                                      recording.title
                                    )
                                  }
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleMockAction("share", recording.title)
                                  }
                                >
                                  <Share2 className="w-4 h-4 mr-2" />
                                  Share
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleMockAction("delete", recording.title)
                                  }
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Recording</TableHead>
                            <TableHead>Host</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRecordings.map((recording) => (
                            <TableRow key={recording.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <img
                                    src={recording.thumbnailUrl}
                                    alt={recording.title}
                                    className="w-16 h-10 object-cover rounded"
                                  />
                                  <span className="font-medium">
                                    {recording.title}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={recording.host.avatar} />
                                    <AvatarFallback className="text-xs">
                                      {recording.host.initials}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">
                                    {recording.host.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>{recording.duration}</TableCell>
                              <TableCell>{recording.date}</TableCell>
                              <TableCell>{recording.size}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleMockAction("play", recording.title)
                                    }
                                  >
                                    <Play className="w-4 h-4 mr-2" />
                                    Play
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleMockAction(
                                            "download",
                                            recording.title
                                          )
                                        }
                                      >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleMockAction(
                                            "share",
                                            recording.title
                                          )
                                        }
                                      >
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleMockAction(
                                            "delete",
                                            recording.title
                                          )
                                        }
                                        className="text-red-600"
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}

                {filteredRecordings.length === 0 && (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <CirclePlay className="w-12 h-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No recordings found
                      </h3>
                      <p className="text-gray-500 text-center">
                        {searchQuery
                          ? "No recordings match your search."
                          : "Your recorded sessions will appear here."}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            {/* Room Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Room Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Rooms</span>
                  <span className="font-semibold">{mockMeetings.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Recordings</span>
                  <span className="font-semibold">{mockRecordings.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Storage Used</span>
                  <span className="font-semibold">4.7 GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="font-semibold text-green-600">
                    +12 hours
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">Sarah Johnson</span> created
                      "Weekly Team Standup"
                      <div className="text-gray-500 text-xs">2 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">Mike Chen</span> uploaded a
                      recording
                      <div className="text-gray-500 text-xs">5 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">Emma Wilson</span> shared
                      "Design Workshop"
                      <div className="text-gray-500 text-xs">1 day ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">David Rodriguez</span> ended
                      "Q3 Planning Session"
                      <div className="text-gray-500 text-xs">2 days ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">Lisa Park</span> deleted a
                      recording
                      <div className="text-gray-500 text-xs">3 days ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;
