// ==========================================
// SELLER SETTINGS PAGE
// ==========================================
// Purpose: Comprehensive store settings with multiple tabs
// Location: src/pages/seller/Settings.jsx
// Route: /seller/settings
// Tabs: Store Info, Policies, Verification, Notifications
// ==========================================

import React, { useState, useEffect } from 'react';
import {
  Store, FileText, Shield, Bell, Upload, Save, Globe, MapPin,
  Phone, Mail, AlertTriangle, CheckCircle
} from 'lucide-react';
import SellerProfileService from '@/services/SellerProfileService';
import SellerAuthService from '@/services/SellerAuthService';

export default function SellerSettings() {
  const [activeTab, setActiveTab] = useState('store');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const tabs = [
    { id: 'store', label: 'Store Info', icon: Store },
    { id: 'policies', label: 'Policies', icon: FileText },
    { id: 'verification', label: 'Verification', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-[#374151]">Store Settings</h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">Manage your store configuration and preferences</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-700">{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 p-1.5 md:p-2 overflow-x-auto">
        <div className="flex gap-1 md:gap-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 md:px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 md:gap-2 whitespace-nowrap text-sm md:text-base ${
                  activeTab === tab.id
                    ? 'bg-[#FF9900] text-white'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 p-4 md:p-6">
        {activeTab === 'store' && <StoreInfoTab setError={setError} setSuccess={setSuccess} />}
        {activeTab === 'policies' && <PoliciesTab setError={setError} setSuccess={setSuccess} />}
        {activeTab === 'verification' && <VerificationTab setError={setError} setSuccess={setSuccess} />}
        {activeTab === 'notifications' && <NotificationsTab setError={setError} setSuccess={setSuccess} />}
      </div>
    </div>
  );
}

// ==========================================
// STORE INFO TAB
// ==========================================
function StoreInfoTab({ setError, setSuccess }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [formData, setFormData] = useState({
    store_name: '',
    store_description: '',
    business_type: '',
    website: '',
    phone: '',
    business_email: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Bangladesh',       
    logo_url: '',      
    banner_url: ''
  });

  useEffect(() => {
    loadStoreInfo();
  }, []);

  const loadStoreInfo = async () => {
    setIsLoadingProfile(true);
    
    try {
      const response = await SellerProfileService.getFullProfile();
      
      if (response.success) {
        const profile = response.data.data || response.data;
        
        setFormData({
          store_name: profile.store_name || '',
          store_description: profile.store_description || '',
          business_type: profile.business_type || '',
          website: profile.website || '',
          phone: profile.phone || '',
          business_email: profile.business_email || '',
          address: profile.address || '',
          city: profile.city || '',
          state: profile.state || '',
          postal_code: profile.postal_code || '',
          country: profile.country || 'Bangladesh',
          logo_url: profile.store_logo || '',
          banner_url: profile.store_banner || ''
        });
      }
    } catch (err) {
      setError('Failed to load store information');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      const response = await SellerProfileService.completeProfile({
        business_email: formData.business_email,
        phone: formData.phone,
        store_description: formData.store_description,
        business_type: formData.business_type,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postal_code: formData.postal_code
      });
      
      if (response.success) {
        setSuccess('Store information updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to update store information');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Logo size must be less than 2MB');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('logo', file);

    setIsSaving(true);
    
    try {
      const response = await SellerProfileService.updateBranding(uploadFormData);
      
      if (response.success) {
        const logoUrl = response.data?.data?.logo_url || response.data?.data?.store_logo;
        if (logoUrl) {
          setFormData(prev => ({ ...prev, logo_url: logoUrl }));
        }
        setSuccess('Store logo updated!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to upload logo');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Banner size must be less than 5MB');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('banner', file);

    setIsSaving(true);
    
    try {
      const response = await SellerProfileService.updateBranding(uploadFormData);
      
      if (response.success) {
        const bannerUrl = response.data?.data?.banner_url || response.data?.data?.store_banner;
        if (bannerUrl) {
          setFormData(prev => ({ ...prev, banner_url: bannerUrl }));
        }
        setSuccess('Store banner updated!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to upload banner');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-[#FF9900] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      {/* Logo Upload */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
      <div className="w-20 h-20 md:w-24 md:h-24 bg-[#FF9900] rounded-lg md:rounded-xl flex items-center justify-center text-white text-xl md:text-2xl font-semibold overflow-hidden flex-shrink-0">
        {formData.logo_url ? (
          <img src={formData.logo_url} alt="Store Logo" className="w-full h-full object-cover" />
        ) : (
          formData.store_name?.substring(0, 2).toUpperCase() || 'TS'
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer text-sm md:text-base">
          <Upload className="w-4 h-4" />
          <span>Upload Logo</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleLogoUpload}
            className="hidden"
            disabled={isSaving}
          />
        </label>
        <p className="text-xs md:text-sm text-gray-500">PNG or JPG (max. 2MB)</p>
      </div>
    </div>

    {/* Banner Upload */}
    <div>
      {formData.banner_url && (
        <img
          src={formData.banner_url}
          alt="Store Banner"
          className="w-full h-40 object-cover rounded-xl mb-4"
        />
      )}
      <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#FF9900] transition-colors cursor-pointer block">
        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 mb-2">Click to upload banner image</p>
        <p className="text-sm text-gray-500">Recommended: 1200x300px (max. 5MB)</p>
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleBannerUpload}
          className="hidden"
          disabled={isSaving}
        />
      </label>
    </div>


      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-2">Store Description *</label>
        <textarea
          name="store_description"
          value={formData.store_description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] resize-none"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.store_description.length}/500 characters
        </p>
      </div>

      {/* Business Type */}
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-2">Business Type *</label>
        <select
          name="business_type"
          value={formData.business_type}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
          required
        >
          <option value="">Select Business Type</option>
          <option value="individual">Individual Seller</option>
          <option value="nursery">Plant Nursery</option>
          <option value="company">Registered Company</option>
        </select>
      </div>

      {/* Contact Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">Phone *</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
              placeholder="+8801712345678"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">Business Email *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              name="business_email"
              value={formData.business_email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
              placeholder="business@store.com"
              required
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-2">Address *</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={2}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] resize-none"
            placeholder="Street address"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
            placeholder="Dhaka"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">State/Division *</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
            placeholder="Dhaka Division"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">Postal Code *</label>
          <input
            type="text"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
            placeholder="1200"
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// ==========================================
// POLICIES TAB
// ==========================================
function PoliciesTab({ setError, setSuccess }) {
  const [isSaving, setIsSaving] = useState(false);
  const [policies, setPolicies] = useState({
    return_policy: '',
    shipping_policy: '',
    faq: ''
  });

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      const response = await SellerProfileService.getFullProfile();
      
      if (response.success && response.data.policies) {
        setPolicies(response.data.policies);
      }
    } catch (err) {
      // Use default values
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPolicies(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      const response = await SellerProfileService.updatePolicies(policies);
      
      if (response.success) {
        setSuccess('Store policies updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to update policies');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-2">Return Policy</label>
        <textarea
          name="return_policy"
          value={policies.return_policy}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] resize-none"
          placeholder="Describe your return policy..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#374151] mb-2">Shipping Policy</label>
        <textarea
          name="shipping_policy"
          value={policies.shipping_policy}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] resize-none"
          placeholder="Describe your shipping policy..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#374151] mb-2">FAQ</label>
        <textarea
          name="faq"
          value={policies.faq}
          onChange={handleChange}
          rows={6}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] resize-none"
          placeholder="Add frequently asked questions..."
        />
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Policies
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// ==========================================
// VERIFICATION TAB
// ==========================================
function VerificationTab({ setError, setSuccess }) {
  const [verificationStatus, setVerificationStatus] = useState({
    identity: 'not-submitted',
    tax: 'not-submitted',
    bank: 'not-submitted'
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadVerificationStatus();
  }, []);

  const loadVerificationStatus = async () => {
    try {
      const response = await SellerProfileService.getVerificationStatus();
      
      if (response.success) {
        setVerificationStatus(response.data);
      }
    } catch (err) {
      // Use default values
    }
  };

  const handleDocumentUpload = async (documentType, file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Document size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('document_type', documentType);
    formData.append('document', file);

    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      const response = await SellerProfileService.uploadVerificationDocument(formData);
      
      if (response.success) {
        setSuccess(`${documentType} document uploaded successfully!`);
        setTimeout(() => setSuccess(''), 3000);
        loadVerificationStatus();
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'verified': { bg: 'bg-green-100', text: 'text-green-700', label: 'Verified' },
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending Review' },
      'rejected': { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
      'not-submitted': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Not Submitted' }
    };

    const config = statusConfig[status] || statusConfig['not-submitted'];
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Identity Verification */}
      <div className="border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              verificationStatus.identity === 'verified' ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <Shield className={`w-6 h-6 ${
                verificationStatus.identity === 'verified' ? 'text-green-600' : 'text-gray-600'
              }`} />
            </div>
            <div>
              <h3 className="font-medium text-[#374151]">Identity Verification</h3>
              <p className="text-sm text-gray-500">Government-issued ID</p>
            </div>
          </div>
          {getStatusBadge(verificationStatus.identity)}
        </div>
        {verificationStatus.identity !== 'verified' && (
          <label className="px-4 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors flex items-center gap-2 w-fit cursor-pointer">
            <Upload className="w-4 h-4" />
            {isUploading ? 'Uploading...' : 'Upload ID'}
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => handleDocumentUpload('identity', e.target.files?.[0])}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        )}
      </div>

      {/* Tax Document */}
      <div className="border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              verificationStatus.tax === 'verified' ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <FileText className={`w-6 h-6 ${
                verificationStatus.tax === 'verified' ? 'text-green-600' : 'text-gray-600'
              }`} />
            </div>
            <div>
              <h3 className="font-medium text-[#374151]">Tax Document</h3>
              <p className="text-sm text-gray-500">Business tax registration</p>
            </div>
          </div>
          {getStatusBadge(verificationStatus.tax)}
        </div>
        {verificationStatus.tax !== 'verified' && (
          <label className="px-4 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors flex items-center gap-2 w-fit cursor-pointer">
            <Upload className="w-4 h-4" />
            {isUploading ? 'Uploading...' : 'Upload Document'}
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => handleDocumentUpload('tax', e.target.files?.[0])}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        )}
      </div>

      {/* Bank Details */}
      <div className="border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium text-[#374151]">Bank Account Details</h3>
              <p className="text-sm text-gray-500">For receiving payouts</p>
            </div>
          </div>
          {getStatusBadge(verificationStatus.bank)}
        </div>
        {verificationStatus.bank !== 'verified' && (
          <button
            onClick={() => window.location.href = '/seller/add-payment'}
            className="px-4 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors"
          >
            Add Bank Details
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// NOTIFICATIONS TAB
// ==========================================
function NotificationsTab({ setError, setSuccess }) {
  const [notifications, setNotifications] = useState({
    order_email: true,
    order_sms: false,
    order_push: true,
    message_email: true,
    message_sms: false,
    message_push: true,
    marketing_email: false,
    marketing_sms: false,
    marketing_push: false
  });

  useEffect(() => {
    loadNotificationPreferences();
  }, []);

  const loadNotificationPreferences = async () => {
    try {
      const response = await SellerProfileService.getNotificationPreferences();
      
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (err) {
      // Use default values
    }
  };

  const handleToggle = async (key) => {
    const newNotifications = { ...notifications, [key]: !notifications[key] };
    setNotifications(newNotifications);

    try {
      const response = await SellerProfileService.updateNotificationPreferences(newNotifications);
      
      if (response.success) {
        setSuccess('Notification preferences updated!');
        setTimeout(() => setSuccess(''), 2000);
      } else {
        // Revert on error
        setNotifications(notifications);
        setError(response.error);
      }
    } catch (err) {
      // Revert on error
      setNotifications(notifications);
      setError('Failed to update preferences');
    }
  };

  const NotificationRow = ({ title, description, emailKey, smsKey, pushKey }) => (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="mb-3">
        <h4 className="font-medium text-[#374151]">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={notifications[emailKey]}
            onChange={() => handleToggle(emailKey)}
            className="w-4 h-4 text-[#FF9900] border-gray-300 rounded focus:ring-[#FF9900]"
          />
          <span className="text-sm text-gray-700">Email</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={notifications[smsKey]}
            onChange={() => handleToggle(smsKey)}
            className="w-4 h-4 text-[#FF9900] border-gray-300 rounded focus:ring-[#FF9900]"
          />
          <span className="text-sm text-gray-700">SMS</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={notifications[pushKey]}
            onChange={() => handleToggle(pushKey)}
            className="w-4 h-4 text-[#FF9900] border-gray-300 rounded focus:ring-[#FF9900]"
          />
          <span className="text-sm text-gray-700">Push</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-[#374151] mb-2">Manage Notifications</h3>
        <p className="text-sm text-gray-500">Choose how you want to receive updates</p>
      </div>

      <div className="space-y-0">
        <NotificationRow
          title="Order Notifications"
          description="Get notified about new orders and order updates"
          emailKey="order_email"
          smsKey="order_sms"
          pushKey="order_push"
        />
        <NotificationRow
          title="Message Notifications"
          description="Receive alerts when buyers send you messages"
          emailKey="message_email"
          smsKey="message_sms"
          pushKey="message_push"
        />
        <NotificationRow
          title="Marketing & Promotions"
          description="Updates about new features and special offers"
          emailKey="marketing_email"
          smsKey="marketing_sms"
          pushKey="marketing_push"
        />
      </div>
    </div>
  );
}