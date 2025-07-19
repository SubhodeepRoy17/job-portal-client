import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSingleHandler } from "../utils/FetchHandlers";
import { fetchSkillsByIds} from "../utils/skillsHelper";
import { fetchCategoriesByIds } from "../utils/categoriesHelper";
import { postHandler } from "../utils/FetchHandlers";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoadingComTwo from "../components/shared/LoadingComTwo";
import ShimmerLoading from "../components/shared/ShimmerLoading";
import { MdAccessTime } from "react-icons/md";
import Navbar from "../components/shared/Navbar";
import BottomNav from "../components/shared/BottomNav";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { useUserContext } from "../context/UserContext";
import { VISIBILITY_STATUS } from "../utils/JobData";

dayjs.extend(advancedFormat);

const Job = () => {
    const { id } = useParams();
    const { user } = useUserContext();
    const [skillNames, setSkillNames] = useState([]);
    const [categoryNames, setCategoryNames] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [activeTab, setActiveTab] = useState("details");
    const navigate = useNavigate();

    const {
        isLoading,
        isError,
        data: job,
        error,
    } = useQuery({
        queryKey: ["job", id],
        queryFn: () => getSingleHandler(`https://job-portal-server-theta-olive.vercel.app/api/jobs/${id}`),
    });

    // Fetch skill names and categories from their IDs
    useEffect(() => {
        const loadData = async () => {
            if (job?.job_skills?.length > 0) {
                const skills = await fetchSkillsByIds(job.job_skills);
                setSkillNames(skills.map(skill => skill.name));
            }
            if (job?.categories?.length > 0) {
                const categories = await fetchCategoriesByIds(job.categories);
                setCategoryNames(categories.map(cat => cat.category_name));
            }
        };
        loadData();
    }, [job]);

    const handleLikeClick = () => {
        setIsLiked(!isLiked);
    };

    const handleApply = async (id) => {
        let currentDate = new Date();
        let date = currentDate.toISOString().slice(0, 10);
        const appliedJob = {
            applicant_id: user?.id,
            recruiter_id: job?.created_by,
            job_id: id,
            status: "pending",
            dateOfApplication: date,
            resume: user?.resume || "",
        };
        try {
            const response = await postHandler({
                url: "https://job-portal-server-theta-olive.vercel.app/api/application/apply",
                body: appliedJob,
            });
            toast.success("Application submitted successfully!", {
                position: "top-right",
            });
        } catch (error) {
            console.log(error);
            if (error?.response?.data?.error) {
                toast.error(error?.response?.data?.error[0].msg, {
                    position: "top-right",
                });
            } else {
                toast.error(error?.response?.data, {
                    position: "top-right",
                });
            }
        }
    };

    if (isLoading) {
        return <ShimmerLoading type="job-detail" />;
    }

    if (isError) {
        return <h2 className="text-center text-red-600 mt-10 text-xl">{error?.message}</h2>;
    }

    const handleEmailClick = () => {
        window.location.href = `mailto:${job?.job_contact}`;
    };

    return (
            <Wrapper>
                <ToastContainer 
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    closeOnClick
                    pauseOnHover
                    draggable
                    theme="light"
                />
                {/* Fixed Top Bar */}
                <div className="fixed-top-bar">
                    <div className="top-bar-content">
                        <button 
                            className="back-button"
                            onClick={() => navigate('/')}
                        >
                            <FiArrowLeft />
                        </button>
                        <h2 className="job-title">{job?.position}</h2>
                    </div>
                    <div className="tab-bar">
                        <button 
                            className={`tab ${activeTab === "details" ? "active" : ""}`}
                            onClick={() => setActiveTab("details")}
                        >
                            Job Details
                        </button>
                        <button 
                            className={`tab ${activeTab === "dates" ? "active" : ""}`}
                            onClick={() => setActiveTab("dates")}
                        >
                            Dates
                        </button>
                        <button 
                            className={`tab ${activeTab === "facilities" ? "active" : ""}`}
                            onClick={() => setActiveTab("facilities")}
                        >
                            Facilities
                        </button>
                        <button 
                            className={`tab ${activeTab === "skills" ? "active" : ""}`}
                            onClick={() => setActiveTab("skills")}
                        >
                            Required Skills
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="scrollable-content">
                    {activeTab === "details" && (
                        <>
                            <div className="apply-section">
                                <button
                                    className="apply-now-btn"
                                    onClick={() => handleApply(job.id)}
                                >
                                    Apply Now
                                </button>
                                <div className="action-buttons">
                                    <button 
                                        className={`heart-btn ${isLiked ? 'liked' : ''}`}
                                        onClick={handleLikeClick}
                                    >
                                        {isLiked ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" width="24px" height="24px">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24px" height="24px">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                            </svg>
                                        )}
                                    </button>
                                    <button className="share-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24px" height="24px">
                                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="content-section">
                                <div className="info-row">
                                    <h4 className="info-label">Posted by:</h4>
                                    <p className="info-value">{job?.company}</p>
                                </div>
                                
                                <div className="info-row">
                                    <h4 className="info-label">Job Description:</h4>
                                    <p className="info-value">{job?.job_description}</p>
                                </div>
                                
                                <div className="info-row">
                                    <h4 className="info-label">Job Vacancy:</h4>
                                    <p className="info-value">{job?.job_vacancy}</p>
                                </div>
                                
                                <div className="info-row">
                                    <h4 className="info-label">Salary:</h4>
                                    <p className="info-value">{job?.job_salary} TK</p>
                                </div>
                                
                                {categoryNames.length > 0 && (
                                    <div className="info-row">
                                        <h4 className="info-label">Job Categories:</h4>
                                        <div className="tags-container">
                                            {categoryNames.map((category) => (
                                                <span key={category} className="category-tag">
                                                    {category}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="info-row">
                                    <h4 className="info-label">To Apply:</h4>
                                    <div className="apply-info">
                                        <p>Send your CV/resume to:</p>
                                        <button className="email-btn" onClick={handleEmailClick}>
                                            <HiOutlineMail className="mail-icon" />
                                            {job?.job_contact}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === "dates" && (
                        <div className="content-section">
                            <div className="info-row">
                                <h4 className="info-label">Posted Date:</h4>
                                <p className="info-value">
                                    <MdAccessTime className="text-lg mr-1" />
                                    {dayjs(job?.result?.created_at).format("MMM Do, YYYY")}
                                </p>
                            </div>
                            
                            <div className="info-row">
                                <h4 className="info-label">Deadline:</h4>
                                <p className="info-value">
                                    <MdAccessTime className="text-lg mr-1" />
                                    {dayjs(job?.job_deadline).format("MMM Do, YYYY")}
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === "facilities" && job?.job_facilities?.length > 0 && (
                        <div className="content-section">
                            <div className="tags-container">
                                {job.job_facilities.map((facility) => (
                                    <span key={facility} className="facility-tag">
                                        {facility}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "skills" && skillNames.length > 0 && (
                        <div className="content-section">
                            <div className="tags-container">
                                {skillNames.map((skill) => (
                                    <span key={skill} className="skill-tag">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Wrapper>
    );
};

const Wrapper = styled.section`
    padding: 0;
    max-width: 1200px;
    margin: 0 auto;
    height: 100vh;
    display: flex;
    flex-direction: column;

    .fixed-top-bar {
        background: #fff;
        height: auto;
        display: flex;
        flex-direction: column;
    }

    .top-bar-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem 2rem;
        background: #fff;
        position: sticky;
        top: 0;
        z-index: 10;
    }

    .divider {
        height: 1px;
        background: #e2e8f0;
        width: 100%;
        margin: 0;
    }

    .back-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        margin-left: -10px;
        cursor: pointer;
        color: #3b82f6;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.2s;

        &:hover {
            background: #f1f5f9;
        }
    }

    .job-title {
        font-size: 1.25rem;
        color: #333;
        font-weight: 600;
        margin-left: -15px;
    }

    .tab-bar {
        display: flex;
        overflow-x: auto;
        padding: 0.5rem 2rem;
        background: white;
        gap: 0.5rem;
        border-bottom: 1px solid #e2e8f0;
        scrollbar-width: none;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .tab {
        flex-shrink: 0;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        border: 1px solid #ddd;
        background: white;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;

        &.active {
            background: #414FEA;
            color: white;
            border-color: #414FEA;
        }
    }

    .scrollable-content {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem 2rem;
    }

    .apply-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .apply-now-btn {
        width: 100%;
        padding: 1rem;
        background: #414FEA;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;

        &:hover {
            background: #303dc7;
        }
    }

    .action-buttons {
        display: flex;
        gap: 0.5rem;
    }

    .heart-btn, .share-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;

        &:hover {
            background: #f1f5f9;
        }
    }

    .heart-btn.liked svg {
        fill: red;
    }

    .content-section {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .info-row {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .info-label {
        font-size: 1rem;
        font-weight: 600;
        color: #333;
    }

    .info-value {
        font-size: 1rem;
        color: #555;
        line-height: 1.5;
    }

    .tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .category-tag, .facility-tag, .skill-tag {
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        font-size: 0.85rem;
        font-weight: 500;
    }

    .category-tag {
        background: #f0f7ff;
        color: #1a73e8;
        border: 1px solid #d2e3fc;
    }

    .facility-tag {
        background: #f6f6f6;
        color: #333;
        border: 1px solid #ddd;
    }

    .skill-tag {
        background: #f0fff4;
        color: #2e7d32;
        border: 1px solid #c8e6c9;
    }

    .email-btn {
        display: inline-flex;
        align-items: center;
        background: none;
        border: none;
        color: #1a73e8;
        font-size: 1rem;
        padding: 0;
        cursor: pointer;
        transition: color 0.2s;

        &:hover {
            color: #0d5bba;
            text-decoration: underline;
        }
    }

    @media (max-width: 768px) {
        .top-bar-content {
            padding: 1rem 1.5rem;
        }

        .tab-bar {
            padding: 0.5rem 1.5rem;
        }

        .scrollable-content {
            padding: 1rem 1.5rem;
        }

        .job-title {
            font-size: 1.1rem;
        }

        .tab {
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
        }

        .apply-now-btn {
            padding: 0.8rem;
            font-size: 0.95rem;
        }

        .info-label, .info-value {
            font-size: 0.95rem;
        }
    }

    @media (max-width: 480px) {
        .top-bar-content {
            padding: 0.8rem 1rem;
        }

        .tab-bar {
            padding: 0.4rem 1rem;
        }

        .scrollable-content {
            padding: 0.8rem 1rem;
        }

        .job-title {
            font-size: 1rem;
        }

        .tab {
            font-size: 0.75rem;
            padding: 0.3rem 0.7rem;
        }

        .apply-now-btn {
            padding: 0.7rem;
            font-size: 0.9rem;
        }

        .info-label, .info-value {
            font-size: 0.9rem;
        }

        .category-tag, .facility-tag, .skill-tag {
            font-size: 0.8rem;
            padding: 0.3rem 0.6rem;
        }
    }
`;

export default Job;