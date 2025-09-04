import React from 'react'
import DashboardCards from "../../components/Dashboard/Card";
import Dashboard from "../../components/Dashboard/RecentProjects";
import { currentUser } from '@clerk/nextjs/server';

const page = async () => {
  const user = await currentUser();
  return (
    <>
      <div className="flex flex-col flex-1 p-4 ">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
            Welcome back, {user?.firstName || "there"}!
          </h1>
          <p className="text-base sm:text-lg text-gray-600 font-medium">
            Here's what's happening with your projects today.
          </p>
        </div>
        <DashboardCards />
        <Dashboard />
      </div>
    </>
  );
}

export default page