// store/slices/tabSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TabState {
  activeTab: string;
}

const initialState: TabState = {
  activeTab: "Files", // Default tab
};

const tabSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = tabSlice.actions;
export default tabSlice.reducer;

// RootState type for selector
export type RootState = {
  tabs: TabState;
};
