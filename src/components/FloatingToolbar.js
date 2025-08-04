import React, { useState, useEffect } from 'react';
import '../keyboard-fix.css';
import { 
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  Bars3BottomLeftIcon,
  Bars3CenterLeftIcon,
  Bars3Icon,
  TableCellsIcon,
  NumberedListIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon
} from '@heroicons/react/24/outline';
import { useEditorContext } from '../contexts/EditorContext';
import { useHapticFeedback } from '../hooks/useSwipeGestures';

const FloatingToolbar = ({ showTableModal, setShowTableModal, hideToolbar = false }) => {
  const { activeEditor } = useEditorContext();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { lightTap } = useHapticFeedback();

  useEffect(() => {
    let resizeTimeout;
    
    const updateKeyboardHeight = () => {
      if (window.visualViewport) {
        const kbHeight = Math.max(0, window.innerHeight - window.visualViewport.height);
        setKeyboardHeight(kbHeight);
        document.documentElement.style.setProperty('--keyboard-height', `${kbHeight}px`);
      }
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateKeyboardHeight, 200);
    };

    const handleFocus = () => {
      // Immediate check on focus
      setTimeout(updateKeyboardHeight, 300);
    };

    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          if (activeEditor && activeEditor.can && activeEditor.can().undo()) {
            activeEditor.chain().focus().undo().run();
          }
        } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          if (activeEditor && activeEditor.can && activeEditor.can().redo()) {
            activeEditor.chain().focus().redo().run();
          }
        }
      }
    };

    const handleScroll = () => {
      updateKeyboardHeight();
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('keydown', handleKeyDown);
    
    const scrollElement = document.querySelector('.custom-scrollbar');
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      clearTimeout(resizeTimeout);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('keydown', handleKeyDown);
      
      const scrollElement = document.querySelector('.custom-scrollbar');
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [activeEditor]);

  // Always show toolbar

  const executeCommand = (command) => {
    if (!activeEditor) return false;
    lightTap(); // Haptic feedback for all commands
    
    switch(command) {
      case 'bold':
        return activeEditor.chain().focus().toggleBold().run();
      case 'italic':
        return activeEditor.chain().focus().toggleItalic().run();
      case 'underline':
        // Check if underline extension is available
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
    <div className="floating-toolbar fixed left-0 right-0 z-[9999] bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-600">
      <div 
        className="flex items-center gap-1 p-2 overflow-x-auto" 
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
          className="touch-target p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none disabled:opacity-50"
          aria-label="Undo"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <ArrowUturnLeftIcon className="w-4 h-4" aria-hidden="true" />
        </button>
        
        {/* Redo */}
        <button
          onClick={() => {
            if (activeEditor && activeEditor.can && activeEditor.can().redo()) {
              activeEditor.chain().focus().redo().run();
            }
          }}
          disabled={!activeEditor || !activeEditor.can || !activeEditor.can().redo()}
          className="p-2 rounded-lg transition-colors touch-manipulation text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none disabled:opacity-50"
          aria-label="Redo"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <ArrowUturnRightIcon className="w-4 h-4" aria-hidden="true" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        
        {/* Bold */}
        <button
          onClick={() => executeCommand('bold')}
          className={`p-2 rounded-lg transition-colors touch-manipulation focus:outline-none ${
            activeEditor?.isActive('bold') 
              ? 'border-2 border-[#09302f] dark:border-[#4ade80] text-[#09302f] dark:text-[#4ade80]' 
              : 'text-gray-600 dark:text-gray-300'
          }`}
          aria-label="Bold text"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <BoldIcon className="w-4 h-4" aria-hidden="true" />
        </button>
        
        {/* Italic */}
        <button
          onClick={() => executeCommand('italic')}
          className={`p-2 rounded-lg transition-colors touch-manipulation focus:outline-none ${
            activeEditor?.isActive('italic') 
              ? 'border-2 border-[#09302f] dark:border-[#4ade80] text-[#09302f] dark:text-[#4ade80]' 
              : 'text-gray-600 dark:text-gray-300'
          }`}
          aria-label="Italic text"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <ItalicIcon className="w-4 h-4" aria-hidden="true" />
        </button>
        
        {/* Underline */}
        <button
          onClick={() => executeCommand('underline')}
          className={`p-2 rounded-lg transition-colors touch-manipulation focus:ring-2 focus:ring-[#09302f] focus:outline-none ${
            activeEditor?.isActive('underline') 
              ? 'bg-[#09302f] text-white dark:bg-[#4ade80] dark:text-gray-900' 
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-label="Underline text"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <UnderlineIcon className="w-4 h-4" aria-hidden="true" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        
        {/* Toggle Alignment */}
        <button
          onClick={toggleAlignment}
          className={`p-2 rounded-lg transition-colors touch-manipulation focus:outline-none ${
            activeEditor?.isActive({ textAlign: 'center' }) || activeEditor?.isActive({ textAlign: 'right' })
              ? 'border-2 border-[#09302f] dark:border-[#4ade80] text-[#09302f] dark:text-[#4ade80]' 
              : 'text-gray-600 dark:text-gray-300'
          }`}
          aria-label="Toggle text alignment"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          {activeEditor?.isActive({ textAlign: 'center' }) ? (
            <Bars3Icon className="w-4 h-4" aria-hidden="true" />
          ) : activeEditor?.isActive({ textAlign: 'right' }) ? (
            <Bars3CenterLeftIcon className="w-4 h-4 scale-x-[-1]" aria-hidden="true" />
          ) : (
            <Bars3CenterLeftIcon className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        
        {/* Numbered List */}
        <button
          onClick={() => executeCommand('insertOrderedList')}
          className={`p-2 rounded-lg transition-colors touch-manipulation focus:outline-none ${
            activeEditor?.isActive('orderedList') 
              ? 'border-2 border-[#09302f] dark:border-[#4ade80] text-[#09302f] dark:text-[#4ade80]' 
              : 'text-gray-600 dark:text-gray-300'
          }`}
          aria-label="Numbered list"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <NumberedListIcon className="w-4 h-4" aria-hidden="true" />
        </button>
        
        {/* Table */}
        <button
          onClick={() => setShowTableModal(true)}
          className="p-2 rounded-lg transition-colors touch-manipulation text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
          aria-label="Insert table"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <TableCellsIcon className="w-4 h-4" aria-hidden="true" />
        </button>
        
        {/* Strikethrough */}
        <button
          onClick={() => executeCommand('strikeThrough')}
          className={`p-2 rounded-lg transition-colors touch-manipulation focus:outline-none ${
            activeEditor?.isActive('strike') 
              ? 'border-2 border-[#09302f] dark:border-[#4ade80] text-[#09302f] dark:text-[#4ade80]' 
              : 'text-gray-600 dark:text-gray-300'
          }`}
          aria-label="Strikethrough text"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <span className="line-through font-bold text-sm" aria-hidden="true">S</span>
        </button>
        
        {/* Horizontal Rule */}
        <button
          onClick={() => executeCommand('insertHorizontalRule')}
          className="p-2 rounded-lg transition-colors touch-manipulation text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
          aria-label="Insert horizontal rule"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <span className="text-sm" aria-hidden="true">───</span>
        </button>
      </div>
      
      {/* Table Modal */}
      {showTableModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center z-[10000] p-4" onClick={() => setShowTableModal(false)}>
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
                  id="global-table-rows"
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
                  id="global-table-cols"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="global-table-header"
                  className="mr-2"
                />
                <label htmlFor="global-table-header" className="text-sm text-gray-700 dark:text-gray-300">Include header row</label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowTableModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const rows = parseInt(document.getElementById('global-table-rows').value) || 2;
                  const cols = parseInt(document.getElementById('global-table-cols').value) || 3;
                  const hasHeader = document.getElementById('global-table-header').checked;
                  
                  if (rows >= 1 && cols >= 1 && rows <= 10 && cols <= 10) {
                    insertTable(rows, cols, hasHeader);
                    setShowTableModal(false);
                  }
                }}
                className="px-6 py-2 bg-[#09302f] text-white rounded-lg hover:bg-[#072625] font-semibold transition-colors"
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

export default FloatingToolbar;