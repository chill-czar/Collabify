"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

// Stale time configurations for different query types
export const STALE_TIME = {
  PROJECTS: 1000 * 60 * 5, // 5 minutes - projects change infrequently
  FILES: 1000 * 60, // 1 minute - files change moderately
  FOLDERS: 1000 * 60, // 1 minute - folders change moderately
  USER: 1000 * 60 * 10, // 10 minutes - user data is mostly static
  DEFAULT: 1000 * 30, // 30 seconds - generic data
} as const;

// Export a shared QueryClient instance for use across the app
let sharedQueryClient: QueryClient | null = null;

export function getQueryClient() {
  if (!sharedQueryClient) {
    sharedQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 1,
          staleTime: 1000 * 30, // 30 seconds default
          gcTime: 1000 * 60 * 5, // 5 minutes garbage collection
        },
      },
    });
  }
  return sharedQueryClient;
}

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
