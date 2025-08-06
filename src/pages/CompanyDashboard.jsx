"use client"

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyData } from "../redux/slices/companySlice";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import Logo from "../components/Logo";
import { 
  faBell, 
  faBriefcase, 
  faBuilding, 
  faCalendarAlt, 
  faChevronDown, 
  faCreditCard, 
  faEye, 
  faFileAlt, 
  faHeart, 
  faSignOutAlt, 
  faEllipsisH, 
  faPhone, 
  faPlus, 
  faCog, 
  faChartLine, 
  faUser, 
  faUsers,
  faHome,
  faSearch,
  faBookmark,
  faHeadset
} from "@fortawesome/free-solid-svg-icons";

export default function CompanyDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { company } = useSelector((state) => state.auth);
  const { stats, jobs, loading } = useSelector((state) => state.company);
  
  const [activeJob, setActiveJob] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (company) {
      dispatch(fetchCompanyData());
    }
  }, [dispatch, company]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/company-login");
  };

  const sidebarItems = [
    { icon: faFileAlt, label: "Overview", active: true },
    { icon: faUser, label: "Employers Profile" },
    { icon: faPlus, label: "Post a Job" },
    { icon: faBriefcase, label: "My Jobs" },
    { icon: faHeart, label: "Saved Candidate" },
    { icon: faCreditCard, label: "Plans & Billing" },
    { icon: faBuilding, label: "All Companies" },
    { icon: faCog, label: "Settings" },
  ];

  const LogoContainer = styled.div`
    max-width: 120px;
  `;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Top Navigation */}
      <nav className="bg-white border-b border-gray-200 lg:hidden">
        <div className="px-4">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <LogoContainer>
              <Logo />
            </LogoContainer>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{company?.company_name?.charAt(0) || "C"}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-10">
        <div className="flex justify-around items-center h-16">
          <a href="#" className="text-gray-500 hover:text-gray-700 flex flex-col items-center">
            <FontAwesomeIcon icon={faHome} className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700 flex flex-col items-center">
            <FontAwesomeIcon icon={faSearch} className="h-5 w-5" />
            <span className="text-xs mt-1">Find</span>
          </a>
          <a href="#" className="text-blue-600 flex flex-col items-center">
            <FontAwesomeIcon icon={faFileAlt} className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700 flex flex-col items-center">
            <FontAwesomeIcon icon={faBookmark} className="h-5 w-5" />
            <span className="text-xs mt-1">Saved</span>
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700 flex flex-col items-center">
            <FontAwesomeIcon icon={faHeadset} className="h-5 w-5" />
            <span className="text-xs mt-1">Support</span>
          </a>
        </div>
      </div>

      {/* Desktop Top Navigation */}
      <nav className="bg-white border-b border-gray-200 hidden lg:block">
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
                <FontAwesomeIcon icon={faPhone} className="h-4 w-4 mr-2" />
                <span className="text-sm">+1-202-555-0178</span>
              </div>
              <div className="hidden lg:flex items-center">
                <img src="/placeholder.svg?height=20&width=30" alt="US Flag" className="h-4 w-6 mr-2" />
                <span className="text-sm text-gray-600">English</span>
                <FontAwesomeIcon icon={faChevronDown} className="h-4 w-4 ml-1 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="flex items-center">
                <LogoContainer>
                  <Logo />
                </LogoContainer>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Post A Job
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">{company?.company_name?.charAt(0) || "C"}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div 
            className={`fixed lg:static inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out w-64 lg:w-80 bg-white rounded-lg shadow-sm z-30 lg:z-auto`}
          >
            <div className="p-6 h-full overflow-y-auto">
              <div className="flex justify-between items-center lg:hidden mb-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">MENU</h3>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <h3 className="hidden lg:block text-sm font-medium text-gray-500 uppercase tracking-wide mb-6">EMPLOYERS DASHBOARD</h3>
              <nav className="space-y-2">
                {sidebarItems.map((item, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      item.active
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <FontAwesomeIcon icon={item.icon} className="mr-3 h-5 w-5" />
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="border-t border-gray-200 pt-6 mt-6">
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md w-full"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 h-5 w-5" />
                  Log-out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={`flex-1 ${sidebarOpen ? 'ml-64 lg:ml-0' : ''} pb-16 lg:pb-0`}>
            <div className="mb-8">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                  {company ? `Company - ${company.full_name}` : "Your Company Dashboard"}
                </h1>
                <p className="text-gray-600">Here is your daily activities and applications</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stats?.openJobs || "0"}</p>
                      <p className="text-gray-600">Open Jobs</p>
                    </div>
                    <div className="bg-blue-100 p-2 lg:p-3 rounded-lg">
                      <FontAwesomeIcon icon={faBriefcase} className="h-5 lg:h-6 w-5 lg:w-6 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stats?.savedCandidates || "0"}</p>
                      <p className="text-gray-600">Saved Candidates</p>
                    </div>
                    <div className="bg-orange-100 p-2 lg:p-3 rounded-lg">
                      <FontAwesomeIcon icon={faUsers} className="h-5 lg:h-6 w-5 lg:w-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recently Posted Jobs */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 lg:p-6">
                <div className="flex justify-between items-center mb-4 lg:mb-6">
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Recently Posted Jobs</h2>
                  <button className="text-blue-600 hover:text-blue-700 bg-transparent border-none text-sm lg:text-base">
                    View all →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2 lg:py-3 lg:px-4 font-medium text-gray-500 uppercase tracking-wide text-xs">
                          JOBS
                        </th>
                        <th className="text-left py-2 px-2 lg:py-3 lg:px-4 font-medium text-gray-500 uppercase tracking-wide text-xs">
                          STATUS
                        </th>
                        <th className="text-left py-2 px-2 lg:py-3 lg:px-4 font-medium text-gray-500 uppercase tracking-wide text-xs hidden sm:table-cell">
                          APPLICATIONS
                        </th>
                        <th className="text-left py-2 px-2 lg:py-3 lg:px-4 font-medium text-gray-500 uppercase tracking-wide text-xs">
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs?.map((job) => (
                        <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-2 lg:px-4">
                            <div>
                              <h3 className="font-medium text-gray-900 text-sm lg:text-base">{job.title}</h3>
                              <p className="text-xs lg:text-sm text-gray-500">
                                {job.type} • {job.timeRemaining}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-2 lg:px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              job.status === "Active" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              <div className="flex items-center">
                                <div
                                  className={`w-2 h-2 rounded-full mr-1 ${job.status === "Active" ? "bg-green-500" : "bg-red-500"}`}
                                ></div>
                                {job.status}
                              </div>
                            </span>
                          </td>
                          <td className="py-3 px-2 lg:px-4 hidden sm:table-cell">
                            <div className="flex items-center text-gray-600">
                              <FontAwesomeIcon icon={faUsers} className="h-4 w-4 mr-2" />
                              <span className="text-xs lg:text-sm">{job.applications} Applications</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 lg:px-4">
                            <div className="flex items-center space-x-1 lg:space-x-2">
                              <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 lg:px-3 py-1 rounded-md text-xs lg:text-sm">
                                View
                              </button>
                              <div className="relative inline-block text-left">
                                <button className="p-1 rounded-full hover:bg-gray-100">
                                  <FontAwesomeIcon icon={faEllipsisH} className="h-4 w-4" />
                                </button>
                                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                  <div className="py-1">
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                      <FontAwesomeIcon icon={faChartLine} className="mr-2 h-4 w-4" />
                                      Promote Job
                                    </a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                      <FontAwesomeIcon icon={faEye} className="mr-2 h-4 w-4" />
                                      View Detail
                                    </a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 h-4 w-4" />
                                      Mark as expired
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">© {new Date().getFullYear()} HireNext @2025. All rights Reserved</p>
        </div>
      </footer>
    </div>
  )
}