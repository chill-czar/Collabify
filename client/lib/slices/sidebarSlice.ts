// store/slices/sidebarSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean; // For desktop collapsed state
}

const initialState: SidebarState = {
  isOpen: false, // Mobile sidebar starts closed
  isCollapsed: false, // Desktop sidebar starts expanded
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },
    openSidebar: (state) => {
      state.isOpen = true;
    },
    closeSidebar: (state) => {
      state.isOpen = false;
      state.isCollapsed = true;
    },
    toggleCollapse: (state) => {
      state.isCollapsed = !state.isCollapsed;
    },
    collapseSidebar: (state) => {
      state.isCollapsed = true;
    },
    expandSidebar: (state) => {
      state.isCollapsed = false;
    },
  },
});

export const {
  toggleSidebar,
  openSidebar,
  closeSidebar,
  toggleCollapse,
  collapseSidebar,
  expandSidebar,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;

// Type for RootState
export type RootState = {
  sidebar: SidebarState;
};
