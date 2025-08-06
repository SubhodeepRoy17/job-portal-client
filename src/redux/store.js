// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice2';
import companyReducer from './slices/companySlice';
import companyRegistrationReducer from './slices/companyRegistrationSlice';


export const store = configureStore({
  reducer: {
    company: companyReducer,
    auth: authReducer,
    companyRegistration: companyRegistrationReducer
  }
});