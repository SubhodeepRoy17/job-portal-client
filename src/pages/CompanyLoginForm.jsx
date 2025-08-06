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
  const from = location.state?.from?.pathname || "/";
  
  const { loading, error, user } = useSelector((state) => state.auth);

  const onSubmit = (data) => {
    dispatch(loginCompany(data));
  };

  useEffect(() => {
    if (user) {
      if (user.ac_status === 2) {
        toast.warning(
          <div>
            Your company account is hibernated. <br/>
            <a href="#" style={{color: '#007bff'}}>Contact support</a>
          </div>,
          { autoClose: 5000 }
        );
        dispatch(resetAuthState());
        return;
      }
      
      if (user.ac_status === 3) {
        toast.error(
          <div>
            Company account permanently disabled.<br/>
            <a href="#" style={{color: '#007bff'}}>Appeal this decision</a>
          </div>,
          { autoClose: 10000 }
        );
        dispatch(resetAuthState());
        return;
      }

      if (user.role !== 4) {
        toast.error("Invalid account type for company login");
        dispatch(resetAuthState());
        return;
      }

      toast.success(`Welcome ${user.full_name}`);
      resetForm();
      setTimeout(() => {
        navigate('/company-dashboard', {
          replace: true  // Prevent going back to login page with back button
        });
      }, 1500);
    }
  }, [user, navigate, from, resetForm, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthState());
    }
  }, [error, dispatch]);

    return (
        <Wrapper>
            <ToastContainer 
                position="top-center"
                autoClose={10000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="container">
                <div className="flex justify-center">
                    <Logo />
                </div>
                <h1>Login as Company</h1>

                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <div className="row">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email@example.com"
                            {...register("email", {
                                required: {
                                    value: true,
                                    message: "A valid email is required",
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
                            name="password"
                            placeholder="Type Here"
                            {...register("password", {
                                required: {
                                    value: true,
                                    message: "Password is required",
                                },
                            })}
                        />
                        {errors?.password && (
                            <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                {errors?.password?.message}
                            </span>
                        )}
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" disabled={loading}>
                            {loading ? "Loading..." : "Login"}
                        </button>
                    </div>
                </form>

                <div className="">
                    <p className="text-center text-[10px] font-semibold opacity-9 mt-3">
                        New as a Recruiter.
                        <Link className="ml-1 link" to="/register-companyform">
                            Create account
                        </Link>
                    </p>
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

export default CompanyLoginForm;