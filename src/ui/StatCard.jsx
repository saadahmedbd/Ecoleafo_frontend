import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, icon: Icon, change, changeType, accentColor }) {
  const colorClasses = {
    green: 'bg-[#064232] text-white',
    sage: 'bg-[#568F87] text-white',
    pink: 'bg-[#F5BABB] text-[#064232]',
    orange: 'bg-[#F59E0B] text-white',
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-[0_2px_8px_rgba(6,66,50,0.08)]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[#666666] mb-2">{title}</p>
          <p className="text-[#1A1A1A] mb-2">{value}</p>
          {change && (
            <div className="flex items-center gap-1">
              {changeType === 'up' ? (
                <TrendingUp size={16} className="text-[#10B981]" />
              ) : (
                <TrendingDown size={16} className="text-[#EF4444]" />
              )}
              <span className={changeType === 'up' ? 'text-[#10B981]' : 'text-[#EF4444]'}>
                {change}
              </span>
              <span className="text-[#666666] text-sm ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[accentColor] || colorClasses.green}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
