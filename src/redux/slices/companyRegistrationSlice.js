import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentStep: 1,
  formData: {
    // Step 1 - Company Info
    companyName: "",
    aboutUs: "",
    logoUrl: null,
    bannerUrl: null,
    logoPreview: null,
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
        { platform: 'linkedin', url: '' },
        { platform: 'facebook', url: '' },
        { platform: 'twitter', url: '' },
        { platform: 'instagram', url: '' },
        { platform: 'youtube', url: '' },
        { platform: 'github', url: '' },
        { platform: 'glassdoor', url: '' },
        { platform: 'crunchbase', url: '' }
    ],
    careersLink: '',

    // Step 4 - Contact
    mapLocation: "",
    phoneCountry: 'US',
    phoneCountryCode: '+1',
    phoneNumber: '',
    email: "",
    password: "",
    confirmPassword: "" // Added for password confirmation
  },
  uploading: false,
  showCalendar: false,
  formErrors: {} // Added for form validation
};

export const companyRegistrationSlice = createSlice({
  name: 'companyRegistration',
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
      // Clear errors when updating form data
      state.formErrors = {};
    },
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
      // Clear error for this field when updated
      if (state.formErrors[field]) {
        delete state.formErrors[field];
      }
    },
    setUploading: (state, action) => {
      state.uploading = action.payload;
    },
    setShowCalendar: (state, action) => {
      state.showCalendar = action.payload;
    },
    addSocialLink: (state) => {
      state.formData.socialLinks.push({ platform: "facebook", url: "" });
    },
    removeSocialLink: (state, action) => {
      state.formData.socialLinks = state.formData.socialLinks.filter(
        (_, i) => i !== action.payload
      );
    },
    updateSocialLink: (state, action) => {
      const { index, field, value } = action.payload;
      state.formData.socialLinks[index][field] = value;
    },
    removeFile: (state, action) => {
      const { field } = action.payload;
      state.formData[field] = null;
      state.formData[`${field}Url`] = null;
      state.formData[`${field}Preview`] = null;
    },
    // Added for form validation
    setFormErrors: (state, action) => {
      state.formErrors = action.payload;
    },
    resetForm: () => initialState,
  },
});

export const {
  setCurrentStep,
  updateFormData,
  updateField,
  setUploading,
  setShowCalendar,
  addSocialLink,
  removeSocialLink,
  updateSocialLink,
  removeFile,
  setFormErrors,
  resetForm,
} = companyRegistrationSlice.actions;

export default companyRegistrationSlice.reducer;