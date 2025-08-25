ROLE

You are an expert Next.js (App Router) + TypeScript frontend engineer with deep knowledge of React, TailwindCSS, GSAP/Framer Motion micro-interactions, TanStack Query (React Query), and file management UX (Google Drive-style).

Build a complete, working Files Tab component for the Collabify editor page that integrates with existing REST APIs exactly as specified in the API contracts the user will provide at generation time.

⚠️ Important:

Do not invent endpoints or payload shapes.

Use the exact routes, query params, and request/response bodies from the provided API contracts.

Name types to match the contracts.

If a field is missing, add a TODO clearly labeled (// TODO(api):).

TECH CONSTRAINTS

Next.js 14+ App Router, React 18+, TypeScript.

UI: TailwindCSS only (no other CSS frameworks). Icons from lucide-react.

State: Local component state + TanStack Query for server data (cache, pagination, optimistic updates).

Animations: Framer Motion for subtle transitions & micro-interactions.

Sidebar slide-in/out.

File/folder hover.

Context menu fade/scale.

Upload progress transitions.

No server actions. Use fetch with provided endpoints.

No external libraries for search → client-side filtering only.

OUTPUT REQUIREMENT
1. Main Export

Default export:
components/files/FilesTab.tsx → FilesTab (main entry component).

2. Code Splitting & Structure

Each subcomponent lives in components/files/ as its own .tsx file.

Each is self-contained, portable, reusable.

Suggested structure:

components/files/
├── FilesTab.tsx          // main entry
├── Toolbar.tsx
├── UploadDropzone.tsx
├── Breadcrumbs.tsx
├── FiltersBar.tsx
├── FileGrid.tsx
├── FileCard.tsx
├── FolderTile.tsx
├── RightSidebar.tsx
├── ContextMenu.tsx
└── EmptyState.tsx

3. Implementation Rules

FilesTab orchestrates layout & imports all subcomponents.

Use clean props interfaces with TypeScript types for maintainability.

Styling: TailwindCSS only, no inline styles.
Subcomponents must be individually testable (pure UI with props).
 **API Contracts**:
  - All request/response interfaces must be defined in a **Contracts & Types** section at the bottom of the file.
  - Keep contracts separate from main logic to avoid clutter.
4. Code Quality

Code must look human-written, not AI-generated.

Descriptive variable names.

Comments only where useful.

Avoid robotic abstractions or unnecessary factories.

Natural formatting and indentation.

Include // TODO: for incomplete API details.

Keep flexibility for future updates (extensible props, modular structure).

5. UI/UX Style

Minimal, clean, Google-Drive-like aesthetic.

File/Folder cards styled with:

Rounded corners.

Subtle shadows.

Thumbnail or icon.

Filename.

Owner chip.

Kebab menu (context menu).
---

# FEATURES & BEHAVIOR (MUST-HAVES)

## Core

* **List & Navigate**: Display **folders first**, then **files** within the current folder. Support **nested navigation** with a **breadcrumb** (root → … → current). Clicking a folder drills in and updates the breadcrumb.
* **Upload**: Drag & drop **and** button to upload *any media type* supported by backend. Show inline progress per item (optimistic placeholder card). On success, refetch or optimistic insert.
* **Create Folder**: Inline modal/dialog to create a folder in the current path. Optimistic UI.
* **Search (client‑side only)**: A search input that filters current in‑memory list by **name** (no API calls). Debounced 150ms. Highlight matched substring in results.
* **Filter by Type**: Quick filters (All, Images, Video, Audio, Documents, Other, Starred). Multi-toggle supported. Persist selection in component state.
* **Star / Unstar**: Star files or folders. Optimistic toggle with rollback on failure.
* **Right Sidebar (Details Pane)**: Opens when a file **or** folder is selected (clicking anywhere except the 3‑dot menu). Shows:

  * **Details**: name, type, size, createdAt, updatedAt, path, owner (avatar + name), starred state, tags (if available), and mock preview if file (image/video thumbnail or generic icon).
  * **Activity (mock)**: Render a fake activity timeline local to the component if API not provided.
  * **Comments (mock)**: Local, in‑memory comment thread (persist for session only).
* **Context Menu (3 dots)** on each card/tile with actions permitted by API: Open, Download (if allowed), Rename, Move, Star/Unstar, Delete. Disable items when not permitted.
* **Selection**: Single select by click; **multi-select** with ⌘/Ctrl or Shift-click. Bulk actions in toolbar when multiple selected (Delete, Move, Star/Unstar, Download).
* **Preview**: File cards show a **thumbnail** (use provided thumbnail URL if available, else use a **demo placeholder**), file type badge/icon, filename, owner avatar (tiny), and kebab menu.
* **Folders UI**: Folders appear as **folder tiles** (not cards) with a folder icon, name, item count if provided, owner avatar, kebab menu. Looks like Drive folders.
* **Empty States & Skeletons**: Show skeletons while loading; tailored empty states for no results, no starred items, and empty folder.
* **Error Handling**: Toasts for failures. Rollback optimistic changes.
* **Keyboard**: `Backspace` = go up one level if no input active, `Enter` on focused item opens, `Delete` triggers delete (confirm modal), `Ctrl/Cmd+K` focuses search.

## Nice-to-haves (include if trivial)

* **Infinite scroll / pagination** if the API returns paginated results (detect from response and integrate via useInfiniteQuery).
* **Grid/List toggle**.
* **Sort**: By name, size, modified (asc/desc). Client-side if API doesn’t support.
Mock activity/comments in the right sidebar must persist only in component state (per session).
---

# API INTEGRATION (MATCH CONTRACTS EXACTLY)

> Replace example endpoints with the exact ones from the provided contracts. Do not change field names.

* **List folder contents**: `GET /api/folders/:folderId?include=children&types=file,folder`

  * Response: `{ folder: Folder; parents: Folder[]; files: File[]; folders: Folder[] }` (or match provided)
* **Open folder by id**: same as list; clicking navigates and queries this endpoint.
* **Create folder**: `POST /api/folders` with `{ name, parentId, projectId }` → returns created `Folder`.
* **Upload file**: `POST /api/files/upload` (or signed URL flow). Show progress. On completion, returns `File` incl. `thumbnailUrl?`.
* **Star/Unstar**: `PATCH /api/files/:id/star` & `PATCH /api/folders/:id/star` with `{ starred: boolean }` → returns updated entity.
* **Rename**: `PATCH /api/files/:id` or `/api/folders/:id` with `{ name }`.
* **Delete**: `DELETE /api/files/:id` and `DELETE /api/folders/:id`.
* **Move** (if available): `PATCH /api/files/:id/move` with `{ targetFolderId }` and similar for folders.
* **Download** (if available): provide `href` to `file.downloadUrl`.

> If your backend uses different routes (e.g., `/app/api/...`, query params for `projectId`, etc.), use those instead. **All zod/prisma constraints must be respected**.

---
CONTRACTS & TYPES (MATCH API)

Define interfaces in each file under a Contracts & Types section.

Must match provided API contracts exactly.

If missing, add // TODO(api):.
# CONTRACTS & TYPES (MATCH API)

Create TS interfaces from the provided contracts. Example shape (EDIT to match):

```ts
export type FileType = "image" | "video" | "audio" | "document" | "archive" | "code" | "other";

export interface BaseEntity { id: string; name: string; createdAt: string; updatedAt: string; owner: { id: string; name: string; avatarUrl?: string }; starred?: boolean; }
export interface FileItem extends BaseEntity { type: FileType; size?: number; mime?: string; thumbnailUrl?: string | null; downloadUrl?: string; parentId: string | null; projectId: string; }
export interface FolderItem extends BaseEntity { parentId: string | null; projectId: string; childrenCount?: number; }

export interface ListResponse { folder: FolderItem; parents: FolderItem[]; files: FileItem[]; folders: FolderItem[]; page?: number; pageSize?: number; nextCursor?: string | null; }
```

---

# UI SPEC (GOOGLE DRIVE‑LIKE)

* **Toolbar (top)**: Breadcrumbs (left), actions (New → Folder, Upload), Search input, Filters dropdown (Type, Starred), View toggle (Grid/List). When selection > 0, show bulk actions.
* **Grid (default)**: Responsive grid; **folders first** (folder tiles), then file cards. Cards have: thumbnail (16:9 for media), filename (truncate), owner avatar chip, type badge, kebab menu. Hover reveals quick actions (Star, Download).
* **Right Sidebar**: Slide-in panel from right (`Sheet` from shadcn) with tabs: Details | Activity | Comments. Comments are in-memory, mock-only (id, author, message, createdAt). Activity is mock with sample events (Uploaded, Renamed, Starred, Moved).
* **Context Menu**: shadcn `DropdownMenu` triggered by 3-dots on each item.
* **Drag & Drop**: Entire grid accepts drops; if dropping over a folder tile, visually indicate and allow dropping **into** that folder (if supported). Otherwise, upload to current folder.
* **Accessibility**: Keyboard focus rings, ARIA labels, proper roles, and readable contrasts.

---

# IMPLEMENTATION DETAILS

## Data Fetching

* Wrap in a TanStack `QueryClientProvider` assumption (document in comments). Use `useQuery` / `useInfiniteQuery`. Keyed by `["files", projectId, folderId]`.
* After mutations (create, upload, star, rename, delete, move), either **optimistic update** the cache or `invalidateQueries`.

## Local State Shape

```ts
const [state, setState] = useState({
  view: "grid" as "grid" | "list",
  search: "",
  filters: { types: new Set<FileType>(), starredOnly: false },
  selection: new Set<string>(),
  currentFolderId: initialFolderId,
  rightPanel: { open: false, entity: null as (FileItem | FolderItem | null), tab: "details" as "details" | "activity" | "comments" },
});
```

## Client-side Search & Filter

* Debounce search (150ms). Filter **only** the currently loaded lists (no API) by case-insensitive `name` and active `filters`.

## Icons

Map file type → icon (lucide): `image → Image`, `video → Film`, `audio → Music`, `document → FileText`, `archive → Archive`, `code → Code2`, `other → File`.

## Thumbnails

* If `thumbnailUrl` present, show it. Else show a **demo placeholder** image (solid gradient with file type icon centered). Generate placeholder with a tiny inline SVG or a static asset.

## Upload

* Provide both button and drag‑drop. Show per-file progress bar and transient “processing” badge if the API is async.
* If backend uses signed URLs, implement the two-step flow (get signed URL → PUT → finalize endpoint). Otherwise, `multipart/form-data` directly.

## Optimistic Mutations

* **Star**: Toggle immediately; rollback if error.
* **Create Folder**: Insert at top of folders list with a temporary id; replace with server payload on success.
* **Rename**: Update local. If failure, revert and toast.
* **Delete**: Remove from cache immediately; on failure, revert.

## Error & Loading

* Skeleton cards for initial load (12 items). Distinguish empty folder vs. no search results.
* shadcn `useToast` for all errors/success messages.

## Routing (optional)

* Accept `projectId` and optional `initialFolderId` as props. If App Router params are available, read via `useParams`. Breadcrumb segments push a local stack; no navigation to route is required unless desired.

---

# COMPONENT PROPS

```ts
export interface FilesTabProps {
  projectId: string;
  initialFolderId: string | null; // null = project root
  api: {
    listFolder: (args: { projectId: string; folderId: string | null; cursor?: string }) => Promise<ListResponse>;
    createFolder: (args: { projectId: string; parentId: string | null; name: string }) => Promise<FolderItem>;
    uploadFile: (args: { projectId: string; parentId: string | null; file: File }) => Promise<FileItem>; // or signed URL flow
    starFile: (args: { id: string; starred: boolean }) => Promise<FileItem>;
    starFolder: (args: { id: string; starred: boolean }) => Promise<FolderItem>;
    renameFile: (args: { id: string; name: string }) => Promise<FileItem>;
    renameFolder: (args: { id: string; name: string }) => Promise<FolderItem>;
    deleteFile: (args: { id: string }) => Promise<{ success: true }>;
    deleteFolder: (args: { id: string }) => Promise<{ success: true }>;
    moveFile?: (args: { id: string; targetFolderId: string }) => Promise<FileItem>;
    moveFolder?: (args: { id: string; targetFolderId: string }) => Promise<FolderItem>;
  };
}
```

> Implement **default API adapters** that call the real endpoints (using the provided contracts). Also export the prop-less version that reads from a central `apiClient` if available.

---

# TEST DATA & MOCKS

* Provide a small in-file `MOCK_ACTIVITY` and `MOCK_COMMENTS` generator keyed by entity id for the Right Sidebar, used when the API does not exist.
* Provide a `DEMO_THUMBNAIL_URL` constant for placeholder thumbnails.

---

# FINAL ACCEPTANCE CHECKLIST (AUTO-VERIFY VIA COMMENTS)

* [ ] Renders folders first, then files, grid by default.
* [ ] Breadcrumb works across arbitrary depth; parents shown from root.
* [ ] Client-side search filters displayed items without hitting API.
* [ ] Type filters and Starred toggle work together.
* [ ] Drag‑drop uploads to current folder; shows per-item progress.
* [ ] Create folder dialog works; optimistic insert.
* [ ] Star toggle works on both files and folders; optimistic.
* [ ] Right sidebar opens on item click; tabs: Details/Activity/Comments.
* [ ] 3‑dot menu supports: Open, Rename, Move (if provided), Star/Unstar, Delete, Download (if available).
* [ ] Multi-select and bulk actions in toolbar.
* [ ] Loading skeletons and tailored empty states.
* [ ] Errors handled with toasts, optimistic rollback.
* [ ] Accessible keyboard nav + ARIA labels.

---

# CODE STYLE NOTES

* Use **functional components**, hooks, and explicit types.
* Keep Tailwind classes tidy and readable; extract repetitive classes into small utilities when needed.
* Keep animations subtle (opacity/scale on cards, slide for sidebar, shimmer for skeletons).
* Provide JSDoc on public functions/props.

---

# DELIVERABLES

Output a well-split codebase under components/files/ as specified in OUTPUT REQUIREMENT.

Each component is its own .tsx file.

Provide full code with proper imports so it can be copy-pasted directly.

Do not collapse into one file unless explicitly asked.

Do not leave TODOs unresolved unless the API contract is missing; mark them clearly.

### API Contracts, Endpoints & Types (Start from here)
This section contains all API definitions, request/response contracts, and TypeScript types needed for the system.



// 📌 Endpoint: POST /api/files/upload

// ----------------------
// Request Body (FormData)
// ----------------------
export interface UploadFileRequest {
  file: File;                  // required → actual file being uploaded
  fileName: string;            // required → name of the file
  projectId: string;           // required → project ID
  folderId?: string | null;    // optional → folder ID
  category?: string;           // optional → file category (enum: IMAGE, VIDEO, DOCUMENT, OTHER, etc.)
  description?: string | null; // optional → file description
  tags?: string[];             // optional → array of tags
}

// ----------------------
// Success Response (201)
// ----------------------
export interface UploadFileResponse {
  success: true;
  data: {
    id: string;                     // file record ID (from Prisma)
    fileName: string;               // stored file name
    fileType: string;               // MIME type (e.g., "image/png")
    fileSize: number;               // size in bytes
    fileUrl: string;                // S3 key (path to file in S3 bucket)
    projectId: string;              // linked project ID (as hex string)
    folderId?: string | null;       // linked folder ID if any
    uploadedBy: string;             // uploader's user ID
    category: string;               // file category (enum from Prisma: IMAGE, VIDEO, DOCUMENT, OTHER…)
    description?: string | null;    // optional description
    tags: string[];                 // stored tags
    status: "ACTIVE" | "INACTIVE";  // file status
    visibility: "PROJECT_MEMBERS" | "PUBLIC"; // who can see this file
    createdAt: string;              // timestamp of creation
    updatedAt: string;              // timestamp of last update
  };
}

// ----------------------
// Error Responses
// ----------------------
export interface ErrorResponse {
  error: string; // e.g., "Unauthorized", "Missing required fields", "User not found", "Internal Server Error"
}

// 📌 Endpoint: GET /api/files/project/:projectId?folderId=<optional>

// ----------------------
// Query Parameters
// ----------------------
export interface GetProjectFilesQuery {
  folderId?: string; // optional → must be a valid Mongo ObjectId if provided
}

// ----------------------
// Path Parameters
// ----------------------
export interface GetProjectFilesParams {
  projectId: string; // required → must be a valid Mongo ObjectId
}

// ----------------------
// Success Response (200)
// ----------------------
export interface GetProjectFilesResponse {
  success: true;
  data: {
    files: {
      id: string;
      fileName: string;
      fileType: string;
      fileSize: number;
      folderId: string | null;
      createdAt: string;
      updatedAt: string;
      fileUrl: string;
      category: string;
      tags: string[];
      description: string | null;
      uploadedBy: string;
      parentFileId: string | null;
      parentFile: any | null; // could be expanded type if needed
      status: string;
      isStarred: boolean;
      downloadCount: number;
      visibility: string;
      accessUsers: any[]; // Prisma relation → could be refined
      shareLinks: any[];  // Prisma relation → could be refined
    }[];
    folders: {
      id: string;
      name: string;
      parentFolderId: string | null;
      color: string | null;
      createdAt: string;
      updatedAt: string;
    }[];
  };
}

// ----------------------
// Error Responses
// ----------------------
export interface ErrorResponse {
  success: false;
  error: string; // "Unauthorized" | "Invalid projectId" | "Invalid query" | "Internal Server Error"
  details?: any; // Zod error details (for invalid query)
}

// 📌 Endpoint: GET /api/files/:fileId

// ----------------------
// Path Parameters
// ----------------------
export interface GetFileParams {
  fileId: string; // required → must be a valid file ID
}

// ----------------------
// Success Response (200)
// ----------------------
export interface GetFileResponse {
  success: true;
  data: {
    file: {
      id: string;
      fileName: string;
      fileType: string;
      fileSize: number;
      fileUrl: string; // presigned if PRIVATE / SPECIFIC_USERS
      category: string;
      version: number;
      isStarred: boolean;
      downloadCount: number;
      status: string;
      visibility: "PUBLIC" | "PRIVATE" | "SPECIFIC_USERS" | "PROJECT_MEMBERS";
      description?: string;
      tags: string[];
      projectId: string;
      uploadedBy: {
        id: string;
        displayName: string;
        email: string;
        avatar?: string;
      };
      folder?: {
        id: string;
        name: string;
        description?: string;
        color?: string;
        parentFolderId?: string;
      };
      parentFile?: {
        id: string;
        fileName: string;
        version: number;
      };
      versions: {
        id: string;
        version: number;
        createdAt: string;
      }[];
      accessUsers: {
        id: string;
        userId: string;
        permission: string;
      }[];
      shareLinks: {
        id: string;
        shareToken: string;
        permission: string;
        expiresAt?: string;
      }[];
      createdAt: string;
      updatedAt: string;
    };
  };
  timestamp: string; // server timestamp (ISO8601)
}

// ----------------------
// Error Responses
// ----------------------
export interface ErrorResponse {
  error:
    | "Unauthorized"
    | "User not found"
    | "File not found"
    | "Forbidden"
    | "Invalid request parameters"
    | "Internal server error";
  details?: any; // Zod validation details if 400
}


// PATCH /api/files/:fileId/update

// --------------------
// Request Body
// --------------------
interface PatchFileUpdateRequest {
  fileName?: string;       // optional new name for the file
  description?: string | null; // optional description update
  tags?: string[];         // optional tags update
  category?: string;       // optional category update
  visibility?: "PRIVATE" | "PROJECT_MEMBERS" | "PUBLIC"; // optional visibility
}

// --------------------
// Response Body
// --------------------
interface PatchFileUpdateResponse {
  success: boolean; // true if update was successful
  data?: {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    fileUrl: string;
    projectId: string;
    folderId: string | null;
    uploadedBy: string;
    category: string;
    description: string | null;
    tags: string[];
    status: "ACTIVE" | "ARCHIVED" | "DELETED";
    visibility: "PRIVATE" | "PROJECT_MEMBERS" | "PUBLIC";
    createdAt: string; // ISO date
    updatedAt: string; // ISO date
  };
  error?: string; // present if success=false
}

// DELETE /api/files/:fileId/delete

// --------------------
// Request
// --------------------
// - No request body
// - Path Param: fileId (string, 24-hex ObjectId)
// - Authentication: Clerk (currentUser)
// - Authorization: uploader OR project member with admin/delete permission


// --------------------
// Success Response
// --------------------
interface DeleteFileSuccessResponse {
  success: true;
  message: string;      // "File deleted successfully"
  timestamp: string;    // ISO timestamp
}

// --------------------
// Error Response
// --------------------
interface DeleteFileErrorResponse {
  success: false;
  error: string;        // error message (e.g., "Unauthorized: missing Clerk session")
  details?: any;        // optional metadata (validation errors, DB errors, S3 errors, etc.)
  timestamp: string;    // ISO timestamp
}

// POST /api/folders

// --------------------
// Request Body
// --------------------
interface CreateFolderRequest {
  projectId: string;                 // required, must exist
  name: string;                      // required, 1–255 chars
  parentFolderId?: string | null;    // optional, must belong to same project if provided
  description?: string;              // optional, max 2000 chars
  metadata?: Record<string, any>;    // optional
}

// --------------------
// Success Response
// --------------------
interface CreateFolderSuccessResponse {
  success: true;
  message: "Folder created successfully";
  data: {
    id: string;
    name: string;
    projectId: string;
    parentFolderId: string | null;
    description: string | null;
    metadata: Record<string, unknown> | null;
    createdBy: {
      id: string;
      name: string | null;
    };
    createdAt: string; // ISO timestamp
    updatedAt: string; // ISO timestamp
  };
  timestamp: string;   // ISO timestamp
}

// --------------------
// Error Response
// --------------------
interface CreateFolderErrorResponse {
  success: false;
  error: string;        // error message
  details?: any;        // validation errors, stack trace (dev mode), etc.
  timestamp: string;    // ISO timestamp
}

// ==========================
// Endpoint
// ==========================
// GET /api/folders/:folderId


// --------------------------
// Request Params
// --------------------------
interface GetFolderParams {
  folderId: string; // required, must be a valid folder ID
}

// --------------------------
// Response Types
// --------------------------
interface FileResponse {
  id: string;
  name: string;
  size: number;
  presignedUrl?: string; // temporary signed URL for download/access
}

interface SubfolderResponse {
  id: string;
  name: string;
}

interface FolderResponse {
  id: string;
  name: string;
  projectId: string;
  parentFolderId?: string | null;
  description?: string | null;
  metadata?: Record<string, any>; // e.g. { color: "blue" }
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  files: FileResponse[];
  subfolders: SubfolderResponse[];
}

// --------------------------
// Success Response
// --------------------------
interface GetFolderSuccessResponse {
  success: true;
  data: FolderResponse;
  timestamp: string; // ISO timestamp
}

// --------------------------
// Error Response
// --------------------------
interface GetFolderErrorResponse {
  success?: false; // sometimes omitted in your route, worth standardizing
  error: string | object; // plain string or zod error object
  timestamp?: string;
}
// ==========================
// Endpoint
// ==========================
// PATCH /api/folders/:folderId/update


// --------------------------
// Path Params
// --------------------------
interface PatchFolderParams {
  folderId: string; // required, must be a valid folder ID
}

// --------------------------
// Request Body
// --------------------------
interface PatchFolderRequestBody {
  name?: string; // 1–255 chars
  description?: string; // up to 2000 chars
  parentFolderId?: string | null; // null = detach from parent
  metadata?: Record<string, unknown>; // free-form object
  color?: string; // optional color, max 50 chars
}

// --------------------------
// Success Response
// --------------------------
interface PatchFolderSuccessResponse {
  success: true;
  data: {
    id: string;
    name: string;
    projectId: string;
    parentFolderId: string | null;
    description: string | null;
    metadata: Record<string, unknown> | null;
    color: string | null;
    createdBy: {
      id: string | null;
      name: string | null;
    };
    createdAt: string; // ISO timestamp
    updatedAt: string; // ISO timestamp
  };
  message: string; // e.g. "Folder updated successfully"
  timestamp: string; // ISO timestamp
}

// --------------------------
// Error Response
// --------------------------
interface PatchFolderErrorResponse {
  success: false;
  error: {
    code:
      | "invalid_path_params"
      | "unauthenticated"
      | "invalid_json"
      | "invalid_body"
      | "user_not_found"
      | "folder_not_found"
      | "forbidden"
      | "parent_not_found"
      | "parent_different_project"
      | "circular_hierarchy"
      | "invalid_hierarchy"
      | "nothing_to_update"
      | "not_found"
      | "internal_error";
    message: string;
    details?: unknown; // may contain Zod validation errors or role requirements
  };
  timestamp: string; // ISO timestamp
}
/**
 * DELETE /api/folders/:folderId
 *
 * Deletes a folder. Can also delete all subfolders and files if `force=true`.
 */

// =============================
// Request Types
// =============================

/** Path params */
export interface DeleteFolderParams {
  folderId: string; // must be a 24-char Mongo ObjectId
}

/** Query params */
export interface DeleteFolderQuery {
  force?: boolean; // default false; if true, deletes non-empty folders
}

// =============================
// Response Types
// =============================

/** Success response */
export interface DeleteFolderSuccess {
  success: true;
  message: string; // "Folder deleted successfully"
  data: {
    folderId: string;
    deletedFilesCount: number;        // how many files deleted
    deletedSubfoldersCount: number;   // how many subfolders deleted (excluding root)
    s3DeletedObjectsCount: number;    // how many objects deleted from S3
  };
  timestamp: string; // ISO date string
}

/** Error response */
export interface DeleteFolderError {
  success: false;
  error: string;   // error message
  details?: unknown; // extra context (e.g., validation errors, counts, etc.)
}

// =============================
// Union Response Type
// =============================

export type DeleteFolderResponse =
  | DeleteFolderSuccess
  | DeleteFolderError;

