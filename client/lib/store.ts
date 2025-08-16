import { configureStore } from "@reduxjs/toolkit";
import  userReducer  from '@/lib/slices/userSlice';
// Import your reducers here

export const store = configureStore({
  reducer: {
    user: userReducer
    },
//   devTools: process.env.NODE_ENV !== "production",
});

// Types for better TS support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
