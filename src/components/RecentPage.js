import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftIcon,
  DocumentTextIcon, 
  ClockIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  ShareIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  FolderIcon,
  PlusIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useHapticFeedback } from '../hooks/useSwipeGestures';
import { getRecentPapers } from '../utils/recentPapers';
import BottomNavigation from './common/BottomNavigation';
import SearchBar from './common/SearchBar';
import PaperCard from './common/PaperCard';

const RecentPage = ({ onBack, onOpenPaper, onNavigate }) => {
  const [recentPapers, setRecentPapers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
  const { lightTap } = useHapticFeedback();

  useEffect(() => {
    setRecentPapers(getRecentPapers());
  }, []);
  
  // Handle mobile back button
  useEffect(() => {
    const handleBackButton = (e) => {
      e.preventDefault();
      onBack();
    };
    
    window.addEventListener('popstate', handleBackButton);
    window.history.pushState(null, '', window.location.href);
    
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [onBack]);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    if (activeMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeMenu]);

  const handlePaperAction = (action, paper) => {
    lightTap();
    setActiveMenu(null);
    
    switch(action) {
      case 'edit':
        onOpenPaper(paper);
        break;
      case 'delete':
        const updated = recentPapers.filter(p => p.id !== paper.id);
        localStorage.setItem('qmaker-recent-papers', JSON.stringify(updated));
        setRecentPapers(updated);
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
    }
  };

  const filteredPapers = recentPapers.filter(paper => 
    paper.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => {
                lightTap();
                onBack();
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Recent Papers</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">{filteredPapers.length} papers</p>
            </div>
          </div>

          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recent papers..."
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
        {filteredPapers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPapers.map((paper, index) => (
              <PaperCard 
                key={index} 
                paper={paper} 
                onOpenPaper={onOpenPaper}
                onUpdatePapers={setRecentPapers}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <DocumentTextIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No papers found' : 'No recent papers'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Try a different search term' : 'Your recent papers will appear here'}
            </p>
          </div>
        )}
      </div>
      
      <BottomNavigation 
        currentPage="recent"
        onNavigate={onNavigate}
        onHome={onBack}
      />
    </div>
  );
};

export default RecentPage;