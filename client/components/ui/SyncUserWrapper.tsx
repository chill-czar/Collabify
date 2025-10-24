"use client";

import dynamic from "next/dynamic";

const SyncUser = dynamic(() => import("@/components/ui/SyncUser"), { ssr: false });

export default function SyncUserWrapper() {
  return <SyncUser />;
}
