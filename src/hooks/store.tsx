import { configureStore } from '@reduxjs/toolkit';
import industryReducer from './authThunks';
// or relative: import industryReducer from '../slices/industrySlice';

export const store = configureStore({
  reducer: {
    industry: industryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



