import React, { useState, useEffect } from 'react';
import usePaperStore from './store/paperStore';
import Layout from './components/Layout';
import Header from './components/Header';
import MetadataPanel from './components/MetadataPanel';
import SectionEditor from './components/SectionEditor';
import LazyPreviewPanel from './components/LazyPreviewPanel';
import ErrorBoundary from './components/ErrorBoundary';
import WelcomeScreen from './components/WelcomeScreen';
import { EditorProvider } from './contexts/EditorContext';
import './styles/typography.css';

function App() {
  const { darkMode, previewMode, initialize, setLanguage } = usePaperStore();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    initialize();
    const hasVisited = localStorage.getItem('qmaker-visited');
    if (!hasVisited) {
      setShowWelcome(true);
    }
  }, [initialize]);



  const handleWelcomeComplete = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    localStorage.setItem('qmaker-visited', 'true');
    setShowWelcome(false);
  };



  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }



  return (
    <div className={darkMode ? 'dark' : ''}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#09302f] text-white px-4 py-2 rounded-lg z-50">
        Skip to main content
      </a>
      <ErrorBoundary fallbackMessage="Application error occurred.">
        <EditorProvider>
          <Layout>
          <Header />
          <main id="main-content" className="flex-1 flex flex-col overflow-hidden" role="main" aria-label="Question paper editor">
            {!previewMode && <MetadataPanel />}
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
        </EditorProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;