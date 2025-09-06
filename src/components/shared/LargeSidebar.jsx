//src/components/shared/LargeSidebar.jsx
import React from "react";
import { BiUserCircle } from "react-icons/bi";
import { FiSettings, FiHelpCircle, FiLogOut } from "react-icons/fi";
import styled from "styled-components";
import DashboardNavLinks from "./DashboardNavLinks";
import { useDashboardContext } from "../../Layout/DashboardLayout";
import { useUserContext } from "../../context/UserContext";
import { NavLink } from "react-router-dom";

const LargeSidebar = () => {
    const { user } = useUserContext();
    const { showSidebar, handleLogout } = useDashboardContext();
    return (
        <Wrapper>
            <div
                className={
                    !showSidebar
                        ? "sidebar-container show-sidebar"
                        : "sidebar-container"
                }
            >
                <div className="p-6 h-full overflow-y-auto">
                    <div className="profile">
                        <BiUserCircle className="text-5xl font-normal" />
                        <h6 className="text-sm font-semibold capitalize mt-1">
                            {user?.username}
                        </h6>
                        <p className="text-xs capitalize -mt-1 font-medium">
                            {user?.role === 1 ? 'Admin' : user?.role === 2 ? 'Recruiter' : 'User'}
                        </p>
                    </div>
                    
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-6">
                        {user?.role === 2 ? 'EMPLOYERS DASHBOARD' : 'USER DASHBOARD'}
                    </h3>
                    
                    <div className="content">
                        <DashboardNavLinks />
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6 mt-6">
                        <NavLink
                            to="/dashboard/settings"
                            className={({ isActive }) =>
                                `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                    isActive
                                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                }`
                            }
                        >
                            <FiSettings className="mr-3 h-5 w-5" />
                            Settings
                        </NavLink>
                        <NavLink
                            to="/dashboard/help"
                            className={({ isActive }) =>
                                `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                    isActive
                                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                }`
                            }
                        >
                            <FiHelpCircle className="mr-3 h-5 w-5" />
                            Help & Support
                        </NavLink>
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md w-full"
                        >
                            <FiLogOut className="mr-3 h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.aside`
    display: none;

    @media (min-width: 992px) {
        display: block;
        box-shadow: 1px 0px 0px 0px rgba(0, 0, 0, 0.1);
        position: relative;
        height: 100vh;
        width: 250px;
        flex-shrink: 0;
        overflow-y: hidden;

        .sidebar-container {
            background: var(--background-secondary-color);
            height: 100vh;
            width: 250px;
            margin-left: -250px;
            transition: margin-left 0.3s ease-in-out;
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0;
            overflow-y: auto;
        }

        .show-sidebar {
            margin-left: 0;
        }

        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 0;
            overflow-y: auto;
        }

        .nav-link {
            display: flex;
            align-items: center;
            color: var(--text-secondary-color);
            padding: 0.5rem 0;
            margin: 0.1rem 0;
            padding-left: 2.5rem;
            text-transform: capitalize;
            transition: all 0.3s linear;
            font-weight: 400;
            font-size: 16px;
            opacity: 0.8;
        }

        .nav-link:hover {
            background-color: rgba(0, 0, 0, 0.05);
            opacity: 0.9;
            text-decoration: none;
        }

        .icon {
            font-size: 1.5rem;
            margin-right: 1rem;
            display: grid;
            place-items: center;
        }

        .active {
            color: var(--color-primary);
            font-weight: 600;
            background-color: rgba(0, 0, 0, 0.04);
            opacity: 0.9;
        }
    }
`;

export default LargeSidebar;