import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Using custom table structure since Table component is not available
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserPlus } from "lucide-react";

type MemberRole = "Admin" | "Editor" | "Viewer";
type MemberStatus = "Active" | "Invited" | "Pending";

const Members = () => {
  const projectMembers = [
    {
      id: 1,
      name: "Sarah Chen",
      email: "sarah.chen@company.com",
      avatar: "/api/placeholder/40/40",
      role: "Admin",
      status: "Active",
      joinedDate: "2024-01-15",
    },
    {
      id: 2,
      name: "John Smith",
      email: "john.smith@company.com",
      avatar: "/api/placeholder/40/40",
      role: "Editor",
      status: "Active",
      joinedDate: "2024-01-18",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      avatar: "/api/placeholder/40/40",
      role: "Editor",
      status: "Active",
      joinedDate: "2024-01-22",
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma.wilson@company.com",
      avatar: "/api/placeholder/40/40",
      role: "Viewer",
      status: "Active",
      joinedDate: "2024-02-01",
    },
    {
      id: 5,
      name: "David Brown",
      email: "david.brown@company.com",
      avatar: "/api/placeholder/40/40",
      role: "Editor",
      status: "Invited",
      joinedDate: "2024-02-15",
    },
    {
      id: 6,
      name: "Lisa Garcia",
      email: "lisa.garcia@company.com",
      avatar: "/api/placeholder/40/40",
      role: "Viewer",
      status: "Pending",
      joinedDate: "2024-02-18",
    },
    {
      id: 7,
      name: "Alex Kim",
      email: "alex.kim@company.com",
      avatar: "/api/placeholder/40/40",
      role: "Editor",
      status: "Active",
      joinedDate: "2024-02-20",
    },
    {
      id: 8,
      name: "Rachel Taylor",
      email: "rachel.taylor@company.com",
      avatar: "/api/placeholder/40/40",
      role: "Viewer",
      status: "Active",
      joinedDate: "2024-02-25",
    },
  ];

  const getRoleBadgeVariant = (role: MemberRole) => {
    switch (role) {
      case "Admin":
        return "destructive";
      case "Editor":
        return "default";
      case "Viewer":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusBadgeVariant = (status: MemberStatus) => {
    switch (status) {
      case "Active":
        return "default";
      case "Invited":
        return "secondary";
      case "Pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: MemberStatus) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Invited":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Invite Member Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Invite New Member</span>
          </CardTitle>
          <CardDescription>
            Add new team members to collaborate on this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter email address"
              className="flex-1"
              type="email"
            />
            <Button>Send Invite</Button>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Project Members ({projectMembers.length})</CardTitle>
          <CardDescription>
            Manage team members and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="pb-3 font-medium text-gray-900">Member</th>
                  <th className="pb-3 font-medium text-gray-900">Role</th>
                  <th className="pb-3 font-medium text-gray-900">Status</th>
                  <th className="pb-3 font-medium text-gray-900">Email</th>
                  <th className="pb-3 font-medium text-gray-900 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {projectMembers.map((member, index) => (
                  <tr
                    key={member.id}
                    className={
                      index !== projectMembers.length - 1 ? "border-b" : ""
                    }
                  >
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-500">
                            Joined {member.joinedDate}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge
                        variant={getRoleBadgeVariant(member.role as MemberRole)}
                      >
                        {member.role}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <Badge
                        variant="secondary"
                        className={getStatusColor(
                          member.status as MemberStatus
                        )}
                      >
                        {member.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-gray-600">{member.email}</td>
                    <td className="py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          <DropdownMenuItem>Resend Invitation</DropdownMenuItem>
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Member Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {projectMembers.filter((m) => m.status === "Active").length}
              </p>
              <p className="text-sm text-gray-600">Active Members</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {projectMembers.filter((m) => m.status === "Invited").length}
              </p>
              <p className="text-sm text-gray-600">Pending Invites</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {projectMembers.filter((m) => m.role === "Admin").length}
              </p>
              <p className="text-sm text-gray-600">Administrators</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Members;
