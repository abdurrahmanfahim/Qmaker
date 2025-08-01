import React, { useRef, useEffect, useState } from 'react';
import { 
  DocumentTextIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  BookOpenIcon,
  LanguageIcon,
  ClipboardDocumentListIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';
import QuestionBank from './QuestionBank';

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
  },
  {
    id: 'questionBank',
    name: 'Question Bank',
    icon: ArchiveBoxIcon,
    isSpecial: true
  }
];

const TemplateSelector = ({ onSelect, language = 'english' }) => {
  const containerRef = useRef(null);
  const leftIndicatorRef = useRef(null);
  const rightIndicatorRef = useRef(null);
  const [showQuestionBank, setShowQuestionBank] = useState(false);

  const handleTemplateSelect = (template) => {
    if (template.id === 'questionBank') {
      setShowQuestionBank(true);
    } else {
      onSelect(template);
    }
  };

  const updateScrollIndicators = () => {
    const container = containerRef.current;
    const leftIndicator = leftIndicatorRef.current;
    const rightIndicator = rightIndicatorRef.current;
    
    if (container && leftIndicator && rightIndicator) {
      const hasScrollableContent = container.scrollWidth > container.clientWidth;
      leftIndicator.style.opacity = container.scrollLeft > 10 ? '1' : '0';
      const isAtEnd = container.scrollLeft >= container.scrollWidth - container.clientWidth - 10;
      rightIndicator.style.opacity = hasScrollableContent && !isAtEnd ? '1' : '0';
    }
  };

  useEffect(() => {
    updateScrollIndicators();
    const container = containerRef.current;
    if (container) {
      const resizeObserver = new ResizeObserver(updateScrollIndicators);
      resizeObserver.observe(container);
      return () => resizeObserver.disconnect();
    }
  }, []);

  return (
    <div className="relative">
      <div 
        ref={leftIndicatorRef}
        className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-gray-50 dark:from-gray-800 to-transparent z-10 pointer-events-none opacity-0 transition-opacity"
      ></div>
      <div 
        ref={rightIndicatorRef}
        className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-gray-50 dark:from-gray-800 to-transparent z-10 pointer-events-none opacity-0 transition-opacity"
      ></div>
      
      <div 
        ref={containerRef}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={updateScrollIndicators}
      >
        {templates.map((template) => {
          const IconComponent = template.icon;
          return (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all group min-w-[90px] max-w-[90px] h-[100px] touch-manipulation active:scale-95 hover:scale-105 ${
                template.isSpecial 
                  ? 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500'
                  : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
              } hover:shadow-lg`}
            >
              <IconComponent className={`w-7 h-7 mb-1.5 transition-colors ${
                template.isSpecial 
                  ? 'text-purple-500 group-hover:text-purple-600'
                  : 'text-gray-500 group-hover:text-blue-500'
              }`} />
              <span className={`text-xs font-medium text-center leading-tight px-1 transition-colors ${
                template.isSpecial
                  ? 'text-purple-700 dark:text-purple-300 group-hover:text-purple-800 dark:group-hover:text-purple-200'
                  : 'text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'
              } ${['arabic', 'urdu'].includes(language) ? 'font-arabic' : language === 'bangla' ? 'font-bangla' : ''}`}>
                {template.name}
              </span>
              {!template.isSpecial && (
                <span className="text-xs text-gray-400 group-hover:text-blue-400 mt-0.5">
                  {template.marks}m
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Question Bank Modal */}
      {showQuestionBank && (
        <QuestionBank
          isOpen={showQuestionBank}
          onClose={() => setShowQuestionBank(false)}
        />
      )}
    </div>
  );
};

export default TemplateSelector;