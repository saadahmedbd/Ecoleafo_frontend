

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useRegisterSellerMutation,
  useCompleteSellerProfileMutation,
  useAddSellerPaymentMethodMutation,
} from '@/features/auth/sellerAuthApi';
import { useAppDispatch } from '@/app/hooks';
import { setCredentials } from '@/features/auth/authSlice';
import {
  validateSellerRegistration,
  validateSellerProfile,
  validatePaymentMethod,
} from '@/utils/validation';

/**
 * Custom Hook for Multi-Step Seller Registration
 * Manages the complete seller onboarding flow
 * 
 * Flow:
 * 1. Register Account (creates seller in database)
 * 2. Complete Profile (adds business information)
 * 3. Add Payment Method (sets up payment)
 * 4. Navigate to Dashboard
 * 
 * Features:
 * - Multi-step validation
 * - API integration
 * - State persistence
 * - Error handling
 * - Progress tracking
 * 
 * @returns {Object} Registration state and methods
 */
export const useSellerRegistration = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // API mutations
  const [registerSeller, { isLoading: isRegistering }] = useRegisterSellerMutation();
  const [completeProfile, { isLoading: isCompletingProfile }] = useCompleteSellerProfileMutation();
  const [addPayment, { isLoading: isAddingPayment }] = useAddSellerPaymentMethodMutation();
  
  // Registration state
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [registrationToken, setRegistrationToken] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Account
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    storeName: '',
    agreeToTerms: false,
    
    // Step 2: Store Info
    storeDescription: '',
    businessType: '',
    businessEmail: '',
    
    // Step 3: Business Details
    address: '',
    city: '',
    state: '',
    country: 'Bangladesh',
    postalCode: '',
    taxNumber: '',
    businessLicense: '',
    
    // Step 4: Payment
    paymentType: '',
    accountName: '',
    accountNumber: '',
    bankName: '',
    bankCode: '',
    routingNumber: '',
  });
  
  /**
   * Load saved registration data from sessionStorage
   */
  useEffect(() => {
    const saved = sessionStorage.getItem('seller_registration_data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setFormData(data.formData || formData);
        setCurrentStep(data.currentStep || 1);
        setRegistrationToken(data.token || null);
      } catch (err) {
        console.error('Error loading saved registration:', err);
      }
    }
  }, []);
  
  /**
   * Save registration data to sessionStorage
   */
  useEffect(() => {
    if (currentStep > 1 || registrationToken) {
      sessionStorage.setItem('seller_registration_data', JSON.stringify({
        formData,
        currentStep,
        token: registrationToken,
      }));
    }
  }, [formData, currentStep, registrationToken]);
  
  /**
   * Update form field
   */
  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  }, [error]);
  
  /**
   * Validate current step
   */
  const validateCurrentStep = useCallback(() => {
    setError('');
    
    let validation;
    switch (currentStep) {
      case 1:
        validation = validateSellerRegistration(formData);
        break;
      case 2:
      case 3:
        validation = validateSellerProfile(formData);
        break;
      case 4:
        validation = validatePaymentMethod(formData);
        break;
      default:
        return true;
    }
    
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setError(firstError);
      return false;
    }
    
    return true;
  }, [currentStep, formData]);
  
  /**
   * Step 1: Register Seller Account
   */
  const registerAccount = useCallback(async () => {
    if (!validateCurrentStep()) return false;
    
    try {
      const result = await registerSeller({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        storeName: formData.storeName.trim(),
        phone: formData.phone.trim(),
        agreeToTerms: formData.agreeToTerms,
      }).unwrap();
      
      // Save token and credentials
      setRegistrationToken(result.token);
      dispatch(setCredentials(result));
      
      return true;
    } catch (err) {
      const errorMessage = err?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return false;
    }
  }, [formData, validateCurrentStep, registerSeller, dispatch]);
  
  /**
   * Step 2 & 3: Complete Profile
   */
  const completeSellerProfile = useCallback(async () => {
    if (!validateCurrentStep()) return false;
    if (!registrationToken) {
      setError('Registration session expired. Please start over.');
      return false;
    }
    
    try {
      await completeProfile({
        businessEmail: formData.businessEmail || formData.email,
        phone: formData.phone,
        storeDescription: formData.storeDescription,
        businessType: formData.businessType,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postalCode: formData.postalCode,
      }).unwrap();
      
      return true;
    } catch (err) {
      const errorMessage = err?.message || 'Failed to complete profile. Please try again.';
      setError(errorMessage);
      return false;
    }
  }, [formData, registrationToken, validateCurrentStep, completeProfile]);
  
  /**
   * Step 4: Add Payment Method
   */
  const addPaymentMethod = useCallback(async () => {
    if (!validateCurrentStep()) return false;
    if (!registrationToken) {
      setError('Registration session expired. Please start over.');
      return false;
    }
    
    try {
      await addPayment({
        type: formData.paymentType,
        accountName: formData.accountName,
        accountNumber: formData.accountNumber,
        bankName: formData.bankName || '',
        bankCode: formData.bankCode || '',
        routingNumber: formData.routingNumber || '',
        isDefault: true,
      }).unwrap();
      
      return true;
    } catch (err) {
      const errorMessage = err?.message || 'Failed to add payment method. Please try again.';
      setError(errorMessage);
      return false;
    }
  }, [formData, registrationToken, validateCurrentStep, addPayment]);
  
  /**
   * Go to next step
   */
  const goToNextStep = useCallback(async () => {
    let success = false;
    
    // Execute appropriate API call based on step
    switch (currentStep) {
      case 1:
        success = await registerAccount();
        break;
      case 2:
      case 3:
        if (currentStep === 3) {
          success = await completeSellerProfile();
        } else {
          // Just validate and move to step 3
          success = validateCurrentStep();
        }
        break;
      case 4:
        success = await addPaymentMethod();
        break;
      default:
        success = true;
    }
    
    if (success) {
      if (currentStep === 4) {
        // Registration complete
        sessionStorage.removeItem('seller_registration_data');
        navigate('/seller/dashboard');
      } else {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, registerAccount, completeSellerProfile, addPaymentMethod, validateCurrentStep, navigate]);
  
  /**
   * Go to previous step
   */
  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setError('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);
  
  /**
   * Reset registration
   */
  const resetRegistration = useCallback(() => {
    sessionStorage.removeItem('seller_registration_data');
    setFormData({
      email: '', password: '', confirmPassword: '', firstName: '', lastName: '',
      phone: '', storeName: '', agreeToTerms: false, storeDescription: '',
      businessType: '', businessEmail: '', address: '', city: '', state: '',
      country: 'Bangladesh', postalCode: '', taxNumber: '', businessLicense: '',
      paymentType: '', accountName: '', accountNumber: '', bankName: '',
      bankCode: '', routingNumber: '',
    });
    setCurrentStep(1);
    setError('');
    setRegistrationToken(null);
  }, []);
  
  // Determine loading state
  const isLoading = isRegistering || isCompletingProfile || isAddingPayment;
  
  return {
    // State
    currentStep,
    formData,
    error,
    isLoading,
    registrationToken,
    
    // Methods
    updateField,
    goToNextStep,
    goToPreviousStep,
    resetRegistration,
    
    // Validation
    validateCurrentStep,
    
    // Progress
    totalSteps: 4,
    progress: (currentStep / 4) * 100,
  };
};