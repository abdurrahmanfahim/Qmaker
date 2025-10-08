import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import usePaperStore from '../store/paperStore';
import Layout from '../components/Layout';
import { SectionEditor } from '../components/editor';
import LazyPreviewPanel from '../components/LazyPreviewPanel';
import ErrorBoundary from '../components/ErrorBoundary';
import TopFloatingToolbar from '../components/TopFloatingToolbar';
import ReviewButton from '../components/ReviewButton';
import { EditorProvider } from '../contexts/EditorContext';
import { saveRecentPaper } from '../utils/recentPapers';
import mobileStorage from '../utils/mobileStorage';

const QuestionPaper = () => {
  const { qsnId } = useParams();
  const location = useLocation();
  const { 
    darkMode, 
    previewMode, 
    initialize, 
    setLanguage, 
    importData, 
    clearAll,
    metadata,
    sections
  } = usePaperStore();
  
  const [showTableModal, setShowTableModal] = React.useState(false);

  useEffect(() => {
    initialize();
    
    // Try to load existing data for this qsnId
    const loadPaperData = () => {
      try {
        const existingData = mobileStorage.getItem(`qmaker-paper-${qsnId}`);
        
        if (location.state?.isNew) {
          clearAll();
          if (location.state.metadata) {
            const { setMetadata } = usePaperStore.getState();
            setMetadata(location.state.metadata);
            setLanguage(location.state.metadata.language || 'bangla');
          }
        } else if (location.state?.paperData) {
          importData(location.state.paperData);
        } else if (existingData) {
          const paperData = existingData;
          importData(paperData);
        } else {
          // Try to load from recent papers as fallback
          const recentPapers = JSON.parse(localStorage.getItem('qmaker-recent-papers') || '[]');
          const recentPaper = recentPapers.find(p => p.id === qsnId);
          if (recentPaper?.data) {
            importData(recentPaper.data);
          }
        }
      } catch (error) {
        console.error('Failed to load paper data:', error);
      }
    };
    
    loadPaperData();
  }, [qsnId, location.state, initialize, clearAll, setLanguage, importData]);
  
  // Auto-save paper data with qsnId
  useEffect(() => {
    const saveData = () => {
      try {
        const currentState = usePaperStore.getState();
        if (currentState.sections.length > 0 || currentState.metadata.examName) {
          const paperData = {
            metadata: currentState.metadata,
            sections: currentState.sections,
            lastSaved: Date.now()
          };
          mobileStorage.setItem(`qmaker-paper-${qsnId}`, paperData);
          saveRecentPaper(paperData, qsnId);
        }
      } catch (error) {
        console.error('Failed to save paper data:', error);
      }
    };
    
    const saveInterval = setInterval(saveData, 3000);
    
    // Save on page unload (mobile)
    const handleBeforeUnload = () => saveData();
    const handleVisibilityChange = () => {
      if (document.hidden) saveData();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(saveInterval);
      saveData(); // Final save
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [qsnId]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <ErrorBoundary fallbackMessage="Application error occurred.">
        <EditorProvider>
          <Layout>
            <TopFloatingToolbar
              showTableModal={showTableModal}
              setShowTableModal={setShowTableModal}
            />
            <main
              id="main-content"
              className="flex-1 flex flex-col overflow-hidden"
              role="main"
              aria-label="Question paper editor"
            >
              <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 flex flex-col overflow-hidden">
                  <SectionEditor />
                </div>
                {previewMode && (
                  <aside className="w-full md:w-1/2 border-l border-gray-200">
                    <LazyPreviewPanel />
                  </aside>
                )}
              </div>
            </main>
          </Layout>
          <ReviewButton showTableModal={showTableModal} />
        </EditorProvider>
      </ErrorBoundary>
    </div>
  );
};

export default QuestionPaper;