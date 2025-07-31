import React from 'react';
import { 
  SunIcon, 
  MoonIcon, 
  EyeIcon, 
  DocumentArrowDownIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';
import usePaperStore from '../store/paperStore';
import { exportToPDF } from '../utils/pdfExport';

const Header = () => {
  const { 
    darkMode, 
    toggleDarkMode, 
    previewMode, 
    togglePreviewMode,
    exportData,
    importData
  } = usePaperStore();

  const handleExportPDF = async () => {
    await exportToPDF();
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
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
            <span className="hidden sm:inline">Question Paper Builder</span>
            <span className="sm:hidden">QPB</span>
          </h1>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-green-100 dark:bg-green-900 px-2 py-1 rounded">
            Auto-saved
          </span>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-3">
          <button
            onClick={togglePreviewMode}
            className={`px-2 sm:px-4 py-2 rounded-lg transition-colors flex items-center space-x-1 sm:space-x-2 text-sm ${
              previewMode 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <EyeIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{previewMode ? 'Exit Preview' : 'Preview'}</span>
          </button>
          
          <button
            onClick={handleExportPDF}
            className="px-2 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 sm:space-x-2 text-sm"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
          
          <div className="hidden sm:flex items-center space-x-2">
            <button
              onClick={handleExportJSON}
              className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-1"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>Export</span>
            </button>
            
            <label className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer flex items-center space-x-1">
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
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {darkMode ? (
              <SunIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            ) : (
              <MoonIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;