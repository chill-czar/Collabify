"use client";

import api from "@/lib/axios";
import { useEffect, useRef } from "react";

export default function SyncUser() {
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    // fire and forget; errors are logged server-side
      api.post("/sync-user").then(() => console.log("User synced")    
      )
  }, []);

  return null;
}
