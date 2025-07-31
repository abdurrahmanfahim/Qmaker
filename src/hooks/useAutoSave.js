import { useEffect } from 'react';
import useQuestionStore from '../store/questionStore';

const useAutoSave = (interval = 30000) => {
  const { saveToStorage } = useQuestionStore();

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      saveToStorage();
    }, interval);

    return () => clearInterval(autoSaveInterval);
  }, [saveToStorage, interval]);
};

export default useAutoSave;