//src/pages/CompanyRegisterForm.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerCompany, resetAuthState } from "../redux/slices/authSlice2";
import { useForm } from "react-hook-form";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Swal from "sweetalert2";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const CompanyRegisterForm = () => {
  const [phoneValue, setPhoneValue] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success, company } = useSelector((state) => state.auth);

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false
  });

  // Watch password changes for real-time validation
  useEffect(() => {
    const password = watch('password') || '';
    setPasswordValidation({
      length: password.length >= 8,
      upperCase: /[A-Z]/.test(password),
      lowerCase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*]/.test(password)
    });
  }, [watch('password')]);

  const onSubmit = (data) => {
    if (!phoneValue) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please enter a valid phone number",
      });
      return;
    }

    const companyData = {
      email: data.email.toLowerCase(),
      password: data.password,
      full_name: data.full_name,
      mobile_no: phoneValue // react-phone-number-input already provides E.164 format
    };

    dispatch(registerCompany(companyData));
  };

  // Handle success/error messages
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: typeof error === 'string' ? error : error.message || 'Registration failed',
      });
      dispatch(resetAuthState());
    }

    if (success && company) {
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: `Account created for ${company.email}`,
      }).then(() => {
        navigate("/login-company");
        dispatch(resetAuthState());
      });
    }
  }, [error, success, company, navigate, dispatch]);

  return (
    <Wrapper>
      <div className="container">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1>Register as Company</h1>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="row">
            <label htmlFor="full_name">Company Name</label>
            <input
              type="text"
              name="full_name"
              autoComplete="off"
              placeholder="Enter company name"
              {...register("full_name", {
                required: {
                  value: true,
                  message: "Company name is required",
                },
                minLength: {
                  value: 2,
                  message: "Minimum 2 characters required"
                },
                maxLength: {
                  value: 100,
                  message: "Maximum 100 characters allowed"
                }
              })}
            />
            {errors?.full_name && (
              <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                {errors?.full_name?.message}
              </span>
            )}
          </div>
          
          <div className="row">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="company@example.com"
              {...register("email", {
                required: {
                  value: true,
                  message: "Email is required",
                },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@(?!gmail\.com|outlook\.com|icloud\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Use company email with your domain",
                },
              })}
            />
            {errors?.email && (
              <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                {errors?.email?.message}
              </span>
            )}
          </div>
          
          <div className="row">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Minimum 8 characters required"
                },
                validate: {
                  hasUpper: v => /[A-Z]/.test(v) || "Need 1 uppercase letter",
                  hasLower: v => /[a-z]/.test(v) || "Need 1 lowercase letter",
                  hasNumber: v => /[0-9]/.test(v) || "Need 1 number",
                  hasSpecial: v => /[!@#$%^&*]/.test(v) || "Need 1 special character"
                }
              })}
              placeholder="Create password"
            />
            {errors.password && (
              <span className="error-text">{errors.password.message}</span>
            )}
          </div>
          
          <div className="row">
            <label htmlFor="mobile_no">Mobile Number</label>
            <div className="phone-input-wrapper">
              <PhoneInput
                international
                defaultCountry="IN"
                value={phoneValue}
                onChange={setPhoneValue}
                required
              />
            </div>
          </div>
          
          <div className="flex justify-center">
            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Register"}
            </button>
          </div>
        </form>

        <div className="">
          <p className="text-center text-[10px] font-semibold opacity-9 mt-3">
            Already registered as Company.
            <Link className="ml-1 link" to="/login-company">
              Login now
            </Link>
          </p>
        </div>
      </div>
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
    font-size: 24px;
    font-weight: 600;
    color: #1d1f2b;
  }

  .google-btn-container {
    width: 100%;
  }

  .google-btn {
    width: 100%;
    padding: 12px;
    font-size: 15px;
    font-weight: 500;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .google-btn:hover {
    background-color: #f5f5f5;
  }

  .google-btn:disabled {
    background-color: #fafafa;
    cursor: not-allowed;
  }

  .google-icon {
    font-size: 18px;
  }

  .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 13px;
    position: relative;
  }

  .divider::before,
  .divider::after {
    content: "";
    flex: 1;
    height: 1px;
    background-color: #e0e0e0;
  }

  .divider::before {
    margin-right: 12px;
  }

  .divider::after {
    margin-left: 12px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .row {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .row label {
    font-size: 14px;
    color: #333;
    font-weight: 500;
  }

  .row input {
    padding: 10px 14px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
    transition: border 0.3s ease;
  }

  .row input:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.1);
  }

  .row input::placeholder {
    color: #aaa;
  }

  .error-text {
    font-size: 12px;
    color: #d32f2f;
    font-weight: 500;
    margin-top: -10px;
    padding-left: 2px;
  }

  button[type="submit"],
  .user-btn {
    width: 100%;
    padding: 12px;
    font-size: 15px;
    font-weight: 600;
    background-color:var(--color-accent);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  button[type="submit"]:hover,
  .user-btn:hover {
    background-color: #4178c0;
  }

  button:disabled {
    background-color: #c4c4c4;
    cursor: not-allowed;
  }

  .alt-actions {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #666;
    margin-top: 10px;
  }

  .phone-input-wrapper {
    .PhoneInput {
      width: 100%;
      
      input {
        width: 100%;
        padding: 10px 14px;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 14px;
        
        &:focus {
          outline: none;
          border-color: #4a90e2;
        }
        
        &.error {
          border-color: #d32f2f;
        }
      }
      
      .PhoneInputCountry {
        margin-right: 8px;
      }
    }
  }

  .link {
    color: #4a90e2;
    text-decoration: none;
    font-weight: 500;
  }

  .link:hover {
    text-decoration: underline;
  }

  @media (max-width: 480px) {
    .container {
      padding: 36px 24px;
    }
  }
`;

export default CompanyRegisterForm;