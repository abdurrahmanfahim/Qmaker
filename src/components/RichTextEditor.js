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
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  NumberedListIcon,
  TableCellsIcon,
  PhotoIcon,
  MicrophoneIcon
} from '@heroicons/react/24/outline';

const RichTextEditor = ({ 
  content, 
  onChange, 
  language = 'english', 
  direction = 'ltr', 
  placeholder = 'Start typing...',
  className = ''
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      BulletList,
      OrderedList,
      ListItem,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[100px] p-3 ${
          direction === 'rtl' ? 'text-right' : 'text-left'
        }`,
        dir: direction,
        lang: language,
      },
    },
  });

  const getFontClass = () => {
    const fonts = {
      arabic: 'font-arabic',
      bangla: 'font-bangla',
      urdu: 'font-urdu',
      english: 'font-sans'
    };
    return fonts[language] || fonts.english;
  };

  const ToolbarButton = ({ onClick, isActive, children, title }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded transition-colors ${
        isActive
          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
      title={title}
      type="button"
    >
      {children}
    </button>
  );

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = language === 'arabic' ? 'ar-SA' : 
                        language === 'bangla' ? 'bn-BD' : 
                        language === 'urdu' ? 'ur-PK' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        editor.chain().focus().insertContent(transcript).run();
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognition.start();
    } else {
      alert('Speech recognition not supported in this browser');
    }
  };

  if (!editor) {
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded"></div>;
  }

  return (
    <div className={`border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <BoldIcon className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <ItalicIcon className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <span className="text-sm">⬅</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <span className="text-sm">⬌</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <span className="text-sm">➡</span>
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <ListBulletIcon className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <NumberedListIcon className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <ToolbarButton
          onClick={insertTable}
          isActive={editor.isActive('table')}
          title="Insert Table"
        >
          <TableCellsIcon className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={insertImage}
          isActive={false}
          title="Insert Image"
        >
          <PhotoIcon className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={startVoiceInput}
          isActive={false}
          title="Voice Input"
        >
          <MicrophoneIcon className="w-4 h-4" />
        </ToolbarButton>

        {/* Language-specific tools */}
        {(language === 'arabic' || language === 'urdu') && (
          <>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
            <button
              onClick={() => {
                const selection = editor.state.selection;
                const text = editor.state.doc.textBetween(selection.from, selection.to);
                // Placeholder for diacritic restoration
                console.log('Adding diacritics to:', text);
              }}
              className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              title="Add Diacritics"
            >
              ◌ً
            </button>
          </>
        )}
      </div>

      {/* Editor Content */}
      <div className={`${getFontClass()} text-gray-900 dark:text-gray-100`}>
        <EditorContent 
          editor={editor} 
          className="min-h-[100px]"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;