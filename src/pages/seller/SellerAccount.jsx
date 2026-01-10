


// ==========================================
// SELLER ACCOUNT PAGE
// ==========================================
// Purpose: Manage seller account information and security settings
// Location: src/pages/seller/Account.jsx
// Route: /seller/account
// ==========================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Lock, Shield, LogOut, Camera, Save,
  Eye, EyeOff, AlertTriangle, CheckCircle
} from 'lucide-react';
import SellerProfileService from '@/services/SellerProfileService';
import SellerAuthService from '@/services/sellerAuthService';

export default function SellerAccount() {
  const navigate = useNavigate();

  // State management
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loginActivity, setLoginActivity] = useState([]);

  // Form data
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    profile_photo: '',
    commission: ''
  });

  // Password change data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // ==========================================
  // LOAD PROFILE DATA
  // ==========================================
  useEffect(() => {
    loadProfileData();
    loadLoginActivity();
  }, []);

  const loadProfileData = async () => {
    setIsLoading(true);
    
    try {
      const response = await SellerProfileService.getFullProfile();
      
      if (response.success) {
        const profile = response.data.data || response.data;
        const user = profile.reg_user || {};
        
        setFormData({
          first_name: user.first_name || profile.first_name || '',
          last_name: user.last_name || profile.last_name || '',
          email: user.email || profile.email || profile.business_email || '',
          phone: profile.phone || '',
          profile_photo: profile.profile_photo || profile.photo_url || profile.photo || '',
          commission: profile.commission !== undefined ? profile.commission : ''
        });
        setTwoFactorEnabled(profile.two_factor_enabled || false);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadLoginActivity = async () => {
    try {
      const response = await SellerProfileService.getLoginActivity();
      
      if (response.success) {
        setLoginActivity(response.data.activities || []);
      }
    } catch (err) {
      // Silent fail
    }
  };

  // ==========================================
  // FORM HANDLERS
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  /**
   * Update profile information
   */
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      const response = await SellerProfileService.updateAccount({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone
      });

      if (response.success) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Change password
   */
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('All password fields are required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }

    setIsSaving(true);

    try {
      const response = await SellerProfileService.changePassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        confirm_password: passwordData.confirmPassword
      });

      if (response.success) {
        setSuccess('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Toggle 2FA
   */
  const handleToggle2FA = async () => {
    try {
      const response = await SellerProfileService.toggle2FA(!twoFactorEnabled);
      
      if (response.success) {
        setTwoFactorEnabled(!twoFactorEnabled);
        setSuccess(response.message);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to update 2FA settings');
    }
  };

  /**
   * Handle profile photo upload
   */
  // const handlePhotoUpload = async (e) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   // Validate file
  //   if (file.size > 2 * 1024 * 1024) { // 2MB limit
  //     setError('Photo size must be less than 2MB');
  //     return;
  //   }

  //   if (!file.type.match(/^image\/(png|jpg|jpeg)$/)) {
  //     setError('Only PNG and JPG files are allowed');
  //     return;
  //   }

  //   setIsSaving(true);
  //   setError('');

  //   try {
  //     const response = await SellerProfileService.uploadProfilePhoto(file);
      
  //     if (response.success) {
  //       setFormData(prev => ({ ...prev, profile_photo: response.data.photo_url }));
  //       setSuccess('Profile photo updated!');
  //       setTimeout(() => setSuccess(''), 3000);
  //     } else {
  //       setError(response.error);
  //     }
  //   } catch (err) {
  //     setError('Failed to upload photo');
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };
  const handlePhotoUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    setError('Photo must be less than 2MB');
    return;
  }
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    setError('Only PNG and JPG allowed');
    return;
  }

  setIsSaving(true);
  setError('');

  try {
    const token = localStorage.getItem('auth_token');
    const formData = new FormData();
    formData.append('photo', file);

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/seller/account/photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok && (data.status === 'success' || data.success)) {
      const photoUrl = data.data?.photo_url || data.photo_url || data.url;
      setFormData(prev => ({ ...prev, profile_photo: photoUrl }));
      setSuccess('Profile photo updated!');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(data.message || data.error || 'Upload failed');
    }
  } catch (err) {
    setError('Failed to upload photo');
  } finally {
    setIsSaving(false);
  }
}

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await SellerAuthService.logout();
      navigate('/seller/login');
    }
  };

  /**
   * Handle account deactivation
   */
  const handleDeactivate = async () => {
    if (window.confirm('Are you sure you want to deactivate your account? You can reactivate it later.')) {
      setIsSaving(true);
      
      try {
        const response = await SellerProfileService.deactivateAccount();
        
        if (response.success) {
          navigate('/seller/login', {
            state: { message: 'Account deactivated successfully' }
          });
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError('Failed to deactivate account');
      } finally {
        setIsSaving(false);
      }
    }
  };
  

  /**
   * Handle account deletion
   */
  const handleDelete = async () => {
    const password = window.prompt('Enter your password to confirm account deletion:');
    
    if (!password) return;

    if (window.confirm('⚠️ WARNING: This will permanently delete your account and all data. This action cannot be undone!')) {
      setIsSaving(true);
      
      try {
        const response = await SellerProfileService.deleteAccount(password);
        
        if (response.success) {
          navigate('/seller/login', {
            state: { message: 'Account deleted successfully' }
          });
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError('Failed to delete account');
      } finally {
        setIsSaving(false);
      }
    }
  };
  

  // ==========================================
  // RENDER
  // ==========================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF9900] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading account settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[#374151]">Account Settings</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">Manage your account information and security</p>
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

      {/* Profile Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-[#374151] mb-6">Profile Information</h2>
        
        {/* Profile Photo */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 pb-6 border-b border-gray-200">
          <div className="relative">
            {formData.profile_photo ? (
              <img
                src={formData.profile_photo}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-[#FF9900] rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                {formData.first_name?.charAt(0)}{formData.last_name?.charAt(0)}
              </div>
            )}
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
              <Camera className="w-4 h-4 text-gray-600" />
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={isSaving}
              />
            </label>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-medium text-[#374151] mb-1">Profile Photo</h3>
            <p className="text-sm text-gray-500 mb-3">PNG or JPG (max. 2MB)</p>
          </div>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">Last Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                disabled
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">Phone Number</label>
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

          {/* Commission */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">Commission (%)</label>
            <input
              type="text"
              value={formData.commission ? `${formData.commission}%` : 'Not set'}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Commission rate cannot be changed</p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>

      {/* Password Change */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-[#374151] mb-2">Change Password</h2>
        <p className="text-sm text-gray-500 mb-6">Update your password to keep your account secure</p>

        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                placeholder="Enter new password"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-[#374151] mb-2">Password requirements:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• At least 8 characters long</li>
              <li>• Contains uppercase and lowercase letters</li>
              <li>• Includes at least one number</li>
              <li>• Has at least one special character</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-[#374151] mb-2">Security Settings</h2>
        <p className="text-sm text-gray-500 mb-6">Manage your account security preferences</p>

        {/* Two-Factor Authentication */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-4 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              twoFactorEnabled ? 'bg-green-100' : 'bg-gray-200'
            }`}>
              <Shield className={`w-5 h-5 ${twoFactorEnabled ? 'text-green-600' : 'text-gray-600'}`} />
            </div>
            <div>
              <h3 className="font-medium text-[#374151] mb-1">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">
                Add an extra layer of security to your account
              </p>
              {twoFactorEnabled && (
                <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                  Enabled
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleToggle2FA}
            disabled={isSaving}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
              twoFactorEnabled
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-[#FF9900] text-white hover:bg-[#E68A00]'
            }`}
          >
            {twoFactorEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>

        {/* Login Activity */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-[#374151] mb-3">Recent Login Activity</h3>
          <div className="space-y-3">
            {loginActivity.length > 0 ? (
              loginActivity.slice(0, 3).map((activity, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-[#374151]">{activity.device || 'Unknown Device'}</p>
                    <p className="text-xs text-gray-500">
                      {activity.location || 'Unknown Location'} • {activity.time_ago || 'Recently'}
                    </p>
                  </div>
                  {activity.is_current && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      Current
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-red-200 p-4 sm:p-6">
        <div className="flex items-start gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-red-600 mb-1">Danger Zone</h2>
            <p className="text-sm text-gray-600">Irreversible actions that affect your account</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Deactivate Account */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-[#374151]">Deactivate Account</p>
              <p className="text-sm text-gray-500">Temporarily disable your seller account</p>
            </div>
            <button
              onClick={handleDeactivate}
              disabled={isSaving}
              className="w-full sm:w-auto px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              Deactivate
            </button>
          </div>

          {/* Delete Account */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border border-red-200 bg-red-50 rounded-lg">
            <div>
              <p className="font-medium text-red-600">Delete Account</p>
              <p className="text-sm text-red-600">Permanently delete your account and all data</p>
            </div>
            <button
              onClick={handleDelete}
              disabled={isSaving}
              className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <button
          onClick={handleLogout}
          disabled={isSaving}
          className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
}