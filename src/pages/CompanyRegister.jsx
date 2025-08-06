//src\pages\CompanyRegister.jsx
"use client"
import { toast } from 'react-toastify';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Logo from '../components/Logo'
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import styled from "styled-components";
import { 
  faFacebook, 
  faTwitter, 
  faInstagram, 
  faYoutube,
  faLinkedin,
  faGithub
} from '@fortawesome/free-brands-svg-icons';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import {
  Upload,
  User,
  Building,
  Globe,
  MessageCircle,
  X,
  Plus,
  Check,
  ArrowRight,
  CalendarIcon,
  Link,
  Mail,
  ChevronDown,
} from "lucide-react";
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import {
  setCurrentStep,
  updateFormData,
  updateField,
  setUploading,
  setShowCalendar,
  addSocialLink,
  removeSocialLink,
  updateSocialLink,
  removeFile,
} from '../redux/slices/companyRegistrationSlice';

const API_BASE_URL = 'https://job-portal-server-six-eosin.vercel.app';

const CalendarWrapper = styled.div`
  position: relative;
  width: 100%;
`

const ORGANIZATION_TYPES = [
  { value: "solo proprietor", label: "Sole Proprietor" },
  { value: "pvt LTD", label: "Private Limited" },
  { value: "LTD", label: "Limited" },
  { value: "OPC", label: "One Person Company" },
  { value: "LLP", label: "LLP" },
  { value: "INC", label: "Incorporated" },
  { value: "Corporation", label: "Corporation" }
];

const INDUSTRY_TYPES = [
  { value: "Fintech", label: "Fintech" },
  { value: "Engineering", label: "Engineering" },
  { value: "Software & IT", label: "Software & IT" },
  { value: "edutech", label: "Edtech" },
  { value: "oil and gas", label: "Oil & Gas" },
  { value: "other", label: "Other" }
];

const CalendarDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 100;
  margin-top: 0.25rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
`

const CalendarInputWrapper = styled.div`
  position: relative;
  width: 100%;
`

// Styled UI Components
const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  outline: none;

  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  /* Default variant */
  ${(props) =>
    !props.$variant &&
    `
    background-color: #2563eb;
    color: white;
    
    &:hover {
      background-color: #1d4ed8;
    }
  `}

  /* Outline variant */
  ${(props) =>
    props.$variant === "outline" &&
    `
    border: 1px solid #d1d5db;
    background-color: white;
    color: #374151;
    
    &:hover {
      background-color: #f9fafb;
      color: #111827;
    }
  `}

  /* Ghost variant */
  ${(props) =>
    props.$variant === "ghost" &&
    `
    background-color: transparent;
    color: #374151;
    
    &:hover {
      background-color: #f3f4f6;
      color: #111827;
    }
  `}

  /* Size variants */
  ${(props) =>
    props.$size === "sm" &&
    `
    height: 2.25rem;
    padding: 0 0.75rem;
    font-size: 0.75rem;
  `}

  ${(props) =>
    props.$size === "lg" &&
    `
    height: 2.75rem;
    padding: 0 2rem;
    font-size: 1rem;
  `}

  ${(props) =>
    props.$size === "icon" &&
    `
    height: 2.5rem;
    width: 2.5rem;
    padding: 0;
  `}

  ${(props) =>
    !props.$size &&
    `
    height: 2.5rem;
    padding: 0 1rem;
  `}
`
const PhoneInputWrapper = styled.div`
  --PhoneInput-color--focus: #2563eb;
  --PhoneInputCountrySelectArrow-color: #6b7280;
  --PhoneInputCountrySelectArrow-opacity: 1;
  --PhoneInputCountryFlag-borderColor: transparent;
  --PhoneInputCountryFlag-height: 24px;
  --PhoneInputCountryFlag-width: 24px;
  width: 100%;

  .PhoneInput {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .PhoneInputInput {
    flex: 1;
    height: 40px;
    padding: 0 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.5);
    }
  }

  .PhoneInputCountry {
    position: relative;
    align-self: stretch;
    display: flex;
    align-items: center;
    margin-right: 8px;
  }

  .PhoneInputCountrySelect {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1;
    border: 0;
    opacity: 0;
    cursor: pointer;
  }

  .PhoneInputCountryIcon {
    width: 24px;
    height: 24px;
    border-radius: 3px;
  }

  .PhoneInputCountrySelectArrow {
    display: block;
    margin-left: 4px;
    color: #6b7280;
    opacity: 1;
    transition: transform 0.2s;
  }

  .PhoneInputCountrySelectArrow--open {
    transform: rotate(180deg);
  }

  .PhoneInputCountryDropdown {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 10;
    margin-top: 4px;
    background: white;
    border-radius: 6px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: 1px solid #e2e8f0;
    max-height: 300px;
    overflow-y: auto;
  }

  .PhoneInputSearch {
    padding: 8px;
    margin: 0 8px;
    border-bottom: 1px solid #e2e8f0;
    width: calc(100% - 16px);

    input {
      width: 100%;
      padding: 4px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
    }
  }

  .PhoneInputCountryList {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .PhoneInputCountryListItem {
    padding: 8px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;

    &:hover {
      background-color: #f3f4f6;
    }
  }
`;

