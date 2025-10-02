import { useEffect } from 'react';
import useQuestionStore from '../store/questionStore';

const useAutoSave = (interval = 30000) => {
  const { saveToStorage } = useQuestionStore();

  useEffect(() => {
    // Validate interval to prevent malicious values
    const safeInterval = Math.max(5000, Math.min(300000, Number(interval) || 30000));
    
    const autoSaveInterval = setInterval(() => {
      try {
        saveToStorage();
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, safeInterval);

    return () => clearInterval(autoSaveInterval);
  }, [saveToStorage, interval]);
};

export default useAutoSave;