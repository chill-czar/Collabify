import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/lib/slices/userSlice";
import currentFolderIdReducer from "@/lib/slices/currentFolderIdSlice";
import breadCrumbReducer from '@/lib/slices/breadcrumbSlice'
export const store = configureStore({
  reducer: {
    user: userReducer,
    currentFolder: currentFolderIdReducer,
    breadCrumb: breadCrumbReducer
  },
});

// Types for better TS support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
