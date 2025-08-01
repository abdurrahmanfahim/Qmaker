import React, { useState } from 'react';
import { 
  XMarkIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  BookOpenIcon,
  LanguageIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const templates = {
  text: {
    name: 'Text',
    icon: DocumentTextIcon,
    content: '<p></p>',
    marks: 5
  },
  mcq: {
    name: 'MCQ',
    icon: CheckCircleIcon,
    content: '<p></p><p>a) </p><p>b) </p><p>c) </p><p>d) </p>',
    marks: 1
  },
  fillBlanks: {
    name: 'Fill Blanks',
    icon: PencilSquareIcon,
    content: '<p>_______</p>',
    marks: 2
  },
  shortAnswer: {
    name: 'Short',
    icon: ClipboardDocumentListIcon,
    content: '<p></p>',
    marks: 3
  },
  essay: {
    name: 'Essay',
    icon: BookOpenIcon,
    content: '<p></p>',
    marks: 10
  },
  translation: {
    name: 'Translation',
    icon: LanguageIcon,
    content: '<p></p><p></p>',
    marks: 5
  }
};

const TemplateModal = ({ isOpen, onClose, onSelect, language }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  if (!isOpen) return null;

  const handleSelect = () => {
    if (selectedTemplate) {
      onSelect(templates[selectedTemplate]);
      onClose();
      setSelectedTemplate(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] sm:max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white">
            Templates
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors touch-manipulation"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {Object.entries(templates).map(([key, template]) => (
              <button
                key={key}
                onClick={() => setSelectedTemplate(key)}
                className={`p-3 sm:p-4 border-2 rounded-lg text-left transition-all hover:shadow-md touch-manipulation active:scale-95 ${
                  selectedTemplate === key
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <template.icon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                      {template.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {template.marks}m
                    </p>
                  </div>
                </div>

              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 sm:gap-3 p-3 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm sm:text-base touch-manipulation"
          >
            Cancel
          </button>
          <button
            onClick={handleSelect}
            disabled={!selectedTemplate}
            className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base touch-manipulation"
          >
            Use
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;