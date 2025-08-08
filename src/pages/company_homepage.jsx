import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Avatar, Card, CardContent, Typography, Button, Box } from "@mui/material";
import companyPlaceholder from "../assets/media/company-placeholder.png";
import axios from "axios";
import styled from "styled-components";
import calculateCompanyProfileCompletion from "../utils/companyProfileCompletion";

dayjs.extend(relativeTime);

const CompanyHomePage = () => {
  const { user } = useUserContext();
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");
  const [profileData, setProfileData] = useState({
    about_us: "",
    company_logo: "",
    banner_logo: "",
    organization_type: "",
    industry_types: "",
    team_size: "",
    official_careers_link: "",
    company_vision: "",
    social_links: {},
    map_location: ""
  });

  const getProgressColor = (value) => {
    if (value <= 10) return '#f44336';
    if (value <= 60) return '#ff9800';
    return '#4caf50';
  };

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        if (!user) return;

        const response = await axios.get(
          "https://job-portal-server-six-eosin.vercel.app/api/company-profile", 
          { withCredentials: true }
        );
        
        setProfileData(response.data || {});

        if (response.data?.updated_at) {
          setLastUpdated(dayjs(response.data.updated_at).fromNow());
        }
      } catch (error) {
        console.error("Error fetching company profile:", error);
      }
    };

    fetchCompanyData();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const completion = calculateCompanyProfileCompletion(profileData);
    setProfileCompletion(completion);
  }, [user, profileData]);

  const progressColor = getProgressColor(profileCompletion);

  return (
    <Wrapper progressColor={progressColor} profileCompletion={profileCompletion}>
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto">
                <div className="bg-white shadow rounded-xl p-6">
                    <div className="flex items-center gap-4">
                      <div className="circle-container">
                        <div className="circle">
                          <div className="inner-circle">
                            {profileData?.company_logo ? (
                              <img
                                src={profileData.company_logo}
                                alt="Company Logo"
                                className="profile-img"
                              />
                            ) : (
                              <img
                                src={companyPlaceholder}
                                alt="Company Placeholder"
                                className="profile-img"
                              />
                            )}
                          </div>
                        </div>
                        <div className="percentage-label">{profileCompletion}%</div>
                      </div>

                      <div className="flex-1">
                        <h2 className="text-base font-semibold mb-1">{user?.full_name || "Company"}</h2>
                        <p className="text-sm text-gray-500 mb-1">
                          Updated {lastUpdated || "recently"}
                        </p>
                        <Link
                            to={`/dashboard/edit-profile/${user?.id}`}
                            className="text-blue-600 font-semibold text-sm hover:text-blue-600"
                            >
                            Update Company Profile
                        </Link>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  font-family: 'Poppins', sans-serif;

  .circle-container {
    position: relative;
    width: 96px;
    height: 96px;
    flex-shrink: 0;
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
`;

export default CompanyHomePage;