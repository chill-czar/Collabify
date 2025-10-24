"use client";

import api from "@/lib/axios";
import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";

export default function SyncUser() {
  const done = useRef(false);
  const prevUserIdRef = useRef<string | null | undefined>(null);
  const { isSignedIn, userId } = useAuth();

  useEffect(() => {
    if (prevUserIdRef.current !== userId) {
      done.current = false;
    }
    prevUserIdRef.current = userId;
    if (!isSignedIn || done.current) return;
    done.current = true;

    // fire and forget; errors are logged server-side
    api.post("/sync-user").then(() => console.log("User synced"));
  }, [isSignedIn, userId]);

  return null;
}
