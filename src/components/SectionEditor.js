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

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections" type="section" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
              >
                {sections.map((section, index) => (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                          section.id === activeSectionId
                            ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 shadow-sm'
                            : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-sm'
                        } ${snapshot.isDragging ? 'shadow-lg scale-105' : ''}`}
                        onClick={() => setActiveSection(section.id)}
                      >
                        <div {...provided.dragHandleProps}>
                          <Bars3Icon className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-sm font-medium whitespace-nowrap max-w-24 truncate">{section.title}</span>
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
          <div className="flex-shrink-0 p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={activeSection.title}
                  onChange={(e) => updateSection(activeSection.id, { title: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={getPlaceholders(activeSection.language).sectionTitle}
                />
                <select
                  value={activeSection.language}
                  onChange={(e) => updateSection(activeSection.id, { 
                    language: e.target.value,
                    direction: ['arabic', 'urdu'].includes(e.target.value) ? 'rtl' : 'ltr'
                  })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="english">EN</option>
                  <option value="arabic">AR</option>
                  <option value="bangla">BN</option>
                  <option value="urdu">UR</option>
                </select>
              </div>

              <button
                onClick={handleAddSubQuestion}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
              >
                <PlusIcon className="w-4 h-4" />
                <span>{getEmptyStateText(activeSection.language).addSubQuestion}</span>
              </button>
            </div>
          </div>

          {/* Sub-Questions */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            {activeSection.subQuestions.length === 0 ? (
              <div className={`flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-6 ${['arabic', 'urdu'].includes(activeSection.language) ? 'rtl font-arabic' : activeSection.language === 'bangla' ? 'font-bangla' : ''}`}>
                <DocumentTextIcon className="w-12 h-12 mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2 text-center">{getEmptyStateText(activeSection.language).noQuestions}</p>
                <p className="text-sm mb-6 text-center text-gray-400">{getEmptyStateText(activeSection.language).getStarted}</p>
                <div className="space-y-4 w-full max-w-sm">
                  <button
                    onClick={handleAddSubQuestion}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                  >
                    <PlusIcon className="w-5 h-5" />
                    {getEmptyStateText(activeSection.language).addSubQuestion}
                  </button>
                  <div className="mt-6">
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
                    <div {...provided.droppableProps} ref={provided.innerRef} className="p-3 space-y-4">
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
        language={activeSection?.language || 'english'}
      />
    </div>
  );
};

export default SectionEditor;