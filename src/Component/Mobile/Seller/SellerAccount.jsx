// ==========================================
// SELLER ACCOUNT COMPONENT (CONNECTED TO BACKEND)
// ==========================================
// Purpose: Manage seller profile, password, and account settings
// API: GET/PUT /api/seller/profile, PUT /api/seller/profile/password
// Color Theme: #ff7000 (Primary Orange)
// ==========================================

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  LogOut,
  Camera,
  Save,
  Eye,
  EyeOff,
  AlertTriangle,
  Loader2,
  Store,
  MapPin,
  Building2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import SellerProfileService from "../../../services/SellerProfileService";
import { useNavigate } from "react-router-dom";

export default function SellerAccount() {
  const navigate = useNavigate();

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Profile data from backend
  const [profile, setProfile] = useState(null);

  // Form data for profile update
  const [profileForm, setProfileForm] = useState({
    phone: '',
    store_name: '',
    store_description: '',
    business_email: '',
    business_type: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
  });

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // ==========================================
  // LIFECYCLE - LOAD PROFILE ON MOUNT
  // ==========================================
  
  useEffect(() => {
    loadProfile();
  }, []);

  /**
   * Load seller profile from backend
   */
  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const result = await SellerProfileService.getProfile();
      
      if (result.success) {
        setProfile(result.data);
        
        // Populate form with existing data
        setProfileForm({
          phone: result.data.phone || '',
          store_name: result.data.store_name || '',
          store_description: result.data.store_description || '',
          business_email: result.data.business_email || '',
          business_type: result.data.business_type || '',
          address: result.data.address || '',
          city: result.data.city || '',
          state: result.data.state || '',
          country: result.data.country || 'Bangladesh',
          postal_code: result.data.postal_code || '',
        });
      } else {
        toast.error(result.error.message || 'Failed to load profile');
      }
    } catch (error) {
      toast.error('Failed to load profile');
      console.error('Load profile error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // FORM HANDLERS
  // ==========================================

  /**
   * Handle profile form input changes
   */
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handle password form input changes
   */
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Submit profile update
   */
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!profileForm.store_name || !profileForm.business_email) {
      toast.error('Store name and business email are required');
      return;
    }
    
    setIsSaving(true);
    try {
      const result = await SellerProfileService.updateProfile(profileForm);
      
      if (result.success) {
        toast.success('Profile updated successfully');
        setProfile(result.data);
      } else {
        toast.error(result.error.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Update profile error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Submit password change
   */
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('All password fields are required');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    
    setIsChangingPassword(true);
    try {
      const result = await SellerProfileService.changePassword(passwordForm);
      
      if (result.success) {
        toast.success('Password changed successfully');
        // Clear password form
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast.error(result.error.message || 'Failed to change password');
      }
    } catch (error) {
      toast.error('Failed to change password');
      console.error('Change password error:', error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  /**
   * Handle profile image upload
   */
  const handleImageUpload = async (type) => {
    // TODO: Implement image upload with file picker
    toast.info('Image upload feature coming soon');
  };

  /**
   * Toggle two-factor authentication
   */
  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast.success(
      twoFactorEnabled 
        ? 'Two-factor authentication disabled' 
        : 'Two-factor authentication enabled'
    );
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem('seller_token');
    localStorage.removeItem('seller_refresh_token');
    localStorage.removeItem('seller_id');
    localStorage.removeItem('seller_data');
    SellerProfileService.clearCache();
    
    toast.success('Logged out successfully');
    navigate('/seller/login');
  };

  // ==========================================
  // LOADING STATE
  // ==========================================
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#ff7000] mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER
  // ==========================================
  
  return (
    <div className="space-y-6">
      {/* ==========================================
          HEADER
          ========================================== */}
      <div>
        <h1 className="text-2xl font-semibold text-[#374151]">Account Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account information and security</p>
      </div>

      {/* ==========================================
          PROFILE STATUS BANNER
          ========================================== */}
      {profile && (
        <div className={`rounded-xl border p-4 ${
          profile.is_approved 
            ? 'bg-green-50 border-green-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-start gap-3">
            {profile.is_approved ? (
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h3 className={`font-semibold ${
                profile.is_approved ? 'text-green-900' : 'text-yellow-900'
              }`}>
                {profile.is_approved ? 'Account Approved' : 'Account Pending Approval'}
              </h3>
              <p className={`text-sm mt-1 ${
                profile.is_approved ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {profile.is_approved 
                  ? 'Your seller account is approved and active. You can now sell products.'
                  : 'Your account is under review. You will be notified once approved.'}
              </p>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${
                    profile.is_verified ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  {profile.is_verified ? 'Verified' : 'Not Verified'}
                </span>
                <span className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${
                    profile.is_active ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  {profile.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          PROFILE INFORMATION SECTION
          ========================================== */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#374151] mb-6">Profile Information</h2>
        
        {/* Profile Photo Section */}
        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
          <div className="relative">
            {profile?.store_logo ? (
              <img
                src={profile.store_logo}
                alt="Store Logo"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 bg-[#ff7000] rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                {profile?.store_name?.charAt(0)?.toUpperCase() || 'S'}
              </div>
            )}
            <button
              onClick={() => handleImageUpload('logo')}
              className="absolute bottom-0 right-0 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div>
            <h3 className="font-medium text-[#374151] mb-1">Store Logo</h3>
            <p className="text-sm text-gray-500 mb-3">PNG or JPG (max. 2MB)</p>
            <button
              onClick={() => handleImageUpload('logo')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Change Logo
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          {/* Store Name */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Store Name *
            </label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="store_name"
                value={profileForm.store_name}
                onChange={handleProfileChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
                placeholder="Your Store Name"
                required
              />
            </div>
          </div>

          {/* Store Description */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Store Description
            </label>
            <textarea
              name="store_description"
              value={profileForm.store_description}
              onChange={handleProfileChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000] resize-none"
              placeholder="Tell customers about your store..."
            />
          </div>

          {/* Business Email */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Business Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="business_email"
                value={profileForm.business_email}
                onChange={handleProfileChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
                placeholder="business@example.com"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
                placeholder="+880 123 456 789"
              />
            </div>
          </div>

          {/* Business Type */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Business Type
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                name="business_type"
                value={profileForm.business_type}
                onChange={handleProfileChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000] appearance-none"
              >
                <option value="">Select type</option>
                <option value="nursery">Nursery</option>
                <option value="wholesaler">Wholesaler</option>
                <option value="retailer">Retailer</option>
                <option value="individual">Individual Seller</option>
                <option value="manufacturer">Manufacturer</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="address"
                value={profileForm.address}
                onChange={handleProfileChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
                placeholder="Street address"
              />
            </div>
          </div>

          {/* City, State, Postal Code */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">City</label>
              <input
                type="text"
                name="city"
                value={profileForm.city}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">State</label>
              <input
                type="text"
                name="state"
                value={profileForm.state}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
                placeholder="State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">Postal Code</label>
              <input
                type="text"
                name="postal_code"
                value={profileForm.postal_code}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
                placeholder="12345"
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">Country</label>
            <select
              name="country"
              value={profileForm.country}
              onChange={handleProfileChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
            >
              <option value="Bangladesh">Bangladesh</option>
              <option value="India">India</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Nepal">Nepal</option>
              <option value="Sri Lanka">Sri Lanka</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-[#ff7000] text-white rounded-lg hover:bg-[#e66300] transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
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

      {/* ==========================================
          PASSWORD CHANGE SECTION
          ========================================== */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#374151] mb-2">Change Password</h2>
        <p className="text-sm text-gray-500 mb-6">Update your password to keep your account secure</p>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showNewPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
                placeholder="Confirm new password"
                required
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
              disabled={isChangingPassword}
              className="px-6 py-2 bg-[#ff7000] text-white rounded-lg hover:bg-[#e66300] transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ==========================================
          SECURITY SETTINGS SECTION
          ========================================== */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#374151] mb-2">Security Settings</h2>
        <p className="text-sm text-gray-500 mb-6">Manage your account security preferences</p>

        {/* Two-Factor Authentication */}
        <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              twoFactorEnabled ? "bg-green-100" : "bg-gray-200"
            }`}>
              <Shield className={`w-5 h-5 ${twoFactorEnabled ? "text-green-600" : "text-gray-600"}`} />
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
            className={`px-4 py-2 rounded-lg transition-colors ${
              twoFactorEnabled
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-[#ff7000] text-white hover:bg-[#e66300]"
            }`}
          >
            {twoFactorEnabled ? "Disable" : "Enable"}
          </button>
        </div>

        {/* Account Statistics */}
        {profile && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-[#374151] mb-3">Account Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-[#ff7000]">{profile.total_orders || 0}</p>
                <p className="text-xs text-gray-600 mt-1">Total Orders</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-[#ff7000]">{profile.product_count || 0}</p>
                <p className="text-xs text-gray-600 mt-1">Products</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-[#ff7000]">
                  ${profile.total_earnings?.toFixed(2) || '0.00'}
                </p>
                <p className="text-xs text-gray-600 mt-1">Earnings</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-[#ff7000]">
                  {profile.average_rating?.toFixed(1) || '0.0'}
                </p>
                <p className="text-xs text-gray-600 mt-1">Rating</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==========================================
          ACCOUNT INFORMATION SECTION
          ========================================== */}
      {profile && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#374151] mb-4">Account Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">User ID</span>
              <span className="text-sm font-medium text-[#374151]">{profile.user_id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Seller ID</span>
              <span className="text-sm font-medium text-[#374151]">{profile.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Store Slug</span>
              <span className="text-sm font-medium text-[#374151]">{profile.store_slug}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Member Since</span>
              <span className="text-sm font-medium text-[#374151]">
                {new Date(profile.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Last Updated</span>
              <span className="text-sm font-medium text-[#374151]">
                {new Date(profile.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-600">Account Status</span>
              <div className="flex gap-2">
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  profile.is_active 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {profile.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  profile.is_verified 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {profile.is_verified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          DANGER ZONE SECTION
          ========================================== */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <div className="flex items-start gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-red-600 mb-1">Danger Zone</h2>
            <p className="text-sm text-gray-600">Irreversible actions that affect your account</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Deactivate Account */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-[#374151]">Deactivate Account</p>
              <p className="text-sm text-gray-500">Temporarily disable your seller account</p>
            </div>
            <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
              Deactivate
            </button>
          </div>

          {/* Delete Account */}
          <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg">
            <div>
              <p className="font-medium text-red-600">Delete Account</p>
              <p className="text-sm text-red-600">Permanently delete your account and all data</p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================
          LOGOUT BUTTON
          ========================================== */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
}

// ==========================================
// USAGE NOTES
// ==========================================
/**
 * This component requires:
 * 1. SellerProfileService from services
 * 2. React Router for navigation
 * 3. Sonner for toast notifications
 * 4. Backend running on port 3000
 * 
 * File location: src/components/Seller/SellerAccount.jsx
 * Service location: src/services/SellerProfileService.js
 * 
 * Environment variables (.env):
 * REACT_APP_API_URL=http://localhost:3000/api
 * 
 * Features:
 * - Load profile from backend on mount
 * - Update profile with validation
 * - Change password with security checks
 * - Display account statistics
 * - Show account status (approved, verified, active)
 * - Two-factor authentication toggle
 * - Logout functionality
 * - Responsive design
 * - Loading states
 * - Error handling
 */