import React, { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import { 
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import usePaperStore from '../store/paperStore';
import { useEditorContext } from '../contexts/EditorContext';




const SubQuestionEditor = ({ 
  subQuestion, 
  sectionId, 
  sectionLanguage, 
  isActive, 
  onClick,
  questionIndex,
  totalQuestions
}) => {
  const { updateSubQuestion, deleteSubQuestion, reorderSubQuestions } = usePaperStore();
  const { setActiveEditor } = useEditorContext();

  const [showTableModal, setShowTableModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saving', 'saved', 'error'
  const [confirmDelete, setConfirmDelete] = useState(false);
  const saveTimeoutRef = useRef(null);


  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);
  

  


  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: subQuestion.content,
    onUpdate: ({ editor }) => {
      setSaveStatus('saving');
      
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        try {
          updateSubQuestion(sectionId, subQuestion.id, { content: editor.getHTML() });
          setSaveStatus('saved');
        } catch (error) {
          console.error('Failed to save question content:', error.message);
          setSaveStatus('error');
        }
      }, 500);
    },
    onFocus: () => {
      setActiveEditor(editor);
    },
    onBlur: () => {
      // Keep editor active for toolbar
    },
  });
  


  const getFontClass = (language) => {
    const fonts = { arabic: 'font-arabic', urdu: 'font-urdu', bangla: 'font-bangla' };
    return fonts[language] || 'font-english';
  };

  const getDirectionClass = (language) => {
    return ['arabic', 'urdu'].includes(language) ? 'rtl' : 'ltr';
  };

  const getQuestionPlaceholder = (language) => {
    const placeholders = {
      arabic: 'عنوان السؤال...',
      bangla: 'প্রশ্নের শিরোনাম...',
      urdu: 'سوال کا عنوان...'
    };
    return placeholders[language] || 'Question...';
  };



  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl border-2 transition-all duration-300 focus-within:ring-4 focus-within:ring-[#09302f] focus-within:ring-opacity-20 ${
        isActive 
          ? 'border-[#09302f] shadow-xl dark:border-[#4ade80] transform scale-[1.02]' 
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-lg hover:transform hover:scale-[1.01]'
      }`}
      onClick={onClick}
      role="article"
      aria-label={`Question ${subQuestion.label}`}
    >
      <div className="p-2 sm:p-4 md:p-6">
        <div className="space-y-6">
          {/* Question Header */}
          <div className="space-y-4">
            <div className={`flex items-center gap-4 ${['arabic', 'urdu'].includes(sectionLanguage) ? 'flex-row-reverse' : ''}`}>
              {/* Question Label */}
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#09302f] to-[#072625] dark:from-[#4ade80] dark:to-[#22c55e] text-white dark:text-gray-900 rounded-lg text-sm font-bold shadow-md" aria-hidden="true">
                  {subQuestion.label}
                </span>
              </div>
              
              {/* Spacer */}
              <div className="flex-1"></div>
              
              {/* Marks Input */}
              <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700/50 rounded px-2 border border-gray-200 dark:border-gray-600" style={{ minHeight: '40px' }}>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Marks</span>
                <input
                  type="number"
                  onChange={(e) => updateSubQuestion(sectionId, subQuestion.id, { marks: e.target.value === '' ? '' : parseInt(e.target.value) || 0 })}
                  className={`w-8 px-1 py-1 border-0 rounded text-sm font-bold text-center appearance-none bg-transparent text-gray-900 dark:text-white focus:outline-none ${['arabic', 'urdu'].includes(sectionLanguage) ? 'text-right' : ''}`}
                  style={{ MozAppearance: 'textfield' }}
                  placeholder="5"
                  min="0"
                  max="99"
                />
              </div>
              
              {/* Move Up/Down Buttons */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (questionIndex > 0) {
                      reorderSubQuestions(sectionId, questionIndex, questionIndex - 1);
                    }
                  }}
                  disabled={questionIndex === 0}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ minWidth: '24px', minHeight: '20px' }}
                  title="Move up"
                >
                  <ChevronUpIcon className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (questionIndex < totalQuestions - 1) {
                      reorderSubQuestions(sectionId, questionIndex, questionIndex + 1);
                    }
                  }}
                  disabled={questionIndex === totalQuestions - 1}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ minWidth: '24px', minHeight: '20px' }}
                  title="Move down"
                >
                  <ChevronDownIcon className="w-3 h-3" />
                </button>
              </div>
              
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDelete(true);
                }}
                className="flex-shrink-0 text-red-500 hover:text-white hover:bg-red-500 dark:text-red-400 dark:hover:text-white dark:hover:bg-red-500 transition-all duration-200 touch-manipulation flex items-center justify-center rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none transform hover:scale-105 active:scale-95 border border-red-200 dark:border-red-600 hover:border-red-500"
                style={{ minWidth: '44px', minHeight: '44px' }}
                aria-label={`Delete Question ${subQuestion.label}`}
                title="Delete Question"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
            
            <input
              type="text"
              value={subQuestion.heading}
              onChange={(e) => updateSubQuestion(sectionId, subQuestion.id, { heading: e.target.value })}
              className={`w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#09302f] focus:border-[#09302f] rounded-lg text-base font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all ${getFontClass(sectionLanguage)} ${getDirectionClass(sectionLanguage)}`}
              placeholder={getQuestionPlaceholder(sectionLanguage)}
              aria-label={`Question ${subQuestion.label} heading`}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey)) {
                  if (e.key === 'z' && !e.shiftKey) {
                    e.preventDefault();
                    document.execCommand('undo');
                  } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
                    e.preventDefault();
                    document.execCommand('redo');
                  }
                }
              }}
            />
          </div>

          {/* Rich Text Editor */}
          <div>
            <div className="border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden shadow-inner">
              <EditorContent 
                editor={editor} 
                className={`prose prose-sm max-w-none p-2 min-h-[100px] sm:min-h-[120px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base leading-relaxed ${getFontClass(sectionLanguage)} ${getDirectionClass(sectionLanguage)}`}
                style={{ textAlign: 'inherit' }}
              />
            

            <div id={`question-${subQuestion.id}-help`} className="sr-only">
              Use the toolbar above to format your question content. Press Tab to navigate between tools.
            </div>
          </div>
          </div>
        </div>
      </div>
      
      {/* Table Modal */}
      {showTableModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center z-50 p-4" onClick={() => setShowTableModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Insert Table</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rows</label>
                <input
                  type="number"
                  defaultValue={2}
                  min={1}
                  max={10}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  id="table-rows"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Columns</label>
                <input
                  type="number"
                  defaultValue={3}
                  min={1}
                  max={10}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  id="table-cols"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="table-header"
                  className="mr-2"
                />
                <label htmlFor="table-header" className="text-sm text-gray-700 dark:text-gray-300">Include header row</label>
              </div>

            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowTableModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-lg transition-colors focus:ring-2 focus:ring-gray-300 focus:outline-none touch-manipulation"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const rows = parseInt(document.getElementById('table-rows').value) || 2;
                  const cols = parseInt(document.getElementById('table-cols').value) || 3;
                  const hasHeader = document.getElementById('table-header').checked;
                  
                  if (rows >= 1 && cols >= 1 && rows <= 10 && cols <= 10 && editor) {
                    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: hasHeader }).run();
                    setShowTableModal(false);
                  }
                }}
                className="px-6 py-2 bg-[#09302f] text-white rounded-lg hover:bg-[#072625] dark:bg-[#4ade80] dark:text-gray-900 dark:hover:bg-[#22c55e] font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 focus:ring-2 focus:ring-[#09302f] focus:outline-none touch-manipulation"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
      
      {confirmDelete && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-30 flex items-start justify-center z-50 p-4 pt-20">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Delete Question</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete Question {subQuestion.label}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  try {
                    deleteSubQuestion(sectionId, subQuestion.id);
                    setConfirmDelete(false);
                  } catch (error) {
                    console.error('Delete error:', error);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubQuestionEditor;