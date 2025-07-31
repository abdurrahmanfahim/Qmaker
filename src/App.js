import React, { useEffect } from 'react';
import usePaperStore from './store/paperStore';
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
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex flex-col h-screen">
        <Header />
        
        {previewMode ? (
          <PreviewPanel />
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <MetadataPanel />
            <SectionEditor />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;