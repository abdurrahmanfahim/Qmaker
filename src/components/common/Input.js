import React from 'react';

/**
 * Reusable Input component with label and error handling
 * @param {string} label - Input label text
 * @param {string} error - Error message to display
 * @param {string} className - Additional CSS classes for input
 * @param {string} containerClassName - CSS classes for container
 * @param {string} type - Input type attribute
 */
const Input = ({ 
  label, 
  error, 
  className = '', 
  containerClassName = '',
  type = 'text',
  ...props 
}) => {
  return (
    <div className={containerClassName}>
      {/* Input label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      {/* Input field with theme support and error states */}
      <input
        type={type}
        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09302f] dark:focus:ring-[#4ade80] focus:border-[#09302f] dark:focus:border-[#4ade80] bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all ${
          error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {/* Error message display */}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;