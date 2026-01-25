import React, { useState } from 'react';
import Button from '../../ui/Button';
import { Settings, CreditCard, Truck, DollarSign, Mail, Globe, Shield } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function SettingsPage() {
  usePageTitle('Settings');
  const [activeTab, setActiveTab] = useState('general');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'commission', label: 'Commission', icon: DollarSign },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'seo', label: 'SEO', icon: Globe },
    { id: 'maintenance', label: 'Maintenance', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#1A1A1A] mb-2">Settings</h1>
        <p className="text-[#666666]">Configure your platform settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-2">
            <div className="space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#064232] text-white'
                        : 'text-[#666666] hover:bg-[#FFF5F2]'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-[#1A1A1A]">General Settings</h2>
                
                <div>
                  <label className="block text-[#666666] mb-2">Site Name</label>
                  <input
                    type="text"
                    defaultValue="E-Commerce Admin"
                    className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-[#666666] mb-2">Contact Email</label>
                  <input
                    type="email"
                    defaultValue="admin@ecommerce.com"
                    className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-[#666666] mb-2">Contact Phone</label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-[#666666] mb-2">Business Address</label>
                  <textarea
                    rows="3"
                    defaultValue="123 Business St, Suite 100, New York, NY 10001"
                    className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#666666] mb-2">Timezone</label>
                    <select className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]">
                      <option>America/New_York (EST)</option>
                      <option>America/Los_Angeles (PST)</option>
                      <option>Europe/London (GMT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-2">Currency</label>
                    <select className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                </div>

                <Button variant="primary">Save Changes</Button>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h2 className="text-[#1A1A1A]">Payment Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-[#E5E5E5] rounded-lg">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                      <div>
                        <p className="text-[#1A1A1A]">Stripe</p>
                        <p className="text-sm text-[#666666]">Accept credit card payments</p>
                      </div>
                    </div>
                    <span className="text-[#10B981]">Active</span>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-[#E5E5E5] rounded-lg">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                      <div>
                        <p className="text-[#1A1A1A]">PayPal</p>
                        <p className="text-sm text-[#666666]">Accept PayPal payments</p>
                      </div>
                    </div>
                    <span className="text-[#10B981]">Active</span>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-[#E5E5E5] rounded-lg">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-5 h-5" />
                      <div>
                        <p className="text-[#1A1A1A]">Cash on Delivery</p>
                        <p className="text-sm text-[#666666]">Accept cash payments</p>
                      </div>
                    </div>
                    <span className="text-[#666666]">Inactive</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[#666666] mb-2">Stripe API Key</label>
                  <input
                    type="password"
                    defaultValue="sk_test_••••••••••••••••"
                    className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
                  />
                </div>

                <Button variant="primary">Save Changes</Button>
              </div>
            )}

            {activeTab === 'commission' && (
              <div className="space-y-6">
                <h2 className="text-[#1A1A1A]">Commission Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#666666] mb-2">Default Commission Rate (%)</label>
                    <input
                      type="number"
                      defaultValue="10"
                      className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-2">Minimum Payout Amount ($)</label>
                    <input
                      type="number"
                      defaultValue="100"
                      className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-2">Payout Processing Days</label>
                    <input
                      type="number"
                      defaultValue="7"
                      className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
                    />
                  </div>
                </div>

                <div className="p-4 bg-[#FFF5F2] border border-[#F5BABB] rounded-lg">
                  <p className="text-[#064232]">
                    <strong>Note:</strong> Changes to commission rates will only affect new orders. Existing orders will maintain their original commission rate.
                  </p>
                </div>

                <Button variant="primary">Save Changes</Button>
              </div>
            )}

            {activeTab === 'maintenance' && (
              <div className="space-y-6">
                <h2 className="text-[#1A1A1A]">Maintenance Mode</h2>
                
                <div className="flex items-center justify-between p-6 border border-[#E5E5E5] rounded-lg">
                  <div>
                    <p className="text-[#1A1A1A] mb-1">Enable Maintenance Mode</p>
                    <p className="text-sm text-[#666666]">Display maintenance page to visitors</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={maintenanceMode}
                      onChange={(e) => setMaintenanceMode(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#E5E5E5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#064232]"></div>
                  </label>
                </div>

                {maintenanceMode && (
                  <>
                    <div>
                      <label className="block text-[#666666] mb-2">Maintenance Message</label>
                      <textarea
                        rows="4"
                        defaultValue="We are currently performing scheduled maintenance. We'll be back shortly!"
                        className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#666666] mb-2">Expected End Time</label>
                      <input
                        type="datetime-local"
                        className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#666666] mb-2">Allowed IP Addresses (one per line)</label>
                      <textarea
                        rows="3"
                        placeholder="192.168.1.1&#10;192.168.1.2"
                        className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
                      />
                    </div>
                  </>
                )}

                <Button variant="primary">Save Changes</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
