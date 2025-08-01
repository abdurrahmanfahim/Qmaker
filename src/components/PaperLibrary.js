import React, { useState, useEffect } from 'react';
import { DocumentTextIcon, MagnifyingGlassIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const PaperLibrary = ({ isOpen, onClose, onLoadPaper }) => {
  const [papers, setPapers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedPapers = JSON.parse(localStorage.getItem('paperLibrary') || '[]');
    setPapers(savedPapers);
  }, []);

  const savePaper = (paperData) => {
    const newPaper = {
      id: Date.now(),
      name: paperData.metadata?.subject || 'Untitled Paper',
      metadata: paperData.metadata,
      sections: paperData.sections,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedPapers = [...papers, newPaper];
    setPapers(updatedPapers);
    localStorage.setItem('paperLibrary', JSON.stringify(updatedPapers));
  };

  const deletePaper = (paperId) => {
    const updatedPapers = papers.filter(p => p.id !== paperId);
    setPapers(updatedPapers);
    localStorage.setItem('paperLibrary', JSON.stringify(updatedPapers));
  };

  const filteredPapers = papers.filter(paper =>
    paper.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Paper Library</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="p-4 border-b">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search papers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {filteredPapers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <DocumentTextIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No papers found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPapers.map(paper => (
                <div key={paper.id} className="border rounded-lg p-4 hover:shadow-md">
                  <h3 className="font-medium mb-2">{paper.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {new Date(paper.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onLoadPaper(paper);
                        onClose();
                      }}
                      className="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => deletePaper(paper.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaperLibrary;