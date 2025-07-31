import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import usePaperStore from '../store/paperStore';

const MetadataPanel = () => {
  const { metadata, setMetadata } = usePaperStore();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleChange = (field, value) => {
    setMetadata({ ...metadata, [field]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 py-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Paper Information
          </h2>
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {isExpanded && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Class
              </label>
              <input
                type="text"
                value={metadata.className}
                onChange={(e) => handleChange('className', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                placeholder="e.g., Class 10"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={metadata.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                placeholder="e.g., Mathematics"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Marks
              </label>
              <input
                type="text"
                value={metadata.fullMarks}
                onChange={(e) => handleChange('fullMarks', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                placeholder="e.g., 100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration
              </label>
              <input
                type="text"
                value={metadata.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                placeholder="e.g., 3 hours"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Exam Date
              </label>
              <input
                type="date"
                value={metadata.examDate}
                onChange={(e) => handleChange('examDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Teacher Name
              </label>
              <input
                type="text"
                value={metadata.teacherName}
                onChange={(e) => handleChange('teacherName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                placeholder="Teacher's name"
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                School/Institution
              </label>
              <input
                type="text"
                value={metadata.schoolName}
                onChange={(e) => handleChange('schoolName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                placeholder="Institution name"
              />
            </div>
            
            <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                General Instructions
              </label>
              <textarea
                value={metadata.instructions}
                onChange={(e) => handleChange('instructions', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
                placeholder="General instructions for the exam..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetadataPanel;