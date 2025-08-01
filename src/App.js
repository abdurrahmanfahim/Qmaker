import React, { useEffect } from 'react';
import usePaperStore from './store/paperStore';
import Layout from './components/Layout';
import Header from './components/Header';
import MetadataPanel from './components/MetadataPanel';
import SectionEditor from './components/SectionEditor';
import LazyPreviewPanel from './components/LazyPreviewPanel';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';

function App() {
  const { darkMode, previewMode, initialize } = usePaperStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <ToastProvider>
        <ErrorBoundary fallbackMessage="The application encountered an error. Your work is automatically saved.">
          <Layout>
          <ErrorBoundary fallbackMessage="Header component failed to load.">
            <Header />
          </ErrorBoundary>
          
          {previewMode ? (
            <ErrorBoundary fallbackMessage="Preview failed to load. Try switching back to edit mode.">
              <LazyPreviewPanel />
            </ErrorBoundary>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              <ErrorBoundary fallbackMessage="Paper information panel failed to load.">
                <MetadataPanel />
              </ErrorBoundary>
              <ErrorBoundary fallbackMessage="Section editor failed to load.">
                <SectionEditor />
              </ErrorBoundary>
            </div>
          )}
          </Layout>
        </ErrorBoundary>
      </ToastProvider>
    </div>
  );
}

export default App;