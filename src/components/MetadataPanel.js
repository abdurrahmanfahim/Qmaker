import React, { useState, useEffect } from 'react';
import usePaperStore from '../store/paperStore';

const MetadataPanel = () => {
  const { metadata, setMetadata } = usePaperStore();
  const [isExpanded, setIsExpanded] = useState(false);
  


  useEffect(() => {
    // Auto-collapse after first use
    if (metadata.subject && metadata.className) {
      setIsExpanded(false);
    }
  }, [metadata.subject, metadata.className]);





  const handleChange = (field, value) => {
    try {
      setMetadata({ ...metadata, [field]: value });
    } catch (error) {
      console.error('Failed to update metadata:', error);
    }
  };

  return (
    <>
      {/* Clean Info Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-2">
          {!isExpanded ? (
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-gray-700 dark:text-gray-100">
                {metadata.subject || 'Subject'} • {metadata.className || 'Class'}
              </span>
              <button
                onClick={() => setIsExpanded(true)}
                className="text-sm text-[#09302f] hover:text-[#072625] font-medium px-3 py-1 rounded"
                aria-label="Edit paper information"
              >
                Edit
              </button>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              <div className="space-y-6 pb-4">
                <div className="flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 pb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Paper Information</h3>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-3 py-1 rounded"
                  >
                    Done
                  </button>
                </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                  <input
                    type="text"
                    value={metadata.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09302f] focus:border-[#09302f] text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Mathematics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Class</label>
                  <input
                    type="text"
                    value={metadata.className}
                    onChange={(e) => handleChange('className', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09302f] focus:border-[#09302f] text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Class 10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">School Name</label>
                <input
                  type="text"
                  value={metadata.schoolName || ''}
                  onChange={(e) => handleChange('schoolName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09302f] focus:border-[#09302f] text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="School/Institution Name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Exam Name</label>
                <input
                  type="text"
                  value={metadata.examName}
                  onChange={(e) => handleChange('examName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09302f] focus:border-[#09302f] text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="First Term Examination 2024"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={metadata.date || ''}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09302f] focus:border-[#09302f] text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time</label>
                  <input
                    type="text"
                    value={metadata.duration || ''}
                    onChange={(e) => handleChange('duration', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09302f] focus:border-[#09302f] text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="3 hours"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Marks</label>
                  <input
                    type="number"
                    value={metadata.fullMarks || ''}
                    onChange={(e) => handleChange('fullMarks', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09302f] focus:border-[#09302f] text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="100"
                    min="0"
                  />
                </div>
              </div>
              

              </div>
            </div>
          )}
        </div>
      </div>




    </>
  );
};

export default MetadataPanel;