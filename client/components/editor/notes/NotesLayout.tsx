"use client";

import { Spinner } from "@/components/spinner";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import React from "react";
import { Navigation } from "./Navigation";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect("/");
  }

  return (
    <div className="flex w-full h-full dark:bg-[#1F1F1F] overflow-hidden">
      {/* Sidebar should stick full height */}
      <Navigation />

      {/* Children area takes full height + scrolls internally */}
      <main className="flex-1 h-full w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
