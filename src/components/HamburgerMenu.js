import React, { useState, useRef, useEffect } from 'react';
import {
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  DocumentArrowDownIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  InformationCircleIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import usePaperStore from '../store/paperStore';
import { exportToPDF } from '../utils/pdfExport';

const HamburgerMenu = ({ showPaperInfo, setShowPaperInfo, onMenuToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  
  const {
    darkMode,
    toggleDarkMode,
    metadata,
    setMetadata,
    exportData,
    importData
  } = usePaperStore();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        onMenuToggle?.(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleExportPDF = async () => {
    try {
      await exportToPDF();
      setIsOpen(false);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const handleExportJSON = () => {
    try {
      const data = exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${metadata.subject || 'question-paper'}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setIsOpen(false);
    } catch (error) {
      console.error('JSON export failed:', error);
      alert('Failed to export JSON. Please try again.');
    }
  };

  const handleImportJSON = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          importData(data);
          setIsOpen(false);
          alert('Paper imported successfully!');
        } catch (error) {
          console.error('Import failed:', error);
          alert('Failed to import file. Please check the format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const menuItems = [
    {
      section: 'Navigation',
      items: [
        {
          icon: HomeIcon,
          label: 'Home',
          action: () => {
            // Save current paper first
            const currentData = exportData();
            if (currentData.sections.length > 0 || currentData.metadata.examName) {
              // Save to recent papers
              const recent = JSON.parse(localStorage.getItem('qmaker-recent-papers') || '[]');
              const paperInfo = {
                id: Date.now().toString(),
                title: currentData.metadata?.examName || 'Untitled Paper',
                subject: currentData.metadata?.subject || 'Unknown Subject',
                className: currentData.metadata?.className || 'Unknown Class',
                language: currentData.metadata?.language || 'english',
                lastModified: new Date().toLocaleDateString(),
                data: currentData
              };
              const filtered = recent.filter(p => p.title !== paperInfo.title);
              const updated = [paperInfo, ...filtered].slice(0, 10);
              localStorage.setItem('qmaker-recent-papers', JSON.stringify(updated));
            }
            
            localStorage.removeItem('qmaker-visited');
            window.location.reload();
          }
        }
      ]
    },
    {
      section: 'Export',
      items: [
        {
          icon: DocumentArrowDownIcon,
          label: 'Export PDF',
          action: handleExportPDF
        },
        {
          icon: ArrowDownTrayIcon,
          label: 'Export JSON',
          action: handleExportJSON
        }
      ]
    },
    {
      section: 'Import',
      items: [
        {
          icon: ArrowUpTrayIcon,
          label: 'Import JSON',
          action: () => document.getElementById('import-file').click()
        }
      ]
    },
    {
      section: 'Settings',
      items: [
        {
          icon: darkMode ? SunIcon : MoonIcon,
          label: darkMode ? 'Light Mode' : 'Dark Mode',
          action: () => { toggleDarkMode(); setIsOpen(false); }
        }
      ]
    }
  ];

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          onMenuToggle?.(true);
        }}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Open menu"
      >
        <Bars3Icon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" />
          <div
            ref={menuRef}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-xl transform transition-transform"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
                <button
                  onClick={() => {
                    setIsOpen(false);
            onMenuToggle?.(false);
                    onMenuToggle?.(false);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                  aria-label="Close menu"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>


              <div className="flex-1 overflow-y-auto">
                {menuItems.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800">
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {section.section}
                      </h3>
                    </div>
                    <div className="py-2">
                      {section.items.map((item, itemIndex) => (
                        <button
                          key={itemIndex}
                          onClick={item.action}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                            item.active ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <InformationCircleIcon className="w-4 h-4" />
                  <span>Qmaker v1.0.0</span>
                  <span>
                    <a
                      href="https://github.com/abdurrahmanfahim"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-emerald-600"
                      aria-label="Visit the developer's GitHub profile"
                    >
                      abdurrahmanfahim
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paper Info Modal */}
      {showPaperInfo && (
        <div className="fixed inset-0 z-[10000] bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-sm sm:max-w-md max-h-[90vh] sm:max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Paper Information</h3>
                <button
                  onClick={() => setShowPaperInfo(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                <input
                  type="text"
                  value={metadata.subject || ''}
                  onChange={(e) => setMetadata({ ...metadata, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09302f] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Mathematics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Class</label>
                <input
                  type="text"
                  value={metadata.className || ''}
                  onChange={(e) => setMetadata({ ...metadata, className: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09302f] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Class 10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">School Name</label>
                <input
                  type="text"
                  value={metadata.schoolName || ''}
                  onChange={(e) => setMetadata({ ...metadata, schoolName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09302f] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="School/Institution Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Exam Name</label>
                <input
                  type="text"
                  value={metadata.examName || ''}
                  onChange={(e) => setMetadata({ ...metadata, examName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09302f] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="First Term Examination 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  value={metadata.date || ''}
                  onChange={(e) => setMetadata({ ...metadata, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09302f] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time</label>
                <input
                  type="text"
                  value={metadata.duration || ''}
                  onChange={(e) => setMetadata({ ...metadata, duration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09302f] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="3 hours"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Marks</label>
                <input
                  type="number"
                  value={metadata.fullMarks || ''}
                  onChange={(e) => setMetadata({ ...metadata, fullMarks: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09302f] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="100"
                  min="0"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowPaperInfo(false)}
                className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input for import */}
      <input
        id="import-file"
        type="file"
        accept=".json"
        onChange={handleImportJSON}
        className="hidden"
      />
    </>
  );
};

export default HamburgerMenu;