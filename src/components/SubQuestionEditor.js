import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { 
  Bars3Icon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import usePaperStore from '../store/paperStore';

const SubQuestionEditor = ({ 
  subQuestion, 
  sectionId, 
  sectionLanguage, 
  isActive, 
  isDragging, 
  provided, 
  onClick 
}) => {
  const { updateSubQuestion, deleteSubQuestion } = usePaperStore();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
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
      ref={provided.innerRef}
      {...provided.draggableProps}
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2 sm:p-4 transition-all ${
        isDragging ? 'shadow-lg' : 'hover:shadow-md'
      } ${
        isActive ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <div {...provided.dragHandleProps} className="mt-1 flex-shrink-0">
          <Bars3Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
        </div>
        
        <div className="flex-1 space-y-3 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
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
            
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <input
                type="number"
                value={subQuestion.marks}
                onChange={(e) => updateSubQuestion(sectionId, subQuestion.id, { marks: parseInt(e.target.value) || 0 })}
                className="w-12 sm:w-16 px-1 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Marks"
                min="0"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">marks</span>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateSubQuestion(sectionId, subQuestion.id, { showAnswer: !subQuestion.showAnswer });
                }}
                className={`p-1 rounded transition-colors ${
                  subQuestion.showAnswer 
                    ? 'text-green-600 hover:text-green-700' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title={subQuestion.showAnswer ? "Hide Answer" : "Show Answer"}
              >
                {subQuestion.showAnswer ? (
                  <EyeIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <EyeSlashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSubQuestion(sectionId, subQuestion.id);
                }}
                className="p-1 text-red-500 hover:text-red-700 transition-colors"
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
                  className={`px-1.5 sm:px-2 py-1 text-xs rounded transition-colors flex-shrink-0 ${
                    editor.isActive('bold') 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  B
                </button>
                
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`px-1.5 sm:px-2 py-1 text-xs rounded transition-colors flex-shrink-0 ${
                    editor.isActive('italic') 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  I
                </button>
                
                <button
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={`px-1.5 sm:px-2 py-1 text-xs rounded transition-colors flex-shrink-0 ${
                    editor.isActive('underline') 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  U
                </button>
                
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1 hidden sm:block"></div>
                
                <button
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  className={`px-1.5 sm:px-2 py-1 text-xs rounded transition-colors flex-shrink-0 ${
                    editor.isActive({ textAlign: 'left' }) 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="hidden sm:inline">Left</span>
                  <span className="sm:hidden">L</span>
                </button>
                
                <button
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  className={`px-1.5 sm:px-2 py-1 text-xs rounded transition-colors flex-shrink-0 ${
                    editor.isActive({ textAlign: 'center' }) 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="hidden sm:inline">Center</span>
                  <span className="sm:hidden">C</span>
                </button>
                
                <button
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  className={`px-1.5 sm:px-2 py-1 text-xs rounded transition-colors flex-shrink-0 ${
                    editor.isActive({ textAlign: 'right' }) 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="hidden sm:inline">Right</span>
                  <span className="sm:hidden">R</span>
                </button>
              </div>
            )}
            
            <EditorContent 
              editor={editor} 
              className={`prose prose-sm max-w-none p-2 sm:p-3 min-h-[80px] sm:min-h-[100px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base ${getFontClass(sectionLanguage)} ${getDirectionClass(sectionLanguage)}`}
            />
          </div>

          {/* Answer Section */}
          {subQuestion.showAnswer && (
            <div className="border border-green-300 dark:border-green-600 rounded-lg p-2 sm:p-3 bg-green-50 dark:bg-green-900/20">
              <label className="block text-xs sm:text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                Answer Key
              </label>
              <textarea
                value={subQuestion.answer}
                onChange={(e) => updateSubQuestion(sectionId, subQuestion.id, { answer: e.target.value })}
                className={`w-full px-2 sm:px-3 py-2 border border-green-300 dark:border-green-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none text-sm ${getFontClass(sectionLanguage)} ${getDirectionClass(sectionLanguage)}`}
                rows="3"
                placeholder={getAnswerPlaceholder(sectionLanguage)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubQuestionEditor;