import React from "react";
import Link from "next/link";
import {
  Home,
  FolderOpen,
  File,
  Video,
  Search,
  Bell,
  User,
  CreditCard,
  Users,
  Plus,
  ChevronLeft,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: FolderOpen, label: "Projects", href: "/dashboard/projects" },
    { icon: File, label: "Files", href: "/dashboard/files" },
    { icon: Video, label: "Rooms", href: "/dashboard/rooms" },
    { icon: Search, label: "Search", href: "/dashboard/search" },
    { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
  ];

  const settingsItems = [
    { icon: User, label: "Profile", href: "/profile" },
    { icon: CreditCard, label: "Billing", href: "/billing" },
    { icon: Users, label: "Team", href: "/team" },
  ];

  return (
    <div className=" h-full w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 max-h-15">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-sm">C</span>
          </div>
          <span className="font-semibold text-gray-900">Collabify</span>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded">
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* New Project Button */}
      <div className="p-4">
        <button className="w-full bg-gray-900 text-white rounded-lg px-4 py-3 flex items-center space-x-3 hover:bg-gray-800 transition-colors">
          <Plus className="w-4 h-4" />
          <span className="font-medium">New Project</span>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors group"
              >
                <item.icon className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Settings Section */}
      <div className="px-4 pb-4">
        <div className="mb-3">
          <h3 className="text-sm font-medium text-gray-500 px-3">Settings</h3>
        </div>
        <ul className="space-y-2">
          {settingsItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors group"
              >
                <item.icon className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
