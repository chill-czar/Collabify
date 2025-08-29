// store/slices/currentNoteIdSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrentNoteIdState {
  noteId: string | null;
}

const initialState: CurrentNoteIdState = {
  noteId: null,
};

const currentNoteIdSlice = createSlice({
  name: "currentNoteId",
  initialState,
  reducers: {
    setCurrentNoteId: (state, action: PayloadAction<string | null>) => {
      state.noteId = action.payload;
    },
    clearCurrentNoteId: (state) => {
      state.noteId = null;
    },
  },
});

export const { setCurrentNoteId, clearCurrentNoteId } =
  currentNoteIdSlice.actions;
export default currentNoteIdSlice.reducer;
