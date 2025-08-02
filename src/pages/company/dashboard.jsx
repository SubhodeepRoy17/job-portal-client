// src/pages/company/Dashboard.jsx
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const { company } = useSelector((state) => state.auth);

  // Redirect if not logged in
  useEffect(() => {
    if (!company) {
      toast.error('Please login to access dashboard');
      navigate('/company/login');
    }
  }, [company, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Company Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-500">
                Welcome, {company?.company_name}
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('company');
                  navigate('/company/login');
                }}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Total Jobs Posted</h3>
              <p className="mt-2 text-3xl font-semibold text-blue-600">24</p>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Active Applications</h3>
              <p className="mt-2 text-3xl font-semibold text-blue-600">156</p>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Profile Completion</h3>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: '75%' }}
                  ></div>
                </div>
                <p className="mt-2 text-sm text-gray-500">Complete your profile to get more visibility</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="md:col-span-2 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/company/post-job"
                  className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  <span className="text-sm font-medium">Post New Job</span>
                </Link>
                <Link
                  to="/company/profile"
                  className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span className="text-sm font-medium">Edit Profile</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <ul className="space-y-4">
                <li className="border-b pb-2">
                  <p className="text-sm">You posted a new job: Frontend Developer</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </li>
                <li className="border-b pb-2">
                  <p className="text-sm">5 new applications for Backend Engineer</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </li>
                <li>
                  <p className="text-sm">Profile viewed 24 times</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}