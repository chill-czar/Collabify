import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Hash,
  Lock,
  Star,
  Search,
  ChevronDown,
  ChevronRight,
  Plus,
  Smile,
  Paperclip,
  Send,
  Users,
  Phone,
  Video,
  Settings,
  MoreVertical,
  File,
  Image,
  FileText,
  Play,
  Pin,
  MessageSquare,
  Circle,
  Dot,
} from "lucide-react";

const SlackDashboard = () => {
  const [activeChannel, setActiveChannel] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [dmsOpen, setDmsOpen] = useState(true);
  const [starredOpen, setStarredOpen] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);

  // Mock data
  const channels = [
    {
      id: "general",
      name: "general",
      type: "public",
      unread: 0,
      description: "Company-wide announcements and general discussion",
    },
    {
      id: "development",
      name: "development",
      type: "public",
      unread: 3,
      description: "Development team discussions and updates",
    },
    {
      id: "design",
      name: "design",
      type: "public",
      unread: 1,
      description: "Design team collaboration and feedback",
    },
    {
      id: "marketing",
      name: "marketing",
      type: "private",
      unread: 0,
      description: "Marketing strategies and campaigns",
    },
    {
      id: "random",
      name: "random",
      type: "public",
      unread: 7,
      description: "Random discussions and fun stuff",
    },
  ];

  const directMessages = [
    { id: "alice", name: "Alice Johnson", status: "online", unread: 2 },
    { id: "bob", name: "Bob Smith", status: "offline", unread: 0 },
    { id: "carol", name: "Carol Davis", status: "online", unread: 0 },
    { id: "david", name: "David Wilson", status: "away", unread: 1 },
  ];

  const starredItems = [
    { id: "general", name: "general", type: "channel" },
    { id: "alice", name: "Alice Johnson", type: "dm" },
  ];

  const messages = [
    {
      id: 1,
      user: "Alice Johnson",
      avatar: "/api/placeholder/32/32",
      timestamp: "9:32 AM",
      message: "Good morning everyone! Ready for the sprint review today?",
      isOwn: false,
      role: "admin",
      reactions: [
        { emoji: "👍", count: 3 },
        { emoji: "☕", count: 1 },
      ],
      hasThread: true,
      threadCount: 2,
    },
    {
      id: 2,
      user: "Bob Smith",
      avatar: "/api/placeholder/32/32",
      timestamp: "9:35 AM",
      message:
        "Yes! I've prepared the demo for the new feature. Can't wait to show everyone.",
      isOwn: false,
      reactions: [{ emoji: "🚀", count: 2 }],
    },
    {
      id: 3,
      user: "You",
      avatar: "/api/placeholder/32/32",
      timestamp: "9:37 AM",
      message: "Sounds great! I'll have the meeting room ready by 10 AM.",
      isOwn: true,
    },
    {
      id: 4,
      user: "Carol Davis",
      avatar: "/api/placeholder/32/32",
      timestamp: "9:40 AM",
      message:
        "I've updated the design mockups based on yesterday's feedback. Should I share them now or during the meeting?",
      isOwn: false,
      role: "moderator",
      hasThread: true,
      threadCount: 1,
    },
  ];

  const pinnedMessages = [
    {
      id: 1,
      user: "Alice Johnson",
      message: "Sprint Review - Today at 10 AM in Conference Room A",
    },
  ];

  const members = [
    { name: "Alice Johnson", status: "online", role: "Admin" },
    { name: "Bob Smith", status: "online", role: "Developer" },
    { name: "Carol Davis", status: "online", role: "Designer" },
    { name: "David Wilson", status: "away", role: "Developer" },
    { name: "Emma Brown", status: "offline", role: "Marketing" },
  ];

  const files = [
    {
      name: "sprint-review.pdf",
      type: "pdf",
      size: "2.3 MB",
      user: "Alice Johnson",
      time: "2 hours ago",
    },
    {
      name: "mockups-v2.fig",
      type: "design",
      size: "5.1 MB",
      user: "Carol Davis",
      time: "3 hours ago",
    },
    {
      name: "feature-demo.mp4",
      type: "video",
      size: "45.2 MB",
      user: "Bob Smith",
      time: "1 day ago",
    },
  ];

  const currentChannel =
    channels.find((c) => c.id === activeChannel) || channels[0];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-4 h-4" />;
      case "design":
        return <Image className="w-4 h-4" />;
      case "video":
        return <Play className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Workspace Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900">
            Acme Workspace
          </h1>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search channels, people..."
              className="pl-9 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {/* Starred */}
            <Collapsible open={starredOpen} onOpenChange={setStarredOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded">
                <div className="flex items-center gap-2">
                  {starredOpen ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                  <Star className="w-4 h-4" />
                  Starred
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-4 space-y-1">
                {starredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveChannel(item.id)}
                    className={`flex items-center gap-2 w-full p-2 text-sm rounded hover:bg-gray-100 ${
                      activeChannel === item.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    {item.type === "channel" ? (
                      <Hash className="w-4 h-4" />
                    ) : (
                      <Circle className="w-2 h-2" />
                    )}
                    <span className="truncate">{item.name}</span>
                  </button>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Channels */}
            <Collapsible open={channelsOpen} onOpenChange={setChannelsOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded">
                <div className="flex items-center gap-2">
                  {channelsOpen ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                  Channels
                </div>
                <Plus className="w-4 h-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-2 space-y-1">
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel.id)}
                    className={`flex items-center justify-between w-full p-2 text-sm rounded hover:bg-gray-100 ${
                      activeChannel === channel.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {channel.type === "private" ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <Hash className="w-4 h-4" />
                      )}
                      <span className="truncate">{channel.name}</span>
                    </div>
                    {channel.unread > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-2 text-xs px-1.5 py-0.5 min-w-0"
                      >
                        {channel.unread}
                      </Badge>
                    )}
                  </button>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Direct Messages */}
            <Collapsible open={dmsOpen} onOpenChange={setDmsOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded">
                <div className="flex items-center gap-2">
                  {dmsOpen ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                  Direct Messages
                </div>
                <Plus className="w-4 h-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-2 space-y-1">
                {directMessages.map((dm) => (
                  <button
                    key={dm.id}
                    onClick={() => setActiveChannel(dm.id)}
                    className={`flex items-center justify-between w-full p-2 text-sm rounded hover:bg-gray-100 ${
                      activeChannel === dm.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="relative">
                        <Dot
                          className={`w-3 h-3 ${getStatusColor(dm.status)}`}
                        />
                      </div>
                      <span className="truncate">{dm.name}</span>
                    </div>
                    {dm.unread > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-2 text-xs px-1.5 py-0.5"
                      >
                        {dm.unread}
                      </Badge>
                    )}
                  </button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {currentChannel.type === "private" ? (
                  <Lock className="w-5 h-5" />
                ) : (
                  <Hash className="w-5 h-5" />
                )}
                <h2 className="text-lg font-semibold">{currentChannel.name}</h2>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {members.length}
                </span>
                {currentChannel.description && (
                  <span className="hidden md:block">
                    | {currentChannel.description}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRightPanel(!showRightPanel)}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Pinned Messages */}
        {pinnedMessages.length > 0 && (
          <div className="bg-yellow-50 border-b border-yellow-200 p-3">
            <div className="flex items-start gap-2">
              <Pin className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <span className="font-medium text-yellow-800">
                  {pinnedMessages[0].user}
                </span>
                <span className="text-yellow-700 ml-2">
                  {pinnedMessages[0].message}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.isOwn ? "flex-row-reverse" : ""}`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={message.avatar} />
                  <AvatarFallback>
                    {message.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className={`flex-1 ${message.isOwn ? "text-right" : ""}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{message.user}</span>
                    {message.role && (
                      <Badge variant="secondary" className="text-xs">
                        {message.role}
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">
                      {message.timestamp}
                    </span>
                  </div>
                  <Card
                    className={`p-3 ${message.isOwn ? "bg-blue-50 ml-12" : "bg-gray-50 mr-12"}`}
                  >
                    <p className="text-sm">{message.message}</p>
                    {message.reactions && (
                      <div className="flex gap-1 mt-2">
                        {message.reactions.map((reaction, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs bg-white hover:bg-gray-100"
                          >
                            {reaction.emoji} {reaction.count}
                          </Button>
                        ))}
                      </div>
                    )}
                    {message.hasThread && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-6 text-xs text-blue-600"
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        {message.threadCount}{" "}
                        {message.threadCount === 1 ? "reply" : "replies"}
                      </Button>
                    )}
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder={`Message #${currentChannel.name}`}
                className="pr-20"
              />
              <div className="absolute right-2 top-2 flex gap-1">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      {showRightPanel && (
        <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold">Channel Details</h3>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {/* Members */}
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-3">
                  Members ({members.length})
                </h4>
                <div className="space-y-2">
                  {members.map((member, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="/api/placeholder/32/32" />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full ${getStatusColor(member.status)}`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Files */}
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-3">
                  Recent Files
                </h4>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <Card
                      key={index}
                      className="p-3 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {file.size} • {file.user}
                          </p>
                          <p className="text-xs text-gray-400">{file.time}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-3">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Invite Members
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Start Huddle
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <Pin className="w-4 h-4 mr-2" />
                    View Pinned
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default SlackDashboard;
