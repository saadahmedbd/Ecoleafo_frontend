import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  className = '',
  ...props 
}) {
  const baseStyles = 'rounded-md transition-all duration-200 font-medium inline-flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-[#064232] text-white hover:bg-[#053526] disabled:bg-[#E5E5E5] disabled:text-[#666666]',
    secondary: 'bg-[#568F87] text-white hover:bg-[#467770] disabled:bg-[#E5E5E5] disabled:text-[#666666]',
    outline: 'bg-transparent border-2 border-[#568F87] text-[#568F87] hover:bg-[#568F87] hover:text-white disabled:border-[#E5E5E5] disabled:text-[#666666]',
    danger: 'bg-[#EF4444] text-white hover:bg-[#DC2626] disabled:bg-[#E5E5E5] disabled:text-[#666666]',
    ghost: 'bg-transparent text-[#064232] hover:bg-[#FFF5F2] disabled:text-[#666666]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
