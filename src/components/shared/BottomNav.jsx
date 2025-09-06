//src/components/shared/BottomNav.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";

const BottomNav = () => {
    const { user } = useUserContext();
    const profilePhoto = user?.profile_photo;

    if (!user?.ac_status) return null;

    const isAdmin = user?.role === 1;
    const isRecruiter = user?.role === 2;
    const isRecruiterOrUser = user?.role === 2 || user?.role === 3;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex justify-around items-center py-2 sm:hidden">
            {/* Home */}
            <NavLink
                to="/"
                className={({ isActive }) =>
                    "flex flex-col items-center text-xs " +
                    (isActive ? "text-blue-600" : "text-gray-500")
                }
                end
            >
                <ion-icon name="home-outline" style={{ fontSize: "20px" }}></ion-icon>
                <span className="mt-1">Home</span>
            </NavLink>

            {/* Jobs */}
            <NavLink
                to="/dashboard/all-jobs"
                className={({ isActive }) =>
                    "flex flex-col items-center text-xs " +
                    (isActive ? "text-blue-600" : "text-gray-500")
                }
            >
                <ion-icon name="briefcase-outline" style={{ fontSize: "20px" }}></ion-icon>
                <span className="mt-1">Jobs</span>
            </NavLink>

            {/* Applications (Recruiter or User) */}
            {isRecruiterOrUser && (
                <NavLink
                    to="/dashboard/my-jobs"
                    className={({ isActive }) =>
                        "flex flex-col items-center text-xs " +
                        (isActive ? "text-blue-600" : "text-gray-500")
                    }
                >
                    <ion-icon name="apps-outline" style={{ fontSize: "20px" }}></ion-icon>
                    <span className="mt-1">Applications</span>
                </NavLink>
            )}

            {/* Manage (Only Recruiter) */}
            {isRecruiter && (
                <NavLink
                    to="/dashboard/manage-jobs"
                    className={({ isActive }) =>
                        "flex flex-col items-center text-xs " +
                        (isActive ? "text-blue-600" : "text-gray-500")
                    }
                >
                    <ion-icon name="settings-outline" style={{ fontSize: "20px" }}></ion-icon>
                    <span className="mt-1">Manage</span>
                </NavLink>
            )}

            {/* Admin Links */}
            {isAdmin && (
                <>
                    <NavLink
                        to="/dashboard/admin"
                        className={({ isActive }) =>
                            "flex flex-col items-center text-xs " +
                            (isActive ? "text-blue-600" : "text-gray-500")
                        }
                    >
                        <ion-icon name="shield-outline" style={{ fontSize: "20px" }}></ion-icon>
                        <span className="mt-1">Info</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/stats"
                        className={({ isActive }) =>
                            "flex flex-col items-center text-xs " +
                            (isActive ? "text-blue-600" : "text-gray-500")
                        }
                    >
                        <ion-icon name="stats-chart-outline" style={{ fontSize: "20px" }}></ion-icon>
                        <span className="mt-1">Stats</span>
                    </NavLink>
                </>
            )}

            {/* Profile */}
            <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                    "flex flex-col items-center text-xs " +
                    (isActive ? "text-blue-600" : "text-gray-500")
                }
            >
                {profilePhoto ? (
                    <img
                        src={profilePhoto}
                        alt="Profile"
                        className="w-5 h-5 rounded-full"
                    />
                ) : (
                    <ion-icon name="person-outline" style={{ fontSize: "20px" }}></ion-icon>
                )}
                <span className="mt-1">Profile</span>
            </NavLink>
        </div>
    );
};

export default BottomNav;