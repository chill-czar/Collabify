Awesome — I’ll turn that prompt + contracts into a no-guesswork build plan you can follow end-to-end. It’s split into phases, each with concrete tasks, clear “done” checks, and notes on contracts you must wire. Finish all phases and you’ll have the complete Files Tab.

---

# Phase 0 — Foundations & Scaffolding

**Goal:** Create the file structure, shared utilities, and providers so everything compiles and you can ship incrementally.

**Tasks**

1. **Folders & files**

   * Create `components/files/` with the files listed in your spec (FilesTab.tsx, Toolbar.tsx, UploadDropzone.tsx, Breadcrumbs.tsx, FiltersBar.tsx, FileGrid.tsx, FileCard.tsx, FolderTile.tsx, RightSidebar.tsx, ContextMenu.tsx, EmptyState.tsx).
   * Put minimal functional components that render a `<div>TODO</div>` so imports compile.
2. **Providers**

   * Ensure `QueryClientProvider` wraps the app (e.g., in `app/providers.tsx`). Configure default retry=1, staleTime=5\_000 for list queries.
3. **Shared utils (in `components/files/_utils.ts`)**

   * `classNames(...strings)`.
   * `formatBytes(number)`.
   * `debounce(fn, 150)`.
   * File-type icon mapper (lucide-react names).
4. **Design tokens**

   * Tailwind helpers for cards/tiles (rounded-xl, shadow-sm, hover\:shadow, focus-visible\:ring).
5. **State shape (local)**

   * Copy the state shape from the prompt (view/search/filters/selection/currentFolderId/rightPanel).
6. **Contracts & Types section rule**

   * At the bottom of **every** file, reserve a `// ——— Contracts & Types` region. Re-export only the types you actually consume in that file from your central `contracts.ts` to avoid drift.

**Done when**

* All components import without red squiggles.
* Page renders a basic shell without data.
* ESLint/TS passes.

---

# Phase 1 — Contracts & API Adapters (exact to your backend)

**Goal:** Centralize your contract-matching types and strongly typed API calls. No invented shapes.

**Tasks**

1. **Create `components/files/contracts.ts`**

   * Paste the contracts you gave (UploadFileRequest/Response, GetProjectFiles\*, GetFile\*, PatchFile\*, DeleteFile\*, CreateFolder\*, GetFolder\*, PatchFolder\*, DeleteFolder\*).
   * Export union DTOs you’ll use in the UI:

     * `UIFile` (maps to file list item; `name = fileName`, `mime = fileType`, `size = fileSize`, `thumbnailUrl?: // TODO(api): not provided`, `downloadUrl?: string`).
     * `UIFolder` (maps to folder list item; `name = name`, `parentId = parentFolderId`).
     * Keep a note: `// TODO(api): star/unstar & move endpoints missing.`
2. **Create `components/files/api.ts`**

   * Implement **only** these functions with exact routes:

     * `listProjectItems({ projectId, folderId })` → `GET /api/files/project/:projectId?folderId=` → returns `{ files, folders }` from `GetProjectFilesResponse`.
     * `getFolder({ folderId })` → `GET /api/folders/:folderId` → for sidebar details/breadcrumb parent hops.
     * `createFolder(body: CreateFolderRequest)` → `POST /api/folders`.
     * `uploadFile(form: UploadFileRequest)` → `POST /api/files/upload` (multipart).
     * `getFile({ fileId })` → `GET /api/files/:fileId` (for details/download).
     * `patchFile({ fileId, ...PatchFileUpdateRequest })` → `PATCH /api/files/:fileId/update`.
     * `deleteFile({ fileId })` → `DELETE /api/files/:fileId/delete`.
     * `patchFolder({ folderId, ...PatchFolderRequestBody })` → `PATCH /api/folders/:folderId/update`.
     * `deleteFolder({ folderId, force })` → `DELETE /api/folders/:folderId?force=bool`.
   * **Do not** add star/move endpoints. Add:

     * `// TODO(api): star/unstar endpoints not provided.`
     * `// TODO(api): move endpoints not provided.`
3. **Response → UI mappers**

   * `mapListToUI(res: GetProjectFilesResponse)` → `{ folders: UIFolder[], files: UIFile[] }`.
   * `mapFileDetails(res: GetFileResponse)` → `UIFile & details`.

**Done when**

* You can run a quick `listProjectItems` call in a playground and see typed results.
* All API functions are thin and use `fetch` (no server actions).

---

# Phase 2 — FilesTab Shell & Layout

