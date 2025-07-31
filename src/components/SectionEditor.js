import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  PlusIcon, 
  TrashIcon,
  Bars3Icon,
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
    addSection, 
    deleteSection, 
    updateSection,
    reorderSections,
    setActiveSection,
    addSubQuestion,
    reorderSubQuestions,
    setActiveSubQuestion
  } = usePaperStore();

  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const activeSection = sections.find(s => s.id === activeSectionId);

  const getPlaceholders = (language) => {
    switch (language) {
      case 'arabic':
        return {
          sectionTitle: 'عنوان القسم...',
          sectionInstructions: 'تعليمات القسم (اختيارية)...'
        };
      case 'bangla':
        return {
          sectionTitle: 'বিভাগের শিরোনাম...',
          sectionInstructions: 'বিভাগের নির্দেশনা (ঐচ্ছিক)...'
        };
      case 'urdu':
        return {
          sectionTitle: 'سیکشن کا عنوان...',
          sectionInstructions: 'سیکشن کی ہدایات (اختیاری)...'
        };
      default:
        return {
          sectionTitle: 'Section title...',
          sectionInstructions: 'Section instructions (optional)...'
        };
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

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    if (result.type === 'section') {
      reorderSections(result.source.index, result.destination.index);
    } else if (result.type === 'subQuestion' && activeSectionId) {
      reorderSubQuestions(activeSectionId, result.source.index, result.destination.index);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-900">
      {/* Section Tabs */}
      <div className="flex-shrink-0 p-2 sm:p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sections</h2>
          <button
            onClick={addSection}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Add Section</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections" type="section" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex gap-2 overflow-x-auto pb-2"
              >
                {sections.map((section, index) => (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                          section.id === activeSectionId
                            ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700'
                            : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                        } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                        onClick={() => setActiveSection(section.id)}
                      >
                        <div {...provided.dragHandleProps}>
                          <Bars3Icon className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-sm font-medium whitespace-nowrap">{section.title}</span>
                        {sections.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSection(section.id);
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Section Content */}
      {activeSection ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Section Header */}
          <div className="flex-shrink-0 p-2 sm:p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              <input
                type="text"
                value={activeSection.title}
                onChange={(e) => updateSection(activeSection.id, { title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                placeholder={getPlaceholders(activeSection.language).sectionTitle}
              />
              
              <textarea
                value={activeSection.instructions}
                onChange={(e) => updateSection(activeSection.id, { instructions: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none text-sm sm:text-base"
                rows="2"
                placeholder={getPlaceholders(activeSection.language).sectionInstructions}
              />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <select
                  value={activeSection.language}
                  onChange={(e) => updateSection(activeSection.id, { 
                    language: e.target.value,
                    direction: ['arabic', 'urdu'].includes(e.target.value) ? 'rtl' : 'ltr'
                  })}
                  className="w-full sm:w-auto px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="english">English</option>
                  <option value="arabic">Arabic</option>
                  <option value="bangla">Bangla</option>
                  <option value="urdu">Urdu</option>
                </select>

                <button
                  onClick={handleAddSubQuestion}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">{getEmptyStateText(activeSection.language).addSubQuestion}</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sub-Questions */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            {activeSection.subQuestions.length === 0 ? (
              <div className={`flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-4 ${['arabic', 'urdu'].includes(activeSection.language) ? 'rtl font-arabic' : activeSection.language === 'bangla' ? 'font-bangla' : ''}`}>
                <DocumentTextIcon className="w-8 h-8 sm:w-12 sm:h-12 mb-3" />
                <p className="text-base sm:text-lg font-medium mb-2 text-center">{getEmptyStateText(activeSection.language).noQuestions}</p>
                <p className="text-sm mb-4 text-center">{getEmptyStateText(activeSection.language).getStarted}</p>
                <div className="space-y-2 w-full max-w-xs">
                  <button
                    onClick={handleAddSubQuestion}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    <PlusIcon className="w-4 h-4" />
                    {getEmptyStateText(activeSection.language).addSubQuestion}
                  </button>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">
                      {getEmptyStateText(activeSection.language).chooseTemplate}
                    </p>
                    <TemplateSelector onSelect={(template) => addSubQuestion(activeSection.id, template)} language={activeSection.language} />
                  </div>
                </div>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="subQuestions" type="subQuestion">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="p-2 sm:p-4 space-y-4">
                      {activeSection.subQuestions.map((subQuestion, index) => (
                        <Draggable key={subQuestion.id} draggableId={subQuestion.id} index={index}>
                          {(provided, snapshot) => (
                            <SubQuestionEditor
                              key={subQuestion.id}
                              subQuestion={subQuestion}
                              sectionId={activeSection.id}
                              sectionLanguage={activeSection.language}
                              isActive={subQuestion.id === activeSubQuestionId}
                              isDragging={snapshot.isDragging}
                              provided={provided}
                              onClick={() => setActiveSubQuestion(subQuestion.id)}
                            />
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 p-4">
          <div className="text-center">
            <DocumentTextIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" />
            <p className="text-base sm:text-lg font-medium mb-2">No section selected</p>
            <p className="text-sm">Select a section to start editing</p>
          </div>
        </div>
      )}
      
      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelect={handleTemplateSelect}
        language={activeSection?.language || 'english'}
      />
    </div>
  );
};

export default SectionEditor;