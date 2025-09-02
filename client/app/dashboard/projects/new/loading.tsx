"use client";

import { Spinner } from "@/components/spinner";


export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Spinner size="lg" /> {/* lg size */}
    </div>
  );
}
