# Data Fetching Patterns

This document describes the standardized data fetching patterns used in the Collabify application.

## Overview

We use two data fetching libraries, each for specific use cases:

### 1. TanStack Query (React Query)
**Use for:** REST API calls to the backend server

**Examples:**
- File operations (upload, list, update, delete)
- Folder operations
- Project management
- User authentication data
- Any HTTP-based API calls

**Location:** `client/lib/files/api.ts`, `client/lib/projects/api.ts`

**Benefits:**
- Caching and stale-while-revalidate strategy
- Automatic retries and error handling
- Optimistic updates
- Perfect for traditional REST APIs

### 2. Convex
**Use for:** Real-time collaborative features

**Examples:**
- Whiteboard/canvas data (requires real-time sync)
- Collaborative notes/documents
- Board management
- Any feature requiring real-time updates across multiple users

**Location:** `client/components/editor/board/*`, `client/components/editor/notes/*`

**Benefits:**
- Real-time synchronization
- Automatic reactivity to database changes
- Built-in optimistic updates
- Perfect for collaborative features

## Guidelines

1. **Don't mix both libraries for the same feature** - Choose one based on the use case
2. **Use TanStack Query for standard CRUD operations** - Files, projects, user data
3. **Use Convex for real-time collaboration** - Boards, notes, collaborative editing
4. **Keep hooks in dedicated files** - Organize by feature domain
5. **Always use proper TypeScript types** - Ensure type safety across data fetching

## Migration Notes

If you need to migrate from one pattern to another:
- REST API → TanStack Query: Create hooks in `client/lib/{feature}/api.ts`
- Real-time → Convex: Use Convex queries/mutations in component files
