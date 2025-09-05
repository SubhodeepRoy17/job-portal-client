import React from "react";
import { BiUserCircle } from "react-icons/bi";
import { FiSettings, FiHelpCircle, FiLogOut, FiFileText, FiUser, FiPlus, FiBriefcase, FiHeart, FiCreditCard, FiBuilding } from "react-icons/fi";
import styled from "styled-components";
import { useDashboardContext } from "../../Layout/DashboardLayout";
import { useUserContext } from "../../context/UserContext";
import { NavLink } from "react-router-dom";

const LargeSidebar = () => {
    const { user } = useUserContext();
    const { showSidebar, handleLogout } = useDashboardContext();
    
    const sidebarItems = [
        { icon: FiFileText, label: "Overview", path: "/dashboard", active: true },
        { icon: FiUser, label: "Employers Profile", path: "/dashboard/profile" },
        { icon: FiPlus, label: "Post a Job", path: "/dashboard/post-job" },
        { icon: FiBriefcase, label: "My Jobs", path: "/dashboard/my-jobs" },
        { icon: FiHeart, label: "Saved Candidate", path: "/dashboard/saved-candidates" },
        { icon: FiCreditCard, label: "Plans & Billing", path: "/dashboard/billing" },
        { icon: FiBuilding, label: "All Companies", path: "/dashboard/companies" },
        { icon: FiSettings, label: "Settings", path: "/dashboard/settings" },
    ];

    return (
        <Wrapper>
            <div
                className={
                    !showSidebar
                        ? "sidebar-container show-sidebar"
                        : "sidebar-container"
                }
            >
                <div className="profile">
                    <BiUserCircle className="text-5xl font-normal" />
                    <h6 className="text-sm font-semibold capitalize mt-1">
                        {user?.username}
                    </h6>
                    <p className="text-xs capitalize -mt-1 font-medium">
                        {user?.role === 1 ? 'Admin' : user?.role === 2 ? 'Recruiter' : 'User'}
                    </p>
                </div>
                
                <div className="content">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-6 px-6">
                        EMPLOYERS DASHBOARD
                    </h3>
                    <nav className="nav-links">
                        {sidebarItems.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <NavLink
                                    key={index}
                                    to={item.path}
                                    className={({ isActive }) => 
                                        `nav-link ${isActive ? "active" : ""}`
                                    }
                                    end
                                >
                                    <IconComponent className="icon" />
                                    {item.label}
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>
                
                <div className="bottom-links px-6">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    >
                        <FiLogOut className="mr-3 h-5 w-5" />
                        Log-out
                    </button>
                </div>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.aside`
    display: none;

    .profile {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem 0;
    }

    @media (min-width: 992px) {
        display: block;
        box-shadow: 1px 0px 0px 0px rgba(0, 0, 0, 0.1);
        position: relative;
        height: 100vh;
        width: 280px;
        flex-shrink: 0;
        overflow-y: hidden;

        .sidebar-container {
            background: var(--background-secondary-color);
            height: 100vh;
            width: 280px;
            margin-left: -280px;
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
        }

        .bottom-links {
            margin-top: auto;
            padding: 1.5rem 0;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .nav-links {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-height: 0;
            overflow-y: auto;
            padding: 0 1rem;
        }

        .nav-link {
            display: flex;
            align-items: center;
            color: var(--text-secondary-color);
            padding: 0.75rem 1rem;
            margin: 0.25rem 0;
            text-transform: capitalize;
            transition: all 0.3s linear;
            font-weight: 400;
            font-size: 16px;
            opacity: 0.8;
            border-radius: 0.375rem;
        }

        .nav-link:hover {
            background-color: rgba(0, 0, 0, 0.05);
            opacity: 0.9;
            text-decoration: none;
        }

        .icon {
            font-size: 1.25rem;
            margin-right: 0.75rem;
            display: grid;
            place-items: center;
        }

        .active {
            color: var(--color-primary);
            font-weight: 600;
            background-color: rgba(59, 130, 246, 0.1);
            opacity: 1;
        }
    }
`;

export default LargeSidebar;