/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CiSquarePlus } from "react-icons/ci";
import { Job_Status, Job_Type } from "../utils/JobData";
import { fetchSkillsByIds, fetchSkillsByName } from "../utils/skillsHelper";
import { fetchCategoriesByIds, fetchCategoriesByName } from "../utils/categoriesHelper";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { TagsInput } from "react-tag-input-component";
import { use } from "react";

const CategoriesAutocomplete = ({ value, onChange, placeholder = "Type to search categories..." }) => {
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [currentCategories, setCurrentCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCurrentCategories = async () => {
            if (value?.length > 0) {
                setLoading(true);
                setError(null);
                try {
                    const categories = await fetchCategoriesByIds(value);
                    console.log('Loaded current categories:', categories);
                    setCurrentCategories(categories);
                } catch (err) {
                    setError('Failed to load current categories');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            } else {
                setCurrentCategories([]);
            }
        };
        loadCurrentCategories();
    }, [value]);

    useEffect(() => {
        if (inputValue.length > 1) {
            const timer = setTimeout(async () => {
                try {
                    const categories = await fetchCategoriesByName(inputValue);
                    console.log('Filtered categories:', categories);
                    setFilteredCategories(categories);
                    setShowSuggestions(categories.length > 0);
                    setError(null);
                } catch (err) {
                    setError('Failed to search categories');
                    console.error(err);
                    setFilteredCategories([]);
                    setShowSuggestions(false);
                }
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setFilteredCategories([]);
            setShowSuggestions(false);
        }
    }, [inputValue]);

    const handleAddCategory = (category) => {
        if (!value.includes(category.category_id)) {
            onChange([...value, category.category_id]);
        }
        setInputValue("");
        setShowSuggestions(false);
    };

    const handleRemoveCategory = (categoryId) => {
        onChange(value.filter(id => id !== categoryId));
    };

    return (
        <div className="skills-autocomplete">
            {/* Display current categories as tags */}
            <div className="skills-tags">
                {loading && <span>Loading categories...</span>}
                {error && <span className="error">{error}</span>}
                {currentCategories.map(category => (
                    <span key={category.category_id} className="skill-tag">
                        {category.category_name}
                        <button
                            type="button"
                            onClick={() => handleRemoveCategory(category.category_id)}
                            className="remove-skill"
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
            {/* Search input */}
            <div className="input-container">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={placeholder}
                    className="skills-input"
                    onFocus={() => inputValue && setShowSuggestions(filteredCategories.length > 0)}
                />
                {/* Suggestions dropdown */}
                {showSuggestions && (
                    <div className="suggestions-dropdown">
                        {filteredCategories.map((category) => (
                            <div
                                key={category.category_id}
                                className="suggestion-item"
                                onClick={() => handleAddCategory(category)}
                            >
                                {category.category_name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Custom Skills Input Component with Autocomplete
const SkillsAutocomplete = ({ value, onChange, placeholder = "Type to search skills..." }) => {
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentSkills, setCurrentSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load current skill names when IDs change
  useEffect(() => {
    const loadCurrentSkills = async () => {
      if (value?.length > 0) {
        setLoading(true);
        setError(null);
        try {
          const skills = await fetchSkillsByIds(value);
          setCurrentSkills(skills);
        } catch (err) {
          setError('Failed to load current skills');
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setCurrentSkills([]);
      }
    };
    loadCurrentSkills();
  }, [value]);

  // Search for skills when input changes
  useEffect(() => {
    if (inputValue.length > 1) {
      const timer = setTimeout(async () => {
        try {
          const skills = await fetchSkillsByName(inputValue);
          setFilteredSkills(skills);
          setShowSuggestions(skills.length > 0);
          setError(null);
        } catch (err) {
          setError('Failed to search skills');
          console.error(err);
          setFilteredSkills([]);
          setShowSuggestions(false);
        }
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setFilteredSkills([]);
      setShowSuggestions(false);
    }
  }, [inputValue]);

  const handleAddSkill = (skill) => {
    if (!value.includes(skill.id)) {
      onChange([...value, skill.id]);
    }
    setInputValue("");
    setShowSuggestions(false);
  };

  const handleRemoveSkill = (skillId) => {
    onChange(value.filter(id => id !== skillId));
  };

  return (
    <div className="skills-autocomplete">
      {/* Display current skills as tags */}
      <div className="skills-tags">
        {loading && <span>Loading skills...</span>}
        {error && <span className="error">{error}</span>}
        {currentSkills.map(skill => (
          <span key={skill.id} className="skill-tag">
            {skill.name}
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill.id)}
              className="remove-skill"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Search input */}
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="skills-input"
          onFocus={() => inputValue && setShowSuggestions(filteredSkills.length > 0)}
        />
        
        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div className="suggestions-dropdown">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="suggestion-item"
                onClick={() => handleAddSkill(skill)}
              >
                {skill.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Custom Simple Tags Input Component for Facilities
const SimpleTagsInput = ({ value, onChange, placeholder = "Type and press Enter to add..." }) => {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            if (!value.includes(inputValue.trim())) {
                onChange([...value, inputValue.trim()]);
                setInputValue("");
            }
        }
    };

    const removeTag = (tagToRemove) => {
        onChange(value.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="skills-autocomplete">
            <div className="skills-tags">
                {value.map((tag, index) => (
                    <span key={index} className="skill-tag">
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="remove-skill"
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="skills-input"
                />
            </div>
        </div>
    );
};

const AddJob = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [deadline, setDeadline] = useState(new Date());
    const [skills, setSkills] = useState([]);
    const [categories, setCategories] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [workplaceType, setWorkplaceType] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        if (categories.length > 10){
            toast.error("You can select a maximum of 10 categories.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        setIsLoading(true);
        const newJob = {
            company: data?.company,
            position: data?.position,
            workplace_type: workplaceType,
            job_status: selectedStatus || data?.status,
            job_type: selectedType || data?.type,
            job_location: data?.location,
            job_vacancy: data?.vacancy,
            job_salary: data?.salary,
            job_deadline: deadline.toISOString(),
            job_description: data?.description,
            job_skills: skills,
            categories: categories,
            job_facilities: facilities,
            job_contact: data?.contact,
        };

        console.log(newJob)
        // posting;
        try {
            const response = await axios.post(
                "https://job-portal-server-theta-olive.vercel.app/api/jobs",
                newJob,
                {
                    withCredentials: true,
                }
            );
            toast.success("Job created successfully!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            reset();
            setDeadline(new Date());
            setSkills([]);
            setCategories([]);
            setFacilities([]);
            setSelectedStatus(null);
            setSelectedType(null);
            setWorkplaceType(null);
            // navigate("/");
        } catch (error) {
            console.log(error);
            toast.error("Failed to create job. Please try again.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
        setIsLoading(false);
    };

    return (
        <Wrapper>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="">
                <div className="title-row">
                    Create Job
                    <CiSquarePlus className="ml-1 text-xl md:text-2xl" />
                </div>
                <div className="content-row">
                    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form">
                            {/* Position */}
                            <div className="row">
                                <label htmlFor="position">Position</label>
                                <input
                                    type="text"
                                    id="position"
                                    name="position"
                                    placeholder="Job Position"
                                    {...register("position", {
                                        required: {
                                            value: true,
                                            message: "Job Positon is required",
                                        },
                                        maxLength: {
                                            value: 100,
                                            message: "Too long (max 100char)",
                                        },
                                        minLength: {
                                            value: 3,
                                            message: "Too short (max 3char)",
                                        },
                                    })}
                                />
                                {errors?.position && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.position?.message}
                                    </span>
                                )}
                            </div>

                            {/* Company */}
                            <div className="row">
                                <label htmlFor="company">Company</label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    placeholder="Company Name"
                                    {...register("company", {
                                        required: {
                                            value: true,
                                            message: "Job Company is required",
                                        },
                                        maxLength: {
                                            value: 100,
                                            message: "Too long (max 100char)",
                                        },
                                        minLength: {
                                            value: 3,
                                            message: "Too short (max 3char)",
                                        },
                                    })}
                                />
                                {errors?.company && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.company?.message}
                                    </span>
                                )}
                            </div>

                            {/* Workplace Type */}
                            <div className="row">
                                <label htmlFor="workplaceType">Workplace Type</label>
                                <div className="workplace-tags">
                                    {[
                                        { id: 1, label: 'Work from home' },
                                        { id: 2, label: 'In office' },
                                        { id: 3, label: 'On field' },
                                        { id: 4, label: 'Hybrid' }
                                    ].map((type) => (
                                        <button
                                            type="button"
                                            key={type.id}
                                            className={`workplace-tag ${workplaceType === type.id ? 'selected' : ''}`}
                                            onClick={() => {
                                                setWorkplaceType(type.id);
                                                setValue("workplaceType", type.id);
                                            }}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                                {errors?.workplaceType && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.workplaceType?.message}
                                    </span>
                                )}
                            </div>

                            {/* Location */}
                            {workplaceType !== 1 && (
                                <div className="row">
                                    <label htmlFor="location">Location</label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        placeholder="Job Location"
                                        {...register("location", {
                                            required: {
                                                value: workplaceType !== 1,
                                                message: "Job Location is required for this workplace type",
                                            },
                                            maxLength: {
                                                value: 100,
                                                message: "Too long (max 100char)",
                                            },
                                            minLength: {
                                                value: 3,
                                                message: "Too short (max 3char)",
                                            },
                                        })}
                                    />
                                    {errors?.location && (
                                        <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                            {errors?.location?.message}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Status */}
                            <div className="row">
                                <label htmlFor="status">Job Status</label>
                                <div className="status-tags">
                                    {Job_Status?.map((status) => (
                                        <button
                                            type="button"
                                            key={status}
                                            className={`status-tag ${selectedStatus === status ? 'selected' : ''}`}
                                            onClick={() => {
                                                setSelectedStatus(status);
                                                // Set the value for react-hook-form
                                                setValue("status", status);
                                            }}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                                {errors?.status && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.status?.message}
                                    </span>
                                )}
                            </div>

                            {/* Type */}
                            <div className="row">
                                <label htmlFor="type">Job Type</label>
                                <div className="type-tags">
                                    {Job_Type?.map((type) => (
                                        <button
                                            type="button"
                                            key={type}
                                            className={`type-tag ${selectedType === type ? 'selected' : ''}`}
                                            onClick={() => {
                                                setSelectedType(type);
                                                // Set the value for react-hook-form
                                                setValue("type", type);
                                            }}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                                {errors?.type && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.type?.message}
                                    </span>
                                )}
                            </div>

                            {/* Vacancy */}
                            <div className="row">
                                <label htmlFor="vacancy">Vacancy</label>
                                <input
                                    type="text"
                                    id="vacancy"
                                    name="vacancy"
                                    placeholder="Job Vacancy"
                                    {...register("vacancy", {
                                        required: {
                                            value: true,
                                            message: "Job vacancy is required",
                                        },
                                        max: {
                                            value: 1000,
                                            message:
                                                "Check number of job vacancy(too much)",
                                        },
                                        min: {
                                            value: 1,
                                            message:
                                                "Job Vacancy can't 0 or smaller",
                                        },
                                    })}
                                />
                                {errors?.vacancy && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.vacancy?.message}
                                    </span>
                                )}
                            </div>

                            {/* Salary */}
                            <div className="row">
                                <label htmlFor="salary">Salary</label>
                                <input
                                    type="text"
                                    id="salary"
                                    name="salary"
                                    placeholder="Job salary"
                                    {...register("salary", {
                                        required: {
                                            value: true,
                                            message: "Job salary is required",
                                        },
                                        max: {
                                            value: 1000000,
                                            message:
                                                "Check number of job salary(too much)",
                                        },
                                        min: {
                                            value: 10,
                                            message:
                                                "Job Vacancy can't 0 or smaller",
                                        },
                                    })}
                                />
                                {errors?.salary && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.salary?.message}
                                    </span>
                                )}
                            </div>

                            {/* Deadline */}
                            <div className="row">
                                <label htmlFor="deadline">Job Deadline</label>
                                <DatePicker
                                    selected={deadline}
                                    onChange={(date) => setDeadline(date)}
                                    minDate={
                                        new Date(
                                            new Date().getTime() +
                                                3 * 24 * 60 * 60 * 1000
                                        )
                                    }
                                />
                            </div>

                            {/* Contact */}
                            <div className="row">
                                <label htmlFor="contact">Contact Mail</label>
                                <input
                                    type="text"
                                    id="contact"
                                    name="contact"
                                    placeholder="Job Contact"
                                    {...register("contact", {
                                        required: {
                                            value: true,
                                            message: "Job contact is required",
                                        },
                                    })}
                                />
                                {errors?.contact && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.contact?.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Tag inputs */}
                        <div className="flex flex-col  min-[600px]:flex-row  justify-between items-center gap-4 mt-5">
                            <div className="row gap-y-2">
                                <label htmlFor="skills">Job Categories</label>
                                <CategoriesAutocomplete
                                    value={categories}
                                    onChange={setCategories}
                                    placeholder="Type to search categories..."
                                />
                                {categories.length >= 10 && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        You have reached a maximum of 10 categories.
                                    </span>
                                )}
                            </div>
                            <div className="row gap-y-2">
                                <label htmlFor="skills">Required Skills</label>
                                <SkillsAutocomplete
                                    value={skills}
                                    onChange={setSkills}
                                    placeholder="Type to search skills..."
                                />
                            </div>
                            <div className="row gap-y-2">
                                <label htmlFor="facilities">Job Facilities</label>
                                <SimpleTagsInput
                                    value={facilities}
                                    onChange={setFacilities}
                                    placeholder="Type facilities and press Enter..."
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="row  mt-5">
                            <label htmlFor="description">Job Description</label>
                            <textarea
                                type="text"
                                id="description"
                                name="description"
                                placeholder="Job Description"
                                className="w-full max-w-none"
                                {...register("description", {
                                    required: {
                                        value: true,
                                        message: "Job description is required",
                                    },
                                    maxLength: {
                                        value: 2000,
                                        message: "Too long (max 2000char)",
                                    },
                                    minLength: {
                                        value: 10,
                                        message: "Too short (max 10char)",
                                    },
                                })}
                            />
                            {errors?.description && (
                                <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                    {errors?.description?.message}
                                </span>
                            )}
                        </div>

                        <div className="row mt-4 sm:mt-0">
                            <label htmlFor="" className="invisible">
                                delete
                            </label>
                            <input
                                type="submit"
                                value="submit"
                                className="btn"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.section`
    padding: 0 2rem;
    max-width: 1600px;
    margin: 0 auto;
    .title-row {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: calc(0.9rem + 0.4vw);
        text-transform: capitalize;
        letter-spacing: 1px;
        font-weight: 600;
        opacity: 0.85;
        color: var(--color-black);
        position: relative;
    }
    .title-row:before {
        content: "";
        position: absolute;
        bottom: -4px;
        left: 0;
        width: calc(30px + 0.7vw);
        height: calc(2px + 0.1vw);
        background-color: var(--color-primary);
    }
    .content-row {
        margin-top: calc(2rem + 0.5vw);
    }
    .form {
        margin-top: calc(30px + 1vw);
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        justify-content: space-between;
        align-items: center;
        grid-gap: calc(1rem + 0.5vw);
    }
    @media screen and (max-width: 1000px) {
        .form {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    @media screen and (max-width: 600px) {
        .form {
            grid-template-columns: 1fr;
        }
    }
    .row {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    .row label {
        font-size: 11.3px;
        font-weight: 600;
        letter-spacing: 1px;
        color: var(--color-black);
        opacity: 0.95;
    }
    input,
    select,
    textarea {
        width: 100%;
        max-width: 500px;
        padding: 8px 14px;
        margin-top: 6px;
        display: inline-block;
        border: 1px solid #0000004a;
        border-radius: 4px;
        box-sizing: border-box;
        font-size: calc(0.8rem + 0.1vw);
        outline: none;
        color: var(--color-black);
    }
    textarea {
        max-width: none;
        min-height: 100px;
    }
    select {
        padding-left: 2px;
        text-transform: capitalize;
    }
    input:focus,
    select:focus,
    textarea:focus {
        outline: none;
        border: 1px solid #00000086;
    }
    .input-cls {
        max-width: none;
        width: 100%;
        font-size: 13px;
        padding: 5px 10px;
    }
    .tag-cls {
        font-size: 14px;
    }

    .status-tags, .type-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 6px;
    }

    .status-tag, .type-tag {
        padding: 6px 12px;
        border-radius: 20px;
        border: 1px solid #ddd;
        background-color: white;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s;
    }

    .status-tag.selected, .type-tag.selected {
        background-color: #414FEA;
        color: white;
        border-color: #414FEA;
    }

    .status-tag:hover, .type-tag:hover {
        background-color: #f0f0f0;
    }

    .status-tag.selected:hover, .type-tag.selected:hover {
        background-color: #414FEA;
        opacity: 0.9;
    }

    .workplace-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 6px;
    }

    .workplace-tag {
        padding: 6px 12px;
        border-radius: 20px;
        border: 1px solid #ddd;
        background-color: white;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s;
    }

    .workplace-tag.selected {
        background-color: #414FEA;
        color: white;
        border-color: #414FEA;
    }

    .workplace-tag:hover {
        background-color: #f0f0f0;
    }

    .workplace-tag.selected:hover {
        background-color: #414FEA;
        opacity: 0.9;
    }
    
    /* Skills Autocomplete Styles */
    .skills-autocomplete {
        width: 100%;
        max-width: 500px;
        margin-top: 6px;
    }
    
    .skills-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 8px;
        min-height: 20px;
    }
    
    .skill-tag {
        background-color: var(--color-primary, #414BEA);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 4px;
    }
    
    .remove-skill {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        padding: 0;
        margin-left: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border-radius: 50%;
    }
    
    .remove-skill:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
    
    .input-container {
        position: relative;
    }
    
    .skills-input {
        width: 100%;
        padding: 8px 14px;
        border: 1px solid #0000004a;
        border-radius: 4px;
        font-size: calc(0.8rem + 0.1vw);
        outline: none;
        color: var(--color-black);
    }
    
    .skills-input:focus {
        outline: none;
        border: 1px solid #00000086;
    }
    
    .suggestions-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #0000004a;
        border-top: none;
        border-radius: 0 0 4px 4px;
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .suggestion-item {
        padding: 8px 14px;
        cursor: pointer;
        font-size: calc(0.8rem + 0.1vw);
        color: var(--color-black);
        transition: background-color 0.2s;
    }
    
    .suggestion-item:hover {
        background-color: #f0f0f0;
    }
    
    .suggestion-item:last-child {
        border-radius: 0 0 4px 4px;
    }
    
    .btn {
        width: 100%;
        max-width: 150px;
        height: 100%;
        display: inline-block;
        background-color: var(--color-black);
        color: var(--color-white);
        cursor: pointer;
        transition: all 0.3s linear;
        text-transform: capitalize;
        font-size: calc(0.9rem + 0.1vw);
    }
    .btn:hover {
        background-color: var(--color-primary);
    }
    @media screen and (max-width: 600px) {
        .btn {
            margin: 0 auto;
            margin-top: -6px;
        }
    }
`;

export default AddJob;