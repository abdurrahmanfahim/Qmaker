/**
 * @fileoverview Main application header with navigation, actions, and auto-save status
 * Handles PDF export, theme toggle, language selection, and keyboard shortcuts
 * @author Qmaker Team
 * @version 1.0.0
 * @since 2024
 */

import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import usePaperStore from '../store/paperStore';
import HamburgerMenu from './HamburgerMenu';

/**
 * Main application header component with responsive design
 * Provides access to all major app functions and displays auto-save status
 * @returns {JSX.Element} Rendered header component
 */
const Header = () => {
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
  
  const { 
    exportData,
    metadata,
    sections,
    previewMode,
    togglePreviewMode,
    undo,
    redo,
    canUndo,
    canRedo
  } = usePaperStore();

  // Simple auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const data = exportData();
        localStorage.setItem('qmaker-autosave', JSON.stringify(data));
        setAutoSaveStatus('saved');
      } catch (error) {
        console.error('Auto-save failed:', error);
        setAutoSaveStatus('error');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [metadata, sections, exportData]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          if (canUndo()) undo();
        } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          if (canRedo()) redo();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          if (canUndo()) undo();
        } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          if (canRedo()) redo();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);



  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Status */}
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-[#09302f] dark:text-[#d59145] tracking-tight">
              <span className="sm:hidden">Q</span>
              <span className="hidden sm:inline">Qmaker</span>
            </h1>

          </div>
        
          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Undo/Redo */}
            <div className="flex items-center gap-1">
              <button
                onClick={undo}
                disabled={!canUndo()}
                className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Undo last action"
                title="Undo (Ctrl+Z)"
              >
                <ArrowUturnLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo()}
                className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Redo last action"
                title="Redo (Ctrl+Y)"
              >
                <ArrowUturnRightIcon className="w-4 h-4" />
              </button>
            </div>
            
            {/* Preview */}
            <button
              onClick={togglePreviewMode}
              className={`p-2 rounded-lg transition-colors ${
                previewMode 
                  ? 'bg-[#09302f] text-white shadow-sm' 
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