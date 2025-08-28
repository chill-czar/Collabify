"use client";
import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { FileManagerDemo } from "@/components/editor/files/FileManagerDemo";
import Toolbar from "./Toolbar";

export default function ProjectFilesPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params?.projectId as string;
  const folderId = searchParams.get("folderId") ?? null;
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Header / Toolbar */}
      <div className="sticky top-0 border-b bg-white">
        <Toolbar projectId={projectId} />
      </div>

      {/* File Manager Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="h-full w-full">
          <FileManagerDemo
            projectId={projectId}
            folderId={folderId}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
}
