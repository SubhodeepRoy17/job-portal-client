import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import Loading from "./Loading";
import UniversalLoading from "./UniversalLoading";

const ProtectAdminRoute = ({ children }) => {
    const location = useLocation();
    const { userLoading, user } = useUserContext();

    if (userLoading) {
        return <UniversalLoading type="page" />;
    }

    if (user?.email && user?.role === 1) {
        return children;
    }
    return <Navigate to="/" state={{ from: location }} replace />;
};

export default ProtectAdminRoute;