**Goal:** The main layout with Toolbar, Breadcrumbs, FiltersBar, FileGrid, RightSidebar placeholders wired with props and local state.

**Tasks**

1. **FilesTab.tsx**

   * Props: `{ projectId: string; initialFolderId: string | null; }`.
   * Initialize local state from prompt.
   * Render subcomponents with placeholder props.
2. **Toolbar.tsx**

   * Left: Breadcrumbs slot, Right: Search input, Filters (types/starred), View toggle, Primary actions: “New” (folder) & “Upload”.
   * When `selection.size > 0`, swap to bulk actions.
3. **Breadcrumbs.tsx**

   * Accept `{ trail: Array<{ id: string|null; name: string }> }` and `onNavigate(id)`.
4. **FiltersBar.tsx**

   * Type filters (All, Images, Video, Audio, Documents, Other, Starred) as multi-toggle; call `onChange(filters)`.
5. **FileGrid.tsx**

   * Responsive grid; two sections:

     * Folders first (`FolderTile`).
     * Then files (`FileCard`).
6. **RightSidebar.tsx**

   * Slide-in container with Framer Motion; tabs header (Details/Activity/Comments); body is placeholders.
7. **ContextMenu.tsx**

   * Headless menu component (no shadcn). Trap focus; ESC closes.

**Done when**

* You can click mock items; sidebar opens/closes; view toggles; search input updates local state.

---

# Phase 3 — Data Fetching: List & Navigate

**Goal:** Real data from `GET /api/files/project/:projectId?folderId=` + breadcrumb traversal using `GET /api/folders/:folderId`.

**Tasks**

1. **TanStack Query**

   * `useQuery(['files', projectId, folderId], () => listProjectItems({projectId, folderId}))`.
   * On success, sort client-side folders→files.
2. **Breadcrumb building**

   * Keep `{ id, name }[]` in state.
   * If `currentFolderId === null`, trail = `[{ id:null, name:'All files' }]`.
   * Else:

     * Fetch `getFolder(folderId)` for the current.
     * Build parents by iteratively fetching parentFolderId until null. Cache each folder in a Map to avoid loops.
     * Optimize: parallelize by memoizing previous trails when drilling deeper.
3. **Open folder**

   * Clicking `FolderTile` sets `currentFolderId`, clears selection, triggers query refetch.
4. **Skeletons & empty**

   * While loading, show 12 skeleton tiles/cards.
   * If empty folder, render `EmptyState` with CTA (Upload/Create folder).

**Done when**

* Navigating folders updates the grid and breadcrumb correctly across arbitrary depth.

---

# Phase 4 — Uploads (drag & drop + button, with progress)

**Goal:** Real upload to `POST /api/files/upload` with per-item progress, optimistic placeholders, and refetch/merge.

**Tasks**

1. **UploadDropzone.tsx**

   * Accept `onFiles(files: File[])`.
   * Visual hover state for grid and for folder-tile hovering (indicate “drop into”).
2. **Upload flow**

   * Build `FormData` with `file`, `fileName`, `projectId`, `folderId`, and optional `category/description/tags`.
   * Use **XHR** (not fetch) to display upload progress (onprogress -> %).
   * Show optimistic placeholder `FileCard` with “Uploading … 67%”.
3. **Completion**

   * On success, map response to `UIFile`, replace placeholder item.
   * On error, show toast and remove placeholder.
   * Finally, `invalidateQueries(['files', projectId, currentFolderId])`.

**Done when**

* Drag/drop & button both work, progress animates, items appear without reload.

---

# Phase 5 — Create Folder (inline modal, optimistic)

**Goal:** New folder via `POST /api/folders`.

**Tasks**

1. **New → Folder modal**

   * Simple input for name (+ optional description).
2. **Optimistic insert**

   * Add temp `UIFolder` with id `temp-${n}` at top.
   * On success, replace with server folder.
   * On failure, rollback + toast.
3. **Validation**

   * Trim name; require 1–255 chars to match contract expectations.

**Done when**

* New folders show up instantly and persist after real response.

---

# Phase 6 — Search & Filter (client-only)

**Goal:** Debounced search (150ms), multi-type filters, starred toggle (local only for now).

**Tasks**

1. **Search**

   * Debounce user input and filter current in-memory lists by `name`/`fileName` (case-insensitive).
   * Highlight matched substring inside `FileCard`/`FolderTile` labels.
2. **Filters**

   * Types filter: derive from `fileType` (mime) and/or `category`. Map both to your `FileType` buckets.
   * Starred: **local** filter by `isStarred`.
