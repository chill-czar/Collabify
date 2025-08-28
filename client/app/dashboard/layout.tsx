"use client";

import SyncUser from "@/components/ui/SyncUser";
import React from "react";
import Sidebar from "../../components/ui/Sidebar";
import Header from "../../components/Dashboard/Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex flex-col">
      {/* Optional user sync */}
      <SyncUser />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar stays fixed */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex flex-col flex-1 overflow-auto">
          {/* Header stays fixed */}
          <Header />

          {/* Scrollable content */}
          <main className="flex-1 p-4">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
