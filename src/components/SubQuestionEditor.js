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
  EllipsisVerticalIcon,
  Bars3BottomLeftIcon,
  Bars3Icon,
  Bars3BottomRightIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';
import usePaperStore from '../store/paperStore';

const SubQuestionEditor = ({ 
  subQuestion, 
  sectionId, 
  sectionLanguage, 
  isActive, 
  onClick 
}) => {
  const { updateSubQuestion, deleteSubQuestion } = usePaperStore();
  const [showMenu, setShowMenu] = useState(false);
  const [textAlign, setTextAlign] = useState('left');
  const [showTableModal, setShowTableModal] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);
  


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
      try {
        updateSubQuestion(sectionId, subQuestion.id, { content: editor.getHTML() });
      } catch (error) {
        console.error('Failed to save question content:', error);
      }
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
      className={`bg-white dark:bg-gray-800 rounded-lg border transition-colors ${
        isActive ? 'border-[#09302f] shadow-sm' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
      }`}
      onClick={onClick}
    >
      <div className="p-2 sm:p-4">
        <div className="space-y-6">
          {/* Question Header */}
          <div className={`flex items-start gap-4 ${['arabic', 'urdu'].includes(sectionLanguage) ? 'flex-row-reverse' : ''}`}>
            <div className="flex-shrink-0">
              <span className="inline-flex items-center justify-center w-10 h-10 bg-[#09302f] text-white rounded-full text-sm font-semibold">
                {subQuestion.label}
              </span>
            </div>
            
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={subQuestion.heading}
                onChange={(e) => updateSubQuestion(sectionId, subQuestion.id, { heading: e.target.value })}
                className={`w-full px-2 py-2 border-0 focus:outline-none text-base bg-transparent text-gray-900 dark:text-gray-100 ${getFontClass(sectionLanguage)} ${getDirectionClass(sectionLanguage)}`}
                placeholder={getQuestionPlaceholder(sectionLanguage)}
              />
            </div>
            
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={subQuestion.marks}
                onChange={(e) => updateSubQuestion(sectionId, subQuestion.id, { marks: parseInt(e.target.value) || 0 })}
                className={`w-10 px-1 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs text-center appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${['arabic', 'urdu'].includes(sectionLanguage) ? 'text-right' : ''}`}
                style={{ MozAppearance: 'textfield' }}
                placeholder="5"
                min="0"
                max="99"
              />
              <div className="relative" ref={menuRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center justify-center w-6 h-6"
                  aria-label="More options"
                >
                  <EllipsisVerticalIcon className="w-3 h-3" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded shadow-lg z-10 min-w-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Delete this question?')) {
                          deleteSubQuestion(sectionId, subQuestion.id);
                        }
                        setShowMenu(false);
                      }}
                      className="w-full px-2 py-1 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-1 text-xs"
                    >
                      <TrashIcon className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rich Text Editor */}
          <div>
            <div className="border border-gray-300 dark:border-gray-500 rounded-lg overflow-hidden">
            {editor ? (
              <div className="border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center gap-1 p-1">
                  <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded transition-colors ${
                      editor.isActive('bold') 
                        ? 'bg-[#09302f] text-white' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    aria-label="Bold text"
                    aria-pressed={editor.isActive('bold')}
                    style={{ minWidth: '32px', minHeight: '32px' }}
                  >
                    <BoldIcon className="w-4 h-4" aria-hidden="true" />
                  </button>
                  
                  <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1 rounded transition-colors ${
                      editor.isActive('italic') 
                        ? 'bg-[#09302f] text-white' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    aria-label="Italic text"
                    aria-pressed={editor.isActive('italic')}
                    style={{ minWidth: '32px', minHeight: '32px' }}
                  >
                    <ItalicIcon className="w-4 h-4" aria-hidden="true" />
                  </button>
                  
                  <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-1 rounded transition-colors ${
                      editor.isActive('underline') 
                        ? 'bg-[#09302f] text-white' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    aria-label="Underline text"
                    aria-pressed={editor.isActive('underline')}
                    style={{ minWidth: '32px', minHeight: '32px' }}
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
                      setTextAlign(nextAlign);
                    }}
                    className={`p-2 rounded transition-colors ${
                      editor?.isActive({ textAlign: 'center' }) || editor?.isActive({ textAlign: 'right' })
                        ? 'bg-[#09302f] text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    aria-label="Toggle text alignment"
                    style={{ minWidth: '40px', minHeight: '40px' }}
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
                    onClick={() => setShowTableModal(true)}
                    className="p-1 rounded transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    aria-label="Insert table"
                    style={{ minWidth: '32px', minHeight: '32px' }}
                  >
                    <TableCellsIcon className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-b border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 p-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#09302f] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Loading editor...</span>
                </div>
              </div>
            )}
            
            <EditorContent 
              editor={editor} 
              className={`prose prose-sm max-w-none p-4 sm:p-6 min-h-[120px] sm:min-h-[140px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base leading-relaxed ${getFontClass(sectionLanguage)} ${getDirectionClass(sectionLanguage)}`}
              style={{ textAlign: 'inherit' }}
              role="textbox"
              aria-label="Question content editor"
              aria-multiline="true"
              spellCheck="true"
            />
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
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="table-listing"
                  className="mr-2"
                  defaultChecked
                />
                <label htmlFor="table-listing" className="text-sm text-gray-700 dark:text-gray-300">With listing (a, b, c...)</label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowTableModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const rows = parseInt(document.getElementById('table-rows').value);
                  const cols = parseInt(document.getElementById('table-cols').value);
                  const withHeader = document.getElementById('table-header').checked;
                  const withListing = document.getElementById('table-listing').checked;
                  
                  editor.chain().focus().insertTable({ rows, cols, withHeaderRow: false }).run();
                  
                  setTimeout(() => {
                    if (withListing) {
                      const letters = sectionLanguage === 'arabic' ? ['أ', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح', 'ط', 'ي'] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
                      const tables = editor.view.dom.querySelectorAll('table');
                      const table = tables[tables.length - 1];
                      const cells = table.querySelectorAll('td');
                      for (let i = 0; i < cells.length; i++) {
                        cells[i].innerHTML = `<p>${letters[i] || (i + 1)}.</p>`;
                      }
                    }
                    
                    const table = editor.view.dom.querySelector('table:last-of-type');
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
                  }, 100);
                  
                  setShowTableModal(false);
                }}
                className="px-4 py-2 bg-[#09302f] text-white rounded hover:bg-[#072625]"
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