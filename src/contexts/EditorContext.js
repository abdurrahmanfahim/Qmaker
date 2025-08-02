import React, { createContext, useContext, useState } from 'react';

const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
  const [activeEditor, setActiveEditor] = useState(null);

  return (
    <EditorContext.Provider value={{ activeEditor, setActiveEditor }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditorContext must be used within EditorProvider');
  }
  return context;
};