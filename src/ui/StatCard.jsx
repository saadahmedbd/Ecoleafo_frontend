// src/ui/StatCard.jsx
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'neutral', 
  accentColor = 'green' 
}) {
  // Accent color configurations
  const accentColors = {
    green: {
      bg: 'bg-[#064232]',
      text: 'text-[#064232]',
      light: 'bg-[#064232]/10',
    },
    sage: {
      bg: 'bg-[#568F87]',
      text: 'text-[#568F87]',
      light: 'bg-[#568F87]/10',
    },
    pink: {
      bg: 'bg-[#F5BABB]',
      text: 'text-[#F5BABB]',
      light: 'bg-[#F5BABB]/20',
    },
    orange: {
      bg: 'bg-[#F59E0B]',
      text: 'text-[#F59E0B]',
      light: 'bg-[#F59E0B]/10',
    },
  };

  const colors = accentColors[accentColor] || accentColors.green;

  // Change type icons and colors
  const changeConfig = {
    up: {
      icon: TrendingUp,
      color: 'text-[#10B981]',
      bg: 'bg-[#10B981]/10',
    },
    down: {
      icon: TrendingDown,
      color: 'text-[#EF4444]',
      bg: 'bg-[#EF4444]/10',
    },
    neutral: {
      icon: Minus,
      color: 'text-[#6B7280]',
      bg: 'bg-[#6B7280]/10',
    },
  };

  const ChangeIcon = changeConfig[changeType]?.icon || Minus;

  return (
    <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6 hover:shadow-[0_4px_12px_rgba(6,66,50,0.12)] transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#666666] text-sm font-medium">{title}</h3>
        <div className={`p-2 rounded-lg ${colors.light}`}>
          <Icon className={colors.text} size={20} />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-[#1A1A1A] text-2xl md:text-3xl font-bold">{value}</p>
        
        {change && (
          <div className="flex items-center gap-1">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${changeConfig[changeType]?.bg}`}>
              <ChangeIcon size={14} className={changeConfig[changeType]?.color} />
              <span className={`text-xs font-medium ${changeConfig[changeType]?.color}`}>
                {change}
              </span>
            </div>
            <span className="text-xs text-[#666666]">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}