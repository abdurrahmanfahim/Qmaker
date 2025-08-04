import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftIcon,
  DocumentTextIcon, 
  ShareIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  UserIcon,
  HomeIcon,
  FolderIcon,
  PlusIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useHapticFeedback } from '../../hooks/useSwipeGestures';
import BottomNavigation from '../common/BottomNavigation';
import SearchBar from '../common/SearchBar';
import PaperCard from '../common/PaperCard';
import EmptyState from '../common/EmptyState';
import PageHeader from '../common/PageHeader';

const SharedPage = ({ onBack, onOpenPaper, onNavigate }) => {
  const [sharedPapers, setSharedPapers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
  const { lightTap } = useHapticFeedback();

  useEffect(() => {
    // Mock shared papers with Arabic, Bangla, English examples
    const mockShared = [
      {
        id: 'shared-1',
        title: 'Mathematics Final Exam 2024',
        subject: 'Mathematics',
        className: 'Class 10',
        language: 'english',
        lastModified: '2 days ago',
        sharedBy: 'John Teacher',
        data: { metadata: { language: 'english' }, sections: [] }
      },
      {
        id: 'shared-2',
        title: 'বাংলা মধ্যবর্ষীয় পরীক্ষা ২০২৪',
        subject: 'বাংলা',
        className: 'অষ্টম শ্রেণী',
        language: 'bangla',
        lastModified: '1 week ago',
        sharedBy: 'রহিম স্যার',
        data: { metadata: { language: 'bangla' }, sections: [] }
      },
      {
        id: 'shared-3',
        title: 'امتحان اللغة العربية النهائي',
        subject: 'اللغة العربية',
        className: 'الصف التاسع',
        language: 'arabic',
        lastModified: '3 days ago',
        sharedBy: 'أحمد المعلم',
        data: { metadata: { language: 'arabic' }, sections: [] }
      },
      {
        id: 'shared-4',
        title: 'Science Quiz - Biology',
        subject: 'Biology',
        className: 'Grade 9',
        language: 'english',
        lastModified: '5 days ago',
        sharedBy: 'Sarah Wilson',
        data: { metadata: { language: 'english' }, sections: [] }
      },
      {
        id: 'shared-5',
        title: 'পদার্থবিজ্ঞান প্রাথমিক পরীক্ষা',
        subject: 'পদার্থবিজ্ঞান',
        className: 'নবম শ্রেণী',
        language: 'bangla',
        lastModified: '1 week ago',
        sharedBy: 'করিম স্যার',
        data: { metadata: { language: 'bangla' }, sections: [] }
      },
      {
        id: 'shared-6',
        title: 'اختبار الرياضيات الشهري',
        subject: 'الرياضيات',
        className: 'الصف العاشر',
        language: 'arabic',
        lastModified: '4 days ago',
        sharedBy: 'فاطمة المعلمة',
        data: { metadata: { language: 'arabic' }, sections: [] }
      }
    ];
    setSharedPapers(mockShared);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    if (activeMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeMenu]);
  
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

  const handlePaperAction = (action, paper) => {
    lightTap();
    setActiveMenu(null);
    
    switch(action) {
      case 'open':
        onOpenPaper(paper);
        break;
      case 'export':
        console.log('Export paper:', paper.title);
        break;
    }
  };

  const filteredPapers = sharedPapers.filter(paper => 
    paper.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.sharedBy?.toLowerCase().includes(searchQuery.toLowerCase())
  );



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader
        title="Shared Papers"
        subtitle={`${filteredPapers.length} papers shared with you`}
        onBack={() => {
          lightTap();
          onBack();
        }}
        rightContent={
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shared papers..."
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
                isShared 
                onOpenPaper={onOpenPaper}
                showColorTag={false}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ShareIcon}
            title={searchQuery ? 'No papers found' : 'No shared papers'}
            description={searchQuery ? 'Try a different search term' : 'Papers shared with you will appear here'}
          />
        )}
      </div>
      
      <BottomNavigation 
        currentPage="shared"
        onNavigate={onNavigate}
        onHome={onBack}
      />
    </div>
  );
};

export default SharedPage;