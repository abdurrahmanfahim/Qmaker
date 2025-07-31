import React, { useState } from 'react';
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

        <div className="flex gap-2 overflow-x-auto pb-1">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`flex-shrink-0 flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border cursor-pointer transition-all ${
                section.id === activeSectionId
                  ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 shadow-sm'
                  : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-sm'
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="text-xs sm:text-sm font-medium whitespace-nowrap max-w-20 sm:max-w-24 truncate">{section.title}</span>
              {sections.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSection(section.id);
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          ))}
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
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
              >
                <PlusIcon className="w-4 h-4" />
                <span>{getEmptyStateText(metadata.language).addSubQuestion}</span>
              </button>
            </div>
          </div>

          {/* Sub-Questions */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            {activeSection.subQuestions.length === 0 ? (
              <div className={`flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-6 ${['arabic', 'urdu'].includes(metadata.language) ? 'rtl font-arabic' : metadata.language === 'bangla' ? 'font-bangla' : ''}`}>
                <DocumentTextIcon className="w-12 h-12 mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2 text-center">{getEmptyStateText(metadata.language).noQuestions}</p>
                <p className="text-sm mb-6 text-center text-gray-400">{getEmptyStateText(metadata.language).getStarted}</p>
                <div className="space-y-4 w-full max-w-sm">
                  <button
                    onClick={handleAddSubQuestion}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                  >
                    <PlusIcon className="w-5 h-5" />
                    {getEmptyStateText(metadata.language).addSubQuestion}
                  </button>
                  <div className="mt-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">
                      {getEmptyStateText(metadata.language).chooseTemplate}
                    </p>
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