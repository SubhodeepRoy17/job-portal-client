//src/pages/CompanyDashboard.jsx
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
  faBriefcase, 
  faBuilding, 
  faCalendarAlt, 
  faCreditCard, 
  faEye, 
  faFileAlt, 
  faHeart, 
  faEllipsisH, 
  faPlus, 
  faCog, 
  faChartLine, 
  faUser,
  faUsers,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";

export default function CompanyDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { company } = useSelector((state) => state.auth);
  const { stats, jobs, loading } = useSelector((state) => state.company);
  
  const [activeJob, setActiveJob] = useState(null);

  useEffect(() => {
    if (company) {
      dispatch(fetchCompanyData());
    }
  }, [dispatch, company]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/company-login");
  };

  // Example usage of handleLogout - you can use this in a button or menu item
  const logoutButton = (
    <button
      onClick={handleLogout}
      className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md w-full"
    >
      <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 h-5 w-5" />
      Log-out
    </button>
  );

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-64">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 pb-16 lg:pb-0">
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
              <div className="bg-white rounded-lg shadowSm overflow-hidden">
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

            {/* Example logout button using your handleLogout function */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
              {logoutButton}
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
  );
}