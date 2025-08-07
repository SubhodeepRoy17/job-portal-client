import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import styled from "styled-components";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import avatar from "../assets/media/avatar.jpg";
import { useUserContext } from "../context/UserContext";
import Loading from "../components/shared/Loading";
import UniversalLoading from "../components/shared/UniversalLoading";
import ProfileShimmer from "../components/shared/ProfileShimmer";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { fetchSkillsByIds } from "../utils/skillsHelper";
import calculateProfileCompletion from "../utils/profileCompletion";
import { 
  FiLinkedin, 
  FiGithub, 
  FiTwitter, 
  FiGlobe,
  FiCode,
  FiLink 
} from "react-icons/fi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);

const ProfileHeader = ({ userData, isMobile, activeTab, setActiveTab }) => {
  const [lastUpdated, setLastUpdated] = useState("");
  const { user } = useUserContext();
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [profileData, setProfileData] = useState({
    education: [],
    certificates: [],
    projects: [],
    skills: [],
    about: "",
    social_links: {},
    full_address: "",
    workExperiences: [],
    userProfile: null,
    recruiterProfile: null
  });

  const getProgressColor = (value) => {
    if (value <= 10) return '#f44336';
    if (value <= 60) return '#ff9800';
    return '#4caf50';
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        if (!user) return;

        let promises = [];
        promises.push(
          axios.get("https://job-portal-server-six-eosin.vercel.app/api/user-profile/skills", 
            { withCredentials: true })
            .then(res => {
              return { skills: res.data.skills || res.data || [] };
            })
            .catch(() => {
              return { skills: [] };
            })
        );

        if (user.role === 3) {
          promises = promises.concat([
            axios.get("https://job-portal-server-six-eosin.vercel.app/api/user-profile", 
              { withCredentials: true })
              .then(res => {
                return { 
                  userProfile: res.data,
                  about: res.data.about || "",
                  full_address: res.data.full_address || "",
                  social_links: res.data.social_links || {}
                };
              })
              .catch(() => {
                return {};
              }),
            axios.get("https://job-portal-server-six-eosin.vercel.app/api/education", 
              { withCredentials: true })
              .then(res => {
                return { education: res.data.result || res.data || [] };
              })
              .catch(() => {
                return { education: [] };
              }),
            axios.get("https://job-portal-server-six-eosin.vercel.app/api/work-experience", 
              { withCredentials: true })
              .then(res => {
                return { workExperiences: res.data.result || res.data || [] };
              })
              .catch(() => {
                return { workExperiences: [] };
              }),
            axios.get("https://job-portal-server-six-eosin.vercel.app/api/certificates", 
              { withCredentials: true })
              .then(res => {
                return { certificates: res.data.result || res.data || [] };
              })
              .catch(() => {
                return { certificates: [] };
              }),
            axios.get("https://job-portal-server-six-eosin.vercel.app/api/projects", 
              { withCredentials: true })
              .then(res => {
                return { projects: res.data.result || res.data || [] };
              })
              .catch(() => {
                return { projects: [] };
              })
          ]);
        } else if (user.role === 2) {
          promises.push(
            axios.get("https://job-portal-server-six-eosin.vercel.app/api/recruiter-profile", 
              { withCredentials: true })
              .then(res => {
                return { recruiterProfile: res.data };
              })
              .catch(() => {
                return {};
              })
          );
        } else if (user.role === 4) {
            promises.push(
                axios.get("https://job-portal-server-six-eosin.vercel.app/api/company-profile", 
                { withCredentials: true })
                .then(res => {
                    return { companyProfile: res.data };
                })
                .catch(() => {
                    return {};
                })
            );
        }

        const results = await Promise.all(promises);
        const mergedData = results.reduce((acc, curr) => {
          const normalized = {};
          Object.keys(curr).forEach(key => {
            normalized[key] = curr[key]?.result || curr[key];
          });
          return { ...acc, ...normalized };
        }, {});
        
        setProfileData(prev => ({ ...prev, ...mergedData }));

      } catch (error) {
        console.error("Error in fetchAllData:", error);
      }
    };

    fetchAllData();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const completion = calculateProfileCompletion(user, profileData);
    setProfileCompletion(completion);
    
    if (user?.updated_at) {
      setLastUpdated(dayjs(user.updated_at).fromNow());
    }
  }, [user, profileData]);

  const progressColor = getProgressColor(profileCompletion);

  useEffect(() => {
    if (userData?.updated_at) {
      setLastUpdated(dayjs(userData.updated_at).fromNow());
    }
  }, [userData]);

  return (
    <HeaderWrapper progressColor={progressColor} profileCompletion={profileCompletion}>
      <div className="profile-header">
        <div className="avatar-container">
          <div className="circle-container">
            <div className="circle">
              <div className="inner-circle">
                {userData?.profile_photo ? (
                  <img
                    src={userData.profile_photo}
                    alt="Profile"
                    className="profile-img"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    <div style={{ fontSize: "20px", fontWeight: "bold" }}>+</div>
                    <div>Add photo</div>
                  </div>
                )}
              </div>
            </div>
            <div className="percentage-label">{profileCompletion}%</div>
          </div>

          <Link
            to={`/dashboard/edit-profile/${userData?.id}`}
            className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 rounded-md font-medium transition text-sm"
          >
            <span>Edit Profile</span>
          </Link>
        </div>

        <div className="profile-info">
          <h2>{userData?.full_name || "Your Profile"}</h2>
          {userData?.heading && <h3>{userData.heading}</h3>}
          <p className="last-updated">
            Profile last updated: {lastUpdated || "Recently"}
          </p>
        </div>
      </div>

      {isMobile && (
        <div className="mobile-tabs">
          <button
            className={`tab ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            View Details
          </button>
          <button
            className={`tab ${activeTab === "activity" ? "active" : ""}`}
            onClick={() => setActiveTab("activity")}
          >
            Activity & Insights
          </button>
        </div>
      )}
    </HeaderWrapper>
  );
};

const Profile = () => {
    const navigate = useNavigate();
    const { user } = useUserContext();
    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState("details");
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [skills, setSkills] = useState([]);
    const date = dayjs(user?.created_at).format("MMM Do, YYYY");
    const dob = dayjs(user?.dob).format("MMM Do, YYYY");

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (userData && !userData.is_mo_verified) {
            toast.warn(
            <div>
                Mobile number not verified. Click{' '}
                <span 
                style={{ color: '#2563eb', textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() => navigate(`/dashboard/edit-profile/${userData.id}`)}
                >
                here
                </span>{' '}
                to verify.
            </div>,
            {
                autoClose: 5000,
                closeOnClick: false,
            }
            );
        }
    }, [userData, navigate]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("https://job-portal-server-six-eosin.vercel.app/api/auth/me", { withCredentials: true });
                setUserData(response.data.result);
                if (response.data.result.profile?.skills?.length > 0) {
                    const skillNames = await fetchSkillsByIds(response.data.result.profile.skills);
                    setSkills(skillNames);
                }
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const decodeHTMLEntities = (text) => {
        if (typeof text !== 'string') return text;
        
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    };

    const changeStatus = async (newStatus) => {
        const actionText = newStatus === 2 ? "Hibernate" : "Delete";
        const confirm = await Swal.fire({
            title: `Are you sure you want to ${actionText} your account?`,
            text: newStatus === 2 
                ? "You can reactivate your account later by logging in again." 
                : "This will delete your account. You will need to appeal to reactivate.",
            icon: newStatus === 2 ? "warning" : "error",
            showCancelButton: true,
            confirmButtonColor: newStatus === 2 ? "#f59e0b" : "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: `Yes, ${actionText}`,
        });

        if (!confirm.isConfirmed) return;

        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const answer = num1 + num2;

        const captcha = await Swal.fire({
            title: "Captcha Verification",
            text: `What is ${num1} + ${num2} ?`,
            input: "text",
            inputPlaceholder: "Enter your answer",
            inputValidator: (value) => {
                if (!value) return "Please enter the answer!";
                if (parseInt(value) !== answer) return "Wrong answer. Try again.";
                return null;
            },
            showCancelButton: true,
            confirmButtonText: "Verify",
            cancelButtonText: "Cancel",
        });

        if (!captcha.isConfirmed) return;

        try {
            const res = await axios.patch(
                "https://job-portal-server-six-eosin.vercel.app/api/auth/status",
                { ac_status: newStatus },
                { withCredentials: true }
            );

            await Swal.fire({
                icon: "success",
                title: "Status Changed",
                text: res.data.message,
            });

            navigate("/login");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.response?.data || "Status change failed",
            });
        }
    };

    if (loading) {
        return <ProfileShimmer isMobile={isMobile} />;
    }

    if (!userData) {
        return <div className="error-message">Failed to load user data</div>;
    }

    const formatDate = (dateString) => {
        return dateString ? dayjs(dateString).format("MMM YYYY") : "Present";
    };

    const renderEmploymentType = (type) => {
        return type === 1 ? 'Full-time' : 
               type === 2 ? 'Part-time' : 
               type === 3 ? 'Contract' : 'Freelance';
    };

    return (
    <>
        <ToastContainer position="top-right" autoClose={5000} closeOnClick={false} />
        {([3, 4].includes(user?.role)) && [2, 3].includes(user?.ac_status) && (
        <div className="status-banner">
            {user.ac_status === 2 && (
            <span className="warning">
                Account <strong>hibernated</strong>. <a href="#">Activate</a>
            </span>
            )}
            {user.ac_status === 3 && (
            <span className="error">
                Account <strong>deleted</strong>. <a href="#">Appeal</a>
            </span>
            )}
        </div>
        )}
        
        <Wrapper isMobile={isMobile}>
        {/* New Profile Header */}
        <ProfileHeader 
            userData={userData} 
            isMobile={isMobile}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        />

        {!isMobile && (
            <div className="desktop-tabs">
            <button 
                className={`tab ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
            >
                View Details
            </button>
            <button 
                className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
                onClick={() => setActiveTab('activity')}
            >
                Activity & Insights
            </button>
            </div>
        )}

        {activeTab === 'details' && (
            <>
            {/* Basic Information Section - Updated with sub-cards */}
            <div className="wrapper">
                <h5 className="title">Basic Information</h5>
                <div className="info-cards-container">
                <div className="info-card">
                    <h6>Basic Details</h6>
                    <div className="info-grid">
                    <div className="info-item">
                        <span className="info-label">Status:</span>
                        <span className="info-value">
                        {userData?.ac_status === 1 ? "✅ Active" : 
                        userData?.ac_status === 2 ? "⏸ Hibernated" : 
                        "❌ Deleted"}
                        </span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Name:</span>
                        <span className="info-value">{userData?.full_name || "-"}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Username:</span>
                        <span className="info-value">{userData?.username || "-"}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Role:</span>
                        <span className="info-value">
                            {userData?.role === 1 ? 'Admin' : 
                            userData?.role === 2 ? 'Recruiter' : 
                            userData?.role === 4 ? 'Company' : 
                            'User'}
                        </span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Email:</span>
                        <div className="info-value-container">
                            <span className="info-value email">{userData?.email || "-"}
                                {userData?.is_mail_verified ? (
                                    <img src="/greenverify.svg" alt="Verified" width={16} height={16} className="verified-badge" />
                                    ) : (
                                    <span className="not-verified-text">Not Verified</span>
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Joined:</span>
                        <span className="info-value">{date || "-"}</span>
                    </div>
                    </div>
                </div>

                <div className="info-card">
                    <h6>Personal Details</h6>
                    <div className="info-grid">
                    <div className="info-item">
                        <span className="info-label">Location:</span>
                        <span className="info-value">{userData?.location || "-"}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Gender:</span>
                        <span className="info-value">{userData?.gender || "-"}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Date of Birth:</span>
                        <span className="info-value">{dob || "-"}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Phone:</span>
                        <div className="info-value-container">
                            <span className="info-value">
                            {userData?.mobile_no || "-"}
                            {userData?.is_mo_verified ? (
                                <img src="/greenverify.svg" alt="Verified" width={16} height={16} className="verified-badge" />
                            ) : (
                                <span 
                                className="not-verified-text clickable"
                                onClick={() => navigate(`/dashboard/edit-profile/${userData?.id}`)}
                                >
                                Not Verified
                                </span>
                            )}
                            </span>
                        </div>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Resume:</span>
                        <span className="info-value">
                        {userData?.resume ? (
                            <a href={userData.resume} target="_blank" rel="noopener noreferrer">
                            View Resume
                            </a>
                        ) : (
                            "-"
                        )}
                        </span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Job Preference:</span>
                        <span className="info-value">
                        {userData?.preference === 1
                            ? "Job Only"
                            : userData?.preference === 2
                            ? "Internships Only"
                            : userData?.preference === 3
                            ? "Both"
                            : "-"
                        }
                        </span>
                    </div>
                    </div>
                </div>
                </div>
            </div>

            {/* User Profile Section */}
            {user?.role === 3 && userData.profile && (
                <div className="wrapper">
                <div className="section-header">
                    <h5 className="title">Profile</h5>
                </div>
                <div className="profile-details">
                    {userData.profile.about && (
                    <div className="detail-item">
                        <h6>About</h6>
                        <p className="line-clamp">{userData.profile.about}</p>
                    </div>
                    )}
                    <div className="detail-grid">
                    <div className="detail-item">
                        <span className="detail-label">Designation</span>
                        <span className="detail-value">{userData.profile.designation || "-"}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Course</span>
                        <span className="detail-value">{userData.profile.course_name || "-"}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Specialization</span>
                        <span className="detail-value">{userData.profile.specialization || "-"}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Institution</span>
                        <span className="detail-value">{userData.profile.college_org_name || "-"}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Experience</span>
                        <span className="detail-value">{userData.profile.work_experience || "0"} years</span>
                    </div>
                    {userData.profile.full_address && (
                        <div className="detail-item full-width">
                            <span className="detail-label">Address</span>
                            <span className="detail-value address-value line-clamp">
                            {decodeHTMLEntities(userData.profile.full_address)}
                            </span>
                        </div>
                    )}
                    </div>
                </div>
                </div>
            )}

            {/* Company Profile Section */}
            {user?.role === 4 && userData.companyProfile && (
            <div className="wrapper">
                <div className="section-header">
                <h5 className="title">Company Information</h5>
                <Link to="/dashboard/edit-company-profile" className="edit-link">
                    <FiEdit size={16} /> Edit
                </Link>
                </div>
                <div className="profile-details">
                <div className="detail-grid">
                    <div className="detail-item">
                    <span className="detail-label">Company Name</span>
                    <span className="detail-value">{userData.companyProfile.company_name || "-"}</span>
                    </div>
                    <div className="detail-item">
                    <span className="detail-label">Industry</span>
                    <span className="detail-value">{userData.companyProfile.industry || "-"}</span>
                    </div>
                    <div className="detail-item">
                    <span className="detail-label">Company Size</span>
                    <span className="detail-value">{userData.companyProfile.company_size || "-"}</span>
                    </div>
                    <div className="detail-item">
                    <span className="detail-label">Website</span>
                    <span className="detail-value">
                        {userData.companyProfile.website ? (
                        <a href={userData.companyProfile.website} target="_blank" rel="noopener noreferrer">
                            {userData.companyProfile.website}
                        </a>
                        ) : "-"}
                    </span>
                    </div>
                    <div className="detail-item full-width">
                    <span className="detail-label">About</span>
                    <span className="detail-value">{userData.companyProfile.about || "-"}</span>
                    </div>
                    <div className="detail-item full-width">
                    <span className="detail-label">Address</span>
                    <span className="detail-value address-value line-clamp">
                        {decodeHTMLEntities(userData.companyProfile.address || "-")}
                    </span>
                    </div>
                </div>
                </div>
            </div>
            )}
            
            {/* Skills Section */}
            {user?.role === 3 && skills.length > 0 && (
                <div className="wrapper">
                <div className="section-header">
                    <h5 className="title">Key Skills</h5>
                </div>
                <div className="skills-container">
                    {skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                        {skill.name}
                    </span>
                    ))}
                </div>
                </div>
            )}

            {/* Education Section */}
            {[2, 3].includes(user?.role) && userData.educations?.length > 0 && (
                <div className="wrapper">
                <div className="section-header">
                    <h5 className="title">Education</h5>
                </div>
                <div className="education-list">
                    {userData.educations.map((edu, index) => (
                    <div key={index} className="education-item">
                        <div className="edu-header">
                        <h6>{edu.course_name}</h6>
                        <span className="edu-years">{edu.start_year} - {edu.end_year}</span>
                        </div>
                        <div className="edu-details">
                        <div className="edu-detail">
                            <span className="edu-label">Institution:</span>
                            <span>{edu.college_name}</span>
                        </div>
                        {edu.specialization && (
                            <div className="edu-detail">
                            <span className="edu-label">Specialization:</span>
                            <span>{edu.specialization}</span>
                            </div>
                        )}
                        <div className="edu-detail">
                            <span className="edu-label">Score:</span>
                            <span>{edu.percentage_cgpa}</span>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            )}

            {/* Work Experience Section */}
            {[2, 3].includes(user?.role) && userData.work_experiences?.length > 0 && (
                <div className="wrapper">
                <div className="section-header">
                    <h5 className="title">Experience</h5>
                </div>
                <div className="experience-list">
                    {userData.work_experiences.map((exp, index) => (
                    <div key={index} className="experience-item">
                        <div className="exp-header">
                        <h6>{exp.designation}</h6>
                        <span className="exp-company">{exp.company_name}</span>
                        </div>
                        <div className="exp-details">
                        <div className="exp-detail">
                            <span className="exp-label">Type:</span>
                            <span>{renderEmploymentType(exp.employment_type)}</span>
                        </div>
                        <div className="exp-detail">
                            <span className="exp-label">Location:</span>
                            <span>{exp.location}</span>
                        </div>
                        <div className="exp-detail">
                            <span className="exp-label">Duration:</span>
                            <span>
                            {formatDate(`${exp.start_year}-${exp.start_month}-01`)} - {' '}
                            {exp.currently_working ? 'Present' : 
                            exp.end_year ? formatDate(`${exp.end_year}-${exp.end_month}-01`) : 'Present'}
                            </span>
                        </div>
                        {exp.description && (
                            <div className="exp-description">
                                <p className="line-clamp">{exp.description}</p>
                            </div>
                        )}
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            )}

            {/* Certificates Section */}
            {user?.role === 3 && userData.certificates?.length > 0 && (
                <div className="wrapper">
                <div className="section-header">
                    <h5 className="title">Certificates</h5>
                </div>
                <div className="certificate-list">
                    {userData.certificates.map((cert, index) => (
                    <div key={index} className="certificate-item">
                        <h6>{cert.title}</h6>
                        <div className="cert-details">
                        <div className="cert-detail">
                            <span className="cert-label">Issued by:</span>
                            <span>{cert.issuing_organization}</span>
                        </div>
                        <div className="cert-detail">
                            <span className="cert-label">Issued on:</span>
                            <span>{formatDate(cert.issue_date)}</span>
                        </div>
                        {cert.expiry_date && (
                            <div className="cert-detail">
                            <span className="cert-label">Expires:</span>
                            <span>{formatDate(cert.expiry_date)}</span>
                            </div>
                        )}
                        {cert.description && (
                            <div className="cert-description">
                            <p className="line-clamp">{cert.description}</p>
                            </div>
                        )}
                        </div>
                        {cert.credential_url && (
                        <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="credential-link">
                            View Credential
                        </a>
                        )}
                    </div>
                    ))}
                </div>
                </div>
            )}

            {/* Projects Section */}
            {user?.role === 3 && userData.projects?.length > 0 && (
                <div className="wrapper">
                <div className="section-header">
                    <h5 className="title">Projects</h5>
                </div>
                <div className="project-list">
                    {userData.projects.map((project, index) => (
                    <div key={index} className="project-item">
                        <h6>{project.title}</h6>
                        <div className="project-meta">
                        <span className={`status-badge ${project.is_ongoing ? 'ongoing' : 'completed'}`}>
                            {project.is_ongoing ? 'Ongoing' : 'Completed'}
                        </span>
                        <span className="project-duration">
                            {formatDate(project.start_date)} - {' '}
                            {project.is_ongoing ? 'Present' : 
                            project.end_date ? formatDate(project.end_date) : 'Present'}
                        </span>
                        </div>
                        {project.description && (
                        <div className="project-description">
                            <p className="line-clamp">{project.description}</p>
                        </div>
                        )}
                        {project.project_url && (
                        <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="project-link">
                            View Project
                        </a>
                        )}
                    </div>
                    ))}
                </div>
                </div>
            )}

            {/* Social Links Section */}
            {user?.role === 3 && userData.profile?.social_links && (
                <div className="wrapper">
                    <div className="section-header">
                    <h5 className="title">Social Links</h5>
                    </div>
                        <div className="social-links-container">
                        {/* LinkedIn */}
                        {userData.profile.social_links.linkedin ? (
                            <div className="social-link-item">
                            <FiLinkedin className="social-icon" />
                            <a 
                                href={userData.profile.social_links.linkedin} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="active-link"
                            >
                                LinkedIn
                            </a>
                            </div>
                        ) : (
                            <div className="social-link-item disabled">
                            <FiLinkedin className="social-icon" />
                            <span className="inactive-link">LinkedIn</span>
                            </div>
                        )}

                        {/* GitHub */}
                        {userData.profile.social_links.github ? (
                            <div className="social-link-item">
                            <FiGithub className="social-icon" />
                            <a 
                                href={userData.profile.social_links.github} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="active-link"
                            >
                                GitHub
                            </a>
                            </div>
                        ) : (
                            <div className="social-link-item disabled">
                            <FiGithub className="social-icon" />
                            <span className="inactive-link">GitHub</span>
                            </div>
                        )}

                        {/* Portfolio */}
                        {userData.profile.social_links.portfolio ? (
                            <div className="social-link-item">
                            <FiGlobe className="social-icon" />
                            <a 
                                href={userData.profile.social_links.portfolio} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="active-link"
                            >
                                Portfolio
                            </a>
                            </div>
                        ) : (
                            <div className="social-link-item disabled">
                            <FiGlobe className="social-icon" />
                            <span className="inactive-link">Portfolio</span>
                            </div>
                        )}

                        {/* Twitter */}
                        {userData.profile.social_links.twitter ? (
                            <div className="social-link-item">
                            <FiTwitter className="social-icon" />
                            <a 
                                href={userData.profile.social_links.twitter} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="active-link"
                            >
                                Twitter
                            </a>
                            </div>
                        ) : (
                            <div className="social-link-item disabled">
                            <FiTwitter className="social-icon" />
                            <span className="inactive-link">Twitter</span>
                            </div>
                        )}

                        {/* LeetCode */}
                        {userData.profile.social_links.leetcode ? (
                            <div className="social-link-item">
                            <FiCode className="social-icon" />
                            <a 
                                href={userData.profile.social_links.leetcode} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="active-link"
                            >
                                LeetCode
                            </a>
                            </div>
                        ) : (
                            <div className="social-link-item disabled">
                            <FiCode className="social-icon" />
                            <span className="inactive-link">LeetCode</span>
                            </div>
                        )}

                        {/* Other */}
                        {userData.profile.social_links.other ? (
                            <div className="social-link-item">
                            <FiLink className="social-icon" />
                            <a 
                                href={userData.profile.social_links.other} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="active-link"
                            >
                                Other
                            </a>
                            </div>
                        ) : (
                            <div className="social-link-item disabled">
                            <FiLink className="social-icon" />
                            <span className="inactive-link">Other</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
            </>
        )}

        {activeTab === 'activity' && (
            <div className="wrapper">
            <h5 className="title">Activity & Insights</h5>
            <div className="empty-state">
                <p>Activity & Insights will be shown here</p>
            </div>
            </div>
        )}
        </Wrapper>
    </>
    );
};  

const HeaderWrapper = styled.div`
  font-family: 'Poppins', sans-serif;

  .profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .avatar-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .circle-container {
    position: relative;
    width: 96px;
    height: 96px;
    flex-shrink: 0;
    margin-bottom: 0.5rem;
  }

  .circle {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: conic-gradient(
      ${({ progressColor, profileCompletion }) =>
        `${progressColor} ${profileCompletion * 3.6}deg, #e0e0e0 ${profileCompletion * 3.6}deg`}
    );
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .inner-circle {
    background: #fff;
    width: 88px;
    height: 88px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .profile-img,
  .avatar-placeholder {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #777;
    background-color: #f0f0f0;
    font-weight: 500;
    font-size: 16px;
    flex-direction: column;
    text-align: center;
  }

  .clickable {
    cursor: pointer;
    &:hover {
        text-decoration: underline;
        color: #2563eb;
    }
  }

  .percentage-label {
    position: absolute;
    bottom: -14px;
    left: 50%;
    transform: translateX(-50%);
    background-color: white;
    padding: 2px 10px;
    border-radius: 20px;
    border: 1px solid ${({ progressColor }) => progressColor};
    font-size: 13px;
    font-weight: 500;
    color: ${({ progressColor }) => progressColor};
  }

  .email-verification, .phone-verification {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
  }

  .info-value-container {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    position: relative;
    padding-right: 24px; /* Space for badge */
  }

  .verified-badge {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
  }

  .not-verified-text {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.7rem;
    color: #999;
    font-style: italic;
    white-space: nowrap;
  }

  .profile-info {
    text-align: center;

    h2 {
      font-size: 1.4rem;
      margin: 0;
      color: #333;
    }

    h3 {
      font-size: 0.8rem;
      margin: 0.3rem 0 0;
      color: #555;
      font-weight: 600;
    }

    .last-updated {
      font-size: 0.85rem;
      color: #777;
      margin-top: 0.5rem;
    }
  }

  .mobile-tabs {
    display: flex;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 1.5rem;

    .tab {
      flex: 1;
      padding: 0.8rem;
      background: none;
      border: none;
      font-size: 0.95rem;
      color: #64748b;
      position: relative;

      &.active {
        color: #2563eb;
        font-weight: 500;

        &:after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #2563eb;
        }
      }
    }
  }

  @media (min-width: 768px) {
    .profile-header {
      flex-direction: row;
      align-items: flex-start;
      gap: 2rem;
    }

    .profile-info {
      text-align: left;
      padding-top: 1rem;
      margin-top: 20px;
    }
  }
`;

const Wrapper = styled.section`
    width: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;

    .wrapper {
        background: #fff;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 6px 12px rgba(30, 10, 58, .04);
        width: 100%;
        max-width: 900px;
        margin: 0 auto;
    }

    .title {
        font-size: 1.4rem;
        font-weight: 600;
        color: #333;
        margin-bottom: 1.2rem;
    }

    .desktop-tabs {
        display: flex;
        margin-bottom: 1.5rem;
        border-bottom: 1px solid #e2e8f0;
        
        .tab {
            padding: 0.8rem 1rem;
            background: none;
            border: none;
            font-size: 1rem;
            color: #64748b;
            position: relative;
            cursor: pointer;
        
            &.active {
                color: #2563eb;
                font-weight: 500;
                
                &:after {
                content: '';
                position: absolute;
                bottom: -1px;
                left: 0;
                right: 0;
                height: 2px;
                background: #2563eb;
                }
            }
        }
    }

    .info-cards-container {
        display: grid;
        grid-template-columns: ${props => props.isMobile ? '1fr' : '1fr 1fr'};
        margin-top: 1rem;
    }

    .info-card {
        background: #f9f9f9;
        border-radius: 8px;
        padding: 1.2rem;
        
        h6 {
        font-size: 1.1rem;
        margin: 0 0 1rem 0;
        color: #333;
        }
    }

    .empty-state {
        background: #f9f9f9;
        border-radius: 8px;
        padding: 2rem;
        text-align: center;
        color: #666;
    }

    @media (max-width: 768px) {
        .info-cards-container {
        grid-template-columns: 1fr;
        }
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .edit-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--color-primary);
        font-size: 0.9rem;
        text-decoration: none;
    }

    /* Basic Info Section */
    .profile-container {
        display: flex;
        flex-direction: ${props => props.isMobile ? 'column' : 'row'};
        gap: ${props => props.isMobile ? '1.5rem' : '3rem'};
        align-items: flex-start;
        justify-content: ${props => props.isMobile ? 'center' : 'flex-start'};
        width: 100%;
    }

    .avatar-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.8rem;
        min-width: 150px;
    }

    @media (min-width: 768px) {
        .avatar-container {
            margin-top: 0;
            margin-bottom: 0;
        }
    }

    .avatar {
        width: ${props => props.isMobile ? '120px' : '150px'};
        height: ${props => props.isMobile ? '120px' : '150px'};
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #f0f0f0;
    }

    .edit-btn {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        font-size: 0.85rem;
        color: #414BEA;
        text-decoration: none;
    }

    .info-grid {
        display: grid;
        gap: 1rem 3rem;
        flex: 1;
        width: 100%;
    }

    .info-item {
        display: flex;
        flex-direction: ${props => props.isMobile ? 'row' : 'row'}; // force row for both
        gap: ${props => props.isMobile ? '0.5rem' : '0.5rem'};
        align-items: flex-start;
        flex-wrap: wrap;  // important to prevent overflow
        width: 100%;
        max-width: 100%;
    }

    .info-label {
        font-weight: ${props => props.isMobile ? '500' : '600'};
        color: #666;
        font-size: 0.9rem;
        min-width: ${props => props.isMobile ? '80px' : '120px'}; // increase for desktop
    }

    .info-value {
        color: #333;
        font-size: 0.95rem;
        word-break: break-word;
        white-space: normal;  // ensure it wraps correctly
        flex: 1;
    }

    .email {
        text-transform: lowercase;
    }

    .action-buttons {
        display: flex;
        gap: 0.8rem;
        margin-top: ${props => props.isMobile ? '1.2rem' : '2rem'};
        justify-content: ${props => props.isMobile ? 'center' : 'flex-start'};
        width: 100%;
    }

    .hibernate-btn, .delete-btn {
        padding: 0.5rem 1.2rem;
        border: none;
        border-radius: 6px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
    }

    .hibernate-btn {
        background-color: #fbbf24;
        color: #000;
    }

    .delete-btn {
        background-color: #F05537;
        color: #fff;
    }

    /* Skills Section Styles */
    .skills-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
        margin-top: 1rem;
    }

    .skill-tag {
        background-color: #e0f2fe;
        color: #0369a1;
        padding: 0.4rem 0.8rem;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        transition: all 0.2s ease;
    }

    .skill-tag:hover {
        background-color: #bae6fd;
        transform: translateY(-1px);
    }

    @media (max-width: 768px) {
        .skills-container {
            gap: 0.5rem;
        }

        .skill-tag {
            padding: 0.3rem 0.7rem;
            font-size: 0.8rem;
        }
    }

    /* Profile Details Section */
    .profile-details {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
    }

    .detail-item h6 {
        font-size: 1rem;
        color: #333;
    }

    .detail-item p {
        color: #555;
        line-height: 1.5;
        font-size: 0.95rem;
    }

    /* Line clamping utility */
    .line-clamp {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        position: relative;
    }

    .line-clamp:after {
        content: '....';
        position: absolute;
        bottom: 0;
        right: 0;
        background: white;
        padding-left: 2px;
        display: none;
    }

    /* Show dots only when line-clamp is active */
    .line-clamp[style*="-webkit-line-clamp"]:after {
        display: block;
    }

    /* New class for the ellipsis dots */
    .clamp-dots {
        position: absolute;
        bottom: 0;
        right: 0;
        background: white;
        padding-left: 2px;
    }

    /* Force line breaks in address */
    .address-value {
        white-space: pre-line;
    }

    .detail-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .detail-label {
        display: block;
        font-size: 0.85rem;
        color: #666;
        margin-bottom: 0.2rem;
    }

    .detail-value {
        font-size: 0.95rem;
        color: #333;
    }

    .full-width {
        grid-column: 1 / -1;
    }

    /* Education Section */
    .education-list {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
    }

    .education-item {
        background: #f9f9f9;
        border-radius: 8px;
        padding: 1rem;
    }

    .edu-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.8rem;
    }

    .edu-header h6 {
        font-size: 1rem;
        color: #333;
        margin: 0;
    }

    .edu-years {
        font-size: 0.85rem;
        color: #666;
    }

    .edu-details {
        display: grid;
        grid-template-columns: ${props => props.isMobile ? '1fr' : '1fr 1fr'};
        gap: 0.8rem;
    }

    .edu-detail {
        display: flex;
        flex-direction: column;
    }

    .edu-label {
        font-size: 0.8rem;
        color: #666;
    }

    /* Experience Section */
    .experience-list {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
    }

    .experience-item {
        background: #f9f9f9;
        border-radius: 8px;
        padding: 1rem;
    }

    .exp-header {
        margin-bottom: 0.8rem;
    }

    .exp-header h6 {
        font-size: 1rem;
        color: #333;
        margin: 0 0 0.2rem 0;
    }

    .exp-company {
        font-size: 0.9rem;
        color: #555;
    }

    .exp-details {
        display: grid;
        grid-template-columns: ${props => props.isMobile ? '1fr' : '1fr 1fr'};
        gap: 0.8rem;
    }

    .exp-detail {
        display: flex;
        flex-direction: column;
    }

    .exp-label {
        font-size: 0.8rem;
        color: #666;
    }

    .exp-description {
        grid-column: 1 / -1;
        margin-top: 0.5rem;
    }

    .exp-description p {
        font-size: 0.9rem;
        color: #555;
        line-height: 1.5;
    }

    /* Certificates Section */
    .certificate-list {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
    }

    .certificate-item {
        background: #f9f9f9;
        border-radius: 8px;
        padding: 1rem;
    }

    .certificate-item h6 {
        font-size: 1rem;
        color: #333;
        margin: 0 0 0.8rem 0;
    }

    .cert-details {
        display: grid;
        grid-template-columns: ${props => props.isMobile ? '1fr' : '1fr 1fr'};
        gap: 0.8rem;
        margin-bottom: 0.8rem;
    }

    .cert-detail {
        display: flex;
        flex-direction: column;
    }

    .cert-label {
        font-size: 0.8rem;
        color: #666;
    }

    .cert-description {
        grid-column: 1 / -1;
    }

    .cert-description p {
        font-size: 0.9rem;
        color: #555;
        line-height: 1.5;
    }

    .credential-link {
        display: inline-block;
        font-size: 0.9rem;
        color: var(--color-primary);
        text-decoration: none;
        margin-top: 0.5rem;
    }

    .social-links-container {
        display: grid;
        grid-template-columns: ${props => props.isMobile ? '1fr' : '1fr 1fr'};
        gap: 1rem;
        margin-top: 1rem;
        }

        .social-link-item {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        padding: 0.6rem 0.8rem;
        border-radius: 6px;
        background-color: #f8fafc;
        transition: all 0.2s ease;
        
        &.disabled {
            cursor: default;
            background-color: #f1f5f9;
        }
    }

    .social-icon {
        font-size: 1.1rem;
        color: #64748b;
        flex-shrink: 0;
    }

    .active-link {
        color: #2563eb;
        text-decoration: none;
        font-size: 0.95rem;
        word-break: break-all;
        
        &:hover {
            text-decoration: underline;
        }
    }

    .inactive-link {
        color: #94a3b8;
        font-size: 0.95rem;
        pointer-events: none;
    }

    @media (max-width: 480px) {
        .social-links-container {
            grid-template-columns: 1fr;
        }
        
        .social-link-item {
            padding: 0.5rem 0.7rem;
        }
    }

    /* Projects Section */
    .project-list {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
    }

    .project-item {
        background: #f9f9f9;
        border-radius: 8px;
        padding: 1rem;
    }

    .project-item h6 {
        font-size: 1rem;
        color: #333;
        margin: 0 0 0.5rem 0;
    }

    .project-meta {
        display: flex;
        gap: 1rem;
        align-items: center;
        margin-bottom: 0.8rem;
    }

    .status-badge {
        font-size: 0.75rem;
        padding: 0.2rem 0.5rem;
        border-radius: 12px;
        font-weight: 500;
    }

    .status-badge.ongoing {
        background: #dbeafe;
        color: #1d4ed8;
    }

    .status-badge.completed {
        background: #dcfce7;
        color: #166534;
    }

    .project-duration {
        font-size: 0.85rem;
        color: #666;
    }

    .project-description {
        margin-bottom: 0.8rem;
    }

    .project-description p {
        font-size: 0.9rem;
        color: #555;
        line-height: 1.5;
    }

    .project-link {
        display: inline-block;
        font-size: 0.9rem;
        color: var(--color-primary);
        text-decoration: none;
    }

    /* Status Banner */
    .status-banner {
        background: ${props => props.isMobile ? 'transparent' : '#fff'};
        padding: ${props => props.isMobile ? '0.5rem 0' : '0.8rem 1rem'};
        border-radius: ${props => props.isMobile ? '0' : '8px'};
        box-shadow: ${props => props.isMobile ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.08)'};
        text-align: center;
        margin-bottom: ${props => props.isMobile ? '0.5rem' : '1rem'};
    }

    .warning {
        color: #d97706;
        font-size: 0.9rem;
    }

    .error {
        color: #dc2626;
        font-size: 0.9rem;
    }

    .status-banner a {
        color: var(--color-primary);
        text-decoration: underline;
    }

    /* Loading and Error States */
    .loading-spinner {
        display: flex;
        justify-content: center;
        padding: 2rem;
        color: #666;
    }

    .error-message {
        display: flex;
        justify-content: center;
        padding: 2rem;
        color: #dc2626;
    }

    @media (min-width: 768px) {
        padding: 1.5rem;
        gap: 2rem;

        .wrapper {
            padding: 2rem;
        }

        .title {
            font-size: 1.5rem;
        }
    }
`;

export default Profile;
