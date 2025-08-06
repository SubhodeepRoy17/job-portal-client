import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const registerCompany = createAsyncThunk(
  'auth/registerCompany',
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://job-portal-server-six-eosin.vercel.app/api/auth/register-company',
        companyData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          timeout: 10000
        }
      );
      
      if (!response.data.status) {
        return rejectWithValue(response.data.message || 'Registration failed');
      }
      
      return response.data.company;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          error.response.data.message || 
          error.response.data.error || 
          'Registration failed'
        );
      } else if (error.request) {
        return rejectWithValue('No response from server');
      } else {
        return rejectWithValue(error.message || 'Registration failed');
      }
    }
  }
);

export const loginCompany = createAsyncThunk(
  'auth/loginCompany',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://job-portal-server-six-eosin.vercel.app/api/auth/login-company',
        credentials,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    company: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.company = action.payload;
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.user;
      })
      .addCase(loginCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      });
  }
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;