import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Users, 
  Eye, 
  Edit, 
  Clock, 
  TrendingUp,
  Grid3X3,
  GitBranch,
  Brain,
  Vote,
  Pin,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// TypeScript Types
type BoardType = 'Kanban' | 'Scrum' | 'Mind Map' | 'Flowchart';
type BoardStatus = 'Active' | 'Draft' | 'Completed';
type UserRole = 'Admin' | 'Editor' | 'Viewer';
type ActivityType = 'board' | 'poll';
type SortOption = 'recent' | 'name' | 'type' | 'pinned';
type FilterOption = 'all' | 'kanban' | 'scrum' | 'mind map' | 'flowchart';

interface Board {
  id: number;
  name: string;
  type: BoardType;
  owner: string;
  created: string;
  lastEdited: string;
  status: BoardStatus;
  pinned: boolean;
}

interface Poll {
  id: number;
  title: string;
  votes: number;
  options: string[];
  progress: number[];
  active: boolean;
}

interface TeamMember {
  id: number;
  name: string;
  role: UserRole;
  avatar: string;
  active: boolean;
  lastSeen: string;
}

interface Activity {
  id: number;
  action: string;
  item: string;
  user: string;
  time: string;
  type: ActivityType;
}

// Mock Data
const mockBoards: Board[] = [
  { id: 1, name: "Sprint Planning Q4", type: "Scrum", owner: "Sarah Chen", created: "2025-08-15", lastEdited: "2025-09-01", status: "Active", pinned: true },
  { id: 2, name: "Product Roadmap", type: "Kanban", owner: "Mike Torres", created: "2025-08-22", lastEdited: "2025-09-02", status: "Active", pinned: false },
  { id: 3, name: "User Journey Map", type: "Mind Map", owner: "Alex Kim", created: "2025-08-10", lastEdited: "2025-08-30", status: "Draft", pinned: true },
  { id: 4, name: "API Architecture", type: "Flowchart", owner: "David Park", created: "2025-07-28", lastEdited: "2025-08-25", status: "Completed", pinned: false },
  { id: 5, name: "Feature Brainstorm", type: "Mind Map", owner: "Emma Wilson", created: "2025-08-05", lastEdited: "2025-08-28", status: "Active", pinned: false },
  { id: 6, name: "Bug Triage Board", type: "Kanban", owner: "Ryan Lopez", created: "2025-08-12", lastEdited: "2025-09-03", status: "Active", pinned: true }
];

const mockPolls: Poll[] = [
  { id: 1, title: "Q4 Priority Features", votes: 12, options: ["Mobile App", "API v2", "Analytics"], progress: [65, 25, 10], active: true },
  { id: 2, title: "Team Retrospective Topics", votes: 8, options: ["Process", "Tools", "Communication"], progress: [40, 35, 25], active: true },
  { id: 3, title: "Next Sprint Goals", votes: 15, options: ["Bug Fixes", "New Features", "Performance"], progress: [30, 45, 25], active: false }
];

const mockTeamMembers: TeamMember[] = [
  { id: 1, name: "Sarah Chen", role: "Admin", avatar: "SC", active: true, lastSeen: "2 min ago" },
  { id: 2, name: "Mike Torres", role: "Editor", avatar: "MT", active: true, lastSeen: "5 min ago" },
  { id: 3, name: "Alex Kim", role: "Editor", avatar: "AK", active: false, lastSeen: "1 hour ago" },
  { id: 4, name: "David Park", role: "Viewer", avatar: "DP", active: false, lastSeen: "3 hours ago" },
  { id: 5, name: "Emma Wilson", role: "Editor", avatar: "EW", active: true, lastSeen: "Just now" },
  { id: 6, name: "Ryan Lopez", role: "Admin", avatar: "RL", active: false, lastSeen: "30 min ago" }
];

const mockActivity: Activity[] = [
  { id: 1, action: "created", item: "Sprint Planning Q4", user: "Sarah Chen", time: "2 hours ago", type: "board" },
  { id: 2, action: "voted on", item: "Q4 Priority Features", user: "Mike Torres", time: "4 hours ago", type: "poll" },
  { id: 3, action: "edited", item: "Bug Triage Board", user: "Ryan Lopez", time: "6 hours ago", type: "board" },
  { id: 4, action: "created poll", item: "Team Retrospective Topics", user: "Alex Kim", time: "1 day ago", type: "poll" },
  { id: 5, action: "pinned", item: "User Journey Map", user: "Emma Wilson", time: "2 days ago", type: "board" },
  { id: 6, action: "completed", item: "API Architecture", user: "David Park", time: "3 days ago", type: "board" }
];

const FlowTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterType, setFilterType] = useState<FilterOption>('all');

  const getBoardIcon = (type: BoardType): React.JSX.Element => {
    switch (type) {
      case 'Kanban': return <Grid3X3 className="h-4 w-4" />;
      case 'Scrum': return <TrendingUp className="h-4 w-4" />;
      case 'Mind Map': return <Brain className="h-4 w-4" />;
      case 'Flowchart': return <GitBranch className="h-4 w-4" />;
      default: return <Grid3X3 className="h-4 w-4" />;
    }
  };

  const getBadgeVariant = (status: BoardStatus): "default" | "secondary" | "outline" => {
    switch (status) {
      case 'Active': return 'default';
      case 'Draft': return 'secondary';
      case 'Completed': return 'outline';
      default: return 'secondary';
    }
  };

  const filteredBoards: Board[] = mockBoards.filter((board: Board) => 
    (filterType === 'all' || board.type.toLowerCase() === filterType.toLowerCase()) &&
    board.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Flow</h1>
          <p className="text-sm text-muted-foreground">Manage boards, polls, and team collaboration</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Board
          </Button>
          <Button variant="outline">
            <Vote className="h-4 w-4 mr-2" />
            New Poll
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Boards</p>
                <p className="text-2xl font-semibold">6</p>
              </div>
              <Grid3X3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Polls</p>
                <p className="text-2xl font-semibold">2</p>
              </div>
              <Vote className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Team Members</p>
                <p className="text-2xl font-semibold">6</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="boards" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="boards">Boards</TabsTrigger>
          <TabsTrigger value="polls">Polls & Voting</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Boards Tab */}
        <TabsContent value="boards" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search boards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={(value: FilterOption) => setFilterType(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="kanban">Kanban</SelectItem>
                <SelectItem value="scrum">Scrum</SelectItem>
                <SelectItem value="mind map">Mind Map</SelectItem>
                <SelectItem value="flowchart">Flowchart</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="type">Type</SelectItem>
                <SelectItem value="pinned">Pinned First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Board Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBoards.map((board: Board) => (
              <Card key={board.id} className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getBoardIcon(board.type)}
                      <h3 className="font-medium text-sm">{board.name}</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      {board.pinned && <Pin className="h-3 w-3 text-muted-foreground" />}
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {board.type}
                    </Badge>
                    <Badge variant={getBadgeVariant(board.status)} className="text-xs">
                      {board.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-3">
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{board.owner}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Edited {board.lastEdited}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex w-full gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Board Preview Carousel */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Recent Boards</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex w-max space-x-4 p-4">
                {mockBoards.slice(0, 4).map((board: Board) => (
                  <Card key={board.id} className="w-64 shrink-0 cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getBoardIcon(board.type)}
                          <h4 className="font-medium text-sm truncate">{board.name}</h4>
                        </div>
                        {board.pinned && <Star className="h-4 w-4 fill-current text-yellow-500" />}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="h-24 bg-muted rounded-md mb-2 flex items-center justify-center">
                        <div className="text-xs text-muted-foreground">Board Preview</div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{board.type}</span>
                        <span>Edited {board.lastEdited}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        {/* Polls Tab */}
        <TabsContent value="polls" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockPolls.map((poll: Poll) => (
              <Card key={poll.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium">{poll.title}</h3>
                    <Badge variant={poll.active ? "default" : "secondary"} className="text-xs">
                      {poll.active ? "Active" : "Closed"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{poll.votes} votes</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {poll.options.map((option: string, index: number) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{option}</span>
                        <span className="text-muted-foreground">{poll.progress[index]}%</span>
                      </div>
                      <Progress value={poll.progress[index]} className="h-2" />
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button className="w-full" disabled={!poll.active}>
                    <Vote className="h-4 w-4 mr-2" />
                    {poll.active ? "Vote" : "Voting Closed"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Team Members</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Invite Members
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockTeamMembers.map((member: TeamMember) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-medium text-sm">
                        {member.avatar}
                      </div>
                      {member.active && (
                        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{member.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {member.role}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{member.lastSeen}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <h3 className="text-lg font-medium">Recent Activity</h3>
          <div className="space-y-4">
            {mockActivity.map((activity: Activity) => (
              <Card key={activity.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      {activity.type === 'board' ? (
                        <Grid3X3 className="h-4 w-4" />
                      ) : (
                        <Vote className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        {' '}
                        <span className="text-muted-foreground">{activity.action}</span>
                        {' '}
                        <span className="font-medium">{activity.item}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {activity.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FlowTab;