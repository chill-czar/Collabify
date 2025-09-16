## Collabify — Unified Collaboration Workspace for Modern Teams

Build, plan, and create together. Collabify brings notes, whiteboards, files, tasks, and video huddles into one developer-friendly workspace with real-time collaboration and robust permissions.

### Why Collabify?
Teams juggle too many tools. Collabify reduces context switching by unifying core collaboration primitives—documents, boards, file management, and project spaces—backed by secure access control and a modern developer stack. It’s fast, extensible, and designed for product teams who ship.

---

## Features

- **Projects & Spaces**
  - Organize work by projects with roles, membership, invites, and visibility controls.
  - Project dashboards and quick navigation.

- **Files & Folders**
  - Upload, organize, and search files by project/folder.
  - Versioning, sharing links, visibility controls, bulk ops, and presigned downloads.
  - S3 + EdgeStore-backed storage with robust metadata and tagging.

- **Notes**
  - Rich text documents powered by BlockNote.
  - Project-scoped notes, tags, and quick access.

- **Whiteboards**
  - Infinite canvas using Excalidraw.
  - Real-time collaboration for brainstorming, planning, and diagrams.

- **Video Huddles**
  - Spin up project-specific video calls.
  - Track participants and sessions in the data layer.

- **Notifications & Invites**
  - Project invitation flow with accept/decline.
  - Mark-as-read and user notifications.

- **Auth & Access Control**
  - Authentication via Clerk.
  - Protects `dashboard/*` and API routes; project-level permissions and sharing.

- **Performance & DX**
  - Next.js App Router, React 19, React Query, Zustand/Redux slices.
  - Type-safe APIs and Prisma with MongoDB.

---

## Architecture Overview

- **Frontend**: Next.js 15 App Router with React 19, server components, and client components for interactivity. UI built with shadcn/ui + Radix.
- **API Layer**: Next.js Route Handlers under `app/api/*` for files, folders, projects, user notifications, search, sharing, and uploads.
- **Auth**: Clerk middleware secures routes; client requests automatically attach Bearer tokens via Axios interceptor.
- **Data Layer**:
  - Prisma ORM with MongoDB for core entities: `User`, `Project`, `File`, `Folder`, `Note`, `Whiteboard`, `Task`, `VideoCall`, `ProjectInvite`, `Notification`, etc. See `prisma/schema.prisma`.
  - Convex for real-time collaboration primitives (`documents`, `board`) with Clerk auth config in `convex/auth.config.js`.
- **Storage**:
  - AWS S3 for durable file storage and presigned downloads (`lib/s3.ts`).
  - EdgeStore for performant uploads/downloads and CDN delivery (`app/api/edgestore/[...edgestore]/route.ts`, `lib/edgestore.ts`).
- **Client Data Fetching**: Axios client + React Query for caching, mutations, and invalidations (`lib/apiClient.ts`, `lib/files/api.ts`, `lib/projects/api.ts`, `lib/notifications/api.ts`).
- **State Management**: Redux Toolkit slices under `lib/slices/*` and selective Zustand usage.
- **Middleware**: `middleware.ts` protects `/dashboard(.*)` and all API routes with Clerk.
- **Logging**: Winston logs in `logs/`.

Suggested diagram (add to `docs/architecture.png` and embed):
- Browser → Next.js App Router (UI)
- Next.js API Routes → Prisma → MongoDB
- Next.js API Routes → S3 + EdgeStore
- Convex Functions ↔ Clerk Auth
- React Query Cache ↔ Axios (Bearer tokens via Clerk)

---

## How It Works (Flow)

- **Auth Flow**
  - Clerk middleware guards protected routes.
  - Client requests use Axios; an interceptor fetches a Clerk session token and attaches `Authorization: Bearer <token>`.

- **Project & Membership**
  - `GET /api/projects` returns projects where the user is creator or member (`app/api/projects/route.ts`).
  - Members and invites managed via `/api/projects/[projectId]/members` and `/api/projects/[projectId]/...`.

- **Files**
  - Upload via `POST /api/files/upload` with FormData. Stored in EdgeStore/S3; metadata and relations stored via Prisma.
  - Browse project files `/api/files/project/[projectId]` with optional folder filtering.
  - Manage metadata via `/api/files/[fileId]/update`, versioning `/api/files/[fileId]/version`, and sharing `/api/files/[fileId]/share`.
  - Download via presigned URLs `/api/files/[fileId]/download`.

- **Folders**
  - CRUD with `/api/folders` + `/api/folders/[folderId]/update/delete`.

- **Notes & Whiteboards**
  - Notes stored under Prisma `Note`; rich editor in `components/editor/notes/*`.
  - Whiteboard powered by Excalidraw via `components/editor/board/*` and stored as JSON (`Whiteboard.data`); Convex supports hierarchies and real-time (`convex/schema.ts`).

- **Video Calls**
  - Project-scoped endpoints under `/api/projects/[projectId]/video-call`.

- **Notifications & Invites**
  - `/api/users/notifications` and accept/decline invitation flows in `lib/notifications/api.ts`.

