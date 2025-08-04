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
import Button from './common/Button';
import EmptyState from './common/EmptyState';
import PageHeader from './common/PageHeader';

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
      <PageHeader
        title="Recent Papers"
        subtitle={`${filteredPapers.length} papers`}
        onBack={() => {
          lightTap();
          onBack();
        }}
        rightContent={
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recent papers..."
          />
        }
      />

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
          <EmptyState
            icon={DocumentTextIcon}
            title={searchQuery ? 'No papers found' : 'No recent papers'}
            description={searchQuery ? 'Try a different search term' : 'Your recent papers will appear here'}
          />
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