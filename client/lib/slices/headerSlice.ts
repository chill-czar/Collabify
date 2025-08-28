import { createSlice } from "@reduxjs/toolkit";

interface HeaderState {
  visible: boolean;
}

const initialState: HeaderState = {
  visible: true,
};

const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    showHeader: (state) => {
      state.visible = true;
    },
    hideHeader: (state) => {
      state.visible = false;
    },
    toggleHeader: (state) => {
      state.visible = !state.visible;
    },
  },
});

export const { showHeader, hideHeader, toggleHeader } = headerSlice.actions;
export default headerSlice.reducer;
