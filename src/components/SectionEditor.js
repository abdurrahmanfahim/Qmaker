import React, { useState } from 'react';
import { 
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
      {/* Clean Section Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="px-3 py-2 overflow-x-auto custom-scrollbar">
          <div className="flex items-center gap-1 min-w-max">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowLeft' && index > 0) {
                    setActiveSection(sections[index - 1].id);
                  } else if (e.key === 'ArrowRight' && index < sections.length - 1) {
                    setActiveSection(sections[index + 1].id);
                  }
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                  section.id === activeSectionId
                    ? 'bg-[#09302f] text-white shadow-sm'
                    : 'text-gray-700 dark:text-gray-200 hover:text-[#09302f] hover:bg-white dark:hover:bg-gray-600'
                }`}
                role="tab"
                aria-selected={section.id === activeSectionId}
                aria-label={`Section: ${section.title || 'Untitled Section'}`}
              >
                <span>{section.title || 'Untitled Section'}</span>
                {sections.length > 1 && section.id === activeSectionId && (
                  <TrashIcon 
                    className="w-3 h-3 text-red-300 hover:text-red-100 transition-colors" 
                    onClick={(e) => {
                      e.stopPropagation();
                      try {
                        deleteSection(section.id);
                      } catch (error) {
                        console.error('Failed to delete section:', error);
                      }
                    }}
                  />
                )}
              </button>
            ))}
            <button
              onClick={() => {
                try {
                  addSection();
                } catch (error) {
                  console.error('Failed to add section:', error);
                }
              }}
              className="px-3 py-2 text-[#d59145] hover:bg-white dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0"
              aria-label="Add new section"
            >
              + Add Section
            </button>
          </div>
        </div>
      </div>

      {/* Section Content */}
      {activeSection ? (
        <div className="flex-1 overflow-auto custom-scrollbar">
          {activeSection.subQuestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center max-w-sm">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DocumentTextIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {getEmptyStateText(metadata.language).noQuestions}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  {getEmptyStateText(metadata.language).getStarted}
                </p>
                <button
                  onClick={handleAddSubQuestion}
                  className="px-6 py-2 bg-[#09302f] text-white rounded-lg hover:bg-[#072625] text-sm font-medium transition-colors mx-auto block"
                >
                  {getEmptyStateText(metadata.language).addSubQuestion}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-2 sm:p-4 space-y-4">
              {/* Section Header */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Section Title</label>
                    <input
                      type="text"
                      value={activeSection.title}
                      onChange={(e) => updateSection(activeSection.id, { title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09302f] focus:border-[#09302f] text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder={getPlaceholders(metadata.language).sectionTitle}
                    />
                  </div>
                  <div className="pt-6">
                    <button
                      onClick={() => {
                        try {
                          handleAddSubQuestion();
                        } catch (error) {
                          console.error('Failed to add question:', error);
                        }
                      }}
                      className="px-6 py-3 bg-[#09302f] text-white rounded-lg hover:bg-[#072625] text-sm font-semibold transition-colors"
                      aria-label="Add new question to this section"
                    >
                      Add Question
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Sub-Questions */}
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