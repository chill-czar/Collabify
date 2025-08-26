"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Search, Plus, Upload, Filter } from "lucide-react";
import { FileManagerDemo } from "@/components/editor/files/FileManagerDemo";
import Toolbar from './Toolbar';

export default function ProjectFilesPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const projectId = params?.projectId as string;
  const folderId = searchParams.get("folderId") ?? null;

  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
     <Toolbar projectId={projectId} parentFolderId={folderId} />

      {/* File Manager */}
      <div className="flex-1 overflow-hidden">
        <FileManagerDemo
          projectId={projectId}
          folderId={folderId}
          searchQuery={searchQuery}
        />
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">Upload Files</h2>
            <p className="text-gray-600 mb-4">
              Upload modal implementation goes here
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Folder Modal */}
      {showCreateFolderModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">Create New Folder</h2>
            <p className="text-gray-600 mb-4">
              Create folder modal implementation goes here
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCreateFolderModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
