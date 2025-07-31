import { useEffect } from 'react';
import useQuestionStore from '../store/questionStore';

const useKeyboardShortcuts = () => {
  const { 
    addQuestion, 
    deleteQuestion, 
    duplicateQuestion,
    activeQuestionId,
    questions,
    setActiveQuestion,
    togglePreviewMode,
    toggleDarkMode
  } = useQuestionStore();

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl/Cmd + N: New question
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        addQuestion();
      }
      
      // Ctrl/Cmd + D: Duplicate question
      if ((event.ctrlKey || event.metaKey) && event.key === 'd' && activeQuestionId) {
        event.preventDefault();
        duplicateQuestion(activeQuestionId);
      }
      
      // Delete: Delete question (when not in input)
      if (event.key === 'Delete' && activeQuestionId && questions.length > 1 && 
          !['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
        event.preventDefault();
        deleteQuestion(activeQuestionId);
      }
      
      // Ctrl/Cmd + P: Toggle preview
      if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        event.preventDefault();
        togglePreviewMode();
      }
      
      // Ctrl/Cmd + Shift + D: Toggle dark mode
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        toggleDarkMode();
      }
      
      // Arrow keys: Navigate questions
      if (event.key === 'ArrowLeft' && event.ctrlKey && activeQuestionId) {
        event.preventDefault();
        const currentIndex = questions.findIndex(q => q.id === activeQuestionId);
        if (currentIndex > 0) {
          setActiveQuestion(questions[currentIndex - 1].id);
        }
      }
      
      if (event.key === 'ArrowRight' && event.ctrlKey && activeQuestionId) {
        event.preventDefault();
        const currentIndex = questions.findIndex(q => q.id === activeQuestionId);
        if (currentIndex < questions.length - 1) {
          setActiveQuestion(questions[currentIndex + 1].id);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    addQuestion, 
    deleteQuestion, 
    duplicateQuestion, 
    activeQuestionId, 
    questions, 
    setActiveQuestion,
    togglePreviewMode,
    toggleDarkMode
  ]);
};

export default useKeyboardShortcuts;