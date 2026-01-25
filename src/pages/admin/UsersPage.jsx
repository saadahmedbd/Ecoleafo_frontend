//unified buyer and seller page
import React, { useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Users, Store } from 'lucide-react';
import BuyersListPage from './BuyersListPage';
import SellersListPage from './SellersListPage';

export default function UsersPage() {
  usePageTitle('Users Management');
  const [activeSection, setActiveSection] = useState('buyers');

  const sections = [
    { id: 'buyers', label: 'Buyers', icon: Users },
    { id: 'sellers', label: 'Sellers', icon: Store },
  ];

  return (
    <div className="space-y-6">
      {/* Section Switcher */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-2">
        <div className="flex gap-2">
          {sections.map(section => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-md transition-all ${
                  activeSection === section.id
                    ? 'bg-[#064232] text-white shadow-md'
                    : 'text-[#666666] hover:bg-[#FFF5F2]'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {activeSection === 'buyers' && <BuyersListPage />}
      {activeSection === 'sellers' && <SellersListPage />}
    </div>
  );
}