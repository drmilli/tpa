import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import politicianReducer from './slices/politicianSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    politician: politicianReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
