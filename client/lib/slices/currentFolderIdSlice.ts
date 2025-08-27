// store/currentFolderIdSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrentFolderState {
  currentFolderId: string | null; // null = root folder
}

const initialState: CurrentFolderState = {
  currentFolderId: null,
};

const currentFolderIdSlice = createSlice({
  name: "currentFolder",
  initialState,
  reducers: {
    setCurrentFolderId: (state, action: PayloadAction<string | null>) => {
      state.currentFolderId = action.payload;
    },
    resetCurrentFolderId: (state) => {
      state.currentFolderId = null;
    },
  },
});

export const { setCurrentFolderId, resetCurrentFolderId } =
  currentFolderIdSlice.actions;
export default currentFolderIdSlice.reducer;
