import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const handleReload = () => {
    window.location.reload();
  };

  const handleReset = () => {
    // Clear localStorage and reset
    localStorage.removeItem('qmaker-autosave');
    resetErrorBoundary();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <ExclamationTriangleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Something went wrong
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We encountered an unexpected error. Your work is automatically saved.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 bg-[#09302f] text-white rounded-lg hover:bg-[#072625] dark:bg-[#4ade80] dark:text-gray-900 dark:hover:bg-[#22c55e] font-medium transition-colors flex items-center justify-center gap-2"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Try Again
          </button>
          
          <button
            onClick={handleReload}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
          >
            Reload Page
          </button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer">Error Details</summary>
            <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;