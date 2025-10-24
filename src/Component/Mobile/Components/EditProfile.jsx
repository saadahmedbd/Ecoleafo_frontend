import { ArrowLeft, User, Mail, Phone, Camera } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { profileAPI, isBase64Image } from "../../../services/profileAPI";

export default function EditProfile({ onBack, onSave, showToast, userProfile }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileImagePublicId, setProfileImagePublicId] = useState(""); // Store Cloudinary public_id

  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false); // Track image upload status

  const [pendingImageFile, setPendingImageFile] = useState(null); // Store file for upload
  const [previewImage, setPreviewImage] = useState(""); // Local preview

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const result = await profileAPI.getProfile();

    if (result.success) {
      const profile = result.data.reg_user || result.data;
      const profileData = {
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: profile.email || "",
        phone: result.data.phone || "",
        profileImage: result.data.profile_picture || "",
        profileImagePublicId: result.data.profile_picture_public_id || "",
      };

      setFirstName(profileData.firstName);
      setLastName(profileData.lastName);
      setEmail(profileData.email);
      setPhone(profileData.phone);
      setProfileImage(profileData.profileImage);
      setProfileImagePublicId(profileData.profileImagePublicId);
      setOriginalData(profileData);
      
      // Store in localStorage (without public_id for security)
      localStorage.setItem("userData", JSON.stringify({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        profileImage: profileData.profileImage,
      }));
    } else {
      showToast && showToast(result.error || "Failed to load profile", "cart");
    }
    setLoading(false);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showToast && showToast("Please select a valid image file", "cart");
        return;
      }

      // Validate file size (10MB max, matching backend)
      if (file.size > 10 * 1024 * 1024) {
        showToast && showToast("Image size must be less than 10MB", "cart");
        return;
      }

      // Store file for later upload
      setPendingImageFile(file);

      // Create local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = async () => {
    // If there's a pending image, just clear it
    if (pendingImageFile) {
      setPendingImageFile(null);
      setPreviewImage("");
      return;
    }

    // If there's an existing Cloudinary image, delete it
    if (profileImagePublicId) {
      const confirmed = window.confirm("Are you sure you want to remove your profile picture?");
      if (!confirmed) return;

      setUploading(true);
      const result = await profileAPI.deleteProfilePicture(profileImagePublicId);
      
      if (result.success) {
        setProfileImage("");
        setProfileImagePublicId("");
        showToast && showToast("Profile picture removed", "cart");
      } else {
        showToast && showToast(result.error || "Failed to remove picture", "cart");
      }
      setUploading(false);
    } else {
      // Just clear local state
      setProfileImage("");
      setPreviewImage("");
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const result = await profileAPI.uploadProfilePicture(file);
    
    if (result.success) {
      return {
        url: result.data.url,
        publicId: result.data.public_id,
      };
    } else {
      throw new Error(result.error || "Image upload failed");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let finalProfileImage = profileImage;
      let finalPublicId = profileImagePublicId;

      // Step 1: Upload new image to Cloudinary if there's a pending file
      if (pendingImageFile) {
        setUploading(true);
        showToast && showToast("Uploading image...", "cart");

        try {
          const uploadResult = await uploadImageToCloudinary(pendingImageFile);
          finalProfileImage = uploadResult.url;
          finalPublicId = uploadResult.publicId;

          // Delete old image if it exists
          if (profileImagePublicId && profileImagePublicId !== finalPublicId) {
            await profileAPI.deleteProfilePicture(profileImagePublicId);
          }

          setUploading(false);
        } catch (error) {
          setUploading(false);
          showToast && showToast(error.message || "Image upload failed", "cart");
          setSubmitting(false);
          return;
        }
      }

      // Step 2: Update profile with all data including new image URL
      const completeProfileData = {
        firstName: firstName || originalData.firstName,
        lastName: lastName || originalData.lastName,
        email: email || originalData.email,
        phone: phone || originalData.phone,
        profileImage: finalProfileImage,
      };

      const result = await profileAPI.updateProfile(completeProfileData);

      if (result.success) {
        showToast && showToast("Profile updated successfully!", "cart");
        
        // Update local state
        const updatedData = {
          ...completeProfileData,
          profileImagePublicId: finalPublicId,
        };
        setOriginalData(updatedData);
        setProfileImage(finalProfileImage);
        setProfileImagePublicId(finalPublicId);
        setPendingImageFile(null);
        setPreviewImage("");
        
        // Update localStorage
        localStorage.setItem("userData", JSON.stringify(completeProfileData));
        
        onSave && onSave(completeProfileData);
        setTimeout(() => onBack(), 500);
      } else {
        showToast && showToast(result.error || "Update failed", "cart");
      }
    } catch (error) {
      showToast && showToast(error.message || "An error occurred", "cart");
    }

    setSubmitting(false);
  };

  // Determine which image to display
  const displayImage = previewImage || profileImage;

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium">Edit Profile</h1>
      </div>

      <div className="px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#059669] mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading profile...</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 bg-[#059669] rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || submitting}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
                {uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                disabled={uploading || submitting}
              />
              <div className="flex gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || submitting}
                  className="text-sm text-[#059669] font-medium disabled:opacity-50"
                >
                  {pendingImageFile ? "Change Photo" : "Upload Photo"}
                </button>
                {(displayImage || pendingImageFile) && (
                  <>
                    <span className="text-gray-300">|</span>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      disabled={uploading || submitting}
                      className="text-sm text-red-600 font-medium disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
              {pendingImageFile && (
                <p className="text-xs text-orange-600 mt-2">
                  New image will be uploaded when you save
                </p>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    disabled={submitting}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    disabled={submitting}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    disabled={submitting}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    disabled={submitting}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#059669] text-white py-3 rounded-lg hover:bg-[#047857] transition-colors font-medium mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting || uploading}
              >
                {uploading ? "Uploading image..." : submitting ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}