---

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, shadcn/ui, Radix UI, Tailwind CSS 4, Framer Motion
- **State/Data**: React Query 5, Redux Toolkit, Zustand
- **Auth**: Clerk
- **Backend**: Next.js Route Handlers (App Router)
- **Database/ORM**: MongoDB + Prisma
- **Real-time**: Convex (documents/boards)
- **Storage**: AWS S3, EdgeStore
- **Utilities**: Axios, Zod, Lucide, BlockNote, Excalidraw, Sonner, Winston

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB connection string (Atlas or local)
- Clerk application (issuer domain)
- AWS S3 bucket + credentials
- EdgeStore account (or compatible configuration)
- Optional: Convex project (for real-time docs/board)

### 1) Clone and Install

```bash
git clone <your-repo-url>
cd Collabify/client
npm install
```

### 2) Environment Variables

Create `.env.local` in `client/`:

```bash
# Web
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Clerk (server)
CLERK_SECRET_KEY=sk_test_...
CLERK_JWT_ISSUER_DOMAIN=https://<your-clerk-issuer-domain>  # matches convex/auth.config.js domain

# Database
DATABASE_URL="mongodb+srv://<user>:<pass>@cluster.mongodb.net/collabify?retryWrites=true&w=majority"

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET=your-public-download-bucket
AWS_S3_BUCKET_NAME=your-internal-bucket-for-deletes

# EdgeStore
EDGE_STORE_ACCESS_KEY=...
EDGE_STORE_SECRET_KEY=...

# Convex (optional, if you run convex dev)
CONVEX_DEPLOYMENT=dev
```

Notes:
- `S3_BUCKET` and `AWS_S3_BUCKET_NAME` are both referenced in code; set appropriately or unify.
- Clerk issuer domain must match your Clerk instance and Convex auth config (`convex/auth.config.js`).

### 3) Generate Prisma Client

```bash
npm run build
# or run prisma generate directly:
# npx prisma generate
```

### 4) Run the App

```bash
npm run dev
# App: http://localhost:3000
```

Optional: Start Convex (if using real-time docs/board locally):
```bash
# In project root where convex config lives
npx convex dev --yes
```

---

## Usage

- Sign up/login via Clerk.
- Create a Project from the dashboard.
- Upload files to a project or folder. Manage versions, rename, tag, and share.
- Create Notes using the rich editor; they’re scoped to your current project.
- Open Whiteboard for visual collaboration; changes sync in real time.
- Invite teammates; manage roles and accept/decline invites.
- Start a Video Call from a project.

Programmatic examples (client):

```ts
// Files: list project files
import { listFiles } from "@/lib/files/api";
const files = await listFiles({ projectId: "<projectId>" });

// Files: upload
import { uploadFile } from "@/lib/files/api";
await uploadFile({
  file: myFile,
  fileName: myFile.name,
  projectId: "<projectId>",
});

// Projects: fetch
import { fetchProjects } from "@/lib/projects/api";
const projects = await fetchProjects();
```

---

## Project Structure

- `app/`: Next.js app router pages, layouts, and API route handlers
  - `app/api/files/*`: File/folder CRUD, upload, share, search, download
  - `app/api/projects/*`: Project CRUD, members, notes, whiteboards, video calls
  - `app/dashboard/*`: Auth-protected workspace
- `components/`: UI building blocks, editor modules (notes, whiteboard, files)
- `lib/`: Axios client, Prisma client, S3, EdgeStore, React Query utils
- `convex/`: Convex schema and auth config for real-time features
- `prisma/`: Prisma schema (`schema.prisma`)
- `types/`: Shared TypeScript types (files, notifications, projects)
- `middleware.ts`: Clerk-protected routes and API paths

---

## Contributing

Contributions welcome! Please:
1. Open an issue describing the change or feature.
2. Fork the repo and create a feature branch.
3. Follow existing code style and TypeScript patterns.
4. Add/adjust types in `types/*` and keep APIs type-safe.
5. Test locally and ensure no lint/type errors.
6. Open a PR with a clear description and screenshots where relevant.

---

## License

MIT License. You’re free to use, modify, and distribute with attribution. Add your `LICENSE` file at the repo root if not present.

---

## Badges (suggested)

Add these once you integrate CI and versioning:
- Build: ![Build](https://img.shields.io/badge/build-passing-brightgreen)
- License: ![License](https://img.shields.io/badge/license-MIT-blue)
- Version: ![Version](https://img.shields.io/badge/version-0.1.0-orange)

---

## Screenshots & Diagrams (suggested)

- `public/` screenshots of Dashboard, Notes, Whiteboard, and Files
- `docs/architecture.png` diagram (auth, API, DB, storage, real-time)

---

## Notes & Roadmap Ideas

- Improve dashboard metrics (progress, status from tasks).
- Expand file parents listing for better breadcrumbing.
- Ensure consistent S3 bucket env usage (`S3_BUCKET` vs `AWS_S3_BUCKET_NAME`).
- Optional: Add E2E tests and CI/CD with Preview deployments.