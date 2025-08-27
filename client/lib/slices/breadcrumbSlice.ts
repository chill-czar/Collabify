// store/breadcrumbSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BreadcrumbItem {
  id: string | null; // null = root
  name: string;
  icon?: string | null;
}

interface BreadcrumbState {
  items: BreadcrumbItem[];
  currentFolderId: string | null;
}

const initialState: BreadcrumbState = {
  items: [{ id: null, name: "Root" , icon: "Home" }], // start at root
  currentFolderId: null,
};

const breadcrumbSlice = createSlice({
  name: "breadcrumbs",
  initialState,
  reducers: {
    // 🔹 Double-click folder → update folder + push breadcrumb
    enterFolder: (state, action: PayloadAction<BreadcrumbItem>) => {
      state.currentFolderId = action.payload.id;
      state.items.push(action.payload);
    },

    // 🔹 Click on breadcrumb → splice & update folder
    navigateToBreadcrumb: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.items = state.items.slice(0, index + 1); // keep up to index
      state.currentFolderId = state.items[index].id;
    },

    // 🔹 Reset to root
    resetBreadcrumbs: (state) => {
      state.items = [{ id: null, name: "Home" }];
      state.currentFolderId = null;
    },
  },
});

export const { enterFolder, navigateToBreadcrumb, resetBreadcrumbs } =
  breadcrumbSlice.actions;

export default breadcrumbSlice.reducer;
