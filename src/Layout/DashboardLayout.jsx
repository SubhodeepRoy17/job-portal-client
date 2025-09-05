//src/Layout/DashboardLayout.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import Wrapper from "../assets/css/wrappers/Dashboard";
import { Outlet, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import BottomNav from "../components/shared/BottomNav";
import { SmallSidebar, LargeSidebar, DashboardNavbar } from "../components";
import Swal from "sweetalert2";
import { useUserContext } from "../context/UserContext";
import axios from "axios";

const DashboardContext = createContext();

const DashboardLayout = () => {
    const { id } = useParams();
    const { handleFetchMe, user } = useUserContext();
    const [showSidebar, setShowSidebar] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();

    // List of paths where we want to hide navbar on mobile
    const mobileHiddenPaths = [
        "/dashboard/settings",
        "/dashboard/coins",
        "/dashboard/faqs",
        "/dashboard/notifications",
        "/dashboard/about",
        "/dashboard/disclaimer",
        "/dashboard/terms",
        "/dashboard/privacy-policy",
        "/dashboard/support",
        "/dashboard/certificates",
        "/dashboard/courses",
        "/dashboard/referrals",
        `/dashboard/job/${id}`,
    ];

    // List of paths where we always want to show BottomNav (including company dashboard)
    const alwaysShowBottomNavPaths = [
        "/company-dashboard",
        "/dashboard",
        "/dashboard/my-jobs",
        "/dashboard/all-jobs",
        "/dashboard/manage-jobs"
    ];

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768); // 768px is a common breakpoint for mobile
        };

        // Check on mount and on resize
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const isEditProfilePage = location.pathname === "/edit-profile";
    const shouldHideNavbar = isMobile && mobileHiddenPaths.includes(location.pathname);
    
    // Check if we should always show BottomNav (for company dashboard and other main pages)
    const shouldAlwaysShowBottomNav = alwaysShowBottomNavPaths.some(path => 
        location.pathname.startsWith(path)
    );

    const handleLogout = async () => {
        try {
            const response = await axios.post(
                "https://job-portal-server-six-eosin.vercel.app/api/auth/logout",
                { withCredentials: true }
            );
            Swal.fire({
                icon: "success",
                title: "Logout...",
                text: response?.data?.message,
            });
            handleFetchMe();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error?.response?.data,
            });
        }
    };

    // passing values
    const values = { handleLogout, showSidebar, setShowSidebar };
    return (
        <DashboardContext.Provider value={values}>
            <Wrapper>
                <main className="dashboard">
                    <SmallSidebar />
                    <LargeSidebar />
                    <div className="">
                        {!isEditProfilePage && !shouldHideNavbar && <DashboardNavbar />}
                        <div className="dashboard-page">
                            <Outlet />
                        </div>
                    </div>
                </main>
                {/* Always show BottomNav for company dashboard and other main pages */}
                {(shouldAlwaysShowBottomNav || !shouldHideNavbar) && <BottomNav />}
            </Wrapper>
        </DashboardContext.Provider>
    );
};

export const useDashboardContext = () => useContext(DashboardContext);
export default DashboardLayout;