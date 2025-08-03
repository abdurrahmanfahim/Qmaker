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
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  Bars3BottomLeftIcon,
  Bars3Icon,
  Bars3BottomRightIcon,
  TableCellsIcon,
  NumberedListIcon,

} from '@heroicons/react/24/outline';
import usePaperStore from '../store/paperStore';
import { useEditorContext } from '../contexts/EditorContext';



const SubQuestionEditor = ({ 
  subQuestion, 
  sectionId, 
  sectionLanguage, 
  isActive, 
  onClick 
}) => {
  const { updateSubQuestion, deleteSubQuestion } = usePaperStore();
  const { setActiveEditor } = useEditorContext();

  const [showTableModal, setShowTableModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saving', 'saved', 'error'
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
      
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Debounced save
      saveTimeoutRef.current = setTimeout(() => {
        try {
          updateSubQuestion(sectionId, subQuestion.id, { content: editor.getHTML() });
          setSaveStatus('saved');
        } catch (error) {
          console.error('Failed to save question content:', encodeURIComponent(error.message));
          setSaveStatus('error');
        }
      }, 500);
    },
    onFocus: () => {
      setActiveEditor(editor);
    },
    onError: (error) => {
      console.error('Editor error:', error);
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
    return placeholders[language] || 'Question heading...';
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
      <div className="p-4 sm:p-6">
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
              
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const confirmDelete = window.confirm(
                    `Are you sure you want to delete Question ${subQuestion.label}?\n\nThis action cannot be undone.`
                  );
                  if (confirmDelete) {
                    try {
                      deleteSubQuestion(sectionId, subQuestion.id);
                    } catch (error) {
                      alert('Failed to delete question. Please try again.');
                      console.error('Delete error:', error);
                    }
                  }
                }}
                className="flex-shrink-0 text-red-500 hover:text-white hover:bg-red-500 dark:text-red-400 dark:hover:text-white dark:hover:bg-red-500 transition-all duration-200 touch-manipulation flex items-center justify-center rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none transform hover:scale-105 active:scale-95 border border-red-200 dark:border-red-600 hover:border-red-500"
                style={{ minWidth: '36px', minHeight: '36px' }}
                aria-label={`Delete Question ${subQuestion.label}`}
                title="Delete Question"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
            
            <div className="relative">
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
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {saveStatus === 'saving' && (
                  <div className="w-3 h-3 border border-[#09302f] border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                )}
                {saveStatus === 'saved' && (
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" aria-hidden="true" title="Saved"></div>
                )}
                {saveStatus === 'error' && (
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" aria-hidden="true" title="Save failed"></div>
                )}
              </div>
            </div>
          </div>

          {/* Rich Text Editor */}
          <div>
            <div className="border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden shadow-inner">
            {editor ? (
              <div className="border-b-2 border-gray-200 dark:border-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                <div className="flex items-center gap-2 p-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                  <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded-lg transition-all duration-200 touch-manipulation transform hover:scale-110 active:scale-95 ${
                      editor.isActive('bold') 
                        ? 'bg-[#09302f] text-white dark:bg-[#4ade80] dark:text-gray-900 shadow-lg' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-md focus:ring-2 focus:ring-[#09302f] focus:outline-none'
                    }`}
                    aria-label="Bold text"
                    aria-pressed={editor.isActive('bold')}
                    style={{ minWidth: '44px', minHeight: '44px' }}
                  >
                    <BoldIcon className="w-4 h-4" aria-hidden="true" />
                  </button>
                  
                  <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded-lg transition-colors touch-manipulation ${
                      editor.isActive('italic') 
                        ? 'bg-[#09302f] text-white dark:bg-[#4ade80] dark:text-gray-900' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-[#09302f] focus:outline-none'
                    }`}
                    aria-label="Italic text"
                    aria-pressed={editor.isActive('italic')}
                    style={{ minWidth: '44px', minHeight: '44px' }}
                  >
                    <ItalicIcon className="w-4 h-4" aria-hidden="true" />
                  </button>
                  
                  <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-2 rounded-lg transition-colors touch-manipulation ${
                      editor.isActive('underline') 
                        ? 'bg-[#09302f] text-white dark:bg-[#4ade80] dark:text-gray-900' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-[#09302f] focus:outline-none'
                    }`}
                    aria-label="Underline text"
                    aria-pressed={editor.isActive('underline')}
                    style={{ minWidth: '44px', minHeight: '44px' }}
                  >
                    <UnderlineIcon className="w-4 h-4" aria-hidden="true" />
                  </button>
                  
                  <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                  
                  <button
                    onClick={() => {
                      const currentAlign = editor.isActive({ textAlign: 'center' }) ? 'center' : 
                                          editor.isActive({ textAlign: 'right' }) ? 'right' : 'left';
                      
                      const nextAlign = currentAlign === 'left' ? 'center' : 
                                       currentAlign === 'center' ? 'right' : 'left';
                      
                      editor.chain().focus().setTextAlign(nextAlign).run();
                    }}
                    className={`p-2 rounded-lg transition-colors touch-manipulation ${
                      editor?.isActive({ textAlign: 'center' }) || editor?.isActive({ textAlign: 'right' })
                        ? 'bg-[#09302f] text-white dark:bg-[#4ade80] dark:text-gray-900'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-[#09302f] focus:outline-none'
                    }`}
                    aria-label="Toggle text alignment"
                    style={{ minWidth: '44px', minHeight: '44px' }}
                  >
                    {editor?.isActive({ textAlign: 'center' }) ? (
                      <Bars3Icon className="w-4 h-4" aria-hidden="true" />
                    ) : editor?.isActive({ textAlign: 'right' }) ? (
                      <Bars3BottomRightIcon className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Bars3BottomLeftIcon className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                  
                  <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                  
                  <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded-lg transition-colors touch-manipulation ${
                      editor.isActive('orderedList') 
                        ? 'bg-[#09302f] text-white dark:bg-[#4ade80] dark:text-gray-900' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-[#09302f] focus:outline-none'
                    }`}
                    aria-label="Numbered list"
                    style={{ minWidth: '44px', minHeight: '44px' }}
                  >
                    <NumberedListIcon className="w-4 h-4" aria-hidden="true" />
                  </button>
                  
                  <button
                    onClick={() => setShowTableModal(true)}
                    className="p-2 rounded-lg transition-colors touch-manipulation text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-[#09302f] focus:outline-none"
                    aria-label="Insert table"
                    style={{ minWidth: '44px', minHeight: '44px' }}
                  >
                    <TableCellsIcon className="w-4 h-4" aria-hidden="true" />
                  </button>
                  
                  <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-2 rounded-lg transition-colors touch-manipulation ${
                      editor.isActive('strike') 
                        ? 'bg-[#09302f] text-white dark:bg-[#4ade80] dark:text-gray-900' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-[#09302f] focus:outline-none'
                    }`}
                    aria-label="Strikethrough text"
                    aria-pressed={editor.isActive('strike')}
                    style={{ minWidth: '44px', minHeight: '44px' }}
                  >
                    <span className="line-through font-bold text-sm" aria-hidden="true">S</span>
                  </button>
                  
                  <button
                    onClick={() => editor.chain().focus().insertContent('<hr>').run()}
                    className="p-2 rounded-lg transition-colors touch-manipulation text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-[#09302f] focus:outline-none"
                    aria-label="Insert horizontal rule"
                    style={{ minWidth: '44px', minHeight: '44px' }}
                  >
                    <span className="text-sm" aria-hidden="true">───</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 p-4" role="status" aria-live="polite">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-[#09302f] border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Loading editor...</span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            )}
            
            <div>
              <EditorContent 
                editor={editor} 
                className={`prose prose-sm max-w-none p-4 min-h-[120px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base leading-relaxed ${getFontClass(sectionLanguage)} ${getDirectionClass(sectionLanguage)}`}
                style={{ textAlign: 'inherit' }}
                role="textbox"
                aria-label={`Question content editor for ${subQuestion.label}`}
                aria-multiline="true"
                aria-describedby={`question-${subQuestion.id}-help`}
                spellCheck="true"

              />
            </div>
            <div id={`question-${subQuestion.id}-help`} className="sr-only">
              Use the toolbar above to format your question content. Press Tab to navigate between tools.
            </div>
          </div>
          </div>
        </div>
      </div>
      
      {/* Table Modal */}
      {showTableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowTableModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-80" onClick={(e) => e.stopPropagation()}>
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
                  try {
                    const rows = parseInt(document.getElementById('table-rows').value);
                    const cols = parseInt(document.getElementById('table-cols').value);

                    
                    if (rows < 1 || cols < 1 || rows > 10 || cols > 10) {
                      alert('Please enter valid table dimensions (1-10 rows and columns)');
                      return;
                    }
                    
                    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: document.getElementById('table-header').checked }).run();
                    
                    setTimeout(() => {
                      // Add hover controls for table expansion
                      const table = document.querySelector('.ProseMirror table:last-of-type');
                      if (table && !table.querySelector('.table-add-row')) {
                        const addRowBtn = document.createElement('button');
                        addRowBtn.className = 'table-add-row';
                        addRowBtn.innerHTML = '+';
                        addRowBtn.onclick = () => editor.chain().focus().addRowAfter().run();
                        
                        const addColBtn = document.createElement('button');
                        addColBtn.className = 'table-add-col';
                        addColBtn.innerHTML = '+';
                        addColBtn.onclick = () => editor.chain().focus().addColumnAfter().run();
                        
                        table.appendChild(addRowBtn);
                        table.appendChild(addColBtn);
                      }
                    }, 500);
                    
                    setShowTableModal(false);
                  } catch (error) {
                    alert('Failed to insert table. Please try again.');
                    console.error('Table insertion error:', error);
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

    </div>
  );
};

export default SubQuestionEditor;