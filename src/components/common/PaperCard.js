import React, { useState } from 'react';
import { 
  DocumentTextIcon, 
  ClockIcon, 
  ShareIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  PrinterIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { getRecentPapers } from '../../utils/recentPapers';
import { DEFAULT_TITLES, PAPER_COLORS, STORAGE_KEYS } from '../../constants';

/**
 * Reusable Paper Card component with actions menu and color tagging
 * @param {Object} paper - Paper data object
 * @param {boolean} isShared - Whether paper is shared (affects icon display)
 * @param {Function} onOpenPaper - Handler for opening paper
 * @param {Function} onUpdatePapers - Handler for updating papers list
 * @param {boolean} showMenu - Show/hide actions menu
 * @param {boolean} showColorTag - Show/hide color tagging feature
 * @param {string} className - Additional CSS classes
 */
const PaperCard = ({ 
  paper, 
  isShared = false, 
  onOpenPaper, 
  onUpdatePapers,
  showMenu = true,
  showColorTag = true,
  className = ""
}) => {
  /**
   * Get default paper title based on language
   * @param {string} language - Paper language
   * @returns {string} Localized default title
   */
  const getDefaultTitle = (language) => {
    return DEFAULT_TITLES[language] || DEFAULT_TITLES.english;
  };
  // Component state for menu and color picker visibility
  const [activeMenu, setActiveMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Available color options for paper tagging
  const colors = PAPER_COLORS;

  /**
   * Handle color tag change for paper
   * Updates both local storage and cloud storage
   * @param {string|null} color - Selected color value
   */
  const handleColorChange = (color) => {
    // Update recent papers list with new color
    const recent = getRecentPapers();
    const updated = recent.map(p => 
      p.id === paper.id ? { ...p, colorTag: color } : p
    );
    const jsonStr1 = JSON.stringify(updated);
    const encoded1 = btoa(unescape(encodeURIComponent(jsonStr1)));
    localStorage.setItem(STORAGE_KEYS.RECENT_PAPERS, encoded1);
    
    // Save to cloud storage if paper data exists
    if (paper.data) {
      const updatedPaperData = {
        ...paper.data,
        metadata: {
          ...paper.data.metadata,
          colorTag: color
        }
      };
      const jsonStr2 = JSON.stringify(updatedPaperData);
      const encoded2 = btoa(unescape(encodeURIComponent(jsonStr2)));
      localStorage.setItem(`${STORAGE_KEYS.PAPER_PREFIX}${paper.id}`, encoded2);
    }
    
    // Update parent component and close menus
    if (onUpdatePapers) onUpdatePapers(updated);
    setShowColorPicker(false);
    setActiveMenu(false);
  };

  const handlePaperAction = (action) => {
    setActiveMenu(false);
    
    switch(action) {
      case 'edit':
        if (onOpenPaper) onOpenPaper(paper);
        break;
      case 'delete':
        const recent = getRecentPapers();
        const updated = recent.filter(p => p.id !== paper.id);
        const jsonStr = JSON.stringify(updated);
        const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
        localStorage.setItem(STORAGE_KEYS.RECENT_PAPERS, encoded);
        if (onUpdatePapers) onUpdatePapers(updated);
        break;
      case 'print':
        console.log('Print paper:', paper.title);
        break;
      case 'export':
        console.log('Export paper:', paper.title);
        break;
      case 'share':
        if (navigator.share) {
          navigator.share({
            title: paper.title,
            text: `Check out this question paper: ${paper.title}`,
            url: window.location.href
          });
        }
        break;
      default:
        break;
    }
  };

  /**
   * Generate CSS classes for card based on color tag
   * @returns {string} Combined CSS classes
   */
  const getCardClasses = () => {
    const baseClasses = "bg-white dark:bg-gray-800 rounded-xl border p-4 hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 active:scale-98 cursor-pointer";
    
    // Apply color tag styling if enabled and color is set
    if (showColorTag && paper.colorTag) {
      const colorConfig = colors.find(c => c.value === paper.colorTag);
      return `${baseClasses} ${colorConfig?.bg} dark:${colorConfig?.bg} ${colorConfig?.border} dark:${colorConfig?.border}`;
    }
    
    // Default styling without color tag
    return `${baseClasses} border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600`;
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        className={getCardClasses()}
        onClick={() => onOpenPaper && onOpenPaper(paper)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#09302f] to-[#072625] dark:from-[#4ade80] dark:to-[#22c55e] rounded-lg flex items-center justify-center shadow-sm">
              <DocumentTextIcon className="w-5 h-5 text-white dark:text-gray-900" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {paper.title || getDefaultTitle(paper.language || paper.data?.metadata?.language || 'english')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {paper.subject} • {paper.className}
              </p>
            </div>
          </div>
          
          {showMenu && (
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenu(!activeMenu);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                aria-label="Paper options menu"
              >
                <EllipsisVerticalIcon className="w-4 h-4 text-gray-400" />
              </button>
              
              {activeMenu && (
                <div className="absolute right-0 top-8 w-28 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-0.5 z-50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePaperAction('edit');
                    }}
                    className="w-full px-1.5 py-1.5 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1.5"
                  >
                    <PencilIcon className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePaperAction('print');
                    }}
                    className="w-full px-1.5 py-1.5 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1.5"
                  >
                    <PrinterIcon className="w-3.5 h-3.5" />
                    Print
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePaperAction('export');
                    }}
                    className="w-full px-1.5 py-1.5 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1.5"
                  >
                    <DocumentArrowDownIcon className="w-3.5 h-3.5" />
                    Export
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePaperAction('share');
                    }}
                    className="w-full px-1.5 py-1.5 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1.5"
                  >
                    <ShareIcon className="w-3.5 h-3.5" />
                    Share
                  </button>
                  
                  {showColorTag && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowColorPicker(!showColorPicker);
                      }}
                      className="w-full px-1.5 py-1.5 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1.5"
                    >
                      <div className={`w-3.5 h-3.5 rounded-full border border-gray-400 ${
                        paper.colorTag ? colors.find(c => c.value === paper.colorTag)?.bg : 'bg-gray-200'
                      }`}></div>
                      Color
                    </button>
                  )}
                  
                  <hr className="my-0.5 border-gray-200 dark:border-gray-600" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePaperAction('delete');
                    }}
                    className="w-full px-1.5 py-1.5 text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-1.5"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            {isShared ? <ShareIcon className="w-3 h-3" /> : <ClockIcon className="w-3 h-3" />}
            <span>{paper.lastModified}</span>
          </div>
          <span className="px-2 py-1 bg-gray-600 dark:bg-gray-300 text-white dark:text-gray-900 rounded-full">
            {paper.language}
          </span>
        </div>
      </div>
      
      {showColorPicker && showColorTag && (
        <div className="absolute right-0 top-8 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-2 z-50">
          <div className="grid grid-cols-3 gap-1">
            {colors.map((color) => (
              <button
                key={color.value || 'none'}
                onClick={(e) => {
                  e.stopPropagation();
                  handleColorChange(color.value);
                }}
                className={`w-6 h-6 rounded-full border hover:scale-110 transition-transform ${
                  paper.colorTag === color.value ? 'ring-2 ring-blue-400' : ''
                } ${color.bg} ${color.border}`}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaperCard;