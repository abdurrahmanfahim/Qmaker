import React, { useState, useRef, useEffect } from 'react';
import { 
  SunIcon, 
  MoonIcon, 
  EyeIcon, 
  DocumentArrowDownIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  EllipsisVerticalIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import usePaperStore from '../store/paperStore';
import { exportToPDF, exportOptions } from '../utils/pdfExport';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';

const Header = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved'); // 'saving', 'saved', 'error'
  const [lastSaved, setLastSaved] = useState(new Date());
  const dropdownRef = useRef(null);
  
  const { 
    darkMode, 
    toggleDarkMode, 
    previewMode, 
    togglePreviewMode,
    exportData,
    importData,
    undo,
    redo,
    canUndo,
    canRedo,
    metadata,
    sections,
    setLanguage
  } = usePaperStore();

  // Auto-save functionality
  useEffect(() => {
    const saveData = () => {
      try {
        setAutoSaveStatus('saving');
        const data = exportData();
        localStorage.setItem('qmaker-autosave', JSON.stringify({
          data,
          timestamp: new Date().toISOString()
        }));
        setAutoSaveStatus('saved');
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
        setAutoSaveStatus('error');
      }
    };

    const timeoutId = setTimeout(saveData, 2000); // Save after 2 seconds of inactivity
    return () => clearTimeout(timeoutId);
  }, [metadata, sections, exportData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === 'z' && !event.shiftKey) {
          event.preventDefault();
          undo();
        } else if ((event.key === 'y') || (event.key === 'z' && event.shiftKey)) {
          event.preventDefault();
          redo();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const handleExportPDF = async (format = 'standard') => {
    await exportToPDF(exportOptions[format]);
  };

  const handleExportJSON = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `question-paper-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          importData(data);
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and status */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Qmaker
          </h1>
          {/* Auto-save status */}
          <div className="hidden sm:flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all ${
              autoSaveStatus === 'saving' 
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                : autoSaveStatus === 'saved'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
            }`}>
              {autoSaveStatus === 'saving' && (
                <>
                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              )}
              {autoSaveStatus === 'saved' && (
                <>
                  <CheckCircleIcon className="w-3 h-3" />
                  <span>Saved</span>
                </>
              )}
              {autoSaveStatus === 'error' && (
                <>
                  <ExclamationTriangleIcon className="w-3 h-3" />
                  <span>Error</span>
                </>
              )}
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500" title={`Last saved: ${lastSaved.toLocaleString()}`}>
              {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        
        {/* Mobile auto-save status */}
        <div className="sm:hidden flex items-center gap-2 min-w-0">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            autoSaveStatus === 'saving' 
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
              : autoSaveStatus === 'saved'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          }`}>
            {autoSaveStatus === 'saving' && <div className="w-2 h-2 border border-current border-t-transparent rounded-full animate-spin"></div>}
            {autoSaveStatus === 'saved' && <CheckCircleIcon className="w-3 h-3" />}
            {autoSaveStatus === 'error' && <ExclamationTriangleIcon className="w-3 h-3" />}
          </div>
        </div>
        
        {/* Right side - Actions */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Undo/Redo buttons */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={undo}
              disabled={!canUndo()}
              className="min-h-[44px] min-w-[44px] p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              title="Undo (Ctrl+Z)"
            >
              <ArrowUturnLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo()}
              className="min-h-[44px] min-w-[44px] p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              title="Redo (Ctrl+Y)"
            >
              <ArrowUturnRightIcon className="w-4 h-4" />
            </button>
          </div>
          
          {/* Primary actions - always visible */}
          <button
            onClick={togglePreviewMode}
            className={`min-h-[44px] min-w-[44px] px-2 sm:px-3 py-2 rounded-lg transition-all flex items-center justify-center gap-1 sm:gap-2 text-sm font-medium shadow-sm ${
              previewMode 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title={previewMode ? 'Exit Preview' : 'Preview'}
          >
            <EyeIcon className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">{previewMode ? 'Exit' : 'Preview'}</span>
          </button>
          
          {/* PDF Export with dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => handleExportPDF()}
              className="min-h-[44px] min-w-[44px] px-2 sm:px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-1 sm:gap-2 text-sm font-medium shadow-sm"
              title="Export PDF"
            >
              <DocumentArrowDownIcon className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          </div>
          
          {/* Language selector */}
          <div className="relative">
            <select
              value={metadata.language}
              onChange={(e) => setLanguage(e.target.value)}
              className="pl-8 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[85px] appearance-none shadow-sm hover:shadow-md transition-all font-medium cursor-pointer"
              title="Select Language"
            >
              <option value="english">EN</option>
              <option value="bangla">বাং</option>
              <option value="arabic">عر</option>
              <option value="urdu">اردو</option>
            </select>
            <img 
              src={`https://flagcdn.com/w20/${
                metadata.language === 'english' ? 'gb' : 
                metadata.language === 'bangla' ? 'bd' :
                metadata.language === 'arabic' ? 'sa' : 'pk'
              }.png`}
              alt="Flag"
              className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-3 pointer-events-none rounded-sm shadow-sm"
            />
            <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          
          {/* Desktop secondary actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* PDF Export Dropdown */}
            <div className="relative group">
              <button className="min-h-[44px] px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center gap-2 font-medium shadow-sm">
                <DocumentArrowDownIcon className="w-4 h-4" />
                <span>PDF Options</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-200 dark:border-gray-700">
                  Standard Formats
                </div>
                <button
                  onClick={() => handleExportPDF('standard')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <span>📄</span> A4 Portrait
                </button>
                <button
                  onClick={() => handleExportPDF('landscape')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <span>📄</span> A4 Landscape
                </button>
                <button
                  onClick={() => handleExportPDF('letter')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <span>📄</span> Letter Size
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Special Formats
                </div>
                <button
                  onClick={() => handleExportPDF('compact')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <span>📋</span> Compact (Small margins)
                </button>
                <button
                  onClick={() => handleExportPDF('large')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <span>📊</span> Large (A3 size)
                </button>
              </div>
            </div>
            
            <button
              onClick={handleExportJSON}
              className="min-h-[44px] px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center gap-2 font-medium shadow-sm"
              title="Export JSON"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>Export</span>
            </button>
            
            <label className="min-h-[44px] px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all cursor-pointer flex items-center gap-2 font-medium shadow-sm"
              title="Import JSON"
            >
              <ArrowUpTrayIcon className="w-4 h-4" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>
          </div>
          
          {/* Mobile dropdown menu */}
          <div className="md:hidden relative" ref={dropdownRef}>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="min-h-[44px] min-w-[44px] p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all shadow-sm flex items-center justify-center"
              title="More options"
            >
              <EllipsisVerticalIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            
            {/* Dropdown menu */}
            {showMobileMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-200 dark:border-gray-700">
                  PDF Export Options
                </div>
                <button
                  onClick={() => {
                    handleExportPDF('standard');
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  PDF (A4 Portrait)
                </button>
                <button
                  onClick={() => {
                    handleExportPDF('landscape');
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  PDF (A4 Landscape)
                </button>
                <button
                  onClick={() => {
                    handleExportPDF('letter');
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  PDF (Letter Size)
                </button>
                <button
                  onClick={() => {
                    handleExportPDF('compact');
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  PDF (Compact)
                </button>
                <button
                  onClick={() => {
                    handleExportPDF('large');
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  PDF (Large A3)
                </button>
                
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                    </svg>
                    Language
                  </h3>
                </div>
                <div className="p-3 space-y-1">
                  <button
                    onClick={() => {
                      setLanguage('english');
                      setShowMobileMenu(false);
                    }}
                    className={`w-full px-4 py-3 text-sm rounded-xl flex items-center gap-3 transition-all font-medium ${
                      metadata.language === 'english' 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-800'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:shadow-sm'
                    }`}
                  >
                    <img src="https://flagcdn.com/w20/gb.png" alt="English" className="w-6 h-4 rounded-sm shadow-sm" />
                    <span className="flex-1 text-left">English</span>
                    {metadata.language === 'english' && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('bangla');
                      setShowMobileMenu(false);
                    }}
                    className={`w-full px-4 py-3 text-sm rounded-xl flex items-center gap-3 transition-all font-medium ${
                      metadata.language === 'bangla' 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-800'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:shadow-sm'
                    }`}
                  >
                    <img src="https://flagcdn.com/w20/bd.png" alt="Bangla" className="w-6 h-4 rounded-sm shadow-sm" />
                    <span className="flex-1 text-left">বাংলা</span>
                    {metadata.language === 'bangla' && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('arabic');
                      setShowMobileMenu(false);
                    }}
                    className={`w-full px-4 py-3 text-sm rounded-xl flex items-center gap-3 transition-all font-medium ${
                      metadata.language === 'arabic' 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-800'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:shadow-sm'
                    }`}
                  >
                    <img src="https://flagcdn.com/w20/sa.png" alt="Arabic" className="w-6 h-4 rounded-sm shadow-sm" />
                    <span className="flex-1 text-right">العربية</span>
                    {metadata.language === 'arabic' && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('urdu');
                      setShowMobileMenu(false);
                    }}
                    className={`w-full px-4 py-3 text-sm rounded-xl flex items-center gap-3 transition-all font-medium ${
                      metadata.language === 'urdu' 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-800'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:shadow-sm'
                    }`}
                  >
                    <img src="https://flagcdn.com/w20/pk.png" alt="Urdu" className="w-6 h-4 rounded-sm shadow-sm" />
                    <span className="flex-1 text-right">اردو</span>
                    <div className="w-2 h-2 bg-blue-600 rounded-full" style={{opacity: metadata.language === 'urdu' ? 1 : 0}}></div>
                  </button>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                
                <button
                  onClick={() => {
                    handleExportJSON();
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  Export JSON
                </button>
                
                <label className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 cursor-pointer transition-colors">
                  <ArrowUpTrayIcon className="w-4 h-4" />
                  Import JSON
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      handleImportJSON(e);
                      setShowMobileMenu(false);
                    }}
                    className="hidden"
                  />
                </label>
                
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                
                <button
                  onClick={() => {
                    toggleDarkMode();
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                >
                  {darkMode ? (
                    <>
                      <SunIcon className="w-4 h-4" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <MoonIcon className="w-4 h-4" />
                      Dark Mode
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
          
          {/* Desktop dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="hidden md:flex min-h-[44px] min-w-[44px] p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all shadow-sm items-center justify-center"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <SunIcon className="w-5 h-5 text-yellow-500" />
            ) : (
              <MoonIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>
      
      <KeyboardShortcutsModal 
        isOpen={showShortcutsModal} 
        onClose={() => setShowShortcutsModal(false)} 
      />
    </header>
  );
};

export default Header;