const StyledInput = styled.input`
  display: flex;
  height: 2.5rem;
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  background-color: white;
  padding: 0 0.75rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  appearance: none;

  /* Phone input specific styles */
  ${({ $isPhoneInput }) => $isPhoneInput && `
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    &:focus {
      box-shadow: none;
    }
  `}

  /* Social input specific styles */
  ${({ $isSocialInput }) => $isSocialInput && `
    background: #ffffff;
    border-color: #e5e7eb;
    &:focus {
      border-color: #2563eb;
    }
  `}

  &::placeholder {
    color: #9ca3af;
    opacity: 1;
  }

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
    z-index: 1; /* Ensure focus state appears above adjacent elements */
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background-color: #f3f4f6;
  }

  /* Remove number input arrows */
  &[type='number'] {
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

const StyledLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  line-height: 1;

  &[data-disabled] {
    cursor: not-allowed;
    opacity: 0.7;
  }
`
const StyledTextarea = styled.textarea`
  display: flex;
  min-height: 5rem;
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  background-color: white;
  padding: 0.75rem;
  font-size: 0.875rem;
  transition: all 0.2s;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

const LogoContainer = styled.div`
  max-width: 120px;
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`
const validateEmail = (email) => {
  const publicDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
  const domain = email.split('@')[1];
  return !publicDomains.includes(domain);
};

const StyledSelectTrigger = styled.button`
  display: flex;
  height: 2.5rem;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  background-color: white;
  padding: 0 0.75rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &[data-placeholder] {
    color: #9ca3af;
  }
    
  &[data-state="open"] {
    border-bottom-left-radius: 0;
  }
`

const StyledSelectContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  margin-top: 0.25rem;
  max-height: 15rem;
  overflow-y: auto;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  background-color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  display: ${(props) => (props.$isOpen ? "block" : "none")};
`

const StyledSelectItem = styled.div`
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }

  &:first-child {
    border-top-left-radius: 0.375rem;
    border-top-right-radius: 0.375rem;
  }

  &:last-child {
    border-bottom-left-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
  }
`

const ProgressWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: #f3f4f6;
  border-radius: 9999px;
  height: 0.5rem;
`

const ProgressBar = styled.div`
  height: 100%;
  width: ${(props) => props.$value || 0}%;
  background-color: #2563eb;
  transition: width 0.3s ease-in-out;
  border-radius: 9999px;
`

// Custom Select Component
const Select = ({ children, value, onValueChange, defaultValue }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || "")
  const [selectedLabel, setSelectedLabel] = useState("")

  const handleSelect = (itemValue, itemLabel) => {
    setSelectedValue(itemValue)
    setSelectedLabel(itemLabel)
    setIsOpen(false)
    if (onValueChange) {
      onValueChange(itemValue)
    }
  }

  return (
    <SelectWrapper>
      <StyledSelectTrigger onClick={() => setIsOpen(!isOpen)} data-placeholder={!selectedValue}>
        <span>{selectedLabel || selectedValue || "Select..."}</span>
        <ChevronDown className="h-4 w-4" />
      </StyledSelectTrigger>
      <StyledSelectContent $isOpen={isOpen}>
        {children &&
          children.map((child, index) =>
            child.type === SelectItem
              ? {
                  ...child,
                  props: {
                    ...child.props,
                    key: index,
                    onClick: () => handleSelect(child.props.value, child.props.children),
                  },
                }
              : child,
          )}
      </StyledSelectContent>
    </SelectWrapper>
  )
}

const SelectItem = ({ value, children, onClick }) => <StyledSelectItem onClick={onClick}>{children}</StyledSelectItem>

const Progress = ({ value, className }) => (
  <ProgressWrapper className={className}>
    <ProgressBar $value={value} />
  </ProgressWrapper>
)

// Main styled wrapper components
const MainWrapper = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`

const HeaderWrapper = styled.div`
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`

const HeaderContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  padding-bottom: 1rem;

  @media (min-width: 640px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  @media (min-width: 1024px) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
`

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const ProgressWrapperHeader = styled.div`
  display: none;
  align-items: center;
  gap: 1rem;

  @media (min-width: 640px) {
    display: flex;
  }
`

const ProgressText = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const ProgressLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #2563eb;
`

const MobileProgressWrapper = styled.div`
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.75rem 1rem;

  @media (min-width: 640px) {
    display: none;
  }
`

const MobileProgressContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`

const StepNavigationWrapper = styled.div`
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
`

const StepNavigationContainer = styled.div`
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  @media (min-width: 1024px) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
`

const StepNavigationList = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;

  @media (min-width: 640px) {
    gap: 2rem;
  }
`

const StepButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.5rem;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  transition: colors 0.2s;
  font-weight: 500;
  font-size: 0.875rem;
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
  cursor: pointer;

  @media (min-width: 640px) {
    font-size: 1rem;
  }

  ${(props) =>
    props.$isActive &&
    `
    border-bottom-color: #2563eb;
    color: #2563eb;
  `}

  ${(props) =>
    props.$isCompleted &&
    !props.$isActive &&
    `
    color: #6b7280;
    
    &:hover {
      color: #374151;
    }
  `}

  ${(props) =>
    !props.$isActive &&
    !props.$isCompleted &&
    `
    color: #9ca3af;
    
    &:hover {
      color: #6b7280;
    }
  `}
`

const ContentWrapper = styled.div`
  max-width: 1152px;
  margin: 0 auto;
  padding: 1.5rem 1rem;

  @media (min-width: 640px) {
    padding: 2rem 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 2rem;
  }
`

const FormCard = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1rem;

  @media (min-width: 640px) {
    padding: 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 2rem;
  }
`

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 640px) {
    gap: 2rem;
  }
`

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;

  @media (min-width: 640px) {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    gap: 1.5rem;
  }

  ${(props) =>
    props.$cols === 2 &&
    `
    @media (min-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
    }
  `}

  ${(props) =>
    props.$cols === 3 &&
    `
    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
  `}
`

const FileUploadWrapper = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #9ca3af;
  }

  ${(props) => props.$hasFile && `
    border-color: #2563eb;
    background-color: #f0f7ff;
  `}
`

const FileUploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  position: relative;
  z-index: 1;
`

const FileUploadText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const FileUploadButton = styled.button`
  color: #2563eb;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  
  &:hover {
    color: #1d4ed8;
  }
`

const FileUploadDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
`

const FilePreview = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 2;
`

const FilePreviewImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`

const RemoveFileButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const TextareaWrapper = styled.div`
  margin-top: 0.5rem;
`

const TextareaToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;

  @media (min-width: 640px) {
    gap: 0.5rem;
  }
`

const SocialLinkWrapper = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SocialLinkItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
`;

const SocialPlatform = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #374151;

  .social-icon {
    color: #4b5563;
    font-size: 1.25rem;
  }
`;

const SocialInputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  input {
    flex: 1;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 0.5rem;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 1px dashed #d1d5db;
  border-radius: 0.375rem;
  padding: 1rem;
  cursor: pointer;
  color: #2563eb;
  font-weight: 500;
  width: 100%;
  justify-content: center;

  &:hover {
    background: #f8fafc;
  }

  @media (min-width: 768px) {
    grid-column: span 2;
  }
`;

const MapPlaceholder = styled.div`
  margin-top: 0.5rem;
  height: 12rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  border: 2px dashed #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 640px) {
    height: 16rem;
  }
`

const MapPlaceholderContent = styled.div`
  text-align: center;
`

const MapPlaceholderText = styled.span`
  color: #6b7280;
`

const NavigationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1.5rem;
  margin-top: 1.5rem;
  border-top: 1px solid #e5e7eb;

  @media (min-width: 640px) {
    flex-direction: row;
    padding-top: 2rem;
    margin-top: 2rem;
  }
`

const FooterWrapper = styled.div`
  background-color: white;
  border-top: 1px solid #e5e7eb;
  padding: 0.75rem 0;
  margin-top: 2rem;

  @media (min-width: 640px) {
    padding: 1rem 0;
    margin-top: 4rem;
  }
`

const FooterText = styled.div`
  text-align: center;
  font-size: 0.75rem;
  color: #6b7280;

  @media (min-width: 640px) {
    font-size: 0.875rem;
  }
`

const SuccessWrapper = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  padding: 4rem 1rem;

  @media (min-width: 640px) {
    padding: 6rem 1rem;
  }
`

const SuccessContent = styled.div`
  text-align: center;
`

const SuccessIcon = styled.div`
  width: 5rem;
  height: 5rem;
  background-color: #dbeafe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;

  @media (min-width: 640px) {
    width: 6rem;
    height: 6rem;
  }
`

const SuccessTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 1rem;

  @media (min-width: 640px) {
    font-size: 1.5rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.875rem;
  }
`

const SuccessDescription = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
  font-size: 0.875rem;
  line-height: 1.625;

  @media (min-width: 640px) {
    font-size: 1rem;
  }
`

const SuccessButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  max-width: 28rem;
  margin: 0 auto;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`

