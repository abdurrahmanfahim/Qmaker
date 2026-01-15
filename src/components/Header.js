/**
 * @fileoverview Main application header with navigation, actions, and auto-save status
 * Handles PDF export, theme toggle, language selection, and keyboard shortcuts
 * @author Qmaker Team
 * @version 1.0.0
 * @since 2024
 */

import React, { useEffect } from 'react';
import { 
  EyeIcon,
  InformationCircleIcon,
  HomeIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import usePaperStore from '../store/paperStore';

import HamburgerMenu from './HamburgerMenu';
import { saveRecentPaper } from '../utils/recentPapers';

/**
 * Main application header component with responsive design
 * Provides access to all major app functions and displays auto-save status
 * @returns {JSX.Element} Rendered header component
 */
const Header = ({ onMenuToggle }) => {
  const { 
    exportData,
    metadata,
    sections,
    previewMode,
    togglePreviewMode
  } = usePaperStore();
  

  const [showPaperInfo, setShowPaperInfo] = React.useState(false);
  
  // Check if required fields are filled
  const hasRequiredInfo = metadata.subject && metadata.className && metadata.examName;
  const showError = !hasRequiredInfo;

  // Simple auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const data = exportData();
        const jsonStr = JSON.stringify(data);
        const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
        localStorage.setItem('qmaker-autosave', encoded);
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [metadata, sections, exportData]);







  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-2 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center pl-2 sm:pl-0">
              <img 
                src="/images/logo/QMaker-logo-sm-primary.png" 
                alt="Qmaker" 
                className="h-8 w-auto sm:hidden dark:hidden"
                width="32"
                height="32"
              />
              <img 
                src="/images/logo/QMaker-logo-sm.png" 
                alt="Qmaker" 
                className="h-8 w-auto sm:hidden hidden dark:block"
                width="32"
                height="32"
              />
              <img 
                src="/images/logo/QMaker-logo-lg-primary.png" 
                alt="Qmaker" 
                className="h-8 w-auto hidden sm:block dark:hidden"
                width="120"
                height="32"
              />
              <img 
                src="/images/logo/QMaker-logo-lg.png" 
                alt="Qmaker" 
                className="h-8 w-auto hidden sm:dark:block"
                width="120"
                height="32"
              />
            </div>

          </div>
        
          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Back to Dashboard */}
            <button
              onClick={() => {
                // Save current paper before going back
                const currentData = exportData();
                if (currentData.sections.length > 0 || currentData.metadata.examName) {
                  saveRecentPaper(currentData);
                }
                
                localStorage.removeItem('qmaker-visited');
                window.location.reload();
              }}
              className="p-2 rounded-lg transition-colors text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              aria-label="Back to Dashboard"
              title="Back to Dashboard"
            >
              <HomeIcon className="w-4 h-4" />
            </button>
            
            {/* New Paper */}
            <button
              onClick={() => {
                // Save current paper
                const currentData = exportData();
                if (currentData.sections.length > 0 || currentData.metadata.examName) {
                  saveRecentPaper(currentData);
                }
                
                // Clear for new paper
                localStorage.removeItem('paper-storage');
                localStorage.removeItem('qmaker-autosave');
                window.location.reload();
              }}
              className="p-2 rounded-lg transition-colors text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              aria-label="New Paper"
              title="New Paper"
            >
              <PlusIcon className="w-4 h-4" />
            </button>

            {/* Page Info */}
            <button
              onClick={() => setShowPaperInfo(true)}
              className={`relative p-2 rounded-lg transition-colors ${
                showError 
                  ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' 
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
              aria-label={showError ? 'Paper information - Missing required fields' : 'Paper information'}
              title={showError ? 'Paper Info - Missing required fields' : 'Paper Info'}
            >
              <InformationCircleIcon className="w-4 h-4" />
              {showError && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>
            
            {/* Preview */}
            <button
              onClick={togglePreviewMode}
              className={`p-2 rounded-lg transition-colors ${
                previewMode 
                  ? 'bg-[#09302f] dark:bg-[#4ade80] text-white dark:text-gray-900 shadow-sm' 
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
              aria-label={previewMode ? 'Exit preview mode' : 'Enter preview mode'}
              title="Preview Mode"
            >
              <EyeIcon className="w-4 h-4" />
            </button>
            
            <HamburgerMenu 
          showPaperInfo={showPaperInfo} 
          setShowPaperInfo={setShowPaperInfo}
          onMenuToggle={onMenuToggle}
        />
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;