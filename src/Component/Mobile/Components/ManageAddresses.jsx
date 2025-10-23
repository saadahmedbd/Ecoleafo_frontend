import { ArrowLeft, MapPin, Home, Briefcase, Plus, Edit2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
// import { addressAPI } from "../../../services/addressAPI"; // Import the address API service

import { addressAPI } from "../../../services/addressAPI";

/**
 * ManageAddresses Component - Connected to Backend
 * Allows users to view, add, edit, and delete their saved addresses
 * Used for delivery address management in checkout flow
 */
export default function ManageAddresses({ onBack, showToast }) {
  // State to store addresses fetched from backend
  const [addresses, setAddresses] = useState([]);
  
  // State to track which address is being edited (null means adding new)
  const [editingId, setEditingId] = useState(null);
  
  // State to control add/edit form visibility
  const [showForm, setShowForm] = useState(false);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state for address fields
  const [formData, setFormData] = useState({
    label: "Home",
    full_name: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    street: "",
    city: "",
    district: "",
    state: "",
    country: "Bangladesh",
    postal_code: "",
    is_default: false
  });

  /**
   * Fetch addresses on component mount
   */
  useEffect(() => {
    fetchAddresses();
  }, []);

  /**
   * Fetch all addresses from backend
   */
 const fetchAddresses = async () => {
  setLoading(true);
  setError(null);

  const result = await addressAPI.getAddresses();

  if (result.success) {
    // Handle both formats: { addresses: [...] } or just [...]
    const transformedAddresses = (result.data?.addresses || result.data || []).map(addr => ({
      id: addr.id,
      label: addr.label,
      full_name: addr.full_name,
      phone: addr.phone,
      address_line_1: addr.address_line_1,
      address_line_2: addr.address_line_2,
      street: addr.street,
      city: addr.city,
      district: addr.district,
      state: addr.state,
      country: addr.country,
      postal_code: addr.postal_code,
      isDefault: addr.is_default
    }));

    setAddresses(transformedAddresses);
  } else {
    setError(result.error || "Failed to load addresses");
    showToast && showToast("Failed to load addresses", "cart");
  }

  setLoading(false);
};


  /**
   * Handle opening form for adding new address
   */
  const handleAddNew = () => {
    setFormData({
      label: "Home",
      full_name: "",
      phone: "",
      address_line_1: "",
      address_line_2: "",
      street: "",
      city: "",
      district: "",
      state: "",
      country: "Bangladesh",
      postal_code: "",
      is_default: false
    });
    setEditingId(null);
    setShowForm(true);
  };

  /**
   * Handle opening form for editing existing address
   */
  const handleEdit = (address) => {
    setFormData({
      label: address.label,
      full_name: address.full_name,
      phone: address.phone,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2,
      street: address.street,
      city: address.city,
      district: address.district,
      state: address.state,
      country: address.country,
      postal_code: address.postal_code,
      is_default: address.isDefault
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  /**
   * Handle form submission for add/edit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    let result;
    
    if (editingId) {
      // Update existing address
      result = await addressAPI.updateAddress(editingId, formData);
    } else {
      // Create new address
      result = await addressAPI.createAddress(formData);
    }
    
    if (result.success) {
      showToast && showToast(
        editingId ? "Address updated successfully!" : "Address added successfully!",
        "cart"
      );
      
      // Refresh addresses list
      await fetchAddresses();
      
      // Reset form and close
      setShowForm(false);
      setEditingId(null);
    } else {
      showToast && showToast(
        result.error || "Failed to save address",
        "cart"
      );
    }
    
    setSubmitting(false);
  };

  /**
   * Handle deleting an address
   */
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      const result = await addressAPI.deleteAddress(id);
      
      if (result.success) {
        showToast && showToast("Address deleted successfully!", "cart");
        
        // Refresh addresses list
        await fetchAddresses();
      } else {
        showToast && showToast(
          result.error || "Failed to delete address",
          "cart"
        );
      }
    }
  };

  /**
   * Handle setting address as default
   */
  const handleSetDefault = async (id) => {
    const result = await addressAPI.setDefaultAddress(id);
    
    if (result.success) {
      showToast && showToast("Default address updated!", "cart");
      
      // Refresh addresses list
      await fetchAddresses();
    } else {
      showToast && showToast(
        result.error || "Failed to set default address",
        "cart"
      );
    }
  };

  /**
   * Handle input field changes
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium">Manage Addresses</h1>
      </div>

      <div className="px-4 py-4">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#059669] mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading addresses...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchAddresses}
              className="text-red-600 underline mt-2"
            >
              Try again
            </button>
          </div>
        )}

        {/* Show address list when form is hidden and not loading */}
        {!showForm && !loading && (
          <>
            {/* Address List Section */}
            <div className="space-y-3 mb-4">
              {addresses.length === 0 ? (
                // Empty state when no addresses saved
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
                  <p className="text-gray-600 text-sm">Add your first delivery address</p>
                </div>
              ) : (
                // Map through addresses and display each one
                addresses.map((address) => (
                  <div
                    key={address.id}
                    className="bg-white rounded-xl p-4 border border-gray-200"
                  >
                    {/* Address Header with label and default badge */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {/* Icon based on address label */}
                        {address.label === "Home" ? (
                          <Home className="w-5 h-5 text-[#059669]" />
                        ) : address.label === "Work" ? (
                          <Briefcase className="w-5 h-5 text-[#059669]" />
                        ) : (
                          <MapPin className="w-5 h-5 text-[#059669]" />
                        )}
                        <span className="font-medium">{address.label}</span>
                        {/* Default badge */}
                        {address.isDefault && (
                          <span className="text-xs bg-[#059669] text-white px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      
                      {/* Action buttons - Edit and Delete */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(address)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(address.id)}
                          className="p-2 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>

                    {/* Address Details */}
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium text-gray-900">{address.full_name}</p>
                      <p>{address.phone}</p>
                      <p>{address.address_line_1}</p>
                      {address.address_line_2 && <p>{address.address_line_2}</p>}
                      <p>{address.street}</p>
                      <p>{address.city}, {address.district}</p>
                      <p>{address.state}, {address.country} - {address.postal_code}</p>
                    </div>

                    {/* Set as Default Button */}
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="mt-3 text-sm text-[#059669] hover:underline"
                      >
                        Set as default
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Add New Address Button */}
            <button
              onClick={handleAddNew}
              className="w-full bg-[#059669] text-white py-3 rounded-xl hover:bg-[#047857] transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Address
            </button>
          </>
        )}

        {/* Add/Edit Address Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-medium mb-4">
              {editingId ? "Edit Address" : "Add New Address"}
            </h2>

            {/* Address Label Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Label
              </label>
              <div className="flex gap-2">
                {["Home", "Work", "Other"].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleInputChange("label", label)}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                      formData.label === label
                        ? "border-[#059669] bg-[#059669] text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Enter full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent"
                required
              />
            </div>

            {/* Phone Number Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent"
                required
              />
            </div>

            {/* Address Line 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 1
              </label>
              <input
                type="text"
                value={formData.address_line1}
                onChange={(e) => handleInputChange("address_line1", e.target.value)}
                placeholder="e.g., ss road"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent"
                required
              />
            </div>

            {/* Address Line 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 2 (Optional)
              </label>
              <input
                type="text"
                value={formData.address_line2}
                onChange={(e) => handleInputChange("address_line2", e.target.value)}
                placeholder="e.g., sirajganj"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent"
              />
            </div>

            {/* Street */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street
              </label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => handleInputChange("street", e.target.value)}
                placeholder="e.g., janpur bankpara"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent"
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="e.g., sirajganj"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent"
                required
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => handleInputChange("district", e.target.value)}
                placeholder="e.g., rajshahi"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent"
                required
              />
            </div>

            {/* State and Postal Code Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Division
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="Rajshahi Division"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postal_code}
                  onChange={(e) => handleInputChange("postal_code", e.target.value)}
                  placeholder="5700"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                placeholder="Bangladesh"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent"
                required
              />
            </div>

            {/* Default Address Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default}
                onChange={(e) => handleInputChange("is_default", e.target.checked)}
                className="w-4 h-4 accent-[#059669]"
              />
              <label htmlFor="is_default" className="text-sm text-gray-700">
                Set as default delivery address
              </label>
            </div>

            {/* Form Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                disabled={submitting}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="flex-1 bg-[#059669] text-white py-3 rounded-xl hover:bg-[#047857] transition-colors font-medium disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? "Saving..." : editingId ? "Update Address" : "Save Address"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}