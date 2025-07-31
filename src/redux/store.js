import { configureStore } from '@reduxjs/toolkit';
import companyRegistrationReducer from './slices/companyRegistrationSlice';

export const store = configureStore({
  reducer: {
    companyRegistration: companyRegistrationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable for file objects in state
    }),
});