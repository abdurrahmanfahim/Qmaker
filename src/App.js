import React, { useState, useEffect } from 'react';
import usePaperStore from './store/paperStore';
import Layout from './components/Layout';
import Header from './components/Header';
import SectionEditor from './components/SectionEditor';
import LazyPreviewPanel from './components/LazyPreviewPanel';
import ErrorBoundary from './components/ErrorBoundary';
import WelcomeDashboard from './components/WelcomeDashboard';
import FloatingToolbar from './components/FloatingToolbar';
import { EditorProvider } from './contexts/EditorContext';
import { usePerformance } from './hooks/usePerformance';
import { trackEvent, trackPerformance } from './utils/analytics';
import { updateMetaTags, generateStructuredData } from './utils/seo';
import cloudSync from './utils/cloudSync';
import { saveRecentPaper } from './utils/recentPapers';
import './styles/typography.css';

function App() {
  const { darkMode, previewMode, initialize, setLanguage, exportData, importData, clearAll } = usePaperStore();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const performanceMetrics = usePerformance();

  useEffect(() => {
    initialize();
    const hasVisited = localStorage.getItem('qmaker-visited');
    if (!hasVisited) {
      setShowWelcome(true);
    }
    
    // SEO and analytics initialization
    updateMetaTags();
    trackEvent('app_loaded', { timestamp: Date.now() });
    
    // Initialize cloud sync
    cloudSync.init();
  }, [initialize]);
  
  // Handle mobile back button
  useEffect(() => {
    const handleBackButton = (e) => {
      if (!showWelcome) {
        e.preventDefault();
        // Save current paper
        const currentData = exportData();
        if (currentData.sections.length > 0 || currentData.metadata.examName) {
          saveRecentPaper(currentData);
        }
        // Go to dashboard
        localStorage.removeItem('qmaker-visited');
        setShowWelcome(true);
      }
    };
    
    window.addEventListener('popstate', handleBackButton);
    // Push initial state
    window.history.pushState(null, '', window.location.href);
    
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [showWelcome, exportData]);
  
  // Track performance metrics
  useEffect(() => {
    if (performanceMetrics.lcp) {
      trackPerformance('lcp', performanceMetrics.lcp);
    }
    if (performanceMetrics.fid) {
      trackPerformance('fid', performanceMetrics.fid);
    }
  }, [performanceMetrics]);



  const handleWelcomeComplete = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    localStorage.setItem('qmaker-visited', 'true');
    setShowWelcome(false);
  };
  
  const handleCreateNew = (language = 'bangla') => {
    // Save current paper first
    const currentData = exportData();
    if (currentData.sections.length > 0 || currentData.metadata.examName) {
      saveRecentPaper(currentData);
    }
    
    // Clear for new paper and set language
    clearAll();
    setLanguage(language);
    localStorage.setItem('qmaker-visited', 'true');
    setShowWelcome(false);
  };
  
  const handleOpenPaper = (paper) => {
    // Save current paper first
    const currentData = exportData();
    if (currentData.sections.length > 0 || currentData.metadata.examName) {
      saveRecentPaper(currentData);
    }
    
    // Load selected paper
    if (paper.data) {
      importData(paper.data);
    }
    
    localStorage.setItem('qmaker-visited', 'true');
    setShowWelcome(false);
  };



  if (showWelcome) {
    return (
      <WelcomeDashboard 
        onCreateNew={() => handleCreateNew()}
        onOpenPaper={handleOpenPaper}
        onCreateLanguagePaper={(lang) => handleCreateNew(lang)}
      />
    );
  }



  return (
    <div className={darkMode ? 'dark' : ''}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#09302f] text-white px-4 py-2 rounded-lg z-50">
        Skip to main content
      </a>
      <ErrorBoundary fallbackMessage="Application error occurred.">
        <EditorProvider>
          <Layout>
          <Header onMenuToggle={setShowHamburgerMenu} />
          <main id="main-content" className="flex-1 flex flex-col overflow-hidden" role="main" aria-label="Question paper editor">
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
          <FloatingToolbar 
            showTableModal={showTableModal} 
            setShowTableModal={setShowTableModal}
            hideToolbar={showHamburgerMenu}
          />
        </EditorProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;