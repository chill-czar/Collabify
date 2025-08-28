import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/lib/slices/userSlice";
import currentFolderIdReducer from "@/lib/slices/currentFolderIdSlice";
import breadCrumbReducer from '@/lib/slices/breadcrumbSlice'
import sidebarReducer from "@/lib/slices/sidebarSlice";
import headerReducer from "@/lib/slices/headerSlice"
export const store = configureStore({
  reducer: {
    user: userReducer,
    currentFolder: currentFolderIdReducer,
    breadCrumb: breadCrumbReducer,
    sidebar: sidebarReducer,
    headerSlice: headerReducer,
  },
});

// Types for better TS support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