3. **Persistence**

   * Keep filters in FilesTab state; store in `sessionStorage` keyed by projectId.

**Done when**

* Filtering/search never hits the API and feels instant.

---

# Phase 7 — Item Actions & Context Menu (Open/Rename/Delete/Download)

**Goal:** Fully wired context menu on cards/tiles.

**Tasks**

1. **Open**

   * Folder: open it (Phase 3 logic).
   * File: open RightSidebar → Details tab; lazy-fetch `getFile(fileId)` if not cached.
2. **Rename**

   * File: `PATCH /api/files/:fileId/update` with `{ fileName }` (optimistic update + rollback on 4xx/5xx).
   * Folder: `PATCH /api/folders/:folderId/update` with `{ name }` (same optimistic pattern).
3. **Delete**

   * File: `DELETE /api/files/:fileId/delete` (optimistic remove from cache).
   * Folder: show confirm; call `DELETE /api/folders/:folderId?force=true` if non-empty deletion is intended.
4. **Download**

   * Ensure presigned URL exists:

     * If list payload has a directly usable `fileUrl` (already public or presigned), use it.
     * Else call `GET /api/files/:fileId` and use `data.file.fileUrl` which the contract says may be presigned.
   * Trigger browser download via `<a download>` or `window.open(url)` (respect visibility).
5. **Star/Unstar**

   * **Not provided.** Implement UI toggle with optimistic state only and a TODO banner in code:

     * `// TODO(api): Wire star/unstar when endpoint is available.`

**Done when**

* You can rename/delete/download from item kebab menus and from bulk toolbar.

---

# Phase 8 — Right Sidebar (Details / Activity / Comments)

**Goal:** Polished, animated details pane with two mock tabs.

**Tasks**

1. **Details**

   * For files: show `fileName`, `fileType`, `size`, `createdAt/updatedAt`, `visibility`, `uploadedBy`, tags, category, folder path (from breadcrumb).
   * For folders: show `name`, `createdAt/updatedAt`, parent path, description if any.
   * Thumbnail:

     * If image/video: show preview if you have a safe URL.
     * Else show generated placeholder SVG with center icon.
2. **Activity (mock)**

   * Deterministic pseudo-random events based on `id` (e.g., Uploaded, Renamed, Downloaded). Store per-entity in a React Map so it persists while mounted.
3. **Comments (mock)**

   * Minimal thread (author = current user stub), stored in component state; clears when navigating away.

**Done when**

* Sidebar slides in/out with Motion; tabs switch; comments add/remove; feels smooth.

---

# Phase 9 — Selection & Bulk Actions + Keyboard A11y

**Goal:** Multi-select (Ctrl/Cmd click, Shift range), bulk toolbar, and keyboard shortcuts.

**Tasks**

1. **Selection model**

   * Single click selects; repeat click toggles.
   * Ctrl/Cmd click toggles additional selection.
   * Shift-click selects range within current view list (folders+files combined index).
2. **Bulk toolbar**

   * When `selection.size > 0`, show: Delete, Rename (disabled for multi when types mixed), Download (multi = zip? if not supported, disable), Star/Unstar (UI only).
3. **Keyboard**

   * Arrow keys move focus; `Enter` opens focused item; `Backspace` goes up one level if search is not focused; `Delete` opens delete confirm; `Ctrl/Cmd+K` focuses search.
   * Proper roles/ARIA on grid, items, and menus; visible focus rings.

**Done when**

* You can range-select with Shift and perform actions; keyboard navigation works.

---

# Phase 10 — Drag-to-Folder Targeting & Visuals

**Goal:** Drag a file over a folder tile to upload **into** it (or to move later when API exists).

**Tasks**

1. **Dropzone coverage**

   * Global drop uploads to current folder.
   * While dragging, hovering a `FolderTile` sets it as “drop target” (visual highlight).
2. **Upload into target**

   * If a drop target exists, set `folderId = target.id` for the upload call.
3. **Future move**

   * Add UI affordance for drag-to-move with `// TODO(api): move endpoints not provided`.

**Done when**

* Dropping on a folder uploads into that folder; visuals are clear.

---

# Phase 11 — View Toggle, Sorting, (Optional) Pagination

**Goal:** Grid/List toggle, client sort, optional infinite scroll when backend adds cursors.

**Tasks**

1. **Grid/List**

   * Add `view` to state; `FileList` variant for list rows reusing `FileCard` internals.
2. **Sort**

   * Add sort control (Name, Size, Modified; asc/desc) — **client-side**.
