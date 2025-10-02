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
  ChevronDownIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';
import usePaperStore from '../../store/paperStore';
import { useEditorContext } from '../../contexts/EditorContext';




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
  const [saveStatus] = useState('saved'); // 'saving', 'saved', 'error'
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const saveTimeoutRef = useRef(null);
  const cardRef = useRef(null);


  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Handle click outside to flip back
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDeleteWarning && cardRef.current && !cardRef.current.contains(event.target)) {
        setShowDeleteWarning(false);
      }
    };

    if (showDeleteWarning) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDeleteWarning]);
  

  


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
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        try {
          updateSubQuestion(sectionId, subQuestion.id, { content: editor.getHTML() });
        } catch (error) {
          console.error('Failed to save question content:', error.message);
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
    const fonts = { 
      arabic: 'font-arabic', 
      urdu: 'font-urdu', 
      bangla: 'font-bangla',
      english: 'font-english'
    };
    return fonts[language] || 'font-english';
  };

  const getDirectionClass = (language) => {
    return ['arabic', 'urdu'].includes(language) ? 'rtl' : 'ltr';
  };

  const getQuestionPlaceholder = (language) => {
    const placeholders = {
      arabic: 'عنوان السؤال...',
      bangla: 'প্রশ্নের শিরোনাম...',
      urdu: 'سوال کا عنوان...',
      english: 'Question heading...'
    };
    return placeholders[language] || 'Question heading...';
  };

  const getContentPlaceholder = (language) => {
    const placeholders = {
      arabic: 'اكتب محتوى السؤال هنا...',
      bangla: 'এখানে প্রশ্নের বিষয়বস্তু লিখুন...',
      urdu: 'یہاں سوال کا مواد لکھیں...',
      english: 'Write your question content here...'
    };
    return placeholders[language] || 'Write your question content here...';
  };



  return (
    <div
      ref={cardRef}
      className={`relative bg-white dark:bg-gray-800 rounded-xl border-2 transition-all duration-500 mb-4 mx-2 sm:mx-4 ${
        showDeleteWarning 
          ? 'border-red-300 dark:border-red-600' 
          : isActive 
          ? 'border-[#09302f] dark:border-[#4ade80]' 
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
      } ${showDeleteWarning ? 'transform rotateY-180' : ''}`}
      onClick={onClick}
      role="article"
      aria-label={`Question ${subQuestion.label}`}
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      <div className={`p-2 sm:p-4 md:p-6 ${showDeleteWarning ? 'transform rotateY-180' : ''}`} style={{ backfaceVisibility: 'hidden' }}>
        <div className="space-y-2">
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
                  min="0"
                  max="99"
                  value={subQuestion.marks || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 99)) {
                      updateSubQuestion(sectionId, subQuestion.id, { marks: value === '' ? '' : parseInt(value) || 0 });
                    }
                  }}
                  autoComplete="off"
                  className={`w-8 px-1 py-1 border-0 rounded text-sm font-bold text-center appearance-none bg-transparent text-gray-900 dark:text-white focus:outline-none ${['arabic', 'urdu'].includes(sectionLanguage) ? 'text-right' : ''}`}
                  placeholder="5"
                />
              </div>
              
              {/* Header-Body Order Toggle */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateSubQuestion(sectionId, subQuestion.id, { headerFirst: true });
                  }}
                  disabled={subQuestion.headerFirst !== false}
                  className={`p-1 rounded transition-colors ${
                    subQuestion.headerFirst !== false 
                      ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-[#09302f] dark:hover:text-[#4ade80]'
                  }`}
                  style={{ minWidth: '24px', minHeight: '20px' }}
                  title="Header first"
                >
                  <ChevronUpIcon className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateSubQuestion(sectionId, subQuestion.id, { headerFirst: false });
                  }}
                  disabled={subQuestion.headerFirst === false}
                  className={`p-1 rounded transition-colors ${
                    subQuestion.headerFirst === false 
                      ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-[#09302f] dark:hover:text-[#4ade80]'
                  }`}
                  style={{ minWidth: '24px', minHeight: '20px' }}
                  title="Body first"
                >
                  <ChevronDownIcon className="w-3 h-3" />
                </button>
              </div>
              
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteWarning(true);
                }}
                className="flex-shrink-0 text-red-500 hover:text-white hover:bg-red-500 dark:text-red-400 dark:hover:text-white dark:hover:bg-red-500 transition-all duration-200 touch-manipulation flex items-center justify-center rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none transform hover:scale-105 active:scale-95 border border-red-200 dark:border-red-600 hover:border-red-500"
                style={{ minWidth: '44px', minHeight: '44px' }}
                aria-label={`Delete Question ${subQuestion.label}`}
                title="Delete Question"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conditional Header/Body Order */}
          {subQuestion.headerFirst === false ? (
            <>
              {/* Body First */}
              <div className="border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden shadow-inner">
                <EditorContent 
                  editor={editor} 
                  className={`prose prose-sm max-w-none p-2 min-h-[100px] sm:min-h-[120px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base leading-relaxed ${getFontClass(sectionLanguage)} ${getDirectionClass(sectionLanguage)}`}
                  style={{ textAlign: 'inherit' }}
                  placeholder={getContentPlaceholder(sectionLanguage)}
                />
              </div>
              <textarea
                rows="1"
                value={subQuestion.heading}
                onChange={(e) => updateSubQuestion(sectionId, subQuestion.id, { heading: e.target.value })}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className={`w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-[#09302f] focus:border-[#09302f] rounded-lg text-base font-bold bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all resize-none overflow-hidden ${getFontClass(sectionLanguage)} ${getDirectionClass(sectionLanguage)}`}
                placeholder={getQuestionPlaceholder(sectionLanguage)}
                aria-label={`Question ${subQuestion.label} heading`}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
              />
            </>
          ) : (
            <>
              {/* Header First */}
              <textarea
                rows="1"
                value={subQuestion.heading}
                onChange={(e) => updateSubQuestion(sectionId, subQuestion.id, { heading: e.target.value })}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className={`w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-[#09302f] focus:border-[#09302f] rounded-lg text-base font-bold bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all resize-none overflow-hidden ${getFontClass(sectionLanguage)} ${getDirectionClass(sectionLanguage)}`}
                placeholder={getQuestionPlaceholder(sectionLanguage)}
                aria-label={`Question ${subQuestion.label} heading`}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
              />
              {/* Rich Text Editor */}
              <div className="border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden shadow-inner">
                <EditorContent 
                  editor={editor} 
                  className={`prose prose-sm max-w-none p-2 min-h-[100px] sm:min-h-[120px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base leading-relaxed ${getFontClass(sectionLanguage)} ${getDirectionClass(sectionLanguage)}`}
                  style={{ textAlign: 'inherit' }}
                  placeholder={getContentPlaceholder(sectionLanguage)}
                />
              </div>
            </>
          )}

          <div id={`question-${subQuestion.id}-help`} className="sr-only">
            Use the toolbar above to format your question content. Press Tab to navigate between tools.
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
                    try {
                      editor.chain().focus().insertTable({ rows, cols, withHeaderRow: hasHeader }).run();
                      setShowTableModal(false);
                    } catch (error) {
                      console.error('Table insertion error:', error);
                      // Fallback method
                      setTimeout(() => {
                        if (editor && editor.isEditable) {
                          editor.commands.insertTable({ rows, cols, withHeaderRow: hasHeader });
                          setShowTableModal(false);
                        }
                      }, 100);
                    }
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
      
      {/* Delete Warning Card (Back Side) */}
      {showDeleteWarning && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 rounded-xl border-2 border-red-200 dark:border-red-700 p-6 flex flex-col items-center justify-center transform rotateY-180 shadow-lg" style={{ backfaceVisibility: 'hidden' }}>
          <div className="bg-red-100 dark:bg-red-800/50 p-4 rounded-full mb-4 animate-pulse">
            <TrashIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-red-800 dark:text-red-200">Delete Question {subQuestion.label}?</h3>
          <p className="text-red-700 dark:text-red-300 text-center mb-8 text-sm leading-relaxed">
            This will permanently remove this question.<br/>
            <span className="font-semibold">This action cannot be undone.</span>
          </p>
          <div className="flex gap-4 w-full max-w-xs">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteWarning(false);
              }}
              className="flex-1 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-300 dark:border-gray-600 font-medium shadow-sm hover:shadow-md transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                try {
                  deleteSubQuestion(sectionId, subQuestion.id);
                  setShowDeleteWarning(false);
                } catch (error) {
                  console.error('Delete error:', error);
                }
              }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 focus:ring-2 focus:ring-red-400 focus:outline-none"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubQuestionEditor;