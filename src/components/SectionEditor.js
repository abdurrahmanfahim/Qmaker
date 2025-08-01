import React, { useState, useEffect, useRef } from 'react';
import { 
  PlusIcon, 
  TrashIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import usePaperStore from '../store/paperStore';
import SubQuestionEditor from './SubQuestionEditor';
import TemplateSelector from './TemplateSelector';
import TemplateModal from './TemplateModal';

const SectionEditor = () => {
  const { 
    sections, 
    activeSectionId, 
    activeSubQuestionId,
    metadata,
    addSection, 
    deleteSection, 
    updateSection,
    setActiveSection,
    addSubQuestion,
    updateSubQuestion,
    setActiveSubQuestion
  } = usePaperStore();

  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const activeSection = sections.find(s => s.id === activeSectionId);

  const getPlaceholders = (language) => {
    switch (language) {
      case 'arabic':
        return { sectionTitle: 'عنوان القسم...' };
      case 'bangla':
        return { sectionTitle: 'বিভাগের শিরোনাম...' };
      case 'urdu':
        return { sectionTitle: 'سیکشن کا عنوان...' };
      default:
        return { sectionTitle: 'Section title...' };
    }
  };

  const getEmptyStateText = (language) => {
    switch (language) {
      case 'arabic':
        return {
          noQuestions: 'لا توجد أسئلة فرعية بعد',
          getStarted: 'أضف أول سؤال فرعي للبدء',
          addSubQuestion: 'إضافة سؤال فرعي',
          chooseTemplate: 'أو اختر من القوالب:'
        };
      case 'bangla':
        return {
          noQuestions: 'এখনও কোন উপ-প্রশ্ন নেই',
          getStarted: 'শুরু করতে আপনার প্রথম উপ-প্রশ্ন যোগ করুন',
          addSubQuestion: 'উপ-প্রশ্ন যোগ করুন',
          chooseTemplate: 'অথবা টেমপ্লেট থেকে বেছে নিন:'
        };
      case 'urdu':
        return {
          noQuestions: 'ابھی تک کوئی ذیلی سوال نہیں',
          getStarted: 'شروع کرنے کے لیے اپنا پہلا ذیلی سوال شامل کریں',
          addSubQuestion: 'ذیلی سوال شامل کریں',
          chooseTemplate: 'یا ٹیمپلیٹس سے منتخب کریں:'
        };
      default:
        return {
          noQuestions: 'No sub-questions yet',
          getStarted: 'Add your first sub-question to get started',
          addSubQuestion: 'Add Sub-Question',
          chooseTemplate: 'Or choose from templates:'
        };
    }
  };

  const handleAddSubQuestion = () => {
    setShowTemplateModal(true);
  };

  const handleTemplateSelect = (template) => {
    addSubQuestion(activeSectionId, template);
    setShowTemplateModal(false);
  };



  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-900">
      {/* Section Tabs */}
      <div className="flex-shrink-0 p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sections</h2>
          <button
            onClick={addSection}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Section</span>
          </button>
        </div>

        {/* Scroll Container with Indicators */}
        <div className="relative">
          {/* Left Scroll Indicator */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none opacity-0 transition-opacity" id="scroll-left-indicator"></div>
          
          {/* Right Scroll Indicator */}
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none opacity-100 transition-opacity" id="scroll-right-indicator"></div>
          
          <div 
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scroll-smooth"
            onScroll={(e) => {
              const container = e.target;
              const leftIndicator = document.getElementById('scroll-left-indicator');
              const rightIndicator = document.getElementById('scroll-right-indicator');
              
              if (leftIndicator && rightIndicator) {
                // Show left indicator if scrolled right
                leftIndicator.style.opacity = container.scrollLeft > 10 ? '1' : '0';
                
                // Show right indicator if not at end
                const isAtEnd = container.scrollLeft >= container.scrollWidth - container.clientWidth - 10;
                rightIndicator.style.opacity = isAtEnd ? '0' : '1';
              }
            }}
          >
            {sections.map((section, index) => (
              <div
                key={section.id}
                className={`group flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all min-w-[120px] touch-manipulation active:scale-95 ${
                  section.id === activeSectionId
                    ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 shadow-md scale-105'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-md hover:scale-102'
                }`}
                onClick={() => setActiveSection(section.id)}
                style={{ minHeight: '44px' }} // Ensure minimum touch target
              >
                <span className="text-sm font-medium whitespace-nowrap truncate flex-1 min-w-0 text-center">
                  {section.title}
                </span>
                {sections.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSection(section.id);
                    }}
                    className="opacity-70 hover:opacity-100 text-red-500 hover:text-red-700 transition-all p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0 touch-manipulation"
                    style={{ minWidth: '32px', minHeight: '32px' }} // Ensure minimum touch target
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Content */}
      {activeSection ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Section Header */}
          <div className="flex-shrink-0 p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={activeSection.title}
                onChange={(e) => updateSection(activeSection.id, { title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={getPlaceholders(metadata.language).sectionTitle}
              />

              <button
                onClick={handleAddSubQuestion}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.01]"
              >
                <PlusIcon className="w-4 h-4" />
                <span>{getEmptyStateText(metadata.language).addSubQuestion}</span>
              </button>
            </div>
          </div>

          {/* Sub-Questions */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            {activeSection.subQuestions.length === 0 ? (
              <div className={`flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-8 ${['arabic', 'urdu'].includes(metadata.language) ? 'rtl font-arabic' : metadata.language === 'bangla' ? 'font-bangla' : ''}`}>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-6 mb-6">
                  <DocumentTextIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center text-gray-700 dark:text-gray-300">{getEmptyStateText(metadata.language).noQuestions}</h3>
                <p className="text-sm mb-8 text-center text-gray-500 dark:text-gray-400 max-w-md">{getEmptyStateText(metadata.language).getStarted}</p>
                
                <div className="w-full max-w-lg space-y-6">
                  {/* Primary Action */}
                  <button
                    onClick={handleAddSubQuestion}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    <PlusIcon className="w-5 h-5" />
                    {getEmptyStateText(metadata.language).addSubQuestion}
                  </button>
                  
                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">
                        {getEmptyStateText(metadata.language).chooseTemplate}
                      </span>
                    </div>
                  </div>
                  
                  {/* Template Selector */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <TemplateSelector onSelect={(template) => addSubQuestion(activeSection.id, template)} language={metadata.language} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 space-y-4">
                {activeSection.subQuestions.map((subQuestion, index) => (
                  <SubQuestionEditor
                    key={subQuestion.id}
                    subQuestion={subQuestion}
                    sectionId={activeSection.id}
                    sectionLanguage={metadata.language}
                    isActive={subQuestion.id === activeSubQuestionId}
                    onClick={() => setActiveSubQuestion(subQuestion.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 p-6">
          <div className="text-center">
            <DocumentTextIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">No section selected</p>
            <p className="text-sm text-gray-400">Select a section to start editing</p>
          </div>
        </div>
      )}
      
      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelect={handleTemplateSelect}
        language={metadata.language}
      />
    </div>
  );
};

export default SectionEditor;