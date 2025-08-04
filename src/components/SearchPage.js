import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useHapticFeedback } from '../hooks/useSwipeGestures';
import { getRecentPapers } from '../utils/recentPapers';

import BottomNavigation from './common/BottomNavigation';
import SearchBar from './common/SearchBar';
import PaperCard from './common/PaperCard';
import Button from './common/Button';
import EmptyState from './common/EmptyState';

const SearchPage = ({ onBack, onOpenPaper, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const { lightTap } = useHapticFeedback();

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
    if (searchQuery.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        // Search in recent papers and mock shared papers
        const recentPapers = getRecentPapers();
        const mockShared = [
          { id: 'shared-1', title: 'Mathematics Final Exam 2024', subject: 'Mathematics', className: 'Class 10', examName: 'Final Exam', type: 'shared', sharedBy: 'John Teacher' },
          { id: 'shared-2', title: 'বাংলা মধ্যবর্ষীয় পরীক্ষা ২০২৪', subject: 'বাংলা', className: 'অষ্টম শ্রেণি', examName: 'মধ্যবর্ষীয় পরীক্ষা', type: 'shared', sharedBy: 'রহিম স্যার' },
          { id: 'shared-3', title: 'امتحان اللغة العربية النهائي', subject: 'اللغة العربية', className: 'الصف التاسع', examName: 'امتحان نهائي', type: 'shared', sharedBy: 'أحمد المعلم' }
        ];
        
        const allPapers = [
          ...recentPapers.map(p => ({ ...p, type: 'recent' })),
          ...mockShared
        ];
        
        let results = allPapers;
        
        // Filter by search query
        if (searchQuery.trim()) {
          results = results.filter(paper => 
            paper.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            paper.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            paper.className?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            paper.examName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            paper.sharedBy?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        setSearchResults(results);
        setIsSearching(false);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                lightTap();
                onBack();
              }}
              className="p-2"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Search Papers</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">Find your papers quickly</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, subject, class, exam name, or teacher..."
                autoFocus
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
                  title="Clear search"
                >
                  <XMarkIcon className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
        {isSearching ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-[#09302f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Searching...</p>
          </div>
        ) : searchQuery.trim() ? (
          searchResults.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
              {searchResults.map((paper, index) => (
                <PaperCard 
                  key={`${paper.type}-${paper.id || index}`} 
                  paper={paper} 
                  isShared={paper.type === 'shared'}
                  onOpenPaper={onOpenPaper}
                  showColorTag={paper.type === 'recent'}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={MagnifyingGlassIcon}
              title="No results found"
              description="Try searching with different keywords"
            />
          )
        ) : (
          <EmptyState
            icon={MagnifyingGlassIcon}
            title="Search Your Papers"
            description="Enter keywords to find recent and shared papers"
          />
        )}
      </div>

      <BottomNavigation 
        currentPage="search"
        onNavigate={onNavigate}
        onHome={onBack}
      />
    </div>
  );
};

export default SearchPage;