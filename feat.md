
✅ This allows every Claude-generated component to **just call a hook** instead of worrying about fetch details.

---

### **Step 2: Scaffold components**

Create **empty skeletons** in `components/files/`:

```
FilesTab.tsx
Toolbar.tsx
UploadDropzone.tsx
Breadcrumbs.tsx
FiltersBar.tsx
FileGrid.tsx
FileCard.tsx
FolderTile.tsx
RightSidebar.tsx
ContextMenu.tsx
EmptyState.tsx
```

* Each component **only accepts props** (typed from contracts or hooks).
* No internal API calls yet.
* This ensures **Claude sessions can generate code in isolation** and still fit together.

---

### **Step 3: Generate UI components with Claude (one session per component)**

1. **Provide Claude with:**

   * Prompt context (your large prompt above)
   * Relevant **props/interfaces**
   * Centralized **contracts & hooks file location**
2. **Instructions per session:**

   * Do not invent types
   * Use only props/hooks from `apiClient` and `contracts`
   * Focus on **UI + micro-interactions**
   * Use **Tailwind + Framer Motion**
3. **Example for FileCard.tsx session:**

   * Props: `file: FileItem`, `onClick: () => void`, `onStarToggle: () => void`
   * Claude generates: thumbnail, type icon, owner avatar, kebab menu, hover actions

---

### **Step 4: Integrate components into `FilesTab.tsx`**

```tsx
import Toolbar from './Toolbar';
import Breadcrumbs from './Breadcrumbs';
import FileGrid from './FileGrid';
import RightSidebar from './RightSidebar';

export default function FilesTab({ projectId, initialFolderId }) {
  const { data, isLoading } = useFolderContents(projectId, initialFolderId);

  return (
    <div className="flex flex-col h-full">
      <Toolbar ... />
      <Breadcrumbs ... />
      <FileGrid folders={data?.folders} files={data?.files} ... />
      <RightSidebar ... />
    </div>
  );
}
```

✅ Because all components share **centralized types and hooks**, multi-session generation works seamlessly.

---

### **Step 5: Test & refine**

* Mock API data for components in isolation (`MOCK_ACTIVITY`, `MOCK_COMMENTS`, `DEMO_THUMBNAIL_URL`)
* Integrate mutations (`upload`, `star`, `rename`) gradually
* Ensure optimistic updates, skeletons, empty states, keyboard navigation, and accessibility.

---

### **Step 6: Optional: Parallelize Claude sessions**

* Each session can **focus on 1–2 components**.
* Ensure:

  * Consistent import paths (`import { FileItem } from '@/lib/contracts/files'`)
  * Shared props from `FilesTabProps` or contracts
  * Centralized hooks usage

This avoids **props/type conflicts** when merging components from different sessions.

---

### **Summary / Best Practices**

1. **Contracts first** → single source of truth
2. **API client + React Query hooks** → shared access layer
3. **Component skeletons** → isolated Claude sessions
4. **Generate UI component per session** → UI only, rely on hooks for data
5. **Combine in `FilesTab.tsx`** → orchestrator
6. **Mock & test incrementally**
7. **Optional: parallel generation across multiple AI sessions**

---

If you want, I can **draw a visual workflow diagram** showing exactly how 4 Claude sessions can generate separate components and integrate via the central API-first architecture. This will make your multi-AI workflow **zero-conflict and merge-safe**.

Do you want me to create that diagram?
