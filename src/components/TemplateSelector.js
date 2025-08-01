import React from 'react';
import { 
  DocumentTextIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  BookOpenIcon,
  LanguageIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const templates = [
  {
    id: 'text',
    name: 'Text Question',
    icon: DocumentTextIcon,
    content: '<p>Write your question here...</p>',
    marks: 5
  },
  {
    id: 'mcq',
    name: 'Multiple Choice',
    icon: CheckCircleIcon,
    content: '<p>Question text here:</p><p>a) Option A</p><p>b) Option B</p><p>c) Option C</p><p>d) Option D</p>',
    marks: 1
  },
  {
    id: 'fillBlanks',
    name: 'Fill in the Blanks',
    icon: PencilSquareIcon,
    content: '<p>Complete the sentence: The capital of Bangladesh is _______.</p>',
    marks: 2
  },
  {
    id: 'shortAnswer',
    name: 'Short Answer',
    icon: ClipboardDocumentListIcon,
    content: '<p>Answer in 2-3 sentences:</p>',
    marks: 3
  },
  {
    id: 'essay',
    name: 'Essay Question',
    icon: BookOpenIcon,
    content: '<p>Write a detailed essay on:</p>',
    marks: 10
  },
  {
    id: 'translation',
    name: 'Translation',
    icon: LanguageIcon,
    content: '<p>Translate the following:</p><p><strong>English:</strong> </p><p><strong>বাংলা:</strong> </p>',
    marks: 5
  }
];

const TemplateSelector = ({ onSelect, language = 'english' }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 p-2 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      {templates.map((template) => {
        const IconComponent = template.icon;
        return (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className="flex flex-col items-center p-2 sm:p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
            <span className={`text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-center ${['arabic', 'urdu'].includes(language) ? 'font-arabic' : language === 'bangla' ? 'font-bangla' : ''}`}>
              {template.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {template.marks} marks
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TemplateSelector;