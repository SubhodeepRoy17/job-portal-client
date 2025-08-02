import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginCompany } from '../../services/authService';

const initialState = {
  company: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false // Added authentication flag
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await loginCompany(email, password);
      return {
        token: response.data.token,
        company: response.data.company
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.company = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    // Added reducer to check auth state from localStorage
    initializeAuth: (state) => {
      const token = localStorage.getItem('token');
      const company = JSON.parse(localStorage.getItem('company'));
      if (token && company) {
        state.token = token;
        state.company = company;
        state.isAuthenticated = true;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.company = action.payload.company;
        state.isAuthenticated = true;
        // Persist to localStorage
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('company', JSON.stringify(action.payload.company));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  }
});

export const { logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;