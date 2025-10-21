
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
} from "lucide-react";
import { useState } from "react";

/**
 * AccountPage component - user account management page
 */
export default function AccountPage({ onHelpClick, onLoginClick, onSignUpClick, onGuestContinue, onEditProfileClick, isLoggedIn = false, userName = "", userProfile = {} }) {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // If user is not logged in, show login/signup screen
  if (!isLoggedIn) {
    return (
      <div className="pb-20 bg-gray-50 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* Logo/Icon */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-[#059669] rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to TreeStore</h1>
            <p className="text-gray-600">Login or create an account to continue</p>
          </div>

          {/* Login/Signup Buttons */}
          <div className="space-y-3">
            <button
              onClick={onLoginClick || (() => setIsLoggedIn(true))}
              className="w-full bg-[#059669] text-white py-3 rounded-xl hover:bg-[#047857] transition-colors font-medium flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Login
            </button>
            <button
              onClick={onSignUpClick || (() => setIsLoggedIn(true))}
              className="w-full bg-white border-2 border-[#059669] text-[#059669] py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Sign Up
            </button>
          </div>

          {/* Business Account Registration */}
          <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Sell on TreeStore</h3>
                <p className="text-xs text-gray-600">Register as a business seller and reach millions of customers</p>
              </div>
            </div>
            <button
              onClick={() => setIsLoggedIn(true)}
              className="w-full bg-orange-500 text-white py-2.5 rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm flex items-center justify-center gap-2"
            >
              <Store className="w-4 h-4" />
              Register as Business
            </button>
          </div>

          {/* Guest Continue */}
          <div className="mt-4 text-center">
            <button
              onClick={onGuestContinue}
              className="text-gray-600 text-sm hover:text-[#059669] underline"
            >
              Continue as Guest
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 space-y-2">
            <button className="w-full text-center text-sm text-gray-600 hover:text-[#059669]">
              Privacy Policy
            </button>
            <button className="w-full text-center text-sm text-gray-600 hover:text-[#059669]">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Logged in user view
  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-[#059669] to-[#047857] px-4 py-8 mb-2">
        {/* Welcome Message */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white">Welcome, {userName}!</h2>
          <p className="text-sm text-white/80 mt-1">Manage your account and orders</p>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          {userProfile.profileImage ? (
            <img
              src={userProfile.profileImage}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-white"
            />
          ) : (
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-[#059669]" />
            </div>
          )}
          <div className="text-white">
            <h1 className="text-xl mb-1">{userProfile.firstName} {userProfile.lastName}</h1>
            <p className="text-sm opacity-90">{userProfile.email}</p>
            <p className="text-sm opacity-90">{userProfile.phone}</p>
          </div>
        </div>
        <button
          onClick={onEditProfileClick}
          className="w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg flex items-center justify-center gap-2 backdrop-blur-sm transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      {/* Account Sections */}
      <div className="px-4 space-y-2">
        {/* Addresses */}
        <div className="bg-white rounded-xl overflow-hidden border border-border">
          <button
            onClick={() => toggleSection("addresses")}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <MapPin className="w-5 h-5 text-[#059669]" />
              </div>
              <span>Manage Addresses</span>
            </div>
            <ChevronRight
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSection === "addresses" ? "rotate-90" : ""
              }`}
            />
          </button>
          {expandedSection === "addresses" && (
            <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
              <div className="pt-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm mb-1">Home</h3>
                    <p className="text-sm text-gray-600">123 Oak Street, Springfield, IL 62701</p>
                  </div>
                  <button className="text-[#059669] text-sm">Edit</button>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm mb-1">Work</h3>
                    <p className="text-sm text-gray-600">456 Pine Avenue, Chicago, IL 60601</p>
                  </div>
                  <button className="text-[#059669] text-sm">Edit</button>
                </div>
              </div>
              <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-[#059669] text-sm hover:border-[#059669] transition-colors">
                + Add New Address
              </button>
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl overflow-hidden border border-border">
          <button
            onClick={() => toggleSection("payment")}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <span>Payment Methods</span>
            </div>
            <ChevronRight
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSection === "payment" ? "rotate-90" : ""
              }`}
            />
          </button>
          {expandedSection === "payment" && (
            <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
              <div className="pt-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded" />
                    <div>
                      <h3 className="text-sm">**** 4242</h3>
                      <p className="text-xs text-gray-600">Expires 12/25</p>
                    </div>
                  </div>
                  <button className="text-red-500 text-sm">Remove</button>
                </div>
              </div>
              <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-[#059669] text-sm hover:border-[#059669] transition-colors">
                + Add Payment Method
              </button>
            </div>
          )}
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl overflow-hidden border border-border">
          <button
            onClick={() => toggleSection("security")}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <span>Security Settings</span>
            </div>
            <ChevronRight
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSection === "security" ? "rotate-90" : ""
              }`}
            />
          </button>
          {expandedSection === "security" && (
            <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
              <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded-lg flex items-center justify-between">
                <span className="text-sm">Change Password</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded-lg flex items-center justify-between">
                <span className="text-sm">Two-Factor Authentication</span>
                <div className="w-10 h-6 bg-gray-200 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow" />
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl border border-border">
          <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Globe className="w-5 h-5 text-purple-600" />
              </div>
              <span>Language</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">English</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </button>
        </div>

        <div className="bg-white rounded-xl border border-border">
          <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Moon className="w-5 h-5 text-indigo-600" />
              </div>
              <span>Dark Mode</span>
            </div>
            <div className="w-12 h-7 bg-gray-200 rounded-full relative">
              <div className="w-6 h-6 bg-white rounded-full absolute top-0.5 left-0.5 shadow" />
            </div>
          </button>
        </div>

        {/* Help & Support */}
        <div className="bg-white rounded-xl border border-border">
          <button
            onClick={onHelpClick}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <HelpCircle className="w-5 h-5 text-[#f97316]" />
              </div>
              <span>Help & Support</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Logout */}
        <button className="w-full bg-white rounded-xl border border-border px-4 py-4 flex items-center justify-center gap-3 hover:bg-red-50 hover:border-red-200 transition-colors text-red-600">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>

        {/* Footer Links */}
        <div className="pt-4 pb-4 space-y-2">
          <button className="w-full text-center text-sm text-gray-600 hover:text-[#059669]">
            Privacy Policy
          </button>
          <button className="w-full text-center text-sm text-gray-600 hover:text-[#059669]">
            Terms of Service
          </button>
          <p className="text-center text-xs text-gray-500 pt-2">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
