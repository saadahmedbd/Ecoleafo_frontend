import { useState } from "react";
import {
  Store,
  FileText,
  Shield,
  Bell,
  Upload,
  Save,
  Globe,
  MapPin,
  Phone,
  Mail,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function SellerSettings() {
  const [activeTab, setActiveTab] = useState("store");

  const tabs = [
    { id: "store", label: "Store Info", icon: Store },
    { id: "policies", label: "Policies", icon: FileText },
    { id: "verification", label: "Verification", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#374151]">Store Settings</h1>
        <p className="text-gray-500 mt-1">Manage your store configuration and preferences</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-2 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#FF9900] text-white"
                    : "bg-transparent text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {activeTab === "store" && <StoreInfoTab />}
        {activeTab === "policies" && <PoliciesTab />}
        {activeTab === "verification" && <VerificationTab />}
        {activeTab === "notifications" && <NotificationsTab />}
      </div>
    </div>
  );
}

function StoreInfoTab() {
  const [formData, setFormData] = useState({
    storeName: "TreeShop Seller Store",
    description: "Premium quality trees and plants for your garden",
    website: "https://treeshop.com",
    phone: "+1 234 567 8900",
    email: "seller@treeshop.com",
    address: "123 Green Street, Portland, OR 97201",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Store information updated successfully");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-3">Store Logo</label>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 bg-[#FF9900] rounded-xl flex items-center justify-center text-white text-2xl font-semibold">
            TS
          </div>
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Logo
          </button>
          <p className="text-sm text-gray-500">PNG or JPG (max. 2MB)</p>
        </div>
      </div>

      {/* Banner Image */}
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-3">Store Banner</label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#FF9900] transition-colors cursor-pointer">
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">Click to upload banner image</p>
          <p className="text-sm text-gray-500">Recommended: 1200x300px</p>
        </div>
      </div>

      {/* Store Name */}
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-2">Store Name</label>
        <input
          type="text"
          value={formData.storeName}
          onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-2">Store Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] resize-none"
        />
      </div>

      {/* Contact Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">Website</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          type="submit"
          className="px-6 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </form>
  );
}

function PoliciesTab() {
  const [policies, setPolicies] = useState({
    return: "Returns accepted within 30 days of delivery. Items must be in original condition.",
    shipping: "Standard shipping: 5-7 business days. Express shipping: 2-3 business days.",
    faq: "Q: How do I care for my tree?\nA: Water regularly and ensure proper sunlight exposure.",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Policies updated successfully");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-2">Return Policy</label>
        <textarea
          value={policies.return}
          onChange={(e) => setPolicies({ ...policies, return: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] resize-none"
          placeholder="Describe your return policy..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#374151] mb-2">Shipping Policy</label>
        <textarea
          value={policies.shipping}
          onChange={(e) => setPolicies({ ...policies, shipping: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] resize-none"
          placeholder="Describe your shipping policy..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#374151] mb-2">FAQ</label>
        <textarea
          value={policies.faq}
          onChange={(e) => setPolicies({ ...policies, faq: e.target.value })}
          rows={6}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] resize-none"
          placeholder="Add frequently asked questions..."
        />
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          type="submit"
          className="px-6 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Policies
        </button>
      </div>
    </form>
  );
}

function VerificationTab() {
  const [verificationStatus, setVerificationStatus] = useState({
    identity: "verified",
    tax: "pending",
    bank: "not-submitted",
  });

  return (
    <div className="space-y-6">
      {/* Identity Verification */}
      <div className="border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              verificationStatus.identity === "verified" ? "bg-green-100" : "bg-yellow-100"
            }`}>
              <Shield className={`w-6 h-6 ${
                verificationStatus.identity === "verified" ? "text-green-600" : "text-yellow-600"
              }`} />
            </div>
            <div>
              <h3 className="font-medium text-[#374151]">Identity Verification</h3>
              <p className="text-sm text-gray-500">Government-issued ID</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            verificationStatus.identity === "verified"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}>
            {verificationStatus.identity === "verified" ? "Verified" : "Pending"}
          </span>
        </div>
        {verificationStatus.identity !== "verified" && (
          <button className="px-4 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload ID
          </button>
        )}
      </div>

      {/* Tax Document */}
      <div className="border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              verificationStatus.tax === "verified" ? "bg-green-100" : "bg-yellow-100"
            }`}>
              <FileText className={`w-6 h-6 ${
                verificationStatus.tax === "verified" ? "text-green-600" : "text-yellow-600"
              }`} />
            </div>
            <div>
              <h3 className="font-medium text-[#374151]">Tax Document</h3>
              <p className="text-sm text-gray-500">Business tax registration</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            verificationStatus.tax === "verified"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}>
            {verificationStatus.tax === "verified" ? "Verified" : "Pending Review"}
          </span>
        </div>
      </div>

      {/* Bank Details */}
      <div className="border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium text-[#374151]">Bank Account Details</h3>
              <p className="text-sm text-gray-500">For receiving payouts</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            Not Submitted
          </span>
        </div>
        <button className="px-4 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors">
          Add Bank Details
        </button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [notifications, setNotifications] = useState({
    orderEmail: true,
    orderSMS: false,
    orderPush: true,
    messageEmail: true,
    messageSMS: false,
    messagePush: true,
    marketingEmail: false,
    marketingSMS: false,
    marketingPush: false,
  });

  const handleToggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    toast.success("Notification preferences updated");
  };

  const NotificationRow = ({ title, description, emailKey, smsKey, pushKey }) => (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="mb-3">
        <h4 className="font-medium text-[#374151]">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={notifications[emailKey]}
            onChange={() => handleToggle(emailKey)}
            className="w-4 h-4 text-[#FF9900] border-gray-300 rounded focus:ring-[#FF9900]"
          />
          <span className="text-sm text-gray-700">Email</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={notifications[smsKey]}
            onChange={() => handleToggle(smsKey)}
            className="w-4 h-4 text-[#FF9900] border-gray-300 rounded focus:ring-[#FF9900]"
          />
          <span className="text-sm text-gray-700">SMS</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={notifications[pushKey]}
            onChange={() => handleToggle(pushKey)}
            className="w-4 h-4 text-[#FF9900] border-gray-300 rounded focus:ring-[#FF9900]"
          />
          <span className="text-sm text-gray-700">Push</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-[#374151] mb-2">Manage Notifications</h3>
        <p className="text-sm text-gray-500">Choose how you want to receive updates</p>
      </div>

      <div className="space-y-0">
        <NotificationRow
          title="Order Notifications"
          description="Get notified about new orders and order updates"
          emailKey="orderEmail"
          smsKey="orderSMS"
          pushKey="orderPush"
        />
        <NotificationRow
          title="Message Notifications"
          description="Receive alerts when buyers send you messages"
          emailKey="messageEmail"
          smsKey="messageSMS"
          pushKey="messagePush"
        />
        <NotificationRow
          title="Marketing & Promotions"
          description="Updates about new features and special offers"
          emailKey="marketingEmail"
          smsKey="marketingSMS"
          pushKey="marketingPush"
        />
      </div>
    </div>
  );
}
