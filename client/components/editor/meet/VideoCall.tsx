import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Share,
  Circle,
  PhoneOff,
  MessageCircle,
  Users,
  FileText,
  BarChart3,
  Play,
  Download,
  Share as ShareIcon,
  Trash,
  MoreVertical,
  Calendar,
  Clock,
  Eye,
  Search,
  Filter,
  Plus,
  Link,
  Settings,
  Smile,
  Presentation,
} from "lucide-react";

const MeetHubLayout = () => {
  const [activeView, setActiveView] = useState("hub");
  const [meetingSettings, setMeetingSettings] = useState({
    camera: true,
    microphone: true,
    autoRecord: false,
    privacy: "team-only",
  });
  const [activeSidebarTab, setActiveSidebarTab] = useState("chat");

  // Mock data
  const upcomingMeetings = [
    {
      id: 1,
      title: "Weekly Team Standup",
      date: "Today, 2:00 PM",
      participants: ["Alice", "Bob", "Charlie", "+2"],
      host: "Alice Johnson",
    },
    {
      id: 2,
      title: "Product Review",
      date: "Tomorrow, 10:00 AM",
      participants: ["David", "Eve", "Frank"],
      host: "David Chen",
    },
  ];

  const pastMeetings = [
    {
      id: 1,
      title: "Sprint Planning",
      date: "Sep 1, 2025",
      duration: "45 min",
      host: "Sarah Wilson",
      views: 12,
      thumbnail: "/api/placeholder/150/100",
    },
    {
      id: 2,
      title: "Client Presentation",
      date: "Aug 30, 2025",
      duration: "1h 20min",
      host: "Mike Torres",
      views: 8,
      thumbnail: "/api/placeholder/150/100",
    },
  ];

  const recordings = [
    {
      id: 1,
      title: "Sprint Planning",
      date: "Sep 1, 2025",
      duration: "45:32",
      views: 12,
      thumbnail: "/api/placeholder/200/120",
    },
    {
      id: 2,
      title: "Client Presentation",
      date: "Aug 30, 2025",
      duration: "1:20:15",
      views: 8,
      thumbnail: "/api/placeholder/200/120",
    },
  ];

  const participants = [
    { name: "Alice Johnson", muted: false, video: true },
    { name: "Bob Smith", muted: true, video: true },
    { name: "Charlie Brown", muted: false, video: false },
  ];

  const chatMessages = [
    { user: "Alice", message: "Welcome everyone!", time: "2:01 PM" },
    { user: "Bob", message: "Thanks for organizing this", time: "2:02 PM" },
  ];

  const renderHubView = () => (
    <div className="space-y-6">
      {/* Create Meeting Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Start a Meeting</CardTitle>
          <CardDescription>Create or join a meeting instantly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex-1 h-12">
                  <Video className="w-5 h-5 mr-2" />
                  Create New Meeting
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Meeting Settings</DialogTitle>
                  <DialogDescription>
                    Configure your meeting before starting
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="meetingTitle">Meeting Title</Label>
                    <Input
                      id="meetingTitle"
                      placeholder="Enter meeting title"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoRecord">Auto-record meeting</Label>
                    <Switch
                      id="autoRecord"
                      checked={meetingSettings.autoRecord}
                      onCheckedChange={(checked) =>
                        setMeetingSettings({
                          ...meetingSettings,
                          autoRecord: checked,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Privacy</Label>
                    <Select
                      value={meetingSettings.privacy}
                      onValueChange={(value) =>
                        setMeetingSettings({
                          ...meetingSettings,
                          privacy: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="team-only">Team Only</SelectItem>
                        <SelectItem value="invite-only">Invite Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => setActiveView("meeting")}
                  >
                    Start Meeting
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex gap-3">
            <Input placeholder="Enter meeting ID or link" className="flex-1" />
            <Button variant="outline">
              <Link className="w-4 h-4 mr-2" />
              Join
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Meetings */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingMeetings.length > 0 ? (
            <div className="space-y-3">
              {upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{meeting.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {meeting.date}
                      </span>
                      <span>Host: {meeting.host}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      {meeting.participants
                        .slice(0, 3)
                        .map((participant, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            {participant}
                          </Badge>
                        ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">Join</Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Cancel</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">No upcoming meetings</p>
              <Button variant="outline" className="mt-2">
                Schedule Meeting
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Meetings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          {pastMeetings.length > 0 ? (
            <div className="space-y-3">
              {pastMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <div className="w-24 h-16 bg-gray-100 rounded flex items-center justify-center">
                    <Play className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{meeting.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {meeting.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {meeting.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {meeting.views} views
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Host: {meeting.host}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ShareIcon className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Circle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">No past meetings</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderMeetingView = () => (
    <div className="flex h-[calc(100vh-200px)] gap-4">
      {/* Main Video Area */}
      <div className="flex-1 space-y-4">
        <Card className="h-full">
          <CardContent className="p-4 h-full">
            {/* Video Grid */}
            <div className="grid grid-cols-2 gap-4 h-full">
              {[1, 2, 3, 4].map((participant) => (
                <div
                  key={participant}
                  className="bg-gray-900 rounded-lg flex items-center justify-center relative"
                >
                  <div className="text-white text-center">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg font-semibold">
                        U{participant}
                      </span>
                    </div>
                    <p className="text-sm">User {participant}</p>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {participant === 1 ? (
                        <Mic className="w-3 h-3" />
                      ) : (
                        <MicOff className="w-3 h-3" />
                      )}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Meeting Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={meetingSettings.microphone ? "default" : "destructive"}
                size="lg"
                onClick={() =>
                  setMeetingSettings({
                    ...meetingSettings,
                    microphone: !meetingSettings.microphone,
                  })
                }
              >
                {meetingSettings.microphone ? (
                  <Mic className="w-5 h-5" />
                ) : (
                  <MicOff className="w-5 h-5" />
                )}
              </Button>
              <Button
                variant={meetingSettings.camera ? "default" : "destructive"}
                size="lg"
                onClick={() =>
                  setMeetingSettings({
                    ...meetingSettings,
                    camera: !meetingSettings.camera,
                  })
                }
              >
                {meetingSettings.camera ? (
                  <Video className="w-5 h-5" />
                ) : (
                  <VideoOff className="w-5 h-5" />
                )}
              </Button>
              <Button variant="outline" size="lg">
                <Share className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Circle className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Smile className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Presentation className="w-5 h-5" />
              </Button>
              <Button
                variant="destructive"
                size="lg"
                onClick={() => setActiveView("hub")}
              >
                <PhoneOff className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <Card className="w-80">
        <CardContent className="p-0 h-full">
          <Tabs
            value={activeSidebarTab}
            onValueChange={setActiveSidebarTab}
            className="h-full flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="chat" className="text-xs">
                <MessageCircle className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="participants" className="text-xs">
                <Users className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="notes" className="text-xs">
                <FileText className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="polls" className="text-xs">
                <BarChart3 className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 p-4">
              <div className="h-full flex flex-col">
                <div className="flex-1 space-y-3 overflow-y-auto mb-4">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className="text-sm">
                      <div className="font-semibold">{msg.user}</div>
                      <div className="text-gray-600">{msg.message}</div>
                      <div className="text-xs text-gray-400">{msg.time}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Type a message..." className="flex-1" />
                  <Button size="sm">Send</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="participants" className="flex-1 p-4">
              <div className="space-y-3">
                <h3 className="font-semibold">
                  Participants ({participants.length})
                </h3>
                {participants.map((participant, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold">
                          {participant.name[0]}
                        </span>
                      </div>
                      <span className="text-sm">{participant.name}</span>
                    </div>
                    <div className="flex gap-1">
                      {!participant.muted && (
                        <Mic className="w-4 h-4 text-green-600" />
                      )}
                      {participant.muted && (
                        <MicOff className="w-4 h-4 text-gray-400" />
                      )}
                      {participant.video && (
                        <Video className="w-4 h-4 text-green-600" />
                      )}
                      {!participant.video && (
                        <VideoOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="notes" className="flex-1 p-4">
              <div className="h-full flex flex-col">
                <h3 className="font-semibold mb-3">Shared Notes</h3>
                <textarea
                  className="flex-1 p-3 border rounded resize-none"
                  placeholder="Take notes during the meeting..."
                />
              </div>
            </TabsContent>

            <TabsContent value="polls" className="flex-1 p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Polls</h3>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Create
                  </Button>
                </div>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No polls yet</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  const renderRecordingsView = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search recordings..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Recordings</SelectItem>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Recordings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recordings.map((recording) => (
          <Card key={recording.id}>
            <CardContent className="p-4">
              <div className="relative mb-3">
                <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
                  <Play className="w-8 h-8 text-gray-600" />
                </div>
                <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                  {recording.duration}
                </Badge>
              </div>
              <h3 className="font-semibold mb-2">{recording.title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <span>{recording.date}</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {recording.views}
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ShareIcon className="w-4 h-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {recordings.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Circle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No recordings yet</h3>
            <p className="text-gray-600 mb-4">
              Start recording your meetings to build your library
            </p>
            <Button onClick={() => setActiveView("hub")}>
              <Video className="w-4 h-4 mr-2" />
              Start a Meeting
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderAnalyticsView = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Meeting Analytics</CardTitle>
          <CardDescription>Overview of your meeting activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-gray-600">Total Meetings</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">8h 45m</div>
              <div className="text-sm text-gray-600">Total Duration</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">24</div>
              <div className="text-sm text-gray-600">Participants</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Meeting Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Sprint Planning</span>
              <Badge variant="secondary">45 minutes</Badge>
            </div>
            <div className="text-sm text-gray-600">
              <p>• 5 participants joined</p>
              <p>• 23 chat messages</p>
              <p>• 12 reactions</p>
              <p>• Recording viewed 8 times</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className=" mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Meet</h1>
        <p className="text-gray-600">
          Connect, collaborate, and record your meetings
        </p>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="mb-6">
          <TabsTrigger value="hub">Hub</TabsTrigger>
          <TabsTrigger value="meeting">Meeting</TabsTrigger>
          <TabsTrigger value="recordings">Recordings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="hub">{renderHubView()}</TabsContent>

        <TabsContent value="meeting">{renderMeetingView()}</TabsContent>

        <TabsContent value="recordings">{renderRecordingsView()}</TabsContent>

        <TabsContent value="analytics">{renderAnalyticsView()}</TabsContent>
      </Tabs>
    </div>
  );
};

export default MeetHubLayout;
