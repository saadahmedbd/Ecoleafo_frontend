import {
  User,
  MapPin,
  CreditCard,
  Shield,
  Globe,
  Moon,
  LogOut,
  ChevronRight,
  Edit,
  HelpCircle,
  UserPlus,
  LogIn,
  Store,
  Camera,
  Trash2,
  Save,
  X,
  Plus,
  Package,
  Bell,
  Settings as SettingsIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useGetBuyerProfileQuery,
  useUpdateBuyerProfileMutation,
  useUploadProfilePictureMutation,
  useDeleteProfilePictureMutation,
  useChangePasswordMutation,
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetBuyerStatsQuery,
} from "@/features/buyerProfile/buyerProfileApi";
import {
  validateProfileUpdate,
  validateAddress,
  validatePasswordChange,
  validateProfilePicture,
  formatAddress,
} from "@/services/buyerProfileService";
import { logout } from "@/features/auth/authSlice";
import { useLogoutMutation } from "@/features/auth/buyerAuthApi";

export default function AccountPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Check authentication
  const token = localStorage.getItem('auth_token');
  const userDataStr = localStorage.getItem('user_data');
  const userData = userDataStr ? JSON.parse(userDataStr) : {};
  const userRole = userData.role || userData.userType || userData.user_type;
  const isLoggedIn = !!token && userRole === 'buyer';

  // RTK Query hooks
  const { data: profileData, isLoading: profileLoading, refetch: refetchProfile } = useGetBuyerProfileQuery(undefined, { skip: !isLoggedIn });
  const { data: addressesData } = useGetAddressesQuery(undefined, { skip: !isLoggedIn });
  const { data: statsData } = useGetBuyerStatsQuery(undefined, { skip: !isLoggedIn });
  const [updateProfile] = useUpdateBuyerProfileMutation();
  const [uploadPicture] = useUploadProfilePictureMutation();
  const [deletePicture] = useDeleteProfilePictureMutation();
  const [changePassword] = useChangePasswordMutation();
  const [createAddress] = useCreateAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [logoutApi] = useLogoutMutation();

  // Local state
  const [expandedSection, setExpandedSection] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
    gender: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [addressForm, setAddressForm] = useState({
    address_type: 'home',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Bangladesh',
    is_default: false,
  });

  // Error states
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Load profile data into form
  useEffect(() => {
    if (profileData?.data) {
      setProfileForm({
        first_name: profileData.data.reg_user?.first_name || '',
        last_name: profileData.data.reg_user?.last_name || '',
        phone: profileData.data.phone || '',
        date_of_birth: profileData.data.date_of_birth || '',
        gender: profileData.data.gender || '',
      });
    }
  }, [profileData]);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (error) {
      // Ignore API errors - logout locally anyway
    }
    dispatch(logout());
    navigate('/buyer/account');
  };

  // Profile picture upload
  const handlePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validationErrors = validateProfilePicture(file);
    if (validationErrors.length > 0) {
      setErrors({ photo: validationErrors[0] });
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);

    try {
      await uploadPicture(formData).unwrap();
      refetchProfile(); // Refetch profile data to update the picture display
      setSuccessMessage('Profile picture updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ photo: error.data?.error || 'Failed to upload picture' });
    }
  };

  const handleDeletePicture = async () => {
    try {
      await deletePicture().unwrap();
      setSuccessMessage('Profile picture deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ photo: error.data?.error || 'Failed to delete picture' });
    }
  };

  // Profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const validationErrors = validateProfileUpdate(profileForm);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await updateProfile(profileForm).unwrap();
      setSuccessMessage('Profile updated successfully');
      setIsEditingProfile(false);
      setErrors({});
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ submit: error.data?.error || 'Failed to update profile' });
    }
  };

  // Password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const validationErrors = validatePasswordChange(passwordForm);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await changePassword(passwordForm).unwrap();
      setSuccessMessage('Password changed successfully');
      setIsChangingPassword(false);
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
      setErrors({});
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ submit: error.data?.error || 'Failed to change password' });
    }
  };

  // Address operations
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateAddress(addressForm);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (editingAddress) {
        await updateAddress({ id: editingAddress.id, ...addressForm }).unwrap();
        setSuccessMessage('Address updated successfully');
      } else {
        await createAddress(addressForm).unwrap();
        setSuccessMessage('Address added successfully');
      }
      setIsAddingAddress(false);
      setEditingAddress(null);
      setAddressForm({
        address_type: 'home',
        street_address: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'Bangladesh',
        is_default: false,
      });
      setErrors({});
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ submit: error.data?.error || 'Failed to save address' });
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      address_type: address.address_type,
      street_address: address.street_address,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      is_default: address.is_default,
    });
    setIsAddingAddress(true);
    setExpandedSection('addresses');
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    try {
      await deleteAddress(id).unwrap();
      setSuccessMessage('Address deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ submit: error.data?.error || 'Failed to delete address' });
    }
  };

  // Guest view
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to TreeStore</h1>
            <p className="text-gray-600">Login or create an account to continue</p>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => navigate('/buyer/login')}
              className="w-full bg-emerald-600 text-white py-3.5 rounded-xl hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2 shadow-sm"
            >
              <LogIn className="w-5 h-5" />
              Buyer Login
            </button>
            <button
              onClick={() => navigate('/buyer/signup')}
              className="w-full bg-white border-2 border-emerald-600 text-emerald-600 py-3.5 rounded-xl hover:bg-emerald-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Buyer Sign Up
            </button>
          </div>

          <div className="p-5 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Sell on TreeStore</h3>
                <p className="text-sm text-gray-600">Register as a business seller and reach millions</p>
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/seller/register')}
                className="w-full bg-orange-500 text-white py-2.5 rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm flex items-center justify-center gap-2"
              >
                <Store className="w-4 h-4" />
                Seller Register
              </button>
              <button
                onClick={() => navigate('/seller/login')}
                className="w-full bg-white border-2 border-orange-500 text-orange-500 py-2.5 rounded-lg hover:bg-orange-50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Seller Login
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 space-y-2 text-center">
            <button className="text-sm text-gray-600 hover:text-emerald-600">
              Privacy Policy
            </button>
            <span className="mx-2 text-gray-400">•</span>
            <button className="text-sm text-gray-600 hover:text-emerald-600">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    );
  }

  const profile = profileData?.data;
  const addresses = addressesData?.data || [];
  const stats = statsData?.data || {};

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
          {successMessage}
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:block max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  {profile?.profile_picture_url ? (
                    <img
                      src={profile.profile_picture_url}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 text-emerald-600" />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-700 transition-colors shadow-lg">
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePictureUpload}
                    />
                  </label>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mt-4">
                  {profile?.reg_user?.first_name} {profile?.reg_user?.last_name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{profile?.reg_user?.email}</p>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={() => setExpandedSection('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    expandedSection === 'profile' ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </button>
                <button
                  onClick={() => setExpandedSection('addresses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    expandedSection === 'addresses' ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">Addresses</span>
                </button>
                <button
                  onClick={() => setExpandedSection('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    expandedSection === 'orders' ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span className="font-medium">Orders</span>
                </button>
                <button
                  onClick={() => setExpandedSection('security')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    expandedSection === 'security' ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Security</span>
                </button>
                <button
                  onClick={() => setExpandedSection('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    expandedSection === 'settings' ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <SettingsIcon className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </button>
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_orders || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pending_orders || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completed_orders || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Addresses</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.saved_addresses || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              {/* Profile Section */}
              {expandedSection === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                    {!isEditingProfile && (
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {isEditingProfile ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={profileForm.first_name}
                            onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                          {errors.first_name && (
                            <p className="text-sm text-red-600 mt-1">{errors.first_name}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={profileForm.last_name}
                            onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                          {errors.last_name && (
                            <p className="text-sm text-red-600 mt-1">{errors.last_name}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          placeholder="+880XXXXXXXXXX"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            value={profileForm.date_of_birth}
                            onChange={(e) => setProfileForm({ ...profileForm, date_of_birth: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                          {errors.date_of_birth && (
                            <p className="text-sm text-red-600 mt-1">{errors.date_of_birth}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender
                          </label>
                          <select
                            value={profileForm.gender}
                            onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      {errors.submit && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-600">{errors.submit}</p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingProfile(false);
                            setErrors({});
                          }}
                          className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Full Name</p>
                          <p className="text-base font-medium text-gray-900">
                            {profile?.reg_user?.first_name} {profile?.reg_user?.last_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Email</p>
                          <p className="text-base font-medium text-gray-900">{profile?.reg_user?.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Phone</p>
                          <p className="text-base font-medium text-gray-900">
                            {profile?.phone || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                          <p className="text-base font-medium text-gray-900">
                            {profile?.date_of_birth 
                              ? new Date(profile.date_of_birth).toLocaleDateString()
                              : 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Gender</p>
                          <p className="text-base font-medium text-gray-900">
                            {profile?.gender 
                              ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)
                              : 'Not specified'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Member Since</p>
                          <p className="text-base font-medium text-gray-900">
                            {new Date(profile?.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {profile?.profile_photo && (
                        <div className="pt-6 border-t border-gray-200">
                          <button
                            onClick={handleDeletePicture}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove Profile Picture
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Section */}
              {expandedSection === 'addresses' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                    {!isAddingAddress && (
                      <button
                        onClick={() => {
                          setIsAddingAddress(true);
                          setEditingAddress(null);
                          setAddressForm({
                            address_type: 'home',
                            street_address: '',
                            city: '',
                            state: '',
                            postal_code: '',
                            country: 'Bangladesh',
                            is_default: false,
                          });
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Address
                      </button>
                    )}
                  </div>

                  {isAddingAddress ? (
                    <form onSubmit={handleAddressSubmit} className="space-y-4 mb-6 p-6 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Type
                        </label>
                        <select
                          value={addressForm.address_type}
                          onChange={(e) => setAddressForm({ ...addressForm, address_type: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                          <option value="home">Home</option>
                          <option value="work">Work</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={addressForm.street_address}
                          onChange={(e) => setAddressForm({ ...addressForm, street_address: e.target.value })}
                          placeholder="123 Main Street"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                        {errors.street_address && (
                          <p className="text-sm text-red-600 mt-1">{errors.street_address}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                            placeholder="Dhaka"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                          {errors.city && (
                            <p className="text-sm text-red-600 mt-1">{errors.city}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State/Division
                          </label>
                          <input
                            type="text"
                            value={addressForm.state}
                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                            placeholder="Dhaka Division"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                          {errors.state && (
                            <p className="text-sm text-red-600 mt-1">{errors.state}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            value={addressForm.postal_code}
                            onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                            placeholder="1000"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                          {errors.postal_code && (
                            <p className="text-sm text-red-600 mt-1">{errors.postal_code}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                          </label>
                          <input
                            type="text"
                            value={addressForm.country}
                            onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                          {errors.country && (
                            <p className="text-sm text-red-600 mt-1">{errors.country}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="is_default"
                          checked={addressForm.is_default}
                          onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <label htmlFor="is_default" className="text-sm text-gray-700">
                          Set as default address
                        </label>
                      </div>

                      {errors.submit && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-600">{errors.submit}</p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          {editingAddress ? 'Update Address' : 'Save Address'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingAddress(false);
                            setEditingAddress(null);
                            setErrors({});
                          }}
                          className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : null}

                  <div className="space-y-4">
                    {addresses.length === 0 ? (
                      <div className="text-center py-12">
                        <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No saved addresses yet</p>
                        <p className="text-sm text-gray-500 mt-1">Add your first address to get started</p>
                      </div>
                    ) : (
                      addresses.map((address) => (
                        <div
                          key={address.id}
                          className="p-5 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                  {address.address_type.toUpperCase()}
                                </span>
                                {address.is_default && (
                                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                    DEFAULT
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-900 font-medium mb-1">
                                {formatAddress(address)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => handleEditAddress(address)}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Security Section */}
              {expandedSection === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>

                  <div className="space-y-6">
                    <div className="p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Password</h3>
                          <p className="text-sm text-gray-600 mt-1">Change your account password</p>
                        </div>
                        {!isChangingPassword && (
                          <button
                            onClick={() => setIsChangingPassword(true)}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            Change Password
                          </button>
                        )}
                      </div>

                      {isChangingPassword && (
                        <form onSubmit={handlePasswordChange} className="space-y-4 mt-4 pt-4 border-t border-gray-200">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Current Password
                            </label>
                            <input
                              type="password"
                              value={passwordForm.current_password}
                              onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                            {errors.current_password && (
                              <p className="text-sm text-red-600 mt-1">{errors.current_password}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              value={passwordForm.new_password}
                              onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                            {errors.new_password && (
                              <p className="text-sm text-red-600 mt-1">{errors.new_password}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Must be at least 8 characters with uppercase, lowercase, and number
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              value={passwordForm.confirm_password}
                              onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                            {errors.confirm_password && (
                              <p className="text-sm text-red-600 mt-1">{errors.confirm_password}</p>
                            )}
                          </div>

                          {errors.submit && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-sm text-red-600">{errors.submit}</p>
                            </div>
                          )}

                          <div className="flex gap-3">
                            <button
                              type="submit"
                              className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                              <Save className="w-4 h-4" />
                              Update Password
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsChangingPassword(false);
                                setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
                                setErrors({});
                              }}
                              className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>

                    <div className="p-6 border border-gray-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Add an extra layer of security to your account
                      </p>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        Enable 2FA
                      </button>
                    </div>

                    <div className="p-6 border border-red-200 rounded-lg bg-red-50">
                      <h3 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h3>
                      <p className="text-sm text-red-600 mb-4">
                        Once you delete your account, there is no going back
                      </p>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Section */}
              {expandedSection === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No orders yet</p>
                    <p className="text-sm text-gray-500 mt-1">Start shopping to see your orders here</p>
                    <button
                      onClick={() => navigate('/')}
                      className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Browse Products
                    </button>
                  </div>
                </div>
              )}

              {/* Settings Section */}
              {expandedSection === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Preferences</h2>
                  <div className="space-y-4">
                    <div className="p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Language</h3>
                          <p className="text-sm text-gray-600 mt-1">Choose your preferred language</p>
                        </div>
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                          <option>English</option>
                          <option>বাংলা</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Dark Mode</h3>
                          <p className="text-sm text-gray-600 mt-1">Toggle dark mode theme</p>
                        </div>
                        <button
                          onClick={() => setDarkMode(!darkMode)}
                          className={`relative w-14 h-7 rounded-full transition-colors ${
                            darkMode ? 'bg-emerald-600' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                              darkMode ? 'translate-x-7' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
                          <p className="text-sm text-gray-600 mt-1">Receive updates about your orders</p>
                        </div>
                        <button className="relative w-14 h-7 bg-emerald-600 rounded-full">
                          <div className="absolute top-0.5 right-0.5 w-6 h-6 bg-white rounded-full shadow" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 px-4 py-8 mb-2">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white">Welcome Back!</h2>
            <p className="text-sm text-white/90 mt-1">Manage your account</p>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              {profile?.profile_picture_url ? (
                <img
                  src={profile.profile_picture_url}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-emerald-600" />
                </div>
              )}
              <label className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg">
                <Camera className="w-4 h-4 text-emerald-600" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePictureUpload}
                />
              </label>
            </div>
            <div className="text-white flex-1">
              <h1 className="text-xl font-bold mb-1">
                {profile?.reg_user?.first_name} {profile?.reg_user?.last_name}
              </h1>
              <p className="text-sm opacity-90">{profile?.reg_user?.email}</p>
              <p className="text-sm opacity-90">{profile?.phone}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-xs text-gray-600">Orders</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.total_orders || 0}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-xs text-gray-600">Addresses</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.saved_addresses || 0}</p>
            </div>
          </div>
        </div>

        {/* Account Sections */}
        <div className="px-4 space-y-2">
          {/* Profile */}
          <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
            <button
              onClick={() => setIsEditingProfile(true)}
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <User className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="font-medium">My Profile</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
            <button
              onClick={() => navigate('/buyer/addresses')}
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <span className="font-medium">Saved Addresses</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl border border-gray-200">
            <button
              onClick={() => navigate('/buyer/password')}
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <span className="font-medium">Change Password</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl border border-gray-200">
            <button
              onClick={() => toggleSection('settings')}
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <SettingsIcon className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-medium">Preferences</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Help */}
          <div className="bg-white rounded-xl border border-gray-200">
            <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <HelpCircle className="w-5 h-5 text-orange-600" />
                </div>
                <span className="font-medium">Help & Support</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full bg-white rounded-xl border border-gray-200 px-4 py-4 flex items-center justify-center gap-3 hover:bg-red-50 hover:border-red-200 transition-colors text-red-600 font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>

          {/* Footer Links */}
          <div className="pt-4 pb-20 space-y-2">
            <button className="w-full text-center text-sm text-gray-600 hover:text-emerald-600">
              Privacy Policy
            </button>
            <button className="w-full text-center text-sm text-gray-600 hover:text-emerald-600">
              Terms of Service
            </button>
            <p className="text-center text-xs text-gray-500 pt-2">Version 1.0.0</p>
          </div>
        </div>
      </div>

      {/* Mobile Edit Profile Modal */}
      {isEditingProfile && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={() => {
                  setIsEditingProfile(false);
                  setErrors({});
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleProfileUpdate} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={profileForm.first_name}
                  onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors.first_name && (
                  <p className="text-sm text-red-600 mt-1">{errors.first_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profileForm.last_name}
                  onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors.last_name && (
                  <p className="text-sm text-red-600 mt-1">{errors.last_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="+880XXXXXXXXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={profileForm.date_of_birth}
                  onChange={(e) => setProfileForm({ ...profileForm, date_of_birth: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors.date_of_birth && (
                  <p className="text-sm text-red-600 mt-1">{errors.date_of_birth}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={profileForm.gender}
                  onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              <div className="sticky bottom-0 bg-white pt-4 pb-6 border-t border-gray-200 -mx-4 px-4 space-y-3">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingProfile(false);
                    setErrors({});
                  }}
                  className="w-full px-6 py-3.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Add/Edit Address Modal */}
      {isAddingAddress && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingAddress ? 'Edit Address' : 'Add Address'}
              </h2>
              <button
                onClick={() => {
                  setIsAddingAddress(false);
                  setEditingAddress(null);
                  setErrors({});
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddressSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Type
                </label>
                <select
                  value={addressForm.address_type}
                  onChange={(e) => setAddressForm({ ...addressForm, address_type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={addressForm.street_address}
                  onChange={(e) => setAddressForm({ ...addressForm, street_address: e.target.value })}
                  placeholder="123 Main Street"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors.street_address && (
                  <p className="text-sm text-red-600 mt-1">{errors.street_address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  placeholder="Dhaka"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors.city && (
                  <p className="text-sm text-red-600 mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Division
                </label>
                <input
                  type="text"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  placeholder="Dhaka Division"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors.state && (
                  <p className="text-sm text-red-600 mt-1">{errors.state}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={addressForm.postal_code}
                  onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                  placeholder="1000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors.postal_code && (
                  <p className="text-sm text-red-600 mt-1">{errors.postal_code}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={addressForm.country}
                  onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors.country && (
                  <p className="text-sm text-red-600 mt-1">{errors.country}</p>
                )}
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="is_default_mobile"
                  checked={addressForm.is_default}
                  onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="is_default_mobile" className="text-sm text-gray-700 font-medium">
                  Set as default address
                </label>
              </div>

              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              <div className="sticky bottom-0 bg-white pt-4 pb-6 border-t border-gray-200 -mx-4 px-4 space-y-3">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  <Save className="w-5 h-5" />
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingAddress(false);
                    setEditingAddress(null);
                    setErrors({});
                  }}
                  className="w-full px-6 py-3.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}