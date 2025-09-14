import { useUserContext } from "../context/UserContext";
import Landing from "./Landing";
import UserHomePage from "./user_homepage";
import TopMentorsPage from "./top-mentors";
import AdminHomePage from "./admin_homepage";
import RecruiterHomePage from "./recruiter_homepage";
import CompanyHomePage from "./company_homepage";
import Navbar from "../components/shared/Navbar";
import BottomNav from "../components/shared/BottomNav";

const HomeRoleRedirect = () => {
    const { user } = useUserContext();

    // If user not logged in or inactive, show Landing page
    if (!user?.ac_status) return <Landing />;

    return (
        <>
            <Navbar />

            {user.role === 1 && <AdminHomePage />}
            {user.role === 2 && <RecruiterHomePage />}
            {user.role === 4 && <CompanyHomePage />}
            {user.role === 3 && (
                <>
                    <UserHomePage />
                </>
            )}
            <TopMentorsPage />
            
            <BottomNav />
        </>
    );
};

export default HomeRoleRedirect;
