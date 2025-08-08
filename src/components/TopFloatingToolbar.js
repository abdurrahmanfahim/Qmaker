import React, { useEffect, useState } from 'react';
import { 
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  Bars3CenterLeftIcon,
  Bars3Icon,
  TableCellsIcon,
  NumberedListIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon
} from '@heroicons/react/24/outline';
import { useEditorContext } from '../contexts/EditorContext';
import { useHapticFeedback } from '../hooks/useSwipeGestures';

const TopFloatingToolbar = ({ showTableModal, setShowTableModal }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { activeEditor } = useEditorContext();
  const { lightTap } = useHapticFeedback();

  useEffect(() => {
    const handleScroll = () => {
      const sectionHeader = document.querySelector('.border-b.border-gray-200');
      if (sectionHeader) {
        const rect = sectionHeader.getBoundingClientRect();
        setIsVisible(rect.bottom < 0);
      }
    };

    const addScrollListeners = () => {
      window.addEventListener('scroll', handleScroll, { passive: true });
      document.addEventListener('scroll', handleScroll, { passive: true });
      
      const scrollContainers = document.querySelectorAll('.overflow-auto, .custom-scrollbar');
      scrollContainers.forEach(container => {
        container.addEventListener('scroll', handleScroll, { passive: true });
      });
    };

    const removeScrollListeners = () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
      
      const scrollContainers = document.querySelectorAll('.overflow-auto, .custom-scrollbar');
      scrollContainers.forEach(container => {
        container.removeEventListener('scroll', handleScroll);
      });
    };

    addScrollListeners();
    handleScroll();
    
    return removeScrollListeners;
  }, []);

  const executeCommand = (command) => {
    if (!activeEditor) return false;
    lightTap();
    
    switch(command) {
      case 'bold':
        return activeEditor.chain().focus().toggleBold().run();
      case 'italic':
        return activeEditor.chain().focus().toggleItalic().run();
      case 'underline':
        if (activeEditor.extensionManager.extensions.find(ext => ext.name === 'underline')) {
          return activeEditor.chain().focus().toggleMark('underline').run();
        }
        return false;
      case 'strikeThrough':
        return activeEditor.chain().focus().toggleStrike().run();
      case 'insertOrderedList':
        return activeEditor.chain().focus().toggleOrderedList().run();
      case 'insertHorizontalRule':
        return activeEditor.chain().focus().setHorizontalRule().run();
      default:
        return false;
    }
  };

  const toggleAlignment = () => {
    if (!activeEditor) return;
    
    const isCenter = activeEditor.isActive({ textAlign: 'center' });
    const isRight = activeEditor.isActive({ textAlign: 'right' });
    
    if (isCenter) {
      activeEditor.chain().focus().setTextAlign('right').run();
    } else if (isRight) {
      activeEditor.chain().focus().setTextAlign('left').run();
    } else {
      activeEditor.chain().focus().setTextAlign('center').run();
    }
  };

  const insertTable = (rows, cols, hasHeader) => {
    if (activeEditor) {
      activeEditor.chain().focus().insertTable({ rows, cols, withHeaderRow: hasHeader }).run();
    }
  };

  return (
    <div className={`floating-toolbar fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 z-50 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div 
        className="flex items-center gap-[3px] px-1 overflow-x-auto" 
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {/* Undo */}
        <button
          onClick={() => {
            if (activeEditor && activeEditor.can && activeEditor.can().undo()) {
              activeEditor.chain().focus().undo().run();
            }
          }}
          disabled={!activeEditor || !activeEditor.can || !activeEditor.can().undo()}
          className="p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none disabled:opacity-50 flex items-center justify-center"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <ArrowUturnLeftIcon className="w-4 h-4" />
        </button>
        
        {/* Redo */}
        <button
          onClick={() => {
            if (activeEditor && activeEditor.can && activeEditor.can().redo()) {
              activeEditor.chain().focus().redo().run();
            }
          }}
          disabled={!activeEditor || !activeEditor.can || !activeEditor.can().redo()}
          className="p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none disabled:opacity-50 flex items-center justify-center"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <ArrowUturnRightIcon className="w-4 h-4" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 hidden lg:block"></div>
        
        {/* Bold */}
        <button
          onClick={() => executeCommand('bold')}
          className={`p-2 rounded-lg transition-colors focus:outline-none flex items-center justify-center ${
            activeEditor?.isActive('bold') 
              ? 'border-2 border-[#09302f] dark:border-[#4ade80] text-[#09302f] dark:text-[#4ade80]' 
              : 'text-gray-600 dark:text-gray-300'
          }`}
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <BoldIcon className="w-4 h-4" />
        </button>
        
        {/* Italic */}
        <button
          onClick={() => executeCommand('italic')}
          className={`p-2 rounded-lg transition-colors focus:outline-none flex items-center justify-center ${
            activeEditor?.isActive('italic') 
              ? 'border-2 border-[#09302f] dark:border-[#4ade80] text-[#09302f] dark:text-[#4ade80]' 
              : 'text-gray-600 dark:text-gray-300'
          }`}
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <ItalicIcon className="w-4 h-4" />
        </button>
        
        {/* Underline */}
        <button
          onClick={() => executeCommand('underline')}
          className={`p-2 rounded-lg transition-colors focus:outline-none flex items-center justify-center ${
            activeEditor?.isActive('underline') 
              ? 'border-2 border-[#09302f] dark:border-[#4ade80] text-[#09302f] dark:text-[#4ade80]' 
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 hidden lg:block"></div>
        
        {/* Toggle Alignment */}
        <button
          onClick={toggleAlignment}
          className={`p-2 rounded-lg transition-colors focus:outline-none flex items-center justify-center ${
            activeEditor?.isActive({ textAlign: 'center' }) || activeEditor?.isActive({ textAlign: 'right' })
              ? 'border-2 border-[#09302f] dark:border-[#4ade80] text-[#09302f] dark:text-[#4ade80]' 
              : 'text-gray-600 dark:text-gray-300'
          }`}
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          {activeEditor?.isActive({ textAlign: 'center' }) ? (
            <Bars3Icon className="w-4 h-4" />
          ) : activeEditor?.isActive({ textAlign: 'right' }) ? (
            <Bars3CenterLeftIcon className="w-4 h-4 scale-x-[-1]" />
          ) : (
            <Bars3CenterLeftIcon className="w-4 h-4" />
          )}
        </button>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 hidden lg:block"></div>
        
        {/* Numbered List */}
        <button
          onClick={() => executeCommand('insertOrderedList')}
          className={`p-2 rounded-lg transition-colors focus:outline-none flex items-center justify-center ${
            activeEditor?.isActive('orderedList') 
              ? 'border-2 border-[#09302f] dark:border-[#4ade80] text-[#09302f] dark:text-[#4ade80]' 
              : 'text-gray-600 dark:text-gray-300'
          }`}
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <NumberedListIcon className="w-4 h-4" />
        </button>
        
        {/* Table */}
        <button
          onClick={() => setShowTableModal(true)}
          className="p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none flex items-center justify-center"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <TableCellsIcon className="w-4 h-4" />
        </button>
        
        {/* Strikethrough */}
        <button
          onClick={() => executeCommand('strikeThrough')}
          className={`p-2 rounded-lg transition-colors focus:outline-none flex items-center justify-center ${
            activeEditor?.isActive('strike') 
              ? 'border-2 border-[#09302f] dark:border-[#4ade80] text-[#09302f] dark:text-[#4ade80]' 
              : 'text-gray-600 dark:text-gray-300'
          }`}
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <span className="line-through font-bold text-sm">S</span>
        </button>
        
        {/* Horizontal Rule */}
        <button
          onClick={() => executeCommand('insertHorizontalRule')}
          className="p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none flex items-center justify-center"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <span className="text-sm">───</span>
        </button>
      </div>
    </div>
  );
};

export default TopFloatingToolbar;