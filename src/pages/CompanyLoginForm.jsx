//src/pages/CompanyLoginForm.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginCompany, resetAuthState } from "../redux/slices/authSlice2";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import Logo from "../components/Logo";
import CookieConsentBanner from "./CookieConsentBanner";
import { Link, useLocation, useNavigate } from "react-router-dom";

const CompanyLoginForm = () => {
  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/company-dashboard";
  
  const { loading, error, company } = useSelector((state) => state.auth);

  const onSubmit = (data) => {
    // Add basic validation and formatting
    const loginData = {
      email: data.email.toLowerCase().trim(),
      password: data.password
    };
    
    console.log('Attempting login with:', { email: loginData.email });
    dispatch(loginCompany(loginData));
  };

  // Handle successful login
  useEffect(() => {
    if (company) {
      console.log('Login successful, company data:', company);
      
      // Check account status
      if (company.ac_status === 2) {
        toast.warning(
          <div>
            Your company account is hibernated. <br/>
            <a href="#" style={{color: '#007bff'}} onClick={() => window.open('mailto:support@company.com', '_blank')}>Contact support</a>
          </div>,
          { autoClose: 5000 }
        );
        dispatch(resetAuthState());
        return;
      }
      
      if (company.ac_status === 3) {
        toast.error(
          <div>
            Company account permanently disabled.<br/>
            <a href="#" style={{color: '#007bff'}} onClick={() => window.open('mailto:support@company.com', '_blank')}>Appeal this decision</a>
          </div>,
          { autoClose: 10000 }
        );
        dispatch(resetAuthState());
        return;
      }

      // Check if account status is not active (assuming 1 is active)
      if (company.ac_status !== 1 && company.ac_status !== undefined) {
        toast.warning("Account status needs verification. Please contact support.");
        dispatch(resetAuthState());
        return;
      }

      // Check role (assuming role 4 is company)
      if (company.role && company.role !== 4) {
        toast.error("Invalid account type for company login");
        dispatch(resetAuthState());
        return;
      }

      // Success - show welcome message and navigate
      const companyName = company.full_name || company.company_name || company.name || 'Company';
      toast.success(`Welcome back, ${companyName}!`);
      
      resetForm();
      
      // Navigate to company dashboard
      setTimeout(() => {
        navigate('/company-dashboard', {
          replace: true,  // Prevent going back to login page with back button
          state: { from: location.pathname }
        });
      }, 1000); // Reduced delay for better UX
    }
  }, [company, navigate, location.pathname, resetForm, dispatch]);

  // Handle login errors
  useEffect(() => {
    if (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (Array.isArray(error)) {
        errorMessage = error.map(err => err.msg || err.message || err).join(', ');
      }
      
      // Show specific error messages for common issues
      if (errorMessage.toLowerCase().includes('invalid credentials') || 
          errorMessage.toLowerCase().includes('incorrect password') ||
          errorMessage.toLowerCase().includes('user not found')) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      }
      
      toast.error(errorMessage);
      dispatch(resetAuthState());
    }
  }, [error, dispatch]);

  return (
    <Wrapper>
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
      
      <div className="container">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1>Login as Company</h1>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="on">
          <div className="row">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="company@example.com"
              {...register("email", {
                required: {
                  value: true,
                  message: "Email is required",
                },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors?.email && (
              <span className="error-text">
                {errors?.email?.message}
              </span>
            )}
          </div>

          <div className="row">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              {...register("password", {
                required: {
                  value: true,
                  message: "Password is required",
                },
                minLength: {
                  value: 1,
                  message: "Password cannot be empty",
                },
              })}
            />
            {errors?.password && (
              <span className="error-text">
                {errors?.password?.message}
              </span>
            )}
          </div>

          <div className="flex justify-center">
            <button type="submit" disabled={loading}>
              {loading ? (
                <span>
                  <span className="spinner"></span>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        <div className="additional-actions">
          <div className="forgot-password">
            <Link className="link" to="/forgot-password-company">
              Forgot your password?
            </Link>
          </div>
          
          <div className="register-link">
            <p className="text-center text-sm font-medium opacity-80 mt-4">
              New to our platform?
              <Link className="ml-1 link" to="/register-companyform">
                Create company account
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      <CookieConsentBanner />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f4f6f8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;

  .container {
    background: #ADD8E6;
    width: 100%;
    max-width: 440px;
    padding: 48px 36px;
    border-radius: 12px;
    box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  h1 {
    text-align: center;
    font-size: 26px;
    font-weight: 600;
    color: #1d1f2b;
    margin: 0;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .row {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .row label {
    font-size: 14px;
    color: #333;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .row input {
    padding: 12px 16px;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s ease;
    background-color: #ffffff;
  }

  .row input:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }

  .row input::placeholder {
    color: #9ca3af;
  }

  .row input:invalid {
    border-color: #ef4444;
  }

  .error-text {
    font-size: 12px;
    color: #ef4444;
    font-weight: 500;
    padding-left: 4px;
    margin-top: 4px;
  }

  button[type="submit"] {
    width: 100%;
    padding: 14px;
    font-size: 16px;
    font-weight: 600;
    background-color: var(--color-accent, #4a90e2);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 8px;
  }

  button[type="submit"]:hover:not(:disabled) {
    background-color: #357abd;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
  }

  button[type="submit"]:active:not(:disabled) {
    transform: translateY(0);
  }

  button:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .additional-actions {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }

  .forgot-password {
    text-align: center;
  }

  .register-link {
    padding-top: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    width: 100%;
  }

  .link {
    color: #4a90e2;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
  }

  .link:hover {
    color: #357abd;
    text-decoration: underline;
  }

  .text-center {
    text-align: center;
  }

  .text-sm {
    font-size: 13px;
  }

  .font-medium {
    font-weight: 500;
  }

  .opacity-80 {
    opacity: 0.8;
  }

  .mt-4 {
    margin-top: 16px;
  }

  .ml-1 {
    margin-left: 4px;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
    
    .container {
      padding: 32px 24px;
      gap: 24px;
    }
    
    h1 {
      font-size: 22px;
    }
  }
`;

export default CompanyLoginForm;