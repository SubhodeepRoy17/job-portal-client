import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/slices/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from "styled-components";

const API_BASE_URL = 'https://job-portal-server-six-eosin.vercel.app';

// Styled component for the toast container
const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    font-family: inherit;
    border-radius: 8px;
    padding: 12px 16px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .Toastify__toast--error {
    background: #FFEBEE;
    color: #B71C1C;
    border-left: 4px solid #F44336;
  }
  
  .Toastify__toast--success {
    background: #E8F5E9;
    color: #1B5E20;
    border-left: 4px solid #4CAF50;
  }
  
  .Toastify__close-button {
    color: inherit;
    opacity: 0.8;
  }
  
  .Toastify__progress-bar {
    background: rgba(0, 0, 0, 0.1);
  }
`;

export default function CompanyLogin() {
  const [formData, setFormData] = useState({
    company_mail_id: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any existing toasts
    toast.dismiss();

    // Validate inputs
    if (!formData.company_mail_id || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.company_mail_id)) {
      toast.error('Please enter a valid email address');
      return;
    }

    dispatch(loginStart());

    try {
      const response = await fetch(`${API_BASE_URL}/api/company/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          company_mail_id: formData.company_mail_id.trim().toLowerCase(),
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases from backend
        switch (data.errorCode) {
          case 'ACCOUNT_NOT_FOUND':
            throw new Error('No company found with this email. Please register.');
          case 'INVALID_PASSWORD':
            throw new Error('Incorrect password. Please try again.');
          case 'VALIDATION_ERROR':
            // Show all validation errors
            data.errors?.forEach(err => {
              toast.error(`${err.param}: ${err.msg}`);
            });
            throw new Error('Please fix the form errors');
          default:
            throw new Error(data.message || 'Login failed. Please try again.');
        }
      }

      // Successful login
      dispatch(loginSuccess({
        token: data.data.token,
        company: data.data.company
      }));

      // Store authentication data
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('company', JSON.stringify(data.data.company));

      // Show success message and navigate
      toast.success('Login successful! Redirecting...');
      
      // Add slight delay before navigation for better UX
      setTimeout(() => {
        navigate('/company-dashboard', {
          replace: true  // Prevent going back to login page with back button
        });
      }, 1500);

    } catch (error) {
      console.error('Login error:', {
        error: error.toString(),
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      dispatch(loginFailure(error.message));
      
      // Only show toast if it's not a validation error (already shown above)
      if (!error.message.includes('Please fix the form errors')) {
        toast.error(error.message || 'Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      {/* Toast Container positioned at the top */}
      <StyledToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Company Login
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="company_mail_id" className="block text-sm font-medium text-gray-700">
                Company Email
              </label>
              <div className="mt-1">
                <input
                  id="company_mail_id"
                  name="company_mail_id"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.company_mail_id}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength="8"
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/company/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link 
                to="/company-register"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Register your company
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}