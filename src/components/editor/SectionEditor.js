import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  TrashIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import usePaperStore from '../../store/paperStore';
import LazySubQuestionEditor from './LazySubQuestionEditor';
import ConfirmModal from '../modals/ConfirmModal';
import { useSwipeGestures, useHapticFeedback } from '../../hooks/useSwipeGestures';


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
    setActiveSubQuestion,
    reorderSections
  } = usePaperStore();
  
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { lightTap } = useHapticFeedback();
  
  const currentSectionIndex = sections.findIndex(s => s.id === activeSectionId);
  
  const swipeGestures = useSwipeGestures(
    () => {
      // Swipe left - next section
      if (currentSectionIndex < sections.length - 1) {
        setActiveSection(sections[currentSectionIndex + 1].id);
        lightTap();
      }
    },
    () => {
      // Swipe right - previous section
      if (currentSectionIndex > 0) {
        setActiveSection(sections[currentSectionIndex - 1].id);
        lightTap();
      }
    }
  );
  
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    reorderSections(result.source.index, result.destination.index);
  };



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
    addSubQuestion(activeSectionId);
  };
  




  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-900" style={{ paddingBottom: '100px' }}>
      {/* Clean Section Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="section-tabs smooth-scroll px-2 py-2 overflow-x-auto custom-scrollbar">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sections" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex items-center gap-1 min-w-max"
                >
                  {sections.map((section, index) => (
                    <Draggable key={section.id} draggableId={section.id} index={index}>
                      {(provided, snapshot) => (
                        <button
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => setActiveSection(section.id)}
                          className={`touch-target px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-2 focus:ring-2 focus:ring-[#09302f] focus:outline-none ${
                            section.id === activeSectionId
                              ? 'bg-[#09302f] text-white shadow-lg dark:bg-[#4ade80] dark:text-gray-900 transform scale-105'
                              : 'text-gray-700 dark:text-gray-200 hover:text-[#09302f] hover:bg-white dark:hover:bg-gray-600 hover:shadow-md'
                          } ${snapshot.isDragging ? 'shadow-2xl' : ''}`}
                          role="tab"
                          aria-selected={section.id === activeSectionId}
                          aria-label={`Section: ${section.title || 'Untitled Section'}`}
                        >
                          <span>{section.title || 'Untitled Section'}</span>
                          {sections.length > 1 && section.id === activeSectionId && (
                            <TrashIcon 
                              className="w-3 h-3 text-red-500 hover:text-white dark:text-red-500 dark:hover:text-red-300 transition-colors" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDelete({ type: 'section', id: section.id, title: section.title });
                              }}
                            />
                          )}
                        </button>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <button
                    onClick={() => {
                      try {
                        addSection();
                      } catch (error) {
                        console.error('Failed to add section:', error);
                      }
                    }}
                    className="touch-target px-4 py-3 text-[#09302f] dark:text-[#4ade80] hover:bg-white dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 focus:ring-2 focus:ring-[#09302f] focus:outline-none hover:shadow-md"
                    aria-label="Add new section"
                  >
                    + Add Section
                  </button>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      {/* Section Content */}
      {activeSection ? (
        <div 
          className="flex-1 overflow-auto custom-scrollbar" 
          style={{ paddingBottom: '80px' }}
          {...swipeGestures}
        >
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
                  className="px-8 py-3 bg-[#09302f] text-white rounded-lg hover:bg-[#072625] dark:bg-[#4ade80] dark:text-gray-900 dark:hover:bg-[#22c55e] text-sm font-semibold transition-all duration-200 mx-auto block shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-2 focus:ring-[#09302f] focus:outline-none touch-manipulation"
                >
                  {getEmptyStateText(metadata.language).addSubQuestion}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-1 sm:p-2 md:p-4 space-y-2 sm:space-y-4">

              {/* Section Header */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-2 sm:p-4">
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
                      className="px-6 py-3 bg-[#09302f] text-white rounded-lg hover:bg-[#072625] dark:bg-[#4ade80] dark:text-gray-900 dark:hover:bg-[#22c55e] text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 focus:ring-2 focus:ring-[#09302f] focus:outline-none"
                      aria-label="Add new question to this section"
                    >
                      Add Question
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Sub-Questions */}
              {activeSection.subQuestions.map((subQuestion, index) => (
                <LazySubQuestionEditor
                  key={subQuestion.id}
                  subQuestion={subQuestion}
                  sectionId={activeSection.id}
                  sectionLanguage={metadata.language}
                  isActive={subQuestion.id === activeSubQuestionId}
                  onClick={() => setActiveSubQuestion(subQuestion.id)}
                  questionIndex={index}
                  totalQuestions={activeSection.subQuestions.length}
                />
              ))}
              {/* Dynamic transparent spacer - grows with sub-questions */}
              <div 
                className="w-full" 
                style={{ 
                  height: `${Math.max(100, activeSection.subQuestions.length * 60)}px`,
                  visibility: 'hidden'
                }} 
                aria-hidden="true"
              ></div>
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
      
      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => {
          try {
            deleteSection(confirmDelete.id);
            setConfirmDelete(null);
          } catch (error) {
            console.error('Failed to delete section:', error);
          }
        }}
        title="Delete Section"
        message={`Are you sure you want to delete "${confirmDelete?.title || 'this section'}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default SectionEditor;