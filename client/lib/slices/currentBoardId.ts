// store/currentBoardSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrentBoardState {
  currentBoardId: string | null;
}

const initialState: CurrentBoardState = {
  currentBoardId: null,
};

const currentBoardSlice = createSlice({
  name: "currentBoard",
  initialState,
  reducers: {
    setCurrentBoardId: (state, action: PayloadAction<string>) => {
      state.currentBoardId = action.payload;
    },
    clearCurrentBoardId: (state) => {
      state.currentBoardId = null;
    },
  },
});

export const { setCurrentBoardId, clearCurrentBoardId } =
  currentBoardSlice.actions;

export default currentBoardSlice.reducer;
