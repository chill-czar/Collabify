import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/lib/slices/userSlice";
import currentFolderIdReducer from "@/lib/slices/currentFolderIdSlice";
import breadCrumbReducer from '@/lib/slices/breadcrumbSlice'
import sidebarReducer from "@/lib/slices/sidebarSlice";
import headerReducer from "@/lib/slices/headerSlice"
import tabsReducer from "@/lib/slices/tabSlice"
import currentNoteIdReducer from "./slices/currentNoteIdSlice";
import currentBoardReducer from "./slices/currentBoardId";

export const store = configureStore({
  reducer: {
    user: userReducer,
    currentFolder: currentFolderIdReducer,
    breadCrumb: breadCrumbReducer,
    sidebar: sidebarReducer,
    headerSlice: headerReducer,
    tabs: tabsReducer,
    currentNoteId: currentNoteIdReducer,
    currentBoard: currentBoardReducer,
  },
});

// Types for better TS support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
