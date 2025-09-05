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

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const isEditProfilePage = location.pathname === "/edit-profile";
    const shouldHideNavbar = isMobile && mobileHiddenPaths.includes(location.pathname);
    
    // Check if this is a main dashboard page (including company dashboard)
    const isMainDashboardPage = 
        location.pathname === "/company-dashboard" ||
        location.pathname === "/dashboard" ||
        location.pathname.startsWith("/dashboard/my-jobs") ||
        location.pathname.startsWith("/dashboard/all-jobs") ||
        location.pathname.startsWith("/dashboard/manage-jobs");

    const handleLogout = async () => {
        try {
            // First try the API logout
            try {
                const response = await axios.post(
                    "https://job-portal-server-six-eosin.vercel.app/api/auth/logout",
                    {},
                    { 
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                Swal.fire({
                    icon: "success",
                    title: "Logout Successful",
                    text: response?.data?.message || "You have been logged out",
                });
            } catch (apiError) {
                console.log('API logout failed, proceeding with client-side cleanup');
                // If API logout fails, still proceed with client-side cleanup
                Swal.fire({
                    icon: "info",
                    title: "Logged Out",
                    text: "You have been logged out",
                });
            }
            
            // Always perform client-side cleanup
            handleFetchMe(); // This should clear the user context
            
        } catch (error) {
            console.error('Logout error:', error);
            // Even if there's an error, proceed with client-side cleanup
            handleFetchMe();
            Swal.fire({
                icon: "info",
                title: "Logged Out",
                text: "You have been logged out",
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
                {/* Show BottomNav on mobile for main dashboard pages */}
                {isMobile && <BottomNav />}
            </Wrapper>
        </DashboardContext.Provider>
    );
};

export const useDashboardContext = () => useContext(DashboardContext);
export default DashboardLayout;