import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  Clock,
  Users,
  ChevronDown,
  Edit,
  Trash2,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

// Mock data
const mockUsers = [
  { id: 1, name: "John Doe", avatar: "/api/placeholder/32/32", initials: "JD" },
  {
    id: 2,
    name: "Sarah Wilson",
    avatar: "/api/placeholder/32/32",
    initials: "SW",
  },
  {
    id: 3,
    name: "Mike Chen",
    avatar: "/api/placeholder/32/32",
    initials: "MC",
  },
  {
    id: 4,
    name: "Emily Davis",
    avatar: "/api/placeholder/32/32",
    initials: "ED",
  },
  {
    id: 5,
    name: "Alex Johnson",
    avatar: "/api/placeholder/32/32",
    initials: "AJ",
  },
];

const mockProjects = [
  { id: 1, name: "Website Redesign" },
  { id: 2, name: "Mobile App" },
  { id: 3, name: "Marketing Campaign" },
  { id: 4, name: "API Development" },
];

const mockTasks = [
  {
    id: 1,
    title: "Design homepage mockup",
    project: "Website Redesign",
    assignees: [1, 2],
    status: "In Progress",
    priority: "High",
    progress: 75,
    deadline: "2025-09-05",
    createdBy: 1,
    isOverdue: false,
    comments: 3,
  },
  {
    id: 2,
    title: "Implement user authentication",
    project: "Mobile App",
    assignees: [3],
    status: "Not Started",
    priority: "Medium",
    progress: 0,
    deadline: "2025-09-08",
    createdBy: 1,
    isOverdue: false,
    comments: 1,
  },
  {
    id: 3,
    title: "Create marketing assets",
    project: "Marketing Campaign",
    assignees: [4, 5],
    status: "Completed",
    priority: "Low",
    progress: 100,
    deadline: "2025-09-01",
    createdBy: 2,
    isOverdue: false,
    comments: 7,
  },
  {
    id: 4,
    title: "Database optimization",
    project: "API Development",
    assignees: [3, 1],
    status: "Blocked",
    priority: "High",
    progress: 30,
    deadline: "2025-09-02",
    createdBy: 1,
    isOverdue: true,
    comments: 2,
  },
  {
    id: 5,
    title: "User testing sessions",
    project: "Website Redesign",
    assignees: [2, 4],
    status: "In Progress",
    priority: "Medium",
    progress: 60,
    deadline: "2025-09-10",
    createdBy: 1,
    isOverdue: false,
    comments: 5,
  },
  {
    id: 6,
    title: "Content strategy planning",
    project: "Marketing Campaign",
    assignees: [5],
    status: "Not Started",
    priority: "Low",
    progress: 0,
    deadline: "2025-09-15",
    createdBy: 2,
    isOverdue: false,
    comments: 0,
  },
  {
    id: 7,
    title: "API documentation",
    project: "API Development",
    assignees: [3, 2],
    status: "In Progress",
    priority: "Medium",
    progress: 45,
    deadline: "2025-09-12",
    createdBy: 1,
    isOverdue: false,
    comments: 3,
  },
  {
    id: 8,
    title: "Social media campaign",
    project: "Marketing Campaign",
    assignees: [4],
    status: "Completed",
    priority: "High",
    progress: 100,
    deadline: "2025-08-30",
    createdBy: 2,
    isOverdue: false,
    comments: 12,
  },
];

const WorkflowDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [currentUserId] = useState(2); // Sarah Wilson
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedAssignee, setSelectedAssignee] = useState("All");
  const [selectedProject, setSelectedProject] = useState("All");
  const [viewMode, setViewMode] = useState("list");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const statusOptions = [
    "All",
    "Not Started",
    "In Progress",
    "Completed",
    "Blocked",
  ];
  const priorityOptions = ["All", "Low", "Medium", "High"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Not Started":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Completed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Blocked":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "High":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUserById = (id: number) => mockUsers.find((user) => user.id === id);

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredTasks = mockTasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || task.status === selectedStatus;
    const matchesPriority =
      selectedPriority === "All" || task.priority === selectedPriority;
    const matchesProject =
      selectedProject === "All" || task.project === selectedProject;
    const matchesAssignee =
      selectedAssignee === "All" ||
      task.assignees.includes(parseInt(selectedAssignee)) ||
      selectedAssignee === "All";

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesProject &&
      matchesAssignee
    );
  });

  const TaskCard = ({ task }: { task: any }) => {
    const assignedToCurrentUser = task.assignees.includes(currentUserId);
    const daysUntilDeadline = getDaysUntilDeadline(task.deadline);
    const isOverdue = daysUntilDeadline < 0;
    const isUrgent = daysUntilDeadline <= 2 && daysUntilDeadline >= 0;

    return (
      <Card
        className={`hover:shadow-lg transition-all duration-200 border ${
          assignedToCurrentUser && !isAdmin ? "ring-2 ring-blue-200" : ""
        } ${isOverdue ? "border-red-200" : isUrgent ? "border-yellow-200" : ""}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-base font-semibold leading-6">
                {task.title}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">{task.project}</p>
            </div>
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Task
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getStatusColor(task.status)}>
                {task.status}
              </Badge>
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {task.assignees.map((assigneeId: number) => {
                  const user = getUserById(assigneeId);
                  return (
                    <Avatar
                      key={assigneeId}
                      className="w-8 h-8 border-2 border-white"
                    >
                      <AvatarFallback className="text-xs">
                        {user?.initials}
                      </AvatarFallback>
                    </Avatar>
                  );
                })}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MessageSquare className="h-4 w-4" />
                {task.comments}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{task.progress}%</span>
              </div>
              <Progress value={task.progress} className="h-2" />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar className="h-4 w-4" />
                {new Date(task.deadline).toLocaleDateString()}
              </div>
              <div
                className={`flex items-center gap-1 ${
                  isOverdue
                    ? "text-red-600"
                    : isUrgent
                      ? "text-yellow-600"
                      : "text-gray-600"
                }`}
              >
                <Clock className="h-4 w-4" />
                {isOverdue
                  ? `${Math.abs(daysUntilDeadline)}d overdue`
                  : daysUntilDeadline === 0
                    ? "Due today"
                    : `${daysUntilDeadline}d left`}
              </div>
            </div>
          </div>
        </CardContent>
        {!isAdmin && assignedToCurrentUser && (
          <CardFooter className="pt-0">
            <div className="flex gap-2 w-full">
              <Button size="sm" variant="outline" className="flex-1">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mark Complete
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <MessageSquare className="mr-2 h-4 w-4" />
                Comment
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    );
  };

  const KanbanColumn = ({
    status,
    tasks,
  }: {
    status: string;
    tasks: any[];
  }) => (
    <div className="flex-1 min-w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{status}</h3>
        <Badge variant="secondary">{tasks.length}</Badge>
      </div>
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-4 pr-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  const renderListView = () => (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="grid gap-4 pr-4">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </ScrollArea>
  );

  const renderKanbanView = () => {
    const kanbanColumns = statusOptions.filter((status) => status !== "All");

    return (
      <div className="flex gap-6 overflow-x-auto pb-4">
        {kanbanColumns.map((status) => {
          const columnTasks = filteredTasks.filter(
            (task) => task.status === status
          );
          return (
            <KanbanColumn key={status} status={status} tasks={columnTasks} />
          );
        })}
      </div>
    );
  };

  const renderTimelineView = () => (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-2 pr-4">
        {filteredTasks
          .sort(
            (a, b) =>
              new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          )
          .map((task) => {
            const daysUntilDeadline = getDaysUntilDeadline(task.deadline);
            const isOverdue = daysUntilDeadline < 0;

            return (
              <Card key={task.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{task.title}</h4>
                      <Badge
                        className={getStatusColor(task.status)}
                        variant="secondary"
                      >
                        {task.status}
                      </Badge>
                      <Badge
                        className={getPriorityColor(task.priority)}
                        variant="secondary"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{task.project}</span>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {task.assignees.length}
                      </div>
                      <div
                        className={`flex items-center gap-1 ${
                          isOverdue ? "text-red-600" : "text-gray-600"
                        }`}
                      >
                        <Calendar className="h-4 w-4" />
                        {new Date(task.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="w-32">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                </div>
              </Card>
            );
          })}
      </div>
    </ScrollArea>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Collapsible
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        className={`border-r bg-white ${sidebarOpen ? "w-80" : "w-16"} transition-all duration-200`}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4" />
                {sidebarOpen && <span className="ml-2">Filters</span>}
              </Button>
            </CollapsibleTrigger>
            {sidebarOpen && (
              <Button
                variant={isAdmin ? "default" : "outline"}
                size="sm"
                onClick={() => setIsAdmin(!isAdmin)}
              >
                {isAdmin ? "Admin View" : "Member View"}
              </Button>
            )}
          </div>
        </div>

        <CollapsibleContent>
          <div className="p-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Priority
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
              >
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Project
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
              >
                <option value="All">All Projects</option>
                {mockProjects.map((project) => (
                  <option key={project.id} value={project.name}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Assignee
              </label>
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
              >
                <option value="All">All Assignees</option>
                {mockUsers.map((user) => (
                  <option key={user.id} value={user.id.toString()}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="border-b bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Workflow</h1>
              <Badge variant="secondary">{filteredTasks.length} tasks</Badge>
              {!isAdmin && (
                <Badge className="bg-blue-100 text-blue-800">
                  {
                    filteredTasks.filter((t) =>
                      t.assignees.includes(currentUserId)
                    ).length
                  }{" "}
                  assigned to you
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Task
                </Button>
              )}
              <Tabs value={viewMode} onValueChange={setViewMode}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="list">List</TabsTrigger>
                  <TabsTrigger value="kanban">Board</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4">
          {viewMode === "list" && renderListView()}
          {viewMode === "kanban" && renderKanbanView()}
          {viewMode === "timeline" && renderTimelineView()}
        </div>
      </div>
    </div>
  );
};

export default WorkflowDashboard;
