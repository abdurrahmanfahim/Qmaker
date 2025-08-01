import React, { useState, useRef, useEffect } from 'react';
import {
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  DocumentArrowDownIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import usePaperStore from '../store/paperStore';
import { exportToPDF } from '../utils/pdfExport';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  
  const {
    darkMode,
    toggleDarkMode,
    metadata,
    setLanguage,
    exportData,
    importData
  } = usePaperStore();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
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
        onClick={() => setIsOpen(true)}
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
            className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl transform transition-transform"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                  aria-label="Close menu"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Language Selector */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={metadata.language}
                  onChange={(e) => { setLanguage(e.target.value); setIsOpen(false); }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09302f] focus:border-[#09302f] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="english">English</option>
                  <option value="bangla">বাংলা</option>
                  <option value="arabic">العربية</option>
                  <option value="urdu">اردو</option>
                </select>
              </div>

              {/* Menu Items */}
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
                            item.active ? 'bg-[#09302f] text-white hover:bg-[#072625]' : 'text-gray-700 dark:text-gray-300'
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
                </div>
              </div>
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