import React from 'react';

/**
 * Reusable Button component with multiple variants and sizes
 * @param {React.ReactNode} children - Button content
 * @param {Function} onClick - Click handler
 * @param {string} variant - Button style variant (primary, secondary, outline, danger, ghost)
 * @param {string} size - Button size (sm, md, lg)
 * @param {boolean} disabled - Disabled state
 * @param {string} className - Additional CSS classes
 * @param {string} type - Button type attribute
 */
const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  className = '',
  type = 'button',
  ...props 
}) => {
  // Base styles applied to all buttons
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Button variant styles with theme support
  const variants = {
    primary: 'bg-[#09302f] dark:bg-[#4ade80] text-white dark:text-gray-900 hover:bg-[#072625] dark:hover:bg-[#22c55e] focus:ring-[#09302f] dark:focus:ring-[#4ade80]',
    secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-300',
    outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-300'
  };
  
  // Button size variations
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;