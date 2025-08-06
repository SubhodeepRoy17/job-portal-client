// Enhanced authSlice2.js with better error handling and debugging
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const registerCompany = createAsyncThunk(
  'auth/registerCompany',
  async (companyData, { rejectWithValue }) => {
    try {
      console.log('Sending company data:', companyData);
      console.log('Data types:', {
        email: typeof companyData.email,
        password: typeof companyData.password,
        full_name: typeof companyData.full_name,
        mobile_no: typeof companyData.mobile_no
      });
      
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
      
      console.log('Server response:', response.data);
      
      if (!response.data.status) {
        return rejectWithValue(response.data.message || 'Registration failed');
      }
      
      return response.data.company;
    } catch (error) {
      console.error('Registration error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      if (error.response) {
        // Server responded with error status
        let errorMessage;
        
        if (Array.isArray(error.response.data)) {
          // Handle array of validation errors
          errorMessage = error.response.data.map(err => err.msg || err.message || err).join(', ');
        } else {
          // Handle single error object
          errorMessage = error.response.data?.message || 
                        error.response.data?.error || 
                        error.response.data?.errors ||
                        `Server error: ${error.response.status}`;
        }
        
        return rejectWithValue(error.response.data || errorMessage);
      } else if (error.request) {
        // Request made but no response received
        return rejectWithValue('No response from server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request
        return rejectWithValue(error.message || 'Registration failed');
      }
    }
  }
);

export const loginCompany = createAsyncThunk(
  'auth/loginCompany',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Sending login data:', credentials);
      
      const response = await axios.post(
        'https://job-portal-server-six-eosin.vercel.app/api/auth/login-company',
        credentials,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000
        }
      );
      
      console.log('Login response:', response.data);
      
      // Check if login was successful
      if (response.data.status === false) {
        return rejectWithValue(response.data.message || 'Login failed');
      }
      
      // Return the company/user data
      return response.data.user || response.data.company || response.data;
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response) {
        let errorMessage;
        
        if (Array.isArray(error.response.data)) {
          errorMessage = error.response.data.map(err => err.msg || err.message || err).join(', ');
        } else {
          errorMessage = error.response.data?.message || 
                        error.response.data?.error ||
                        `Login failed with status ${error.response.status}`;
        }
        
        return rejectWithValue(error.response.data || errorMessage);
      } else if (error.request) {
        return rejectWithValue('No response from server. Please check your internet connection.');
      } else {
        return rejectWithValue(error.message || 'Login failed');
      }
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
        state.success = false;
      })
      .addCase(loginCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.company = action.payload;
        state.success = true;
      })
      .addCase(loginCompany.rejected, (state, action) => {
        state.loading = false;
        state.company = null;
        state.success = false;
        state.error = action.payload?.message || action.payload || 'Login failed';
      });
  }
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;