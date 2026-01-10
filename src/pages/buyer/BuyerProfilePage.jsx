import { useState, useEffect } from 'react';
import { 
  User, 
  Camera, 
  Save, 
  X, 
  Trash2, 
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  useGetBuyerProfileQuery,
  useUpdateBuyerProfileMutation,
  useUploadProfilePictureMutation,
  useDeleteProfilePictureMutation,
} from '@/features/buyerProfile/buyerProfileApi';
import {
  validateProfileUpdate,
  validateProfilePicture,
  formatProfileData,
} from '@/services/buyerProfileService';

/**
 * Buyer Profile Management Page
 * Complete profile editing with image upload to Cloudinary
 */
export default function BuyerProfilePage() {
  const navigate = useNavigate();
  
  // RTK Query hooks
  const { data: profileData, isLoading: profileLoading } = useGetBuyerProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateBuyerProfileMutation();
  const [uploadPicture, { isLoading: isUploading }] = useUploadProfilePictureMutation();
  const [deletePicture, { isLoading: isDeleting }] = useDeleteProfilePictureMutation();

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
    gender: '',
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const profile = profileData?.data || profileData;

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.reg_user?.first_name || '',
        last_name: profile.reg_user?.last_name || '',
        phone: profile.phone || '',
        date_of_birth: profile.reg_user?.date_of_birth ? profile.reg_user.date_of_birth.split('T')[0] : '',
        gender: profile.reg_user?.gender || '',
      });
    }
  }, [profile]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle profile image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validationErrors = validateProfilePicture(file);
    if (validationErrors.length > 0) {
      setErrors({ photo: validationErrors[0] });
      return;
    }

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setErrors({ photo: '' });
  };

  // Upload profile picture
  const handleImageUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('photo', selectedFile);

    try {
      await uploadPicture(formData).unwrap();
      setSuccessMessage('Profile picture updated successfully');
      setSelectedFile(null);
      setPreviewImage(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ photo: error.data?.error || 'Failed to upload picture' });
    }
  };

  // Delete profile picture
  const handleImageDelete = async () => {
    if (!confirm('Are you sure you want to delete your profile picture?')) return;

    try {
      await deletePicture().unwrap();
      setSuccessMessage('Profile picture deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ photo: error.data?.error || 'Failed to delete picture' });
    }
  };

  // Cancel image selection
  const handleCancelImage = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    setErrors({ photo: '' });
  };

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const validationErrors = validateProfileUpdate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Format data for API
    const apiData = {
      ...formData,
      date_of_birth: formData.date_of_birth ? new Date(formData.date_of_birth).toISOString() : null,
    };

    try {
      await updateProfile(apiData).unwrap();
      setSuccessMessage('Profile updated successfully');
      setIsEditing(false);
      setErrors({});
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ submit: error.data?.error || 'Failed to update profile' });
    }
  };

  // Handle cancel editing
  const handleCancel = () => {
    if (profile) {
      setFormData({
        first_name: profile.reg_user?.first_name || '',
        last_name: profile.reg_user?.last_name || '',
        phone: profile.phone || '',
        date_of_birth: profile.reg_user?.date_of_birth ? profile.reg_user.date_of_birth.split('T')[0] : '',
        gender: profile.reg_user?.gender || '',
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
          {successMessage}
        </div>
      )}

      {/* Header - Mobile */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/buyer/account')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 lg:py-8">
        {/* Header - Desktop */}
        <div className="hidden lg:flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/buyer/account')}
              className="p-2 hover:bg-white rounded-lg transition-colors border border-gray-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Profile Picture Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Picture</h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Profile Image */}
              <div className="relative">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-emerald-100"
                  />
                ) : profile?.profile_picture_url ? (
                  <img
                    src={profile.profile_picture_url}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-emerald-100"
                  />
                ) : (
                  <div className="w-32 h-32 bg-emerald-600 rounded-full flex items-center justify-center border-4 border-emerald-100">
                    <span className="text-4xl font-bold text-white">
                      {profile?.reg_user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                
                {!selectedFile && (
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-700 transition-colors shadow-lg">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleImageSelect}
                      disabled={isUploading}
                    />
                  </label>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 text-center sm:text-left">
                {selectedFile ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      New image selected: <span className="font-medium">{selectedFile.name}</span>
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                      <button
                        onClick={handleImageUpload}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Upload Photo
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancelImage}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Upload a new photo</p>
                      <p className="text-sm text-gray-600">
                        JPG, JPEG or PNG. Max size 2MB.
                      </p>
                    </div>
                    {profile?.profile_picture_url && (
                      <button
                        onClick={handleImageDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            Remove Photo
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
                {errors.photo && (
                  <p className="text-sm text-red-600 mt-2">{errors.photo}</p>
                )}
              </div>
            </div>
          </div>

          {/* Profile Information Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="John"
                    />
                    {errors.first_name && (
                      <p className="text-sm text-red-600 mt-1">{errors.first_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Doe"
                    />
                    {errors.last_name && (
                      <p className="text-sm text-red-600 mt-1">{errors.last_name}</p>
                    )}
                  </div>
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={profile?.reg_user?.email || ''}
                      disabled
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="+880XXXXXXXXXX"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Format: +880XXXXXXXXXX or 01XXXXXXXXX
                  </p>
                </div>

                {/* Date of Birth & Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>
                    {errors.date_of_birth && (
                      <p className="text-sm text-red-600 mt-1">{errors.date_of_birth}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Error Message */}
                {errors.submit && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isUpdating}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                {/* Display Mode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Full Name</p>
                    <p className="text-base font-medium text-gray-900">
                      {profile?.reg_user?.first_name} {profile?.reg_user?.last_name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email Address</p>
                    <p className="text-base font-medium text-gray-900">{profile?.reg_user?.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                    <p className="text-base font-medium text-gray-900">
                      {profile?.phone || 'Not provided'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                    <p className="text-base font-medium text-gray-900">
                      {profile?.reg_user?.date_of_birth
                        ? new Date(profile.reg_user.date_of_birth).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Not provided'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Gender</p>
                    <p className="text-base font-medium text-gray-900">
                      {profile?.reg_user?.gender
                        ? profile.reg_user.gender.charAt(0).toUpperCase() + profile.reg_user.gender.slice(1)
                        : 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Member Since</p>
                    <p className="text-base font-medium text-gray-900">
                      {new Date(profile?.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Mobile Edit Button */}
                <div className="lg:hidden pt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}