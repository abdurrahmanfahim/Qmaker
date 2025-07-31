import React, { useEffect } from 'react';
import usePaperStore from './store/paperStore';
import Layout from './components/Layout';
import Header from './components/Header';
import MetadataPanel from './components/MetadataPanel';
import SectionEditor from './components/SectionEditor';
import PreviewPanel from './components/PreviewPanel';

function App() {
  const { darkMode, previewMode, initialize } = usePaperStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Layout>
        <Header />
        
        {previewMode ? (
          <PreviewPanel />
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <MetadataPanel />
            <SectionEditor />
          </div>
        )}
      </Layout>
    </div>
  );
}

export default App;