3. **Infinite scroll (optional)**

   * Contracts don’t expose pagination for list endpoint; keep a hook with `useInfiniteQuery` behind a feature flag and:

     * `// TODO(api): integrate when nextCursor/page fields are available on GetProjectFilesResponse.`

**Done when**

* Toggle/sort feels instant; pagination code is scaffolded but dormant.

---

# Phase 12 — Errors, Skeletons, Toasts, Edge Cases

**Goal:** Production-ready UX around failure and empty states.

**Tasks**

1. **Skeletons**

   * Shimmer skeletons for `FileCard`/`FolderTile` (12).
2. **Toasts**

   * Lightweight custom toast hook (Portal + Motion).
   * Surface errors from all mutations; show rollback notices.
3. **Empty states**

   * No results (search/filter).
   * Empty folder.
   * No starred (when filter active).
4. **Edge cases**

   * Deleting the current folder you’re viewing (navigate up).
   * Attempting download when `fileUrl` missing → fetch details.
   * Handling 401/403 with a friendly “You don’t have access”.

**Done when**

* You can force failures and see graceful UI with clear recovery.

---

# Phase 13 — Polish & Micro-interactions

**Goal:** Delightful but subtle animations; consistent visuals.

**Tasks**

1. **Motion**

   * Card hover: slight scale+shadow.
   * Grid mount: staggered fade/scale on first render.
   * Sidebar: spring slide-in/out.
   * Context menu: fade+scale, focus-trap.
2. **Accessibility pass**

   * Landmarks, roles, ARIA labels, `aria-busy` on loading regions, keyboard focus order.
3. **Performance**

   * Virtualize only if needed (keep simple first).
   * Memoize heavy items; key by stable ids.

**Done when**

* It feels like Google Drive: snappy, smooth, predictable.

---

## Wiring Matrix (Action → Endpoint)

* **List root/folder** → `GET /api/files/project/:projectId?folderId=` (GetProjectFilesResponse).
* **Open folder** → same as list (set `folderId`).
* **Folder details (breadcrumb parent chain)** → `GET /api/folders/:folderId` (GetFolderSuccessResponse).
* **Create folder** → `POST /api/folders` (CreateFolderRequest → CreateFolderSuccessResponse).
* **Upload** → `POST /api/files/upload` (multipart) (UploadFileRequest/Response).
* **File details / download URL** → `GET /api/files/:fileId` (GetFileResponse).
* **Rename file** → `PATCH /api/files/:fileId/update` (PatchFileUpdateRequest/Response).
* **Delete file** → `DELETE /api/files/:fileId/delete` (DeleteFileSuccessResponse).
* **Rename folder** → `PATCH /api/folders/:folderId/update` (PatchFolderRequestBody).
* **Delete folder** → `DELETE /api/folders/:folderId?force=bool` (DeleteFolderResponse).
* **Star/Unstar** → **TODO(api)** (UI optimistic only until provided).
* **Move** → **TODO(api)** (UI stub + disabled).

---

## Acceptance Checklist (final)

* [ ] Folders listed before files; grid default; list toggle works.
* [ ] Breadcrumb builds from root using `/api/folders/:folderId` parent chain.
* [ ] Client-side search + type/star filters; match highlight.
* [ ] Drag-drop + button uploads, progress per item, optimistic placeholders.
* [ ] Create folder modal; optimistic insert.
* [ ] Rename/Delete for both files and folders; optimistic with rollback.
* [ ] Download works via `fileUrl` or details fetch.
* [ ] Right sidebar (Details/Activity/Comments) opens for file/folder.
* [ ] Context menu actions mirror toolbar; disabled when not permitted/missing.
* [ ] Multi-select + Shift range; bulk actions.
* [ ] Skeletons, tailored empty states, toasts, error handling.
* [ ] Keyboard: Backspace up, Enter open, Delete confirm, Cmd/Ctrl+K focus search.
* [ ] `// TODO(api)` markers only for star/move/pagination; everything else is wired.

---

## Quick build order (at a glance)

P0 Foundations → P1 Contracts/API → P2 Shell → P3 List & Breadcrumb → P4 Upload → P5 Create Folder → P6 Search/Filter → P7 Actions (Rename/Delete/Download) → P8 Sidebar → P9 Selection/Keyboard → P10 Drag-to-Folder → P11 View/Sort/(Paging TBD) → P12 Errors/Toasts → P13 Polish.

If you want, I can now generate the scaffolds for each component with the `// ——— Contracts & Types` sections stubbed and the API adapter wired to your exact endpoints.
