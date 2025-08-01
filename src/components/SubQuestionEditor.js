import React, { useState } from 'react';
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
  Bars3BottomLeftIcon,
  Bars3Icon,
  Bars3BottomRightIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  NumberedListIcon,
  TableCellsIcon,
  PlusIcon,
  MinusIcon,
  VariableIcon
} from '@heroicons/react/24/outline';
import usePaperStore from '../store/paperStore';
import MathEquation from './MathEquation';

const SubQuestionEditor = ({ 
  subQuestion, 
  sectionId, 
  sectionLanguage, 
  isActive, 
  onClick 
}) => {
  const { updateSubQuestion, deleteSubQuestion } = usePaperStore();
  const [showMathModal, setShowMathModal] = useState(false);
  
  const getNextAlignment = () => {
    if (editor?.isActive({ textAlign: 'left' })) return 'center';
    if (editor?.isActive({ textAlign: 'center' })) return 'right';
    return 'left';
  };
  
  const getCurrentAlignmentIcon = () => {
    if (editor?.isActive({ textAlign: 'center' })) return <Bars3Icon className="w-4 h-4" />;
    if (editor?.isActive({ textAlign: 'right' })) return <Bars3BottomRightIcon className="w-4 h-4" />;
    return <Bars3BottomLeftIcon className="w-4 h-4" />;
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'prose-bullet-list',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'prose-ordered-list',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'prose-list-item',
          },
        },
      }),
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
      updateSubQuestion(sectionId, subQuestion.id, { content: editor.getHTML() });
    },
  });

  const getFontClass = (language) => {
    switch (language) {
      case 'arabic': return 'font-arabic';
      case 'urdu': return 'font-urdu';
      case 'bangla': return 'font-bangla';
      default: return 'font-english';
    }
  };

  const getDirectionClass = (language) => {
    return ['arabic', 'urdu'].includes(language) ? 'rtl' : 'ltr';
  };

  const getQuestionPlaceholder = (language) => {
    switch (language) {
      case 'arabic': return 'عنوان السؤال...';
      case 'bangla': return 'প্রশ্নের শিরোনাম...';
      case 'urdu': return 'سوال کا عنوان...';
      default: return 'Question heading...';
    }
  };



  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2 sm:p-4 transition-all hover:shadow-md ${
        isActive ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        
        <div className="flex-1 space-y-3 min-w-0">
          <div className={`flex items-center justify-between gap-2 ${['arabic', 'urdu'].includes(sectionLanguage) ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 sm:gap-3 min-w-0 flex-1 ${['arabic', 'urdu'].includes(sectionLanguage) ? 'flex-row-reverse' : ''}`}>
              <span className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs sm:text-sm font-medium flex-shrink-0">
                {subQuestion.label}
              </span>
              <input
                type="text"
                value={subQuestion.heading}
                onChange={(e) => updateSubQuestion(sectionId, subQuestion.id, { heading: e.target.value })}
                className={`flex-1 min-w-0 px-2 py-1 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${getFontClass(sectionLanguage)} ${getDirectionClass(sectionLanguage)}`}
                placeholder={getQuestionPlaceholder(sectionLanguage)}
              />
            </div>
            
            <div className={`flex items-center gap-1 flex-shrink-0 ${['arabic', 'urdu'].includes(sectionLanguage) ? 'flex-row-reverse' : ''}`}>
              <input
                type="number"
                value={subQuestion.marks}
                onChange={(e) => updateSubQuestion(sectionId, subQuestion.id, { marks: parseInt(e.target.value) || 0 })}
                className={`w-10 sm:w-16 px-1 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${['arabic', 'urdu'].includes(sectionLanguage) ? 'text-right' : ''}`}
                placeholder="0"
                min="0"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">marks</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSubQuestion(sectionId, subQuestion.id);
                }}
                className="p-1 text-red-500 hover:text-red-700 transition-colors touch-manipulation"
                title="Delete Sub-Question"
              >
                <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Rich Text Editor */}
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            {editor && (
              <div className="border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                {/* Mobile: UX-optimized layout with priority-based grouping */}
                <div className="flex flex-col sm:hidden">
                  {/* Primary tools: Most frequently used */}
                  <div className="flex items-center justify-between px-2 py-1">
                    {/* Essential formatting group */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`min-h-[44px] min-w-[44px] rounded-lg transition-colors flex items-center justify-center ${
                          editor.isActive('bold') 
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        title="Bold"
                      >
                        <BoldIcon className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`min-h-[44px] min-w-[44px] rounded-lg transition-colors flex items-center justify-center ${
                          editor.isActive('italic') 
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        title="Italic"
                      >
                        <ItalicIcon className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`min-h-[44px] min-w-[44px] rounded-lg transition-colors flex items-center justify-center ${
                          editor.isActive('underline') 
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        title="Underline"
                      >
                        <UnderlineIcon className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`min-h-[44px] min-w-[44px] rounded-lg transition-colors flex items-center justify-center ${
                          editor.isActive('bulletList') 
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        title="Bullet List"
                      >
                        <ListBulletIcon className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Alignment toggle */}
                    <button
                      onClick={() => editor.chain().focus().setTextAlign(getNextAlignment()).run()}
                      className={`min-h-[44px] min-w-[44px] rounded-lg transition-colors flex items-center justify-center ${
                        editor.isActive({ textAlign: 'left' }) || editor.isActive({ textAlign: 'center' }) || editor.isActive({ textAlign: 'right' })
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      title="Text Alignment"
                    >
                      {getCurrentAlignmentIcon()}
                    </button>
                    
                    {/* Insert tools group */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setShowMathModal(true)}
                        className="min-h-[44px] min-w-[44px] rounded-lg transition-colors flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                        title="Math Equation"
                      >
                        <VariableIcon className="w-5 h-5" />
                      </button>
                      

                      
                      <button
                        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                        className="min-h-[44px] min-w-[44px] rounded-lg transition-colors flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                        title="Table"
                      >
                        <TableCellsIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Table controls for mobile */}
                  {editor?.isActive('table') && (
                    <div className="border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Add</div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => editor.chain().focus().addRowAfter().run()}
                              className="flex-1 min-h-[40px] px-2 rounded-lg transition-colors bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 text-xs font-medium"
                            >
                              +Row
                            </button>
                            <button
                              onClick={() => editor.chain().focus().addColumnAfter().run()}
                              className="flex-1 min-h-[40px] px-2 rounded-lg transition-colors bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-sky-900/50 text-xs font-medium"
                            >
                              +Col
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Remove</div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => editor.chain().focus().deleteRow().run()}
                              className="flex-1 min-h-[40px] px-2 rounded-lg transition-colors bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 text-xs font-medium"
                            >
                              -Row
                            </button>
                            <button
                              onClick={() => editor.chain().focus().deleteColumn().run()}
                              className="flex-1 min-h-[40px] px-2 rounded-lg transition-colors bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 text-xs font-medium"
                            >
                              -Col
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => editor.chain().focus().deleteTable().run()}
                        className="w-full mt-2 min-h-[40px] px-3 rounded-lg transition-colors bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 text-xs font-medium flex items-center justify-center gap-1"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Delete Table
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Desktop: Single compact row */}
                <div className="hidden sm:flex items-center gap-1 p-1.5 overflow-x-auto">
                  <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded transition-colors flex-shrink-0 flex items-center justify-center ${
                      editor.isActive('bold') 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    title="Bold"
                  >
                    <BoldIcon className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded transition-colors flex-shrink-0 flex items-center justify-center ${
                      editor.isActive('italic') 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    title="Italic"
                  >
                    <ItalicIcon className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-1.5 rounded transition-colors flex-shrink-0 flex items-center justify-center ${
                      editor.isActive('underline') 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    title="Underline"
                  >
                    <UnderlineIcon className="w-4 h-4" />
                  </button>
                  
                  <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                  
                  <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-1.5 rounded transition-colors flex-shrink-0 flex items-center justify-center ${
                      editor.isActive('bulletList') 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    title="Bullet List"
                  >
                    <ListBulletIcon className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-1.5 rounded transition-colors flex-shrink-0 flex items-center justify-center ${
                      editor.isActive('orderedList') 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    title="Numbered List"
                  >
                    <NumberedListIcon className="w-4 h-4" />
                  </button>
                  
                  <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                  
                  <button
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`p-1.5 rounded transition-colors flex-shrink-0 flex items-center justify-center ${
                      editor.isActive({ textAlign: 'left' }) 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Bars3BottomLeftIcon className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`p-1.5 rounded transition-colors flex-shrink-0 flex items-center justify-center ${
                      editor.isActive({ textAlign: 'center' }) 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Bars3Icon className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`p-1.5 rounded transition-colors flex-shrink-0 flex items-center justify-center ${
                      editor.isActive({ textAlign: 'right' }) 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Bars3BottomRightIcon className="w-4 h-4" />
                  </button>
                  
                  <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                  
                  <button
                    onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                    className="p-1.5 rounded transition-colors flex-shrink-0 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                    title="Insert Table"
                  >
                    <TableCellsIcon className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => setShowMathModal(true)}
                    className="p-1.5 rounded transition-colors flex-shrink-0 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                    title="Insert Math Equation"
                  >
                    <VariableIcon className="w-4 h-4" />
                  </button>
                  

                  
                  {editor?.isActive('table') && (
                    <>
                      <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                      
                      <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded-lg">
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => editor.chain().focus().addRowBefore().run()}
                            className="px-2 py-1 rounded text-xs font-medium transition-colors bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
                            title="Add Row Above"
                          >
                            +Row↑
                          </button>
                          
                          <button
                            onClick={() => editor.chain().focus().addRowAfter().run()}
                            className="px-2 py-1 rounded text-xs font-medium transition-colors bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
                            title="Add Row Below"
                          >
                            +Row↓
                          </button>
                        </div>
                        
                        <div className="w-px h-4 bg-gray-300 dark:bg-gray-500"></div>
                        
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => editor.chain().focus().addColumnBefore().run()}
                            className="px-2 py-1 rounded text-xs font-medium transition-colors bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-sky-900/50"
                            title="Add Column Left"
                          >
                            +Col←
                          </button>
                          
                          <button
                            onClick={() => editor.chain().focus().addColumnAfter().run()}
                            className="px-2 py-1 rounded text-xs font-medium transition-colors bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-sky-900/50"
                            title="Add Column Right"
                          >
                            +Col→
                          </button>
                        </div>
                        
                        <div className="w-px h-4 bg-gray-300 dark:bg-gray-500"></div>
                        
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => editor.chain().focus().deleteRow().run()}
                            className="px-2 py-1 rounded text-xs font-medium transition-colors bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                            title="Delete Row"
                          >
                            -Row
                          </button>
                          
                          <button
                            onClick={() => editor.chain().focus().deleteColumn().run()}
                            className="px-2 py-1 rounded text-xs font-medium transition-colors bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                            title="Delete Column"
                          >
                            -Col
                          </button>
                          
                          <button
                            onClick={() => editor.chain().focus().deleteTable().run()}
                            className="px-2 py-1 rounded text-xs font-medium transition-colors bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                            title="Delete Table"
                          >
                            <TrashIcon className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            
            <EditorContent 
              editor={editor} 
              className={`prose prose-sm max-w-none p-2 sm:p-3 min-h-[80px] sm:min-h-[100px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base ${getFontClass(sectionLanguage)} ${getDirectionClass(sectionLanguage)}`}
            />
          </div>


        </div>
      </div>
      
      {/* Math Equation Modal */}
      {showMathModal && (
        <MathEquation
          onInsert={(mathText) => {
            editor?.chain().focus().insertContent(mathText).run();
          }}
          onClose={() => setShowMathModal(false)}
        />
      )}
      

    </div>
  );
};

export default SubQuestionEditor;