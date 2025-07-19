/* eslint-disable react/prop-types */
import styled from "styled-components";
import Logo from "../Logo";
import avatar from "../../assets/media/avatar.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import { FiBell, FiMoreVertical } from "react-icons/fi";
import { FaWhatsapp, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { collapseToast } from "react-toastify";

const Navbar = ({ navbarRef }) => {
    const { user } = useUserContext();
    const navigate = useNavigate();
    const profilePhoto = user?.profile_photo;
    const [showSheet, setShowSheet] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowSheet(false);
            setIsClosing(false);
        }, 300);
    };

    return (
        <Wrapper ref={navbarRef}>
            <div className="container">
                <div className="logo-container">
                    <Logo />
                </div>

                {user?.ac_status ? (
                    <div className="icon-group">
                        <div className="icon-button notification-icon" onClick={() => navigate("/dashboard/notifications")}>
                            <FiBell className="icon" />
                            <span className="notification-dot"></span>
                        </div>

                        <div className="icon-button" onClick={() => setShowSheet(true)}>
                            <FaWhatsapp className="whatsapp-icon" />
                        </div>

                        <div className="icon-button">
                            <FiMoreVertical className="icon" />
                        </div>

                        <img
                            src={profilePhoto || avatar}
                            alt="profile"
                            className="profile"
                            onClick={() => navigate("/dashboard")}
                        />
                    </div>
                ) : (
                    <NavLink className="nav-item" to="/login">
                        <span className="login-btn">Login</span>
                    </NavLink>
                )}
            </div>

            {/* Bottom Sheet */}
            {showSheet && (
                <div className="sheet-overlay" onClick={handleClose}>
                    <div
                        className={`sheet-content ${isClosing ? "slideDown" : "slideUp"}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="close-button" onClick={handleClose}>
                            <IoClose />
                        </button>

                        <h2>Stay Connected with HireNext</h2>
                        <p>
                            Follow us on our social media handles to stay updated with the latest
                            features, financial insights, and exciting developments in the world of
                            fintech. Don't miss out – connect with us today!
                        </p>

                        <div className="social-row">
                            <a href="#" className="social-box">
                                <div className="icon-container whatsapp">
                                    <FaWhatsapp className="icon" style={{ color: "white" }} />
                                </div>
                                <span className="label whatsapp-label">WhatsApp</span>
                            </a>
                            <a href="#" className="social-box">
                                <div className="icon-container twitter">
                                    <FaTwitter className="icon" style={{ color: "white" }} />
                                </div>
                                <span className="label twitter-label">Twitter</span>
                            </a>
                            <a href="#" className="social-box">
                                <div className="icon-container linkedin">
                                    <FaLinkedinIn className="icon" style={{ color: "white" }} />
                                </div>
                                <span className="label linkedin-label">LinkedIn</span>
                            </a>
                            <a href="#" className="social-box">
                                <div className="icon-container instagram">
                                    <FaInstagram className="icon" style={{ color: "white" }} />
                                </div>
                                <span className="label instagram-label">Instagram</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    box-shadow: 0 5px 5px var(--shadow-light);
    padding: 0.7rem 0;
    background-color: var(--color-white);
    overflow-x: hidden;
    z-index: 999;
    position: sticky;
    top: 0;

    .container {
        width: 100%;
        max-width: 1200px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
    }

    .logo-container {
        max-width: 120px;
    }

    .nav-item {
        font-size: 16px;
        font-weight: 500;
        margin-left: 20px;
        color: var(--color-black);
    }

    .login-btn {
        background-color: #414bea;
        color: white;
        padding: 7px 14px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        white-space: nowrap;
    }

    .icon-group {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .icon-button {
        cursor: pointer;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .icon {
        font-size: 22px;
        color: #333;
        display: block;
    }

    .whatsapp-icon {
        color: #25D366;
        font-size: 22px;
    }

    .notification-icon {
        position: relative;
        display: flex;
    }

    .notification-dot {
        position: absolute;
        top: -2px;
        right: -2px;
        width: 8px;
        height: 8px;
        background-color: #FF3B30;
        border-radius: 50%;
        border: 1px solid white;
    }

    .profile {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        cursor: pointer;
    }

    /* Bottom Sheet */
    .sheet-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: center;
        align-items: flex-end;
        z-index: 9999;
    }

    .sheet-content {
        background: white;
        width: 100%;
        max-width: 600px;
        padding: 20px 20px 30px;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        position: relative;
        animation-duration: 0.3s;
        animation-fill-mode: both;
    }

    .slideUp {
        animation-name: slideUp;
    }

    .slideDown {
        animation-name: slideDown;
    }

    .close-button {
        position: absolute;
        top: 12px;
        left: 12px;
        background: transparent;
        border: none;
        font-size: 26px;
        color: #666;
        cursor: pointer;
    }

    .sheet-content h2 {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 6px;
        text-align: center;
    }

    .sheet-content p {
        font-size: 13px;
        margin-bottom: 20px;
        text-align: center;
        padding: 0 6px;
    }

    /* Social Icons Section */
    .social-row {
        display: flex;
        justify-content: space-around;
        gap: 10px;
        flex-wrap: wrap;
        padding: 0 10px;
    }

    .social-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-decoration: none;
        width: 70px;
    }

    .icon-container {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8px;
    }

    .social-icon {
        font-size: 20px;
        color: white; /* Ensures icons are white */
    }

    .label {
        font-size: 12px;
        font-weight: 500;
    }

    /* WhatsApp */
    .whatsapp {
        background-color: #25D366;
    }
    .whatsapp-label {
        color: #25D366;
    }

    /* Twitter */
    .twitter {
        background-color: #1DA1F2;
    }
    .twitter-label {
        color: #1DA1F2;
    }

    /* LinkedIn */
    .linkedin {
        background-color: #0A66C2;
    }
    .linkedin-label {
        color: #0A66C2;
    }

    /* Instagram */
    .instagram {
        background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
    }
    .instagram-label {
        color: #E1306C;
    }

    @media screen and (max-width: 600px) {
        .social-box {
            width: 60px;
        }

        .icon-container {
            width: 40px;
            height: 40px;
        }

        .social-icon {
            font-size: 18px;
        }

        .label {
            font-size: 11px;
        }
    }

    @keyframes slideUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0%);
            opacity: 1;
        }
    }

    @keyframes slideDown {
        from {
            transform: translateY(0%);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }

    @media screen and (max-width: 600px) {
        padding: 0.5rem 0;

        .container {
            padding: 0 12px;
        }

        .logo-container {
            max-width: 100px;
        }

        .nav-item {
            font-size: 14px;
        }

        .login-btn {
            padding: 5px 10px;
            font-size: 13px;
        }

        .icon-group {
            gap: 15px;
        }

        .icon, .whatsapp-icon {
            font-size: 20px;
        }

        .profile {
            width: 30px;
            height: 30px;
        }

        /* Mobile adjustments for social icons */
        .social-box {
            width: 60px;
        }

        .icon-container {
            width: 40px;
            height: 40px;
        }

        .social-icon {
            font-size: 18px;
        }

        .label {
            font-size: 11px;
        }
    }
`;

export default Navbar;
