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
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-gray-50 dark:from-gray-800 to-transparent z-10 pointer-events-none opacity-0 transition-opacity" id="template-scroll-left"></div>
      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-gray-50 dark:from-gray-800 to-transparent z-10 pointer-events-none" id="template-scroll-right"></div>
      
      <div 
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={(e) => {
          const container = e.target;
          const leftIndicator = document.getElementById('template-scroll-left');
          const rightIndicator = document.getElementById('template-scroll-right');
          
          if (leftIndicator && rightIndicator) {
            leftIndicator.style.opacity = container.scrollLeft > 10 ? '1' : '0';
            const isAtEnd = container.scrollLeft >= container.scrollWidth - container.clientWidth - 10;
            rightIndicator.style.opacity = isAtEnd ? '0' : '1';
          }
        }}
      >
        {templates.map((template) => {
          const IconComponent = template.icon;
          return (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all group min-w-[90px] max-w-[90px] h-[100px] touch-manipulation active:scale-95 hover:scale-105"
            >
              <IconComponent className="w-7 h-7 text-gray-500 group-hover:text-blue-500 mb-1.5 transition-colors" />
              <span className={`text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-center leading-tight px-1 ${['arabic', 'urdu'].includes(language) ? 'font-arabic' : language === 'bangla' ? 'font-bangla' : ''}`}>
                {template.name}
              </span>
              <span className="text-xs text-gray-400 group-hover:text-blue-400 mt-0.5">
                {template.marks}m
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector;