import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Reusable Modal component with backdrop and close functionality
 * @param {boolean} isOpen - Controls modal visibility
 * @param {Function} onClose - Close handler function
 * @param {string} title - Modal title (optional)
 * @param {React.ReactNode} children - Modal content
 * @param {string} size - Modal size (sm, md, lg, xl, 2xl)
 * @param {boolean} showCloseButton - Show/hide close button
 * @param {string} className - Additional CSS classes
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  className = ''
}) => {
  // Don't render if modal is closed
  if (!isOpen) return null;

  // Modal size configurations
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  return (
    // Modal backdrop with overlay
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Modal container with responsive sizing */}
      <div className={`bg-white dark:bg-gray-800 rounded-xl w-full ${sizes[size]} max-h-[80vh] overflow-y-auto ${className}`}>
        {/* Modal header with title and close button */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
            {title && (
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        )}
        {/* Modal content area */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;