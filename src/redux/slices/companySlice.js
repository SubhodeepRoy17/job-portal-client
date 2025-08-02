// src/redux/slices/companySlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCompanyData as fetchCompanyDataService } from '../../services/companyService'; // Renamed import

const initialState = {
  stats: {
    openJobs: 0,
    savedCandidates: 0
  },
  jobs: [],
  loading: false,
  error: null
};

// Using the renamed import in the thunk
export const fetchCompanyData = createAsyncThunk(
  'company/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchCompanyDataService(); // Using renamed function
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    resetCompanyState: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyData.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats || initialState.stats;
        state.jobs = action.payload.jobs || initialState.jobs;
      })
      .addCase(fetchCompanyData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch company data';
      });
  }
});

export const { resetCompanyState } = companySlice.actions;
export default companySlice.reducer;