//src/components/shared/DashboardNavbar.jsx
import styled from "styled-components";
import Logo from "../Logo";
import { useDashboardContext } from "../../Layout/DashboardLayout";
import { Link } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { useUserContext } from "../../context/UserContext";

const DashboardNavbar = () => {
    const { showSidebar, setShowSidebar } = useDashboardContext();
    const { user } = useUserContext();

    return (
        <Wrapper>
            <div className="nav-container">
                <div className="start">
                    <button
                        className="toggler"
                        onClick={() => setShowSidebar(!showSidebar)}
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
                <div className="center">
                    <Logo />
                </div>
                <div className="end">
                    <Link to="/dashboard/notifications" className="notification-icon p-2 rounded-full hover:bg-gray-100 relative">
                        <FiBell className="icon h-5 w-5" />
                        <span className="notification-dot"></span>
                    </Link>
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center ml-3">
                        <span className="text-white text-sm font-medium">
                            {user?.username?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.nav`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
    padding: 0.7rem 1rem;
    background-color: var(--color-white);
    z-index: 99;
    border-bottom: 1px solid #e5e7eb;

    .nav-container {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .start .toggler {
        color: var(--color-primary);
        cursor: pointer;
        border-radius: 6px;
        border: 1px solid rgba(0, 0, 0, 0.14);
        padding: 4px 6px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .start .toggler:hover {
        background-color: var(--color-primary);
        color: var(--color-white);
    }

    .center {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .notification-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-grey-700);
        position: relative;
        transition: all 0.3s ease;
    }

    .notification-dot {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 8px;
        height: 8px;
        background-color: #FF3B30;
        border-radius: 50%;
        border: 1px solid white;
    }

    @media (max-width: 600px) {
        padding: 0.5rem 0.8rem;

        .start .toggler {
            padding: 3px 5px;
        }

        .center {
            max-width: 100px;
        }
    }

    @media (min-width: 992px) {
        position: sticky;
        top: 0;
    }
`;

export default DashboardNavbar;