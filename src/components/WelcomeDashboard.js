import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  DocumentTextIcon, 
  ClockIcon, 
  ShareIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  HomeIcon,
  FolderIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useHapticFeedback } from '../hooks/useSwipeGestures';
import { getRecentPapers, getMockSharedPapers } from '../utils/recentPapers';
import usePaperStore from '../store/paperStore';
import RecentPage from './RecentPage';
import SharedPage from './SharedPage';
import SettingsPage from './SettingsPage';
import UserProfile from './UserProfile';
import GoogleSignup from './GoogleSignup';
import BottomNavigation from './common/BottomNavigation';
import SearchPage from './SearchPage';
import PaperCard from './common/PaperCard';
import Button from './common/Button';
import EmptyState from './common/EmptyState';


const WelcomeDashboard = ({ onCreateNew, onOpenPaper, onCreateLanguagePaper }) => {

  const [recentPapers, setRecentPapers] = useState([]);
  const [sharedPapers, setSharedPapers] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [showAllShared, setShowAllShared] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const { lightTap } = useHapticFeedback();

  useEffect(() => {
    // Load recent and shared papers
    const recent = getRecentPapers();
    const shared = getMockSharedPapers();
    
    setRecentPapers(recent);
    setSharedPapers(shared);
  }, []);
  
  const displayedRecent = showAllRecent ? recentPapers : recentPapers.slice(0, 6);
  const displayedShared = showAllShared ? sharedPapers : sharedPapers.slice(0, 4);
  
  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = () => setActiveMenu(null);
    if (activeMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeMenu]);
  
  // Handle mobile back button for sub-pages
  useEffect(() => {
    const handleBackButton = (e) => {
      if (currentPage !== 'home') {
        e.preventDefault();
        setCurrentPage('home');
      }
    };
    
    if (currentPage !== 'home') {
      window.addEventListener('popstate', handleBackButton);
      window.history.pushState(null, '', window.location.href);
      
      return () => {
        window.removeEventListener('popstate', handleBackButton);
      };
    }
  }, [currentPage]);

  const handleCreateNew = () => {
    lightTap();
    onCreateNew();
  };

  const handleOpenPaper = (paper) => {
    lightTap();
    onOpenPaper(paper);
  };

  const handlePaperAction = (action, paper) => {
    lightTap();
    setActiveMenu(null);
    
    switch(action) {
      case 'edit':
        onOpenPaper(paper);
        break;
      case 'delete':
        const recent = getRecentPapers();
        const updated = recent.filter(p => p.id !== paper.id);
        localStorage.setItem('qmaker-recent-papers', JSON.stringify(updated));
        setRecentPapers(updated);
        break;
      case 'print':
        // Load paper and print
        console.log('Print paper:', paper.title);
        break;
      case 'export':
        // Export as PDF
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
    }
  };

  const PaperCard = ({ paper, isShared = false }) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const colors = [
      { name: 'None', value: null, bg: 'bg-transparent', border: 'border-gray-300' },
      { name: 'Red', value: 'red', bg: 'bg-red-100', border: 'border-red-300' },
      { name: 'Blue', value: 'blue', bg: 'bg-blue-100', border: 'border-blue-300' },
      { name: 'Green', value: 'green', bg: 'bg-green-100', border: 'border-green-300' },
      { name: 'Yellow', value: 'yellow', bg: 'bg-yellow-100', border: 'border-yellow-300' },
      { name: 'Purple', value: 'purple', bg: 'bg-purple-100', border: 'border-purple-300' }
    ];
    
    const handleColorChange = (color) => {
      const recent = getRecentPapers();
      const updated = recent.map(p => 
        p.id === paper.id ? { ...p, colorTag: color } : p
      );
      localStorage.setItem('qmaker-recent-papers', JSON.stringify(updated));
      setRecentPapers(updated);
      setShowColorPicker(false);
      
      // Save to cloud if paper data exists
      if (paper.data) {
        const updatedPaperData = {
          ...paper.data,
          metadata: {
            ...paper.data.metadata,
            colorTag: color
          }
        };
        // Auto-save to cloud storage
        localStorage.setItem(`qmaker-paper-${paper.id}`, JSON.stringify(updatedPaperData));
      }
    };
    
    const getCardClasses = () => {
      const baseClasses = "bg-white dark:bg-gray-800 rounded-xl border p-4 hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 active:scale-98";
      if (paper.colorTag) {
        const colorConfig = colors.find(c => c.value === paper.colorTag);
        return `${baseClasses} ${colorConfig?.bg} dark:${colorConfig?.bg} ${colorConfig?.border} dark:${colorConfig?.border}`;
      }
      return `${baseClasses} border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600`;
    };
    
    return (
    <div className="relative">
      <div 
        className={getCardClasses()}
        onClick={() => handleOpenPaper(paper)}
      >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#09302f] to-[#072625] dark:from-[#4ade80] dark:to-[#22c55e] rounded-lg flex items-center justify-center shadow-sm">
            <DocumentTextIcon className="w-5 h-5 text-white dark:text-gray-900" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {paper.title || 'Untitled Paper'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {paper.subject} • {paper.className}
            </p>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === paper.id ? null : paper.id);
            }}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <EllipsisVerticalIcon className="w-4 h-4 text-gray-400" />
          </button>
          
          {activeMenu === paper.id && (
            <div className="absolute right-0 top-8 w-28 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-0.5 z-50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePaperAction('edit', paper);
                }}
                className="w-full px-1.5 py-1.5 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1.5"
              >
                <PencilIcon className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePaperAction('print', paper);
                }}
                className="w-full px-1.5 py-1.5 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1.5"
              >
                <PrinterIcon className="w-3.5 h-3.5" />
                Print
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePaperAction('export', paper);
                }}
                className="w-full px-1.5 py-1.5 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1.5"
              >
                <DocumentArrowDownIcon className="w-3.5 h-3.5" />
                Export
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePaperAction('share', paper);
                }}
                className="w-full px-1.5 py-1.5 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1.5"
              >
                <ShareIcon className="w-3.5 h-3.5" />
                Share
              </button>
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
              <hr className="my-0.5 border-gray-200 dark:border-gray-600" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePaperAction('delete', paper);
                }}
                className="w-full px-1.5 py-1.5 text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-1.5"
              >
                <TrashIcon className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          {isShared ? <ShareIcon className="w-3 h-3" /> : <ClockIcon className="w-3 h-3" />}
          <span>{paper.lastModified}</span>
        </div>
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
          {paper.language}
        </span>
      </div>
      
      </div>
      
      {showColorPicker && (
        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-2 z-50">
          <div className="grid grid-cols-3 gap-2">
            {colors.map((color) => (
              <button
                key={color.value || 'none'}
                onClick={(e) => {
                  e.stopPropagation();
                  handleColorChange(color.value);
                }}
                className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform ${
                  paper.colorTag === color.value ? 'ring-2 ring-gray-400' : ''
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

  const { darkMode } = usePaperStore();

  if (currentPage === 'recent') {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <RecentPage 
          onBack={() => setCurrentPage('home')}
          onOpenPaper={onOpenPaper}
          onNavigate={setCurrentPage}
        />
      </div>
    );
  }

  if (currentPage === 'shared') {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <SharedPage 
          onBack={() => setCurrentPage('home')}
          onOpenPaper={onOpenPaper}
          onNavigate={setCurrentPage}
        />
      </div>
    );
  }

  if (currentPage === 'search') {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <SearchPage 
          onBack={() => setCurrentPage('home')}
          onOpenPaper={onOpenPaper}
          onNavigate={setCurrentPage}
        />
      </div>
    );
  }

  if (currentPage === 'settings') {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <SettingsPage 
          onBack={() => setCurrentPage('home')}
          onShowProfile={() => setCurrentPage('profile')}
        />
      </div>
    );
  }

  if (currentPage === 'profile') {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <UserProfile 
          onBack={() => setCurrentPage('settings')}
          onShowGoogleSignup={() => setCurrentPage('google-signup')}
        />
      </div>
    );
  }

  if (currentPage === 'google-signup') {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <GoogleSignup 
          onBack={() => setCurrentPage('profile')}
          onSignupComplete={(profile) => {
            localStorage.setItem('qmaker-profile', JSON.stringify(profile));
            setCurrentPage('profile');
          }}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Qmaker</h1>
              <p className="text-gray-600 dark:text-gray-300">Question Paper Builder</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => setCurrentPage('search')}
              className="p-3"
              title="Search papers"
            >
              <MagnifyingGlassIcon className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20 space-y-8">
        {/* Create New Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Create New Paper</h3>
          <div className="flex gap-2">
            <Button
              onClick={handleCreateNew}
              variant="primary"
              size="sm"
              className="flex-1 flex items-center justify-center gap-1.5"
            >
              <PlusIcon className="w-4 h-4" strokeWidth={3} />
              New
            </Button>
            
            <Button
              onClick={() => {
                lightTap();
                onCreateLanguagePaper('english');
              }}
              variant="outline"
              size="sm"
              className="flex-1 bg-[#09302f]/10 dark:bg-[#4ade80]/20 text-[#09302f] dark:text-[#4ade80] border-[#09302f]/20 dark:border-[#4ade80]/30"
            >
              English
            </Button>
            
            <Button
              onClick={() => {
                lightTap();
                onCreateLanguagePaper('bangla');
              }}
              variant="outline"
              size="sm"
              className="flex-1 bg-[#09302f]/10 dark:bg-[#4ade80]/20 text-[#09302f] dark:text-[#4ade80] border-[#09302f]/20 dark:border-[#4ade80]/30"
            >
              বাংলা
            </Button>
            
            <Button
              onClick={() => {
                lightTap();
                onCreateLanguagePaper('arabic');
              }}
              variant="outline"
              size="sm"
              className="flex-1 bg-[#09302f]/10 dark:bg-[#4ade80]/20 text-[#09302f] dark:text-[#4ade80] border-[#09302f]/20 dark:border-[#4ade80]/30"
            >
              العربية
            </Button>
          </div>
        </div>

        {/* Recent Papers */}
        {recentPapers.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent</h2>
              {recentPapers.length > 6 && (
                <button 
                  onClick={() => {
                    lightTap();
                    setShowAllRecent(!showAllRecent);
                  }}
                  className="text-sm text-[#09302f] dark:text-[#4ade80] font-medium hover:underline"
                >
                  {showAllRecent ? 'Show less' : `See all (${recentPapers.length})`}
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedRecent.map((paper, index) => (
                <PaperCard 
                  key={index} 
                  paper={paper} 
                  onOpenPaper={handleOpenPaper}
                  onUpdatePapers={setRecentPapers}
                />
              ))}
            </div>
          </div>
        )}

        {/* Shared Papers */}
        {sharedPapers.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Shared with me</h2>
              {sharedPapers.length > 4 && (
                <button 
                  onClick={() => {
                    lightTap();
                    setShowAllShared(!showAllShared);
                  }}
                  className="text-sm text-[#09302f] dark:text-[#4ade80] font-medium hover:underline"
                >
                  {showAllShared ? 'Show less' : `See all (${sharedPapers.length})`}
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayedShared.map((paper, index) => (
                <PaperCard 
                  key={index} 
                  paper={paper} 
                  isShared 
                  onOpenPaper={handleOpenPaper}
                  showColorTag={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {recentPapers.length === 0 && sharedPapers.length === 0 && (
          <EmptyState
            icon={DocumentTextIcon}
            title="No papers yet"
            description="Create your first question paper to get started"
            action={
              <Button
                onClick={handleCreateNew}
                variant="primary"
                size="lg"
              >
                Create New Paper
              </Button>
            }
          />
        )}
      </div>
      
      <BottomNavigation 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
    </div>
  );
};

export default WelcomeDashboard;