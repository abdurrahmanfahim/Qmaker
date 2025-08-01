/**
 * @fileoverview Advanced export modal with multiple format options
 * Provides comprehensive export functionality including batch operations
 * @author Qmaker Team
 * @version 1.0.0
 * @since 2024
 */

import React, { useState } from 'react';
import { 
  XMarkIcon, 
  DocumentArrowDownIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { exportToPDF, exportOptions } from '../utils/pdfExport';
import { exportToWord, exportToHTML, exportFormats } from '../utils/exportFormats';
import usePaperStore from '../store/paperStore';

/**
 * Advanced export modal component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close modal callback
 * @returns {JSX.Element} Export modal component
 */
const ExportModal = ({ isOpen, onClose }) => {
  const { exportData } = usePaperStore();
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedPDFOption, setSelectedPDFOption] = useState('standard');
  const [isExporting, setIsExporting] = useState(false);
  const [customFilename, setCustomFilename] = useState('');

  if (!isOpen) return null;

  /**
   * Handle export based on selected format
   */
  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const paperData = exportData();
      const filename = customFilename || `question-paper-${new Date().toISOString().split('T')[0]}`;
      
      switch (selectedFormat) {
        case 'pdf':
          const pdfOptions = { 
            ...exportOptions[selectedPDFOption],
            filename: `${filename}.pdf`
          };
          await exportToPDF(pdfOptions);
          break;
          
        case 'word':
          await exportToWord(paperData, { filename: `${filename}.docx` });
          break;
          
        case 'html':
          exportToHTML(paperData, { filename: `${filename}.html` });
          break;
          
        case 'json':
          const jsonData = JSON.stringify(paperData, null, 2);
          const blob = new Blob([jsonData], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${filename}.json`;
          a.click();
          URL.revokeObjectURL(url);
          break;
      }
      
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const formatIcons = {
    pdf: DocumentArrowDownIcon,
    word: DocumentTextIcon,
    html: GlobeAltIcon,
    json: CodeBracketIcon
  };

  return (
    <div className=\"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4\">
      <div className=\"bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden\">
        {/* Header */}
        <div className=\"flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700\">
          <h2 className=\"text-xl font-semibold text-gray-900 dark:text-white\">
            Export Question Paper
          </h2>
          <button
            onClick={onClose}
            className=\"p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors\"
            aria-label=\"Close export modal\"
          >
            <XMarkIcon className=\"w-5 h-5 text-gray-500\" />
          </button>
        </div>

        {/* Content */}
        <div className=\"p-6 space-y-6\">
          {/* Format Selection */}
          <div>
            <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3\">
              Export Format
            </label>
            <div className=\"grid grid-cols-2 gap-3\">
              {Object.entries(exportFormats).map(([key, format]) => {
                const IconComponent = formatIcons[key];
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedFormat(key)}
                    className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                      selectedFormat === key
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className=\"flex items-center gap-3 mb-2\">
                      <IconComponent className=\"w-6 h-6 text-gray-600 dark:text-gray-400\" />
                      <span className=\"font-medium text-gray-900 dark:text-white\">
                        {format.name}
                      </span>
                    </div>
                    <p className=\"text-xs text-gray-500 dark:text-gray-400\">
                      {format.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PDF Options */}
          {selectedFormat === 'pdf' && (
            <div>
              <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3\">
                PDF Options
              </label>
              <select
                value={selectedPDFOption}
                onChange={(e) => setSelectedPDFOption(e.target.value)}
                className=\"w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent\"
              >
                <option value=\"standard\">A4 Portrait (Standard)</option>
                <option value=\"landscape\">A4 Landscape</option>
                <option value=\"letter\">Letter Size</option>
                <option value=\"compact\">Compact (Small margins)</option>
                <option value=\"large\">Large (A3 size)</option>
              </select>
            </div>
          )}

          {/* Custom Filename */}
          <div>
            <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2\">
              Filename (optional)
            </label>
            <input
              type=\"text\"
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
              className=\"w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent\"
              placeholder=\"question-paper-2024\"
            />
            <p className=\"mt-1 text-xs text-gray-500 dark:text-gray-400\">
              Extension will be added automatically
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className=\"flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700\">
          <button
            onClick={onClose}
            className=\"px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors\"
            disabled={isExporting}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className=\"px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2\"
          >
            {isExporting ? (
              <>
                <div className=\"w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin\"></div>
                Exporting...
              </>
            ) : (
              <>
                <DocumentArrowDownIcon className=\"w-4 h-4\" />
                Export
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;