const FixedFooter = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-top: 1px solid #e5e7eb;
  padding: 0.75rem 0;

  @media (min-width: 640px) {
    padding: 1rem 0;
  }
`

const socialPlatforms = [
  { value: "linkedin", label: "LinkedIn", icon: faLinkedin },
  { value: "facebook", label: "Facebook", icon: faFacebook },
  { value: "twitter", label: "Twitter", icon: faTwitter },
  { value: "instagram", label: "Instagram", icon: faInstagram },
  { value: "youtube", label: "YouTube", icon: faYoutube },
  { value: "github", label: "GitHub", icon: faGithub },
  { value: "crunchbase", label: "Crunchbase", icon: faBriefcase }
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function CompanyRegister() {
  const dispatch = useDispatch();
  const {
    currentStep,
    formData,
    uploading,
    showCalendar,
  } = useSelector((state) => state.companyRegistration);

  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const steps = [
    { id: 1, title: "Company Info", icon: User },
    { id: 2, title: "Founding Info", icon: Building },
    { id: 3, title: "Social Media Profile", icon: Globe },
    { id: 4, title: "Contact", icon: MessageCircle },
  ];

  const getProgress = () => {
    switch (currentStep) {
      case 1: return 0;
      case 2: return 25;
      case 3: return 50;
      case 4: return 75;
      case 5: return 100;
      default: return 0;
    }
  };

  const uploadFile = async (file, type) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_BASE_URL}/api/company/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error(`${type} upload error:`, error);
      throw error;
    }
  };

  const handleFileChange = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    // Clear any existing toasts
    toast.dismiss();

    // Validate file
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error('Only JPG, PNG, and WEBP files are allowed');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      dispatch(setUploading(true));
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/api/company/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const { data } = await response.json();
      dispatch(updateFormData({
        [`${field}Url`]: data.url,
        [`${field}Preview`]: URL.createObjectURL(file)
      }));
      
      toast.success('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      dispatch(setUploading(false));
    }
  };

  const handleDateChange = (date) => {
    const formattedDate = date.toLocaleDateString('en-GB');
    dispatch(updateField({ field: 'yearEstablished', value: formattedDate }));
    dispatch(setShowCalendar(false));
  };

  const handleSubmit = async () => {
    try {
      toast.dismiss();
      
      if (!validateStep(4)) return;

      const cleanPhone = formData.headquarter_phone_no.replace(/\D/g, '');

      const submissionData = {
        company_name: formData.companyName,
        company_mail_id: formData.email,
        password: formData.password,
        headquarter_phone_no: cleanPhone,
        about_company: formData.aboutUs,
        organizations_type: formData.organizationType,
        industry_type: formData.industryType,
        team_size: formData.teamSize,
        year_of_establishment: formData.yearEstablished.split('/').reverse().join('-'),
        company_website: formData.companyWebsite || null,
        company_vision: formData.companyVision || null,
        careers_link: formData.careersLink || null,
        social_links: formData.socialLinks.reduce((acc, link) => {
          if (link.url) {
            acc[link.platform] = link.url;
          }
          return acc;
        }, {}),
        ...(formData.logoUrl && { company_logo_url: formData.logoUrl }),
        ...(formData.bannerUrl && { company_banner_url: formData.bannerUrl }),
      };

      const response = await fetch(`${API_BASE_URL}/api/company/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        // Handle specific error cases from backend
        switch (result.errorCode) {
          case 'EMAIL_EXISTS':
            throw new Error('This email is already registered. Please login.');
          case 'REGISTRATION_VALIDATION_ERROR':
            // Show all validation errors
            result.errors?.forEach(err => {
              toast.error(`${err.param}: ${err.msg}`);
            });
            throw new Error('Please fix the form errors');
          default:
            throw new Error(result.message || 'Registration failed');
        }
      }

      if (result.success) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('company', JSON.stringify(result.data.company));
        toast.success(result.message);
        dispatch(setCurrentStep(5));
      }
    } catch (error) {
      console.error('Registration error:', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      // Only show toast if it's not a validation error (already shown above)
      if (!error.message.includes('Please fix the form errors')) {
        toast.error(error.message || 'Registration failed. Please try again.');
      }
    }
  };

  const handleRemoveFile = (field) => {
    dispatch(removeFile({ field }));
  };

  const getProgressText = () => {
    switch (currentStep) {
      case 1: return "0% Completed";
      case 2: return "25% Completed";
      case 3: return "50% Completed";
      case 4: return "75% Completed";
      case 5: return "100% Completed";
      default: return "0% Completed";
    }
  };

  const validateStep = (step) => {
    toast.dismiss(); // Clear any existing toasts
    let isValid = true;

    switch (step) {
      case 1:
        if (!formData.companyName?.trim()) {
          toast.error('Company name is required');
          isValid = false;
        }
        if (!formData.aboutUs?.trim()) {
          toast.error('About us description is required');
          isValid = false;
        }
        break;

      case 2:
        if (!formData.organizationType) {
          toast.error('Organization type is required');
          isValid = false;
        }
        if (!formData.industryType) {
          toast.error('Industry type is required');
          isValid = false;
        }
        if (!formData.teamSize) {
          toast.error('Team size is required');
          isValid = false;
        }
        if (!formData.yearEstablished) {
          toast.error('Year of establishment is required');
          isValid = false;
        }
        if (formData.companyWebsite && !/^https?:\/\/.+\..+/.test(formData.companyWebsite)) {
          toast.error('Website must be a valid URL (include http:// or https://)');
          isValid = false;
        }
        if (formData.careersLink && !/^https?:\/\/.+\..+/.test(formData.careersLink)) {
          toast.error('Careers link must be a valid URL (include http:// or https://)');
          isValid = false;
        }
        break;

      case 3:
        formData.socialLinks.forEach(link => {
          if (link.url && !/^https?:\/\/.+\..+/.test(link.url)) {
            toast.error(`Invalid ${link.platform} URL format`);
            isValid = false;
          }
        });
        break;

      case 4:
        if (!formData.email) {
          toast.error('Company email is required');
          isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          toast.error('Please enter a valid email address');
          isValid = false;
        } else if (!validateEmail(formData.email)) {
          toast.error('Please use a company email address (no public domains)');
          isValid = false;
        }
        
        if (!formData.password) {
          toast.error('Password is required');
          isValid = false;
        } else if (formData.password.length < 8) {
          toast.error('Password must be at least 8 characters');
          isValid = false;
        }
        break;
    }

    return isValid;
  };

  const handleNext = async () => {
    try {
      if (!validateStep(currentStep)) return;

      if (currentStep === 1) {
        if (formData.logo) {
          const logoUrl = await uploadFile(formData.logo, 'logo');
          dispatch(updateField({ field: 'company_logo_url', value: logoUrl }));
        }
        if (formData.banner) {
          const bannerUrl = await uploadFile(formData.banner, 'banner');
          dispatch(updateField({ field: 'company_banner_url', value: bannerUrl }));
        }
      }

      if (currentStep === 4) {
        await handleSubmit();
        return;
      }

      dispatch(setCurrentStep(currentStep + 1));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      dispatch(setCurrentStep(currentStep - 1));
    }
  };

  const handleAddSocialLink = () => {
    dispatch(addSocialLink());
  };

  const handleRemoveSocialLink = (index) => {
    dispatch(removeSocialLink(index));
  };

  const handleUpdateSocialLink = (index, field, value) => {
    dispatch(updateSocialLink({ index, field, value }));
  };

  const FileUpload = ({ label, description, onFileChange, field, file, preview, inputRef }) => (
    <FileUploadWrapper 
      $hasFile={!!file}
      onClick={() => inputRef.current?.click()}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={(e) => handleFileChange(e, field)}
        accept="image/jpeg, image/png, image/webp"
        style={{ display: 'none' }}
      />
      
      {preview ? (
        <>
          <FilePreview>
            <FilePreviewImage src={preview} alt={`${field} preview`} />
          </FilePreview>
          <RemoveFileButton onClick={(e) => {
            e.stopPropagation();
            handleRemoveFile(field);
          }}>
            <X className="w-3 h-3" />
          </RemoveFileButton>
        </>
      ) : (
        <FileUploadContent>
          <Upload className="h-12 w-12 text-gray-400" />
          <FileUploadText>
            <div>
              <FileUploadButton>Browse photo</FileUploadButton>
              <span style={{ color: "#6b7280" }}> or drop here</span>
            </div>
          </FileUploadText>
        </FileUploadContent>
      )}
      <FileUploadDescription>{description}</FileUploadDescription>
    </FileUploadWrapper>
  );

  // Success/Completion Page
  if (currentStep === 5) {
    return (
      <MainWrapper>
        {/* Header */}
        <HeaderWrapper>
          <HeaderContainer>
            <LogoContainer>
              <Logo />
            </LogoContainer>
            <ProgressWrapperHeader>
              <ProgressText>Setup Progress</ProgressText>
              <ProgressContainer>
                <Progress value={100} className="w-20 sm:w-24" />
                <ProgressLabel>100% Completed</ProgressLabel>
              </ProgressContainer>
            </ProgressWrapperHeader>
          </HeaderContainer>
        </HeaderWrapper>

        {/* Success Content */}
        <SuccessWrapper>
          <SuccessContent>
            <SuccessIcon>
              <Check className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
            </SuccessIcon>
            <SuccessTitle>🎉 Congratulations, Your profile is 100% complete!</SuccessTitle>
            <SuccessDescription>
              Your company profile has been successfully registered. You can now post jobs, manage candidates, and access all the features of our platform.
            </SuccessDescription>
            <SuccessButtonGroup>
              <StyledButton 
                $variant="outline" 
                $size="lg"
                as="a" 
                href="/company-login"
              >
                View Dashboard
              </StyledButton>
              <StyledButton 
                $size="lg"
                as="a" 
                href="/company-login"
              >
                Post Job <ArrowRight className="ml-2 h-4 w-4" />
              </StyledButton>
            </SuccessButtonGroup>
          </SuccessContent>
        </SuccessWrapper>

        {/* Footer */}
        <FixedFooter>
          <FooterText>© {new Date().getFullYear()} HireNext @2025. All rights Reserved</FooterText>
        </FixedFooter>
      </MainWrapper>
    );
  }

  return (
    <MainWrapper>
      {/* Header */}
      <HeaderWrapper>
        <HeaderContainer>
          <LogoContainer>
            <Logo />
          </LogoContainer>
          <ProgressWrapperHeader>
            <ProgressText>Setup Progress</ProgressText>
            <ProgressContainer>
              <Progress value={getProgress()} className="w-24" />
              <ProgressLabel>{getProgressText()}</ProgressLabel>
            </ProgressContainer>
          </ProgressWrapperHeader>
        </HeaderContainer>
      </HeaderWrapper>

      <ToastContainer 
        position="top-center"
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

      {/* Mobile Progress */}
      <MobileProgressWrapper>
        <MobileProgressContainer>
          <ProgressText>Setup Progress</ProgressText>
          <ProgressLabel>{getProgressText()}</ProgressLabel>
        </MobileProgressContainer>
        <Progress value={getProgress()} className="w-full" />
      </MobileProgressWrapper>

      {/* Step Navigation */}
      <StepNavigationWrapper>
        <StepNavigationContainer>
          <StepNavigationList>
            {steps.map((step) => {
              const Icon = step.icon
              const isActive = step.id === currentStep
              const isCompleted = step.id < currentStep

              return (
                <StepButton key={step.id} $isActive={isActive} $isCompleted={isCompleted}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{step.title}</span>
                </StepButton>
              )
            })}
          </StepNavigationList>
        </StepNavigationContainer>
      </StepNavigationWrapper>

      {/* Form Content */}
      <ContentWrapper>
        <FormCard>
          {/* Step 1: Company Info */}
          {currentStep === 1 && (
            <FormSection>
              <div>
                <SectionTitle>Logo & Banner Image</SectionTitle>
                <GridContainer $cols={2}>
                  <FormGroup>
                    <StyledLabel>Upload Logo</StyledLabel>
                    <FileUpload
                      label="Upload Logo"
                      description="A photo larger than 400 pixels work best. Max photo size 5 MB."
                      field="logo"
                      file={formData.logo}
                      preview={formData.logoPreview}
                      inputRef={logoInputRef}
                    />
                  </FormGroup>
                  <FormGroup>
                    <StyledLabel>Banner Image</StyledLabel>
                    <FileUpload
                      label="Banner Image"
                      description="Banner images optimal dimension 1520*400. Supported format JPEG, PNG. Max photo size 5 MB."
                      field="banner"
                      file={formData.banner}
                      preview={formData.bannerPreview}
                      inputRef={bannerInputRef}
                    />
                  </FormGroup>
                </GridContainer>
              </div>

              <FormGroup>
                <StyledLabel htmlFor="companyName">Company name</StyledLabel>
                <StyledInput
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => dispatch(updateField({ field: 'companyName', value: e.target.value }))}
                  placeholder="Enter your company name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <StyledLabel htmlFor="aboutUs">About Us</StyledLabel>
                <TextareaWrapper>
                  <StyledTextarea
                    id="aboutUs"
                    placeholder="Write down about your company here. Let the candidate know who we are..."
                    value={formData.aboutUs}
                    onChange={(e) => dispatch(updateField({ field: 'aboutUs', value: e.target.value }))}
                    rows={6}
                    required
                  />
                  <TextareaToolbar>
                    <StyledButton $variant="ghost" $size="sm">
                      <span className="font-bold">B</span>
                    </StyledButton>
                    <StyledButton $variant="ghost" $size="sm">
                      <span className="italic">I</span>
                    </StyledButton>
                    <StyledButton $variant="ghost" $size="sm">
                      <span className="underline">U</span>
                    </StyledButton>
                    <StyledButton $variant="ghost" $size="sm">
                      <span className="line-through">S</span>
                    </StyledButton>
                    <StyledButton $variant="ghost" $size="sm">
                      <Link className="w-4 h-4" />
                    </StyledButton>
                    <StyledButton $variant="ghost" $size="sm">
                      •
                    </StyledButton>
                    <StyledButton $variant="ghost" $size="sm">
                      1.
                    </StyledButton>
                  </TextareaToolbar>
                </TextareaWrapper>
              </FormGroup>
            </FormSection>
          )}

          {/* Step 2: Founding Info */}
          {currentStep === 2 && (
            <FormSection>
              <GridContainer $cols={3}>
                <FormGroup>
                  <StyledLabel>Organization Type</StyledLabel>
                  <Select
                    value={formData.organizationType}
                    onValueChange={(value) => dispatch(updateField({ field: 'organizationType', value }))}
                  >
                    {ORGANIZATION_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <StyledLabel>Industry Types</StyledLabel>
                  <Select
                    value={formData.industryType}
                    onValueChange={(value) => dispatch(updateField({ field: 'industryType', value }))}
                  >
                    {INDUSTRY_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <StyledLabel>Team Size</StyledLabel>
                  <Select
                    value={formData.teamSize}
                    onValueChange={(value) => dispatch(updateField({ field: 'teamSize', value }))}
                  >
                    <SelectItem value="1-10">1-10 </SelectItem>
                    <SelectItem value="11-50">11-50 </SelectItem>
                    <SelectItem value="51-200">51-200 </SelectItem>
                    <SelectItem value="201-500">201-500 </SelectItem>
                    <SelectItem value="500+">500+ </SelectItem>
                  </Select>
                </FormGroup>
              </GridContainer>

              <GridContainer $cols={2}>
                <FormGroup>
                  <StyledLabel>Year of Establishment</StyledLabel>
                  <CalendarWrapper>
                    <CalendarInputWrapper>
                      <StyledInput
                        placeholder="dd/mm/yyyy"
                        value={formData.yearEstablished}
                        onChange={(e) => dispatch(updateField({ field: 'yearEstablished', value: e.target.value }))}
                        onClick={() => dispatch(setShowCalendar(!showCalendar))}
                        required
                      />
                      <CalendarIcon
                        style={{
                          position: "absolute",
                          right: "0.75rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "1.25rem",
                          height: "1.25rem",
                          color: "#9ca3af",
                          cursor: "pointer",
                        }}
                        onClick={() => dispatch(setShowCalendar(!showCalendar))}
                      />
                    </CalendarInputWrapper>
                    {showCalendar && (
                      <CalendarDropdown>
                        <Calendar
                          onChange={handleDateChange}
                          value={formData.yearEstablished ? new Date(formData.yearEstablished) : new Date()}
                          maxDate={new Date()}
                          onClickDay={() => dispatch(setShowCalendar(false))}
                        />
                      </CalendarDropdown>
                    )}
                  </CalendarWrapper>
                </FormGroup>

                <FormGroup>
                  <StyledLabel>Company Website</StyledLabel>
                  <div style={{ position: "relative" }}>
                    <StyledInput
                      placeholder="Website url..."
                      value={formData.companyWebsite}
                      onChange={(e) => dispatch(updateField({ field: 'companyWebsite', value: e.target.value }))}
                    />
                    <Link
                      style={{
                        position: "absolute",
                        right: "0.75rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "1.25rem",
                        height: "1.25rem",
                        color: "#2563eb",
                      }}
                    />
                  </div>
                </FormGroup>
                <FormGroup>
                  <StyledLabel>Official Careers Link</StyledLabel>
                  <div style={{ position: "relative" }}>
                    <StyledInput
                      placeholder="https://yourcompany.com/careers"
                      value={formData.careersLink}
                      onChange={(e) => dispatch(updateField({ field: 'careersLink', value: e.target.value }))}
                    />
                    <Link
                      style={{
                        position: "absolute",
                        right: "0.75rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "1.25rem",
                        height: "1.25rem",
                        color: "#2563eb",
                      }}
                    />
                  </div>
                </FormGroup>
              </GridContainer>

              <FormGroup>
                <StyledLabel>Company Vision</StyledLabel>
                <TextareaWrapper>
                  <StyledTextarea
                    placeholder="Tell us about your company vision..."
                    value={formData.companyVision}
                    onChange={(e) => dispatch(updateField({ field: 'companyVision', value: e.target.value }))}
                    rows={6}
                  />
                  <TextareaToolbar>
                    <StyledButton $variant="ghost" $size="sm">
                      <span className="font-bold">B</span>
                    </StyledButton>
                    <StyledButton $variant="ghost" $size="sm">
                      <span className="italic">I</span>
                    </StyledButton>
                    <StyledButton $variant="ghost" $size="sm">
                      <span className="underline">U</span>
                    </StyledButton>
                    <StyledButton $variant="ghost" $size="sm">
                      <span className="line-through">S</span>
                    </StyledButton>
                    <StyledButton $variant="ghost" $size="sm">
                      <Link className="w-4 h-4" />
                    </StyledButton>
                    <StyledButton $variant="ghost" $size="sm">
                      •
                    </StyledButton>
                    <StyledButton $variant="ghost" $size="sm">
                      1.
                    </StyledButton>
                  </TextareaToolbar>
                </TextareaWrapper>
              </FormGroup>
            </FormSection>
          )}
          {/* Step 3: Social Media Profile */}
          {currentStep === 3 && (
            <FormSection>
              <SocialLinkWrapper>
                {formData.socialLinks.map((link, index) => (
                  <SocialLinkItem key={index}>
                    <SocialPlatform>
                      <FontAwesomeIcon 
                        icon={socialPlatforms.find(p => p.value === link.platform)?.icon} 
                        className="social-icon"
                      />
                      <span>{socialPlatforms.find(p => p.value === link.platform)?.label}</span>
                    </SocialPlatform>
                    <SocialInputGroup>
                      <StyledInput
                        $isSocialInput
                        placeholder={`${link.platform}.com/username`}
                        value={link.url}
                        onChange={(e) => handleUpdateSocialLink(index, "url", e.target.value)}
                      />
                      <RemoveButton onClick={() => handleRemoveSocialLink(index)}>
                        <FontAwesomeIcon icon={faTimes} />
                      </RemoveButton>
                    </SocialInputGroup>
                  </SocialLinkItem>
                ))}
                
                <AddButton onClick={handleAddSocialLink}>
                  <FontAwesomeIcon icon={faPlus} />
                  Add New Social Link
                </AddButton>
              </SocialLinkWrapper>
            </FormSection>
          )}
          {/* Step 4: Contact */}
          {currentStep === 4 && (
            <FormSection>
              <FormGroup>
                <StyledLabel>Map Location</StyledLabel>
                <MapPlaceholder>
                  <MapPlaceholderContent>
                    <Globe className="w-12 h-12 text-gray-400" style={{ margin: "0 auto 0.5rem" }} />
                    <MapPlaceholderText>Map integration would go here</MapPlaceholderText>
                  </MapPlaceholderContent>
                </MapPlaceholder>
              </FormGroup>

              <FormGroup>
                <StyledLabel htmlFor="headquarter_phone_no">Phone Number</StyledLabel>
                <PhoneInputWrapper>
                  <PhoneInput
                    international
                    defaultCountry="IN"
                    value={formData.headquarter_phone_no}
                    onChange={(value) => {
                      dispatch(updateField({ 
                        field: 'headquarter_phone_no', 
                        value: value || '' 
                      }));
                    }}
                    inputProps={{
                      name: 'headquarter_phone_no',
                      id: 'headquarter_phone_no',
                      required: true,
                    }}
                    enableSearch
                    searchPlaceholder="Search country"
                  />
                </PhoneInputWrapper>
              </FormGroup>

              <FormGroup>
                <StyledLabel>Email</StyledLabel>
                <div style={{ position: "relative" }}>
                  <StyledInput
                    type="email"
                    placeholder="Company email address"
                    value={formData.email}
                    onChange={(e) => {
                      if (!validateEmail(e.target.value) && e.target.value.includes('@')) {
                        toast.error('Public email domains are not allowed');
                      }
                      dispatch(updateField({ field: 'email', value: e.target.value }));
                    }}
                    required
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
                </div>
              </FormGroup>
            </FormSection>
          )}

          {/* Navigation Buttons */}
          <NavigationWrapper>
            <StyledButton 
                $variant="outline" 
                onClick={handlePrevious} 
                disabled={currentStep === 1} 
                style={{ order: 2 }}
            >
                Previous
            </StyledButton>
            
            {currentStep === 4 ? (
                <>
                {/* Add password field on the last step */}
                <FormGroup style={{ order: 1, width: '100%', marginBottom: '1rem' }}>
                    <StyledLabel htmlFor="password">Create Password</StyledLabel>
                    <StyledInput
                    id="password"
                    type="password"
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={(e) => dispatch(updateField({ field: 'password', value: e.target.value }))}
                    required
                    minLength="8"
                    />
                </FormGroup>
                <StyledButton 
                    onClick={handleSubmit} 
                    style={{ order: 3, width: '100%' }}
                >
                    Complete Registration
                    <ArrowRight className="ml-2 h-4 w-4" />
                </StyledButton>
                </>
            ) : (
                <StyledButton 
                onClick={handleNext} 
                style={{ order: 1 }}
                >
                Save & Next
                <ArrowRight className="ml-2 h-4 w-4" />
                </StyledButton>
            )}
            </NavigationWrapper>
        </FormCard>
      </ContentWrapper>

      {/* Footer */}
      <FooterWrapper>
        <FooterText>© {new Date().getFullYear()} HireNext @2025. All rights Reserved</FooterText>
      </FooterWrapper>
    </MainWrapper>
  );
}
