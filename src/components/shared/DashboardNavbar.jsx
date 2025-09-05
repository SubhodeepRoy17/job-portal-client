import styled from "styled-components";
import Logo from "../Logo";
import { useDashboardContext } from "../../Layout/DashboardLayout";
import { Link } from "react-router-dom";
import { FiBell, FiPlus } from "react-icons/fi";
import { useUserContext } from "../../context/UserContext";

const DashboardNavbar = () => {
    const { showSidebar, setShowSidebar } = useDashboardContext();
    const { user } = useUserContext();

    return (
        <Wrapper>
            {/* Mobile Top Navigation */}
            <div className="mobile-nav lg:hidden">
                <div className="nav-container">
                    <div className="start">
                        <button
                            className="toggler"
                            onClick={() => setShowSidebar(!showSidebar)}
                        >
                            <ion-icon name="menu"></ion-icon>
                        </button>
                    </div>
                    <div className="center">
                        <Logo />
                    </div>
                    <div className="end">
                        <Link to="/dashboard/notifications" className="notification-icon">
                            <FiBell className="icon" />
                            <span className="notification-dot"></span>
                        </Link>
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center ml-3">
                            <span className="text-white text-sm font-medium">
                                {user?.username?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Top Navigation */}
            <div className="desktop-nav hidden lg:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex space-x-4 lg:space-x-8">
                            <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                                Home
                            </a>
                            <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                                Find Candidate
                            </a>
                            <a href="#" className="text-blue-600 border-b-2 border-blue-600 px-3 py-2 text-sm font-medium">
                                Dashboard
                            </a>
                            <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                                My Jobs
                            </a>
                            <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                                Applications
                            </a>
                            <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                                Customer Supports
                            </a>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="hidden lg:flex items-center text-gray-600">
                                <ion-icon name="call-outline" className="h-4 w-4 mr-2"></ion-icon>
                                <span className="text-sm">+1-202-555-0178</span>
                            </div>
                            <div className="hidden lg:flex items-center">
                                <img src="/placeholder.svg?height=20&width=30" alt="US Flag" className="h-4 w-6 mr-2" />
                                <span className="text-sm text-gray-600">English</span>
                                <ion-icon name="chevron-down-outline" className="h-4 w-4 ml-1 text-gray-400"></ion-icon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Header */}
            <div className="desktop-header hidden lg:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <Logo />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/dashboard/notifications" className="p-2 rounded-full hover:bg-gray-100 relative notification-icon">
                                <FiBell className="icon" />
                                <span className="notification-dot"></span>
                            </Link>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center">
                                <FiPlus className="mr-2" />
                                Post A Job
                            </button>
                            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium">
                                    {user?.username?.charAt(0)?.toUpperCase() || "U"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.nav`
    background-color: white;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    
    .mobile-nav {
        padding: 0.7rem 1rem;
        
        .nav-container {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .start .toggler {
            font-weight: 900;
            font-size: 24px;
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
        
        .end {
            display: flex;
            align-items: center;
        }
        
        .notification-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-grey-700);
            font-size: 1.5rem;
            position: relative;
            transition: all 0.3s ease;
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
    }
    
    .desktop-header {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 1023px) {
        .mobile-nav {
            display: block;
        }
        .desktop-nav, .desktop-header {
            display: none;
        }
    }

    @media (min-width: 1024px) {
        .mobile-nav {
            display: none;
        }
        .desktop-nav, .desktop-header {
            display: block;
        }
    }
`;

export default DashboardNavbar;