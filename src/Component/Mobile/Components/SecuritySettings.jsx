import { ArrowLeft, Lock, Eye, EyeOff, Shield, Smartphone } from "lucide-react";
import { useState } from "react";

/**
 * SecuritySettings Component
 * Manages user account security including password changes and 2FA
 * Provides security tips and best practices
 */
export default function SecuritySettings({ onBack, onSave }) {
  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Two-factor authentication state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // Error message for password validation
  const [passwordError, setPasswordError] = useState("");

  /**
   * Handle password change form submission
   * Validates password match and minimum length
   * Clears form on success
   */
  const handleChangePassword = (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }
    
    // Validate minimum length
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters!");
      return;
    }
    
    // Clear error and save
    setPasswordError("");
    onSave({ currentPassword, newPassword });
    
    // Reset form fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  /**
   * Toggle two-factor authentication on/off
   * Saves the new state to parent component
   */
  const handleToggle2FA = () => {
    const newState = !twoFactorEnabled;
    setTwoFactorEnabled(newState);
    onSave({ twoFactorEnabled: newState });
  };

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium">Security Settings</h1>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Change Password Section - Allows users to update their password */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="font-medium">Change Password</h2>
              <p className="text-xs text-gray-600">Update your account password</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* Current Password Field - Required for verification */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password Field - Must be at least 6 characters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            {/* Confirm Password Field - Must match new password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Confirm new password"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent ${
                    passwordError ? "border-red-500" : "border-gray-300" // Red border on error
                  }`}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Display error message if passwords don't match */}
              {passwordError && (
                <p className="text-xs text-red-500 mt-1">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#059669] text-white py-3 rounded-lg hover:bg-[#047857] transition-colors font-medium"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Two-Factor Authentication Section - Toggle for extra security */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-medium">Two-Factor Authentication</h2>
                <p className="text-xs text-gray-600">Add extra security to your account</p>
              </div>
            </div>
            {/* Toggle Switch - Green when enabled, gray when disabled */}
            <button
              onClick={handleToggle2FA}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                twoFactorEnabled ? "bg-[#059669]" : "bg-gray-200"
              }`}
            >
              {/* Switch Circle - Moves right when enabled */}
              <div
                className={`absolute w-6 h-6 bg-white rounded-full top-0.5 transition-transform shadow ${
                  twoFactorEnabled ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
          {/* Show info message when 2FA is enabled */}
          {twoFactorEnabled && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                Two-factor authentication is enabled. You'll receive a code via SMS when logging in.
              </p>
            </div>
          )}
        </div>

        {/* Security Tips Section - Best practices for account security */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-[#059669]" />
            <h2 className="font-medium">Security Tips</h2>
          </div>
          {/* List of security best practices */}
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-[#059669] mt-1">•</span>
              <span>Use a strong password with letters, numbers, and symbols</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#059669] mt-1">•</span>
              <span>Never share your password with anyone</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#059669] mt-1">•</span>
              <span>Enable two-factor authentication for extra security</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#059669] mt-1">•</span>
              <span>Change your password regularly</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
