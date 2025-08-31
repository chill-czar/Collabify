"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import React, { useEffect, useMemo } from "react";
import { Spinner } from "../../spinner";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { FileText } from "lucide-react";
import dynamic from "next/dynamic";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Cover } from "./Cover";
import { Toolbar } from "./Toolbar";

const Notes = () => {
  const { isLoading } = useConvexAuth();
  const currentNoteId = useSelector(
    (state: RootState) => state.currentNoteId.noteId
  ) as Id<"documents"> | null;

  // Always define hooks in same order
  const document = useQuery(
    api.documents.getById,
    currentNoteId ? { documentId: currentNoteId } : "skip"
  );
  const update = useMutation(api.documents.update);

  const Editor = useMemo(
    () => dynamic(() => import("./Editor"), { ssr: false }),
    []
  );

  const onChange = (content: string) => {
    if (!currentNoteId) return;
    update({ id: currentNoteId, content });
  };

  if (isLoading) {
    return (
      <div className="h-full h-screen flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!currentNoteId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <FileText className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">
          No Note Selected
        </h2>
        <p className="text-gray-500 mt-2 max-w-md">
          Select a note from the list or create a new one to get started.
        </p>
      </div>
    );
  }

  if (document === undefined) {
    return <Spinner size="lg"/>;
  }

  if (document === null) {
    return <div>Not Found</div>;
  }

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lg:md-max-w-4xl mx-auto">
        <Toolbar initialData={document} />
        <Editor onChange={onChange} initialContent={document.content} />
      </div>
    </div>
  );
};

export default Notes;
