import React from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';
import usePaperStore from '../store/paperStore';

const ReviewButton = ({ showTableModal }) => {
  const { previewMode, togglePreviewMode } = usePaperStore();
  
  return (
    <button
      onClick={togglePreviewMode}
      className={`fixed bottom-20 right-4 p-3 rounded-full shadow-lg transition-colors ${showTableModal ? 'z-[50]' : 'z-[10000]'} ${
        previewMode 
          ? 'bg-[#09302f] dark:bg-[#4ade80] text-white dark:text-gray-900 shadow-sm' 
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
      }`}
      aria-label={previewMode ? 'Exit preview mode' : 'Enter preview mode'}
      title="Preview Mode"
      style={{ minWidth: '56px', minHeight: '56px' }}
    >
      <EyeIcon className="w-5 h-5" />
    </button>
  );
};

export default ReviewButton;