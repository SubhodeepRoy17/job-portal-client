// src/services/companyService.js
import axios from 'axios';

// For Vite, use import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://job-portal-server-six-eosin.vercel.app';

export const fetchCompanyData = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/company/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch company data');
  }
};

export const postJob = async (jobData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/api/company/jobs`, jobData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to post job');
  }
};