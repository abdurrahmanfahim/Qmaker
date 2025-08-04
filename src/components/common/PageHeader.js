import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

/**
 * Reusable Page Header component with back button and content areas
 * @param {string} title - Page title
 * @param {string} subtitle - Page subtitle (optional)
 * @param {Function} onBack - Back button click handler
 * @param {React.ReactNode} rightContent - Content for right side (optional)
 * @param {string} className - Additional CSS classes
 */
const PageHeader = ({ 
  title, 
  subtitle, 
  onBack, 
  rightContent,
  className = ''
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header content with back button and title */}
        <div className="flex items-center gap-4 mb-4">
          {/* Back button (optional) */}
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          )}
          {/* Title and subtitle area */}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-300">{subtitle}</p>
            )}
          </div>
        </div>
        {/* Right content area (search bars, buttons, etc.) */}
        {rightContent && (
          <div>{rightContent}</div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;