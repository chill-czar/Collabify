"use client";

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
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/store"; // adjust import path
import {
  toggleSidebar,
  closeSidebar,
  toggleCollapse,
} from "@/lib/slices/sidebarSlice"; // adjust path

const Sidebar = () => {
  const dispatch = useDispatch();
  const { isOpen, isCollapsed } = useSelector(
    (state: RootState) => state.sidebar
  );

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

  const SidebarContent = ({
    collapsed = false,
    onItemClick = () => {},
  }: {
    collapsed?: boolean;
    onItemClick?: () => void;
  }) => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b px-4 h-15">
        {!collapsed ? (
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-semibold text-primary-foreground">
                C
              </span>
            </div>
            <span className="font-semibold">Collabify</span>
          </div>
        ) : (
          <div className="mx-auto">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-semibold text-primary-foreground">
                C
              </span>
            </div>
          </div>
        )}
      </div>

      {/* New Project Button */}
      {!collapsed && (
        <div className="p-4">
          <Button
            className="w-full justify-start space-x-2"
            onClick={onItemClick}
            size={collapsed ? "icon" : "default"}
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </Button>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Button
                variant="ghost"
                className="w-full justify-start space-x-2"
                size={collapsed ? "icon" : "default"}
                asChild
              >
                <Link href={item.href} onClick={onItemClick}>
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Settings Section */}
      <div className="px-4 pb-4">
        {!collapsed && (
          <div className="mb-3">
            <h3 className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Settings
            </h3>
          </div>
        )}
        <ul className="space-y-2">
          {settingsItems.map((item) => (
            <li key={item.label}>
              <Button
                variant="ghost"
                className="w-full justify-start space-x-2"
                size={collapsed ? "icon" : "default"}
                asChild
              >
                <Link href={item.href} onClick={onItemClick}>
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger Button */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={() => dispatch(toggleSidebar())}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent onItemClick={() => dispatch(closeSidebar())} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <div
          className={`relative flex h-screen flex-col border-r bg-background transition-all duration-300 ease-in-out ${
            isCollapsed ? "w-16" : "w-64"
          }`}
        >
          {/* Collapse Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-5 z-10 h-6 w-6 rounded-full border bg-background shadow-md"
            onClick={() => dispatch(toggleCollapse())}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              className={`h-3 w-3 transition-transform ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </Button>

          <SidebarContent collapsed={isCollapsed} />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
