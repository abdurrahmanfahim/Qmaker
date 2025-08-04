import React from 'react';

/**
 * Reusable Empty State component for no-content scenarios
 * @param {React.Component} icon - Icon component to display
 * @param {string} title - Empty state title
 * @param {string} description - Empty state description (optional)
 * @param {React.ReactNode} action - Action button or element (optional)
 * @param {string} className - Additional CSS classes
 */
const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {/* Empty state icon */}
      {Icon && (
        <Icon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
      )}
      {/* Empty state title */}
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      {/* Empty state description */}
      {description && (
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {description}
        </p>
      )}
      {/* Action button or element */}
      {action && action}
    </div>
  );
};

export default EmptyState;