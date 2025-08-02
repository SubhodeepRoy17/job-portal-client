// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import companyRegistrationReducer from './slices/companyRegistrationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    companyRegistration: companyRegistrationReducer
  }
});