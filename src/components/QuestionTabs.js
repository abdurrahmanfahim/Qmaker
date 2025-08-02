import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  PlusIcon, 
  XMarkIcon, 
  DocumentDuplicateIcon,
  LockClosedIcon,
  LockOpenIcon
} from '@heroicons/react/24/outline';
import useQuestionStore from '../store/questionStore';

const QuestionTabs = () => {
  const { 
    questions, 
    activeQuestionId, 
    addQuestion, 
    deleteQuestion, 
    duplicateQuestion,
    setActiveQuestion, 
    reorderQuestions,
    updateQuestion
  } = useQuestionStore();

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    reorderQuestions(result.source.index, result.destination.index);
  };

  const toggleLock = (questionId) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      updateQuestion(questionId, { locked: !question.locked });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-2">
      <div className="flex items-center space-x-2 overflow-x-auto custom-scrollbar">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="questions" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex items-center space-x-2"
              >
                {questions.map((question, index) => (
                  <Draggable key={question.id} draggableId={question.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg border transition-all ${
                          activeQuestionId === question.id
                            ? 'bg-[#105654]/10 dark:bg-[#105654] border-[#105654]/30 dark:border-[#105654]'
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                        } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-move"
                          onClick={() => setActiveQuestion(question.id)}
                        >
                          <span className={`text-sm font-medium ${
                            activeQuestionId === question.id
                              ? 'text-[#105654] dark:text-white'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {question.title}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => toggleLock(question.id)}
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            title={question.locked ? "Unlock" : "Lock"}
                          >
                            {question.locked ? (
                              <LockClosedIcon className="w-3 h-3 text-red-500" />
                            ) : (
                              <LockOpenIcon className="w-3 h-3 text-gray-400" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => duplicateQuestion(question.id)}
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            title="Duplicate Question"
                          >
                            <DocumentDuplicateIcon className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                          </button>
                          
                          {questions.length > 1 && (
                            <button
                              onClick={() => deleteQuestion(question.id)}
                              className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                              title="Delete Question"
                            >
                              <XMarkIcon className="w-3 h-3 text-red-500" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        
        <button
          onClick={addQuestion}
          className="flex items-center space-x-1 px-3 py-2 bg-emerald-500 dark:bg-emerald-600 text-white rounded-lg hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors whitespace-nowrap shadow-sm"
        >
          <PlusIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Add Question</span>
        </button>
      </div>
    </div>
  );
};

export default QuestionTabs;