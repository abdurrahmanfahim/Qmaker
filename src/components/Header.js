/**
 * @fileoverview Main application header with navigation, actions, and auto-save status
 * Handles PDF export, theme toggle, language selection, and keyboard shortcuts
 * @author Qmaker Team
 * @version 1.0.0
 * @since 2024
 */

import React, { useEffect } from 'react';
import { 
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import usePaperStore from '../store/paperStore';
import { useEditorContext } from '../contexts/EditorContext';
import HamburgerMenu from './HamburgerMenu';

/**
 * Main application header component with responsive design
 * Provides access to all major app functions and displays auto-save status
 * @returns {JSX.Element} Rendered header component
 */
const Header = () => {
  const { 
    exportData,
    metadata,
    sections,
    previewMode,
    togglePreviewMode
  } = usePaperStore();
  
  const { activeEditor } = useEditorContext();

  // Simple auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const data = exportData();
        localStorage.setItem('qmaker-autosave', JSON.stringify(data));
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [metadata, sections, exportData]);

  // Keyboard shortcuts for editor undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          if (activeEditor && activeEditor.can().undo()) {
            activeEditor.chain().focus().undo().run();
          }
        } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          if (activeEditor && activeEditor.can().redo()) {
            activeEditor.chain().focus().redo().run();
          }
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeEditor]);





  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <img 
                src="/images/logo/QMaker-logo-sm-primary.png" 
                alt="Qmaker" 
                className="h-8 w-auto sm:hidden dark:hidden"
              />
              <img 
                src="/images/logo/QMaker-logo-sm.png" 
                alt="Qmaker" 
                className="h-8 w-auto sm:hidden hidden dark:block"
              />
              <img 
                src="/images/logo/QMaker-logo-lg-primary.png" 
                alt="Qmaker" 
                className="h-8 w-auto hidden sm:block dark:hidden"
              />
              <img 
                src="/images/logo/QMaker-logo-lg.png" 
                alt="Qmaker" 
                className="h-8 w-auto hidden sm:dark:block"
              />
            </div>

          </div>
        
          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Undo/Redo */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (activeEditor && activeEditor.can().undo()) {
                    activeEditor.chain().focus().undo().run();
                  }
                }}
                disabled={!activeEditor || !activeEditor.can().undo()}
                className="p-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation active:scale-95 shadow-sm hover:shadow-md"
                aria-label="Undo text changes"
                title="Undo"
                style={{ minWidth: '48px', minHeight: '48px' }}
              >
                <ArrowUturnLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  if (activeEditor && activeEditor.can().redo()) {
                    activeEditor.chain().focus().redo().run();
                  }
                }}
                disabled={!activeEditor || !activeEditor.can().redo()}
                className="p-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation active:scale-95 shadow-sm hover:shadow-md"
                aria-label="Redo text changes"
                title="Redo"
                style={{ minWidth: '48px', minHeight: '48px' }}
              >
                <ArrowUturnRightIcon className="w-5 h-5" />
              </button>
            </div>
            
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
            
            <HamburgerMenu />
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;