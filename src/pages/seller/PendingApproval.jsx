// ==========================================
// PENDING APPROVAL PAGE
// ==========================================
// Purpose: Show sellers waiting for admin approval
// Displays: Current status, what to expect, support contact
// ==========================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, Mail, Phone, AlertCircle, RefreshCw } from 'lucide-react';
import { useGetProfileStatusQuery } from '../../features/auth/sellerAuthApi';
import SellerAuthService from '../../services/SellerAuthService';
export default function PendingApproval() {
  const navigate = useNavigate();
  
  // Query profile status
  const { data: profileStatus, isLoading, refetch } = useGetProfileStatusQuery();
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ==========================================
  // CHECK IF APPROVED
  // ==========================================
  useEffect(() => {
    if (profileStatus?.is_approved) {
      // Seller was approved! Redirect to dashboard
      navigate('/seller/dashboard', {
        state: {
          message: 'Your account has been approved! Welcome to your seller dashboard.',
          type: 'success'
        }
      });
    } else if (profileStatus?.approval_status === 'rejected') {
      // Seller was rejected
      navigate('/seller/account-rejected', {
        state: {
          reason: profileStatus.rejection_reason || 'Your account application was not approved.'
        }
      });
    }
  }, [profileStatus, navigate]);

  // ==========================================
  // HANDLERS
  // ==========================================

  /**
   * Refresh approval status
   */
    const handleRefreshStatus = async () => {
  setIsRefreshing(true);

  try {
    const response = await SellerAuthService.getProfileStatus();

    if (response.success) {
      const status = response.data;
      
      // Check if approved
      if (status.is_approved) {
        navigate('/seller/dashboard', {
          state: { message: 'Your account has been approved!' }
        });
      } else if (status.approval_status === 'rejected') {
        navigate('/seller/account-rejected', {
          state: { reason: status.rejection_reason }
        });
      }
    }
  } catch (err) {
    console.error('Failed to refresh status:', err);
  } finally {
    setIsRefreshing(false);
  }
};

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-amber-100 p-4 rounded-full">
                <Clock className="w-12 h-12 text-amber-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Account Pending Approval
            </h1>
            <p className="text-gray-600">
              Your seller account is currently under review
            </p>
          </div>

          {/* Status Card */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
            <div className="flex items-start mb-4">
              <AlertCircle className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">
                  What's Happening Now?
                </h3>
                <p className="text-sm text-amber-800">
                  Our team is reviewing your seller application to ensure quality and authenticity. This typically takes 1-3 business days.
                </p>
              </div>
            </div>
            
            {/* Completion Checklist */}
            <div className="space-y-2 ml-9">
              <div className="flex items-center text-sm text-emerald-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Account created</span>
              </div>
              <div className="flex items-center text-sm text-emerald-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Business profile completed</span>
              </div>
              <div className="flex items-center text-sm text-emerald-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Payment method added</span>
              </div>
              <div className="flex items-center text-sm text-amber-700">
                <Clock className="w-4 h-4 mr-2" />
                <span className="font-medium">Awaiting admin approval</span>
              </div>
            </div>
          </div>

          {/* What to Expect */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">What to Expect Next</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">Email Notification</h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    You'll receive an email once your account is approved or if additional information is needed
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-emerald-100 p-2 rounded-full mr-3 flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">Account Activation</h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Once approved, you can immediately start adding products and selling
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Refresh Status Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className="flex items-center text-emerald-600 hover:text-emerald-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Checking...' : 'Refresh Status'}
            </button>
          </div>

          {/* Support Section */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Email:</span>
                  <a href="mailto:seller-support@example.com" className="ml-2 text-emerald-600 hover:underline">
                    seller-support@example.com
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Phone:</span>
                  <a href="tel:+8801234567890" className="ml-2 text-emerald-600 hover:underline">
                    +880 1234 567890
                  </a>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-3 text-center">
              Our support team is available Monday-Friday, 9 AM - 6 PM (Bangladesh Time)
            </p>
          </div>

          {/* Logout Option */}
          <div className="text-center mt-6 pt-6 border-t">
            <button
              onClick={() => {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_data');
                navigate('/seller/login');
              }}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}