//src\pages\CompanyEditProfile.jsx
import React, { useState, useEffect, useCallback } from "react";
import { CiSquarePlus } from "react-icons/ci";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import styled from "styled-components";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoArrowBack } from 'react-icons/io5';
import { useMediaQuery } from 'react-responsive';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function LinearProgressWithLabel(props) {
  const getProgressColor = (value) => {
    if (value <= 10) return 'error'; // red
    if (value <= 60) return 'warning'; // yellow
    return 'success'; // green
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress 
          variant="determinate" 
          value={props.value}
          color={getProgressColor(props.value)}
          sx={{
            height: 8,
            borderRadius: 4,
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
            }
          }}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

const CompanyEditProfile = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();
  const { user, handleFetchMe } = useUserContext();
  const [activeSection, setActiveSection] = useState("basic");
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
    github: '',
    crunchbase: ''
  });
  const [showSocialLinksForm, setShowSocialLinksForm] = useState(false);
  const [companyProfile, setCompanyProfile] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  // Organization types
  const organizationTypes = [
    'Sole Proprietor',
    'Private Limited (Pvt Ltd)',
    'Limited (Ltd)',
    'One Person Company (OPC)',
    'Limited Liability Partnership (LLP)',
    'Incorporated (Inc)',
    'Corporation'
  ];

  // Industry types
  const industryTypes = [
    'Fintech',
    'Engineering',
    'Software & IT',
    'Edutech',
    'Oil and Gas',
    'Other'
  ];

  // Team sizes
  const teamSizes = [
    '1-10',
    '10-50',
    '50-100',
    '100-300',
    '300-1000',
    '2000-10000'
  ];

  // Fetch company profile
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const response = await axios.get(
          "https://job-portal-server-six-eosin.vercel.app/api/company-profile",
          { withCredentials: true,
            timeout: 10000
           }
        );
        const profile = response.data;
        setCompanyProfile(profile);
        
        // Set form values
        if (profile) {
          setValue("about", profile.about || "");
          setValue("company_logo", profile.company_logo || "");
          setValue("banner_logo", profile.banner_logo || "");
          setValue("organization_type", profile.organization_type || "");
          setValue("industry_type", profile.industry_type || "");
          setValue("team_size", profile.team_size || "");
          setValue("year_of_establishment", profile.year_of_establishment || "");
          setValue("careers_link", profile.careers_link || "");
          setValue("company_vision", profile.company_vision || "");
          setValue("map_location", profile.map_location || "");
          
          // Set social links
          if (profile.social_links) {
            setSocialLinks({
              facebook: profile.social_links.facebook || '',
              instagram: profile.social_links.instagram || '',
              linkedin: profile.social_links.linkedin || '',
              twitter: profile.social_links.twitter || '',
              github: profile.social_links.github || '',
              crunchbase: profile.social_links.crunchbase || ''
            });
          }
        }
      } catch (error) {
          console.error("Full error details:", error.response?.data);
          console.error("Status:", error.response?.status);
          console.error("Headers:", error.response?.headers);
        }
    };
    
    if (user?.company_id) {
      fetchCompanyProfile();
    }
  }, [user, setValue]);

  // Calculate profile completion
  useEffect(() => {
    if (!companyProfile) return;

    const filledFields = [
      companyProfile.about,
      companyProfile.company_logo,
      companyProfile.banner_logo,
      companyProfile.organization_type,
      companyProfile.industry_type,
      companyProfile.team_size,
      companyProfile.year_of_establishment,
      companyProfile.careers_link,
      companyProfile.company_vision,
      companyProfile.map_location,
      ...Object.values(companyProfile.social_links || {}).filter(link => link)
    ].filter(value => value).length;

    const totalFields = 11; // Total fields we're tracking
    const completionPercentage = (filledFields / totalFields) * 100;
    setProfileCompletion(completionPercentage);
  }, [companyProfile]);

  const handleSocialLinksChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onSubmit = async (data) => {
    const toastId = toast.loading("Updating company profile...", {
      position: "top-right",
      autoClose: false,
      closeOnClick: false,
      draggable: false
    });
    
    try {
      const response = await axios.patch(
        "https://job-portal-server-six-eosin.vercel.app/api/company-profile",
        {
          ...data,
          social_links: socialLinks
        },
        { withCredentials: true }
      );

      toast.update(toastId, {
        render: "Company profile updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        draggable: true
      });

      // Refresh user data
      await handleFetchMe();
      // Refresh company profile
      const profileResponse = await axios.get(
        "https://job-portal-server-six-eosin.vercel.app/api/company-profile",
        { withCredentials: true }
      );
      setCompanyProfile(profileResponse.data);
    } catch (error) {
      console.error("Error updating company profile:", error);
      
      let errorMessage = "Failed to update company profile";
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data.message || "Invalid data provided";
        } else if (error.response.status === 500) {
          errorMessage = "Server error occurred. Please try again later.";
        }
      }

      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        draggable: true
      });
    }
  };

  const isSectionComplete = (section) => {
    if (!companyProfile) return false;
    
    switch(section) {
      case 'basic':
        return companyProfile.company_logo && companyProfile.banner_logo && companyProfile.about;
      case 'details':
        return companyProfile.organization_type && companyProfile.industry_type && 
               companyProfile.team_size && companyProfile.year_of_establishment;
      case 'careers':
        return companyProfile.careers_link && companyProfile.company_vision;
      case 'social':
        return Object.values(companyProfile.social_links || {}).some(link => link);
      case 'location':
        return companyProfile.map_location;
      default:
        return false;
    }
  };

  return (
    <Wrapper>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="profile-container">
        <div className="title-row">
          <button 
            onClick={() => navigate('/dashboard')}
            className="back-btn"
          >
            <IoArrowBack className="text-xl" />
          </button>
          <h1>Edit Company Profile</h1>
        </div>

        <div className="progress-container">
          <LinearProgressWithLabel 
            value={profileCompletion} 
            sx={{
              height: 8,
              borderRadius: 4,
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
              }
            }}
          />
        </div>
        
        <div className="profile-layout">
          {isMobile ? (
            <div className="mobile-tabbar">
              <div className="tabbar-scroll">
                {[
                  { id: 'basic', label: 'Basic' },
                  { id: 'details', label: 'Details' },
                  { id: 'careers', label: 'Careers' },
                  { id: 'social', label: 'Social' },
                  { id: 'location', label: 'Location' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`tab ${activeSection === tab.id ? 'active' : ''} ${
                      isSectionComplete(tab.id) ? 'complete' : ''
                    }`}
                    onClick={() => setActiveSection(tab.id)}
                  >
                    {isSectionComplete(tab.id) ? (
                      <FaCheckCircle className="icon" />
                    ) : (
                      <FaRegCircle className="icon" />
                    )}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="sidebar">
              <ul>
                <li 
                  className={activeSection === 'basic' ? 'active' : ''}
                  onClick={() => setActiveSection('basic')}
                >
                  {isSectionComplete('basic') ? <FaCheckCircle className="icon complete" /> : <FaRegCircle className="icon" />}
                  Basic Info
                </li>
                
                <li 
                  className={activeSection === 'details' ? 'active' : ''}
                  onClick={() => setActiveSection('details')}
                >
                  {isSectionComplete('details') ? <FaCheckCircle className="icon complete" /> : <FaRegCircle className="icon" />}
                  Company Details
                </li>
                
                <li 
                  className={activeSection === 'careers' ? 'active' : ''}
                  onClick={() => setActiveSection('careers')}
                >
                  {isSectionComplete('careers') ? <FaCheckCircle className="icon complete" /> : <FaRegCircle className="icon" />}
                  Careers
                </li>
                
                <li 
                  className={activeSection === 'social' ? 'active' : ''}
                  onClick={() => setActiveSection('social')}
                >
                  {isSectionComplete('social') ? <FaCheckCircle className="icon complete" /> : <FaRegCircle className="icon" />}
                  Social Links
                </li>
                
                <li 
                  className={activeSection === 'location' ? 'active' : ''}
                  onClick={() => setActiveSection('location')}
                >
                  {isSectionComplete('location') ? <FaCheckCircle className="icon complete" /> : <FaRegCircle className="icon" />}
                  Map Location
                </li>
              </ul>
            </div>
          )}
          
          <div className="content">
            <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
              {/* Basic Info Section */}
              {(activeSection === 'basic') && (
                <div className="section-content">
                  <h3>Basic Information</h3>
                  <div className="form-grid">
                    <div className="row">
                      <label htmlFor="company_logo">Company Logo URL</label>
                      <input
                        type="url"
                        id="company_logo"
                        placeholder="https://example.com/logo.png"
                        defaultValue={companyProfile?.company_logo}
                        {...register("company_logo", {
                          pattern: {
                            value: /^https?:\/\/.+/,
                            message: "URL must start with http:// or https://"
                          }
                        })}
                      />
                      {errors?.company_logo && (
                        <span className="error-message">
                          {errors?.company_logo?.message}
                        </span>
                      )}
                      {companyProfile?.company_logo && (
                        <div className="image-preview">
                          <img 
                            src={companyProfile.company_logo} 
                            alt="Company Logo Preview" 
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="row">
                      <label htmlFor="banner_logo">Banner Logo URL</label>
                      <input
                        type="url"
                        id="banner_logo"
                        placeholder="https://example.com/banner.png"
                        defaultValue={companyProfile?.banner_logo}
                        {...register("banner_logo", {
                          pattern: {
                            value: /^https?:\/\/.+/,
                            message: "URL must start with http:// or https://"
                          }
                        })}
                      />
                      {errors?.banner_logo && (
                        <span className="error-message">
                          {errors?.banner_logo?.message}
                        </span>
                      )}
                      {companyProfile?.banner_logo && (
                        <div className="image-preview">
                          <img 
                            src={companyProfile.banner_logo} 
                            alt="Banner Logo Preview" 
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="row full-width">
                      <label htmlFor="about">About Us</label>
                      <textarea
                        id="about"
                        placeholder="Tell us about your company"
                        defaultValue={companyProfile?.about}
                        {...register("about", {
                          maxLength: {
                            value: 2000,
                            message: "Maximum 2000 characters allowed"
                          }
                        })}
                        rows={6}
                      />
                      {errors?.about && (
                        <span className="error-message">
                          {errors?.about?.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Company Details Section */}
              {(activeSection === 'details') && (
                <div className="section-content">
                  <h3>Company Details</h3>
                  <div className="form-grid">
                    <div className="row">
                      <label htmlFor="organization_type">Organization Type</label>
                      <select
                        id="organization_type"
                        defaultValue={companyProfile?.organization_type}
                        {...register("organization_type")}
                      >
                        <option value="">Select Organization Type</option>
                        {organizationTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="row">
                      <label htmlFor="industry_type">Industry Type</label>
                      <select
                        id="industry_type"
                        defaultValue={companyProfile?.industry_type}
                        {...register("industry_type")}
                      >
                        <option value="">Select Industry Type</option>
                        {industryTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="row">
                      <label htmlFor="team_size">Team Size</label>
                      <select
                        id="team_size"
                        defaultValue={companyProfile?.team_size}
                        {...register("team_size")}
                      >
                        <option value="">Select Team Size</option>
                        {teamSizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>

                    <div className="row">
                      <label htmlFor="year_of_establishment">Year of Establishment</label>
                      <input
                        type="number"
                        id="year_of_establishment"
                        placeholder="e.g. 2010"
                        min="1900"
                        max={new Date().getFullYear()}
                        defaultValue={companyProfile?.year_of_establishment}
                        {...register("year_of_establishment", {
                          min: {
                            value: 1900,
                            message: "Year must be 1900 or later"
                          },
                          max: {
                            value: new Date().getFullYear(),
                            message: `Year cannot be in the future`
                          }
                        })}
                      />
                      {errors?.year_of_establishment && (
                        <span className="error-message">
                          {errors?.year_of_establishment?.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Careers Section */}
              {(activeSection === 'careers') && (
                <div className="section-content">
                  <h3>Careers Information</h3>
                  <div className="form-grid">
                    <div className="row">
                      <label htmlFor="careers_link">Official Careers Link</label>
                      <input
                        type="url"
                        id="careers_link"
                        placeholder="https://example.com/careers"
                        defaultValue={companyProfile?.careers_link}
                        {...register("careers_link", {
                          pattern: {
                            value: /^https?:\/\/.+/,
                            message: "URL must start with http:// or https://"
                          }
                        })}
                      />
                      {errors?.careers_link && (
                        <span className="error-message">
                          {errors?.careers_link?.message}
                        </span>
                      )}
                    </div>

                    <div className="row full-width">
                      <label htmlFor="company_vision">Company Vision</label>
                      <textarea
                        id="company_vision"
                        placeholder="Describe your company's vision and mission"
                        defaultValue={companyProfile?.company_vision}
                        {...register("company_vision", {
                          maxLength: {
                            value: 1000,
                            message: "Maximum 1000 characters allowed"
                          }
                        })}
                        rows={4}
                      />
                      {errors?.company_vision && (
                        <span className="error-message">
                          {errors?.company_vision?.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Social Links Section */}
              {(activeSection === 'social') && (
                <div className="section-content">
                  <h3>Social Links</h3>
                  <div className="form-grid">
                    <div className="row full-width">
                      {showSocialLinksForm ? (
                        <div className="social-links-form">
                          <div className="grid">
                            <div>
                              <label>Facebook</label>
                              <input
                                type="url"
                                name="facebook"
                                value={socialLinks.facebook}
                                onChange={handleSocialLinksChange}
                                placeholder="https://facebook.com/yourcompany"
                                pattern="https?://.+"
                              />
                            </div>
                            <div>
                              <label>Instagram</label>
                              <input
                                type="url"
                                name="instagram"
                                value={socialLinks.instagram}
                                onChange={handleSocialLinksChange}
                                placeholder="https://instagram.com/yourcompany"
                                pattern="https?://.+"
                              />
                            </div>
                            <div>
                              <label>LinkedIn</label>
                              <input
                                type="url"
                                name="linkedin"
                                value={socialLinks.linkedin}
                                onChange={handleSocialLinksChange}
                                placeholder="https://linkedin.com/company/yourcompany"
                                pattern="https?://.+"
                              />
                            </div>
                            <div>
                              <label>Twitter</label>
                              <input
                                type="url"
                                name="twitter"
                                value={socialLinks.twitter}
                                onChange={handleSocialLinksChange}
                                placeholder="https://twitter.com/yourcompany"
                                pattern="https?://.+"
                              />
                            </div>
                            <div>
                              <label>GitHub</label>
                              <input
                                type="url"
                                name="github"
                                value={socialLinks.github}
                                onChange={handleSocialLinksChange}
                                placeholder="https://github.com/yourcompany"
                                pattern="https?://.+"
                              />
                            </div>
                            <div>
                              <label>Crunchbase</label>
                              <input
                                type="url"
                                name="crunchbase"
                                value={socialLinks.crunchbase}
                                onChange={handleSocialLinksChange}
                                placeholder="https://crunchbase.com/organization/yourcompany"
                                pattern="https?://.+"
                              />
                            </div>
                          </div>
                          <div className="form-actions">
                            <button
                              type="button"
                              onClick={() => setShowSocialLinksForm(false)}
                              className="cancel-btn"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="social-links-display">
                          <div className="links-grid">
                            {socialLinks.linkedin && (
                              <div className="link-item">
                                <p>LinkedIn</p>
                                <a 
                                  href={socialLinks.linkedin} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  {socialLinks.linkedin.length > 30 
                                    ? socialLinks.linkedin.substring(0, 30) + '...' 
                                    : socialLinks.linkedin}
                                </a>
                              </div>
                            )}
                            {socialLinks.facebook && (
                              <div className="link-item">
                                <p>Facebook</p>
                                <a 
                                  href={socialLinks.facebook} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  {socialLinks.facebook.length > 30 
                                    ? socialLinks.facebook.substring(0, 30) + '...' 
                                    : socialLinks.facebook}
                                </a>
                              </div>
                            )}
                            {socialLinks.instagram && (
                              <div className="link-item">
                                <p>Instagram</p>
                                <a 
                                  href={socialLinks.instagram} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  {socialLinks.instagram.length > 30 
                                    ? socialLinks.instagram.substring(0, 30) + '...' 
                                    : socialLinks.instagram}
                                </a>
                              </div>
                            )}
                            {socialLinks.twitter && (
                              <div className="link-item">
                                <p>Twitter</p>
                                <a 
                                  href={socialLinks.twitter} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  {socialLinks.twitter.length > 30 
                                    ? socialLinks.twitter.substring(0, 30) + '...' 
                                    : socialLinks.twitter}
                                </a>
                              </div>
                            )}
                            {socialLinks.github && (
                              <div className="link-item">
                                <p>GitHub</p>
                                <a 
                                  href={socialLinks.github} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  {socialLinks.github.length > 30 
                                    ? socialLinks.github.substring(0, 30) + '...' 
                                    : socialLinks.github}
                                </a>
                              </div>
                            )}
                            {socialLinks.crunchbase && (
                              <div className="link-item">
                                <p>Crunchbase</p>
                                <a 
                                  href={socialLinks.crunchbase} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  {socialLinks.crunchbase.length > 30 
                                    ? socialLinks.crunchbase.substring(0, 30) + '...' 
                                    : socialLinks.crunchbase}
                                </a>
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowSocialLinksForm(true)}
                            className="edit-btn"
                          >
                            <CiSquarePlus /> {Object.values(socialLinks).some(link => link) ? 'Edit Links' : 'Add Social Links'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Map Location Section */}
              {(activeSection === 'location') && (
                <div className="section-content">
                  <h3>Map Location</h3>
                  <div className="form-grid">
                    <div className="row full-width">
                      <label htmlFor="map_location">Map URL (Google Maps)</label>
                      <input
                        type="url"
                        id="map_location"
                        placeholder="https://maps.google.com/..."
                        defaultValue={companyProfile?.map_location}
                        {...register("map_location", {
                          pattern: {
                            value: /^https?:\/\/.+/,
                            message: "URL must start with http:// or https://"
                          }
                        })}
                      />
                      {errors?.map_location && (
                        <span className="error-message">
                          {errors?.map_location?.message}
                        </span>
                      )}
                      {companyProfile?.map_location && (
                        <div className="map-preview">
                          <a 
                            href={companyProfile.map_location} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            View on Google Maps
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="form-actions">
                <input
                  type="submit"
                  value="Update Company Profile"
                  className="submit-btn"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  /* Base reset to prevent any overflow */
  * {
    box-sizing: border-box;
    max-width: 100%;
  }

  .profile-container {
    max-width: 100%;
    margin: 0 auto;
    padding: 0 15px 20px;
    width: 100%;
  }

  /* Mobile Tabbar Styles - Fixed to only scroll horizontally within the tabbar */
  .mobile-tabbar {
    width: 100%;
    margin-bottom: 1rem;
    background: white;
    padding: 8px 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    overflow: hidden;
    position: relative;
    margin-left: 10px;
    left: 0;
    right: 0;
  }

  .tabbar-scroll {
    display: flex;
    gap: 0.5rem;
    padding: 0 0px;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Firefox */
  }

  /* Hide scrollbar for webkit browsers */
  .tabbar-scroll::-webkit-scrollbar {
    display: none;
  }

  .tab {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.5rem 1rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    font-size: 0.8rem;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

    .back-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f7fafc;
    border: none;
    color: #4a5568;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .back-btn:hover {
    background: #ebf8ff;
    color: #414BEA;
  }

  .progress-container {
    margin-bottom: 2rem;
    width: 100%;
    margin-top: -20px;
  }

  .tab.active {
    background-color: #ebf8ff;
    color: #414BEA;
    border-color: #414BEA;
  }

  .tab.complete .icon {
    color: #38a169;
  }

  .tab .icon {
    font-size: 0.9rem;
  }

  .title-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 1.5rem 0;
    width: 100%;
    margin-top: 10px;
  }

  .title-row h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2d3748;
    margin: 0;
  }

  .profile-layout {
    display: flex;
    width: 100%;
  }

  .sidebar {
    width: 250px;
    flex-shrink: 0;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 6px 10px 0px rgba(30, 10, 58, .04);
    padding: 1.5rem;
    height: fit-content;
  }

  .sidebar ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .sidebar li {
    padding: 0.75rem 1rem;
    margin-bottom: 0.5rem;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 0.95rem;
    color: #4a5568;
    transition: all 0.2s ease;
  }

  .sidebar li:hover {
    background-color: #ebf8ff;
    color: #414BEA;
  }

  .sidebar li.active {
    background-color: #ebf8ff;
    color: #414BEA;
    font-weight: 500;
  }

  .sidebar .icon {
    margin-right: 0.75rem;
    font-size: 1rem;
  }

  .sidebar .icon.complete {
    color: #38a169;
  }

  .content {
    flex-grow: 1;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 6px 10px 0px rgba(30, 10, 58, .04);
    padding: 2rem;
  }

  .section-content {
    margin-bottom: 2rem;
    width: 100%;
  }

  .section-content h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    width: 100%;
  }

  .row {
    margin-bottom: 1rem;
    width: 100%;
  }

  .row.full-width {
    grid-column: 1 / -1;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4a5568;
  }

  input, select, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.875rem;
    transition: border-color 0.2s;
  }

  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: #414BEA;
    box-shadow: 0 0 0 1px #414BEA;
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }

  .error-message {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: #F05537;
  }

  .help-text {
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: #718096;
  }

  .image-preview {
    margin-top: 0.5rem;
    max-width: 200px;
    max-height: 200px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 4px;
  }

  .image-preview img {
    width: 100%;
    height: auto;
    border-radius: 4px;
  }

  .map-preview {
    margin-top: 0.5rem;
  }

  .map-preview a {
    color: #414BEA;
    text-decoration: none;
  }

  .map-preview a:hover {
    text-decoration: underline;
  }

  .social-links-form {
    width: 100%;
    padding: 1.5rem;
    background-color: #f7fafc;
    border-radius: 8px;
  }

  .social-links-form .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
    width: 100%;
  }

  .social-links-display {
    width: 100%;
    padding: 1.5rem;
    background-color: #f7fafc;
    border-radius: 8px;
  }

  .links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
    width: 100%;
  }

  .link-item p {
    font-size: 0.75rem;
    color: #718096;
    margin-bottom: 0.25rem;
  }

  .link-item a {
    font-size: 0.875rem;
    color: #414BEA;
    text-decoration: none;
    word-break: break-all;
  }

  .link-item a:hover {
    text-decoration: underline;
  }

  .save-btn {
    padding: 0.75rem 1rem;
    background-color: #414BEA;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .edit-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #414BEA;
    background: none;
    border: none;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    padding: 0.5rem 0;
  }

  .edit-btn:hover {
    color: #2c5282;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;
    width: 100%;
  }

  .submit-btn {
    padding: 0.75rem 2rem;
    background-color: #414BEA;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .submit-btn:hover {
    background-color: #414BEA;
  }

  .cancel-btn {
    padding: 0.5rem 1rem;
    background-color: #fff;
    color: #4a5568;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    margin-right: 1rem;
  }
  .cancel-btn:hover {
    background-color: #f7fafc;
  }

  .verification-status {
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .verified-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #38a169;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .verify-btn {
    background: none;
    border: none;
    color: #414BEA;
    font-size: 0.75rem;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
  }

  .verify-btn:disabled {
    color: #a0aec0;
    text-decoration: none;
    cursor: not-allowed;
  }

  .otp-container {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }

  .otp-container input {
    flex: 1;
    max-width: 120px;
    padding: 8px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
  }

  .verify-otp-btn {
    padding: 8px 12px;
    background-color: #414BEA;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 0.75rem;
    cursor: pointer;
  }

  .spinner {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
    margin-right: 6px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .verify-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .email-field {
    position: relative;
  }

  .email-field .verified-badge,
  .email-field .not-verified {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.75rem;
  }

  .email-field .not-verified {
    color: #e53e3e;
  }

  /* Strict mobile view changes to prevent horizontal scroll */
  @media (max-width: 768px) {
    width: 100%;
    overflow-x: hidden;
    
    .profile-container {
      padding-bottom: 60px;
      width: 100%;
    }
    
    .profile-layout {
      flex-direction: column;
      width: 100%;
    }

    .sidebar {
      width: 100%;
      margin-bottom: 1.5rem;
      padding: 1rem;
    }

    .content {
      padding: 1rem;
      width: 100%;
      box-shadow: 0 6px 10px 0px rgba(30, 10, 58, .04);
      margin-top: -12px;
    }

    .form-grid {
      grid-template-columns: 1fr;
      width: 100%;
    }

    .mobile-tabbar {
      width: 88vw;
      position: relative;
      left: 50%;
      right: 50%;
      margin-top: -25px;
      margin-left: -44vw;
      margin-right: -50vw;
    }

    .tabbar-scroll {
      padding: 0 0px;
    }

    .social-links-form,
    .social-links-display {
      padding: 1rem;
      width: 100%;
    }

    input, select, textarea {
      width: 100%;
    }

    /* Ensure no element can cause overflow */
    body, html, #root, .App {
      overflow-x: hidden;
      width: 100%;
    }

    /* Remove any potential margin/padding causing overflow */
    body {
      margin: 0;
      padding: 0;
    }
  }
`;

export default CompanyEditProfile;