import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import { 
  TrashIcon,
  Bars3BottomLeftIcon,
  Bars3Icon,
  Bars3BottomRightIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  NumberedListIcon
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

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      BulletList,
      OrderedList,
      ListItem,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
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

  const getAnswerPlaceholder = (language) => {
    switch (language) {
      case 'arabic': return 'أدخل الإجابة...';
      case 'bangla': return 'উত্তর লিখুন...';
      case 'urdu': return 'جواب داخل کریں...';
      default: return 'Enter the answer...';
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
              <span className={`text-xs text-gray-500 dark:text-gray-400 hidden sm:inline ${['arabic', 'urdu'].includes(sectionLanguage) ? 'text-left' : ''}`}>marks</span>
              

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
              <div className="border-b border-gray-300 dark:border-gray-600 p-1 sm:p-2 flex items-center gap-1 sm:gap-2 bg-gray-50 dark:bg-gray-700 overflow-x-auto">
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-1.5 sm:p-2 rounded transition-colors flex-shrink-0 flex items-center justify-center ${
                    editor.isActive('bold') 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="Bold"
                >
                  <BoldIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-1.5 sm:p-2 rounded transition-colors flex-shrink-0 flex items-center justify-center ${
                    editor.isActive('italic') 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="Italic"
                >
                  <ItalicIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                
                <button
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={`p-1.5 sm:p-2 rounded transition-colors flex-shrink-0 flex items-center justify-center ${
                    editor.isActive('underline') 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="Underline"
                >
                  <UnderlineIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                
                <button
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`p-1.5 sm:p-2 rounded transition-colors flex-shrink-0 flex items-center justify-center ${
                    editor.isActive('bulletList') 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="Bullet List"
                >
                  <ListBulletIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                
                <button
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`p-1.5 sm:p-2 rounded transition-colors flex-shrink-0 flex items-center justify-center ${
                    editor.isActive('orderedList') 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="Numbered List"
                >
                  <NumberedListIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                
                <button
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  className={`px-1.5 sm:px-2 py-1 text-xs rounded transition-colors flex-shrink-0 flex items-center justify-center ${
                    editor.isActive({ textAlign: 'left' }) 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="hidden sm:inline">Left</span>
                  <Bars3BottomLeftIcon className="w-3 h-3 sm:hidden" />
                </button>
                
                <button
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  className={`px-1.5 sm:px-2 py-1 text-xs rounded transition-colors flex-shrink-0 flex items-center justify-center ${
                    editor.isActive({ textAlign: 'center' }) 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="hidden sm:inline">Center</span>
                  <Bars3Icon className="w-3 h-3 sm:hidden" />
                </button>
                
                <button
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  className={`px-1.5 sm:px-2 py-1 text-xs rounded transition-colors flex-shrink-0 flex items-center justify-center ${
                    editor.isActive({ textAlign: 'right' }) 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="hidden sm:inline">Right</span>
                  <Bars3BottomRightIcon className="w-3 h-3 sm:hidden" />
                </button>
              </div>
            )}
            
            <EditorContent 
              editor={editor} 
              className={`prose prose-sm max-w-none p-2 sm:p-3 min-h-[80px] sm:min-h-[100px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base ${getFontClass(sectionLanguage)} ${getDirectionClass(sectionLanguage)}`}
            />
          </div>


        </div>
      </div>
    </div>
  );
};

export default SubQuestionEditor;