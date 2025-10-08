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
import paperStorage from '../utils/paperStorage';

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
    
    if (location.state?.isNew) {
      clearAll();
      if (location.state.metadata) {
        const { setMetadata } = usePaperStore.getState();
        setMetadata(location.state.metadata);
        setLanguage(location.state.metadata.language || 'bangla');
      }
    } else if (location.state?.paperData) {
      importData(location.state.paperData);
    } else {
      // Load existing paper by ID
      const existingPaper = paperStorage.loadPaper(qsnId);
      if (existingPaper) {
        importData(existingPaper);
      }
    }
  }, [qsnId, location.state, initialize, clearAll, setLanguage, importData]);
  
  // Auto-save paper data
  useEffect(() => {
    const saveInterval = setInterval(() => {
      const currentState = usePaperStore.getState();
      if (currentState.sections.length > 0 || currentState.metadata.examName) {
        const paperData = {
          metadata: currentState.metadata,
          sections: currentState.sections
        };
        
        // Save to individual paper storage
        paperStorage.savePaper(qsnId, paperData);
        
        // Also save to recent papers
        saveRecentPaper(paperData);
      }
    }, 5000); // Auto-save every 5 seconds
    
    return () => clearInterval(saveInterval);
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