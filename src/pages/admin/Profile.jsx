
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Shield, 
  Calendar,
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import {
  useGetAdminProfileQuery,
  useUpdateAdminMutation,
} from '@/features/admin/adminApi';

export default function AdminProfilePage() {
  const { data: profile, isLoading, error } = useGetAdminProfileQuery();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    department: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        department: profile.department || '',
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) return;

    try {
      await updateAdmin({
        id: profile.id,
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
        department: formData.department.trim(),
      }).unwrap();

      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrors({ submit: err.data?.message || 'Failed to update profile' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#064232] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
          <div>
            <h3 className="text-red-800 font-semibold mb-1">Error Loading Profile</h3>
            <p className="text-red-700 text-sm">{error.data?.message || 'Failed to load profile'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-sm text-gray-600 mt-1">Manage your account information</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-[#064232] to-[#568F87] p-8 text-white rounded-t-lg">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white/30">
              {profile?.full_name?.charAt(0) || 'A'}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profile?.full_name}</h2>
              <p className="text-white/90">{profile?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Shield size={16} />
                <span className="text-sm font-medium">{profile?.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info (Read-only) */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Mail className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{profile?.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-medium text-gray-900">{profile?.role}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium text-gray-900">
                  {new Date(profile?.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Editable Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Editable Information</h3>

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#568F87] ${
                    errors.full_name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                  disabled={isUpdating}
                />
              </div>
              {errors.full_name && (
                <p className="text-sm text-red-600 mt-1">{errors.full_name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#568F87] ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="+1234567890"
                  disabled={isUpdating}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#568F87]"
                  placeholder="e.g., Sales, Marketing"
                  disabled={isUpdating}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isUpdating}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#064232] text-white rounded-lg hover:bg-[#053828] transition-colors disabled:opacity-50 font-medium"
            >
              <Save size={20} />
              <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Permissions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Your Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'can_manage_users', label: 'Manage Users' },
            { key: 'can_manage_products', label: 'Manage Products' },
            { key: 'can_manage_orders', label: 'Manage Orders' },
            { key: 'can_view_reports', label: 'View Reports' },
            { key: 'can_manage_settings', label: 'Manage Settings' },
          ].map((permission) => (
            <div key={permission.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">{permission.label}</span>
              {profile?.[permission.key] ? (
                <CheckCircle className="text-green-600" size={20} />
              ) : (
                <AlertCircle className="text-gray-400" size={20} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}