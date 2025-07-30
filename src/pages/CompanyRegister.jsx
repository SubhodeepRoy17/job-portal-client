"use client"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useState, useRef, useCallback } from "react"
import styled from "styled-components"
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
} from "lucide-react"
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const CalendarWrapper = styled.div`
  position: relative;
  width: 100%;
`

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
const countries = [
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺' },
];

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

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`

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

const SelectTrigger = ({ children, className }) => children

const SelectContent = ({ children }) => children

const SelectItem = ({ value, children, onClick }) => <StyledSelectItem onClick={onClick}>{children}</StyledSelectItem>

const SelectValue = ({ placeholder }) => null

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

const LogoIcon = styled.div`
  width: 2rem;
  height: 2rem;
  background-color: #2563eb;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
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
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const SocialLinkRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`

const SocialLinkInputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex: 1;
`

const PhoneInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`

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
  { value: "facebook", label: "Facebook", icon: "📘" },
  { value: "twitter", label: "Twitter", icon: "🐦" },
  { value: "instagram", label: "Instagram", icon: "📷" },
  { value: "youtube", label: "Youtube", icon: "📺" },
  { value: "linkedin", label: "LinkedIn", icon: "💼" },
]

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function CompanyRegister() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showCalendar, setShowCalendar] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1 - Company Info
    companyName: "",
    aboutUs: "",
    logo: null,
    logoPreview: null,
    banner: null,
    bannerPreview: null,

    // Step 2 - Founding Info
    organizationType: "",
    industryType: "",
    teamSize: "",
    yearEstablished: "",
    companyWebsite: "",
    companyVision: "",

    // Step 3 - Social Media
    socialLinks: [
      { platform: "facebook", url: "" },
      { platform: "twitter", url: "" },
      { platform: "instagram", url: "" },
      { platform: "youtube", url: "" },
    ],

    // Step 4 - Contact
    mapLocation: "",
    phoneCountryCode: "+880", // Default country code
    phoneNumber: "",
    email: "",
    password: "",
  })

  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const steps = [
    { id: 1, title: "Company Info", icon: User },
    { id: 2, title: "Founding Info", icon: Building },
    { id: 3, title: "Social Media Profile", icon: Globe },
    { id: 4, title: "Contact", icon: MessageCircle },
  ]

  const getProgress = () => {
    switch (currentStep) {
      case 1:
        return 0
      case 2:
        return 25
      case 3:
        return 50
      case 4:
        return 75
      case 5:
        return 100
      default:
        return 0
    }
  }

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }
      
      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
      throw error;
    }
  };

  const handleFileChange = useCallback(async (e, field) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size too large. Maximum size is 5MB.');
      return;
    }

    setUploading(true);
    
    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Upload the file to get a permanent URL
      const fileUrl = await uploadFile(file);

      setFormData(prev => ({
        ...prev,
        [field]: file,
        [`${field}Preview`]: previewUrl,
        [`${field}Url`]: fileUrl
      }));

      toast.success(`${field === 'logo' ? 'Logo' : 'Banner'} uploaded successfully`);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDateChange = (date) => {
    const formattedDate = date.toLocaleDateString('en-GB'); // dd/mm/yyyy format
    setFormData({ ...formData, yearEstablished: formattedDate });
    setShowCalendar(false);
  };

  const handleSubmit = async () => {
    try {
      // Basic validation
      if (!formData.companyName) {
        toast.error('Company name is required');
        return;
      }

      if (!formData.email) {
        toast.error('Email is required');
        return;
      }

      // Validate email domain
      const emailDomain = formData.email.split('@')[1];
      const blockedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
      if (blockedDomains.includes(emailDomain)) {
        toast.error('Please use your company email address');
        return;
      }

      if (!formData.password) {
        toast.error('Password is required');
        return;
      }

      if (formData.password.length < 8) {
        toast.error('Password must be at least 8 characters');
        return;
      }

      // Show loading toast
      const toastId = toast.loading('Registering your company...');

      // Prepare the data for submission
      const submissionData = {
        full_name: formData.companyName,
        company_mail_id: formData.email,
        password: formData.password,
        company_name: formData.companyName,
        about_company: formData.aboutUs,
        logo_url: formData.logoUrl,
        banner_url: formData.bannerUrl,
        organizations_type: formData.organizationType,
        industry_type: formData.industryType,
        team_size: formData.teamSize,
        year_of_establishment: formData.yearEstablished,
        company_website: formData.companyWebsite,
        company_vision: formData.companyVision,
        social_links: formData.socialLinks.reduce((acc, link) => {
          acc[`${link.platform}_url`] = link.url;
          return acc;
        }, {}),
        map_location_url: formData.mapLocation,
        headquarter_phone_no: `${formData.phoneCountryCode}${formData.phoneNumber}`,
        email_id: formData.email,
        role: 4 // Company role
      };

      // Send data to your API endpoint
      const response = await fetch('/api/company/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.update(toastId, {
          render: 'Company registered successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        });
        setCurrentStep(5); // Move to success step
      } else {
        toast.update(toastId, {
          render: data.message || 'Registration failed',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        });
        
        if (data.errors) {
          data.errors.forEach(error => toast.error(error));
        }
      }
    } catch (error) {
      toast.error('An error occurred during registration');
      console.error('Registration error:', error);
    }
  };

  const getProgressText = () => {
    switch (currentStep) {
      case 1:
        return "0% Completed"
      case 2:
        return "25% Completed"
      case 3:
        return "50% Completed"
      case 4:
        return "75% Completed"
      case 5:
        return "100% Completed"
      default:
        return "0% Completed"
    }
  }

  const validateStep = (step) => {
    // Clear any previous error toasts
    toast.dismiss();

    switch (step) {
      case 1:
        if (!formData.companyName.trim()) {
          toast.error('🛑 Company name is required');
          return false;
        }
        if (!formData.aboutUs.trim()) {
          toast.error('📝 Please write something about your company');
          return false;
        }
        return true;

      case 2:
        if (!formData.organizationType) {
          toast.error('🏢 Please select your organization type');
          return false;
        }
        if (!formData.industryType) {
          toast.error('🏭 Please select your industry type');
          return false;
        }
        if (!formData.teamSize) {
          toast.error('👥 Please select your team size');
          return false;
        }
        if (!formData.yearEstablished) {
          toast.error('📅 Please select year of establishment');
          return false;
        }
        if (formData.companyWebsite && !/^https?:\/\/.+\..+/.test(formData.companyWebsite)) {
          toast.error('🌐 Website URL must be valid (include http:// or https://)');
          return false;
        }
        return true;

      case 3:
        // Social links are optional but URLs must be valid if provided
        const invalidLinks = formData.socialLinks.filter(link => 
          link.url && !/^https?:\/\/.+\..+/.test(link.url)
        );
        if (invalidLinks.length > 0) {
          toast.error(`🔗 Please enter valid URLs for ${invalidLinks.map(l => l.platform).join(', ')}`);
          return false;
        }
        return true;

      case 4:
        if (!formData.email) {
          toast.error('📧 Company email is required');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          toast.error('✉️ Please enter a valid email address');
          return false;
        }
        if (!formData.phoneNumber) {
          toast.error('📱 Phone number is required');
          return false;
        }
        if (!/^\d+$/.test(formData.phoneNumber)) {
          toast.error('🔢 Phone number must contain only digits');
          return false;
        }
        if (!formData.password) {
          toast.error('🔑 Password is required');
          return false;
        }
        if (formData.password.length < 8) {
          toast.error('⚠️ Password must be at least 8 characters');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const addSocialLink = () => {
    setFormData({
      ...formData,
      socialLinks: [...formData.socialLinks, { platform: "facebook", url: "" }],
    })
  }

  const removeSocialLink = (index) => {
    const newLinks = formData.socialLinks.filter((_, i) => i !== index)
    setFormData({ ...formData, socialLinks: newLinks })
  }

  const updateSocialLink = (index, field, value) => {
    const newLinks = [...formData.socialLinks]
    newLinks[index][field] = value
    setFormData({ ...formData, socialLinks: newLinks })
  }

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
            removeFile(field);
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
  )

  // Success/Completion Page
  if (currentStep === 5) {
    return (
      <MainWrapper>
        {/* Header */}
        <HeaderWrapper>
          <HeaderContainer>
            <LogoWrapper>
              <LogoIcon>
                <Building className="w-5 h-5 text-white" />
              </LogoIcon>
              <LogoText>Jobpilot</LogoText>
            </LogoWrapper>
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
              <StyledButton $variant="outline" $size="lg">
                View Dashboard
              </StyledButton>
              <StyledButton $size="lg">
                Post Job <ArrowRight className="ml-2 h-4 w-4" />
              </StyledButton>
            </SuccessButtonGroup>
          </SuccessContent>
        </SuccessWrapper>

        {/* Footer */}
        <FixedFooter>
          <FooterText>© {new Date().getFullYear()} Jobpilot - Job Board. All rights Reserved</FooterText>
        </FixedFooter>
      </MainWrapper>
    )
  }

  return (
    <MainWrapper>
      {/* Header */}
      <HeaderWrapper>
        <HeaderContainer>
          <LogoWrapper>
            <LogoIcon>
              <Building className="w-5 h-5 text-white" />
            </LogoIcon>
            <LogoText>Jobpilot</LogoText>
          </LogoWrapper>
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
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, aboutUs: e.target.value })}
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
                    onValueChange={(value) => setFormData({ ...formData, organizationType: value })}
                  >
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="nonprofit">Non-profit</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="agency">Agency</SelectItem>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <StyledLabel>Industry Types</StyledLabel>
                  <Select
                    value={formData.industryType}
                    onValueChange={(value) => setFormData({ ...formData, industryType: value })}
                  >
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <StyledLabel>Team Size</StyledLabel>
                  <Select
                    value={formData.teamSize}
                    onValueChange={(value) => setFormData({ ...formData, teamSize: value })}
                  >
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="500+">500+ employees</SelectItem>
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
                        onChange={(e) => setFormData({ ...formData, yearEstablished: e.target.value })}
                        onClick={() => setShowCalendar(!showCalendar)}
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
                        onClick={() => setShowCalendar(!showCalendar)}
                      />
                    </CalendarInputWrapper>
                    {showCalendar && (
                      <CalendarDropdown>
                        <Calendar
                          onChange={handleDateChange}
                          value={formData.yearEstablished ? new Date(formData.yearEstablished) : new Date()}
                          maxDate={new Date()}
                          onClickDay={() => setShowCalendar(false)}
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
                      onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, companyVision: e.target.value })}
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
              {formData.socialLinks.map((link, index) => (
                <SocialLinkWrapper key={index}>
                  <StyledLabel>Social Link {index + 1}</StyledLabel>
                  <SocialLinkRow>
                    <Select value={link.platform} onValueChange={(value) => updateSocialLink(index, "platform", value)}>
                      {socialPlatforms.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span>{platform.icon}</span>
                            <span>{platform.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </Select>
                    <SocialLinkInputGroup>
                      <StyledInput
                        placeholder="Profile link/url..."
                        value={link.url}
                        onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <StyledButton
                        $variant="ghost"
                        $size="icon"
                        onClick={() => removeSocialLink(index)}
                        style={{ flexShrink: 0 }}
                      >
                        <X className="w-4 h-4" />
                      </StyledButton>
                    </SocialLinkInputGroup>
                  </SocialLinkRow>
                </SocialLinkWrapper>
              ))}

              <StyledButton
                $variant="outline"
                onClick={addSocialLink}
                style={{ width: "100%", padding: "1.5rem 0", borderStyle: "dashed" }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Social Link
              </StyledButton>
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
                <StyledLabel>Phone</StyledLabel>
                <PhoneInputWrapper>
                    <Select 
                    value={formData.phoneCountryCode}
                    onValueChange={(value) => setFormData({...formData, phoneCountryCode: value})}
                    >
                    {countries.map(country => (
                        <SelectItem key={country.code} value={country.dialCode}>
                        {country.flag} {country.name} ({country.dialCode})
                        </SelectItem>
                    ))}
                    </Select>
                    <StyledInput
                    placeholder="Phone number..."
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    style={{ flex: 1 }}
                    required
                    />
                </PhoneInputWrapper>
              </FormGroup>

              <FormGroup>
                <StyledLabel>Email</StyledLabel>
                <div style={{ position: "relative" }}>
                  <StyledInput
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <Mail
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
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
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
        <FooterText>© {new Date().getFullYear()} Jobpilot - Job Board. All rights Reserved</FooterText>
      </FooterWrapper>
    </MainWrapper>
  )
}