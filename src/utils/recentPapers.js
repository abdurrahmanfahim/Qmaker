// Recent papers management
export const saveRecentPaper = (paperData) => {
  const recent = getRecentPapers();
  const paperInfo = {
    id: Date.now().toString(),
    title: paperData.metadata?.examName || 'Untitled Paper',
    subject: paperData.metadata?.subject || 'Unknown Subject',
    className: paperData.metadata?.className || 'Unknown Class',
    language: paperData.metadata?.language || 'english',
    lastModified: new Date().toISOString().split('T')[0],
    data: paperData
  };

  // Remove if already exists
  const filtered = recent.filter(p => p.title !== paperInfo.title);
  
  // Add to beginning
  const updated = [paperInfo, ...filtered].slice(0, 10);
  
  localStorage.setItem('qmaker-recent-papers', JSON.stringify(updated));
  return updated;
};

export const getRecentPapers = () => {
  try {
    return JSON.parse(localStorage.getItem('qmaker-recent-papers') || '[]');
  } catch {
    return [];
  }
};

export const removeRecentPaper = (paperId) => {
  const recent = getRecentPapers();
  const updated = recent.filter(p => p.id !== paperId);
  localStorage.setItem('qmaker-recent-papers', JSON.stringify(updated));
  return updated;
};

export const clearRecentPapers = () => {
  localStorage.removeItem('qmaker-recent-papers');
  return [];
};

// Mock shared papers for demo
export const getMockSharedPapers = () => [
  {
    id: 'shared-1',
    title: 'Mathematics Final Exam',
    subject: 'Mathematics',
    className: 'Class 10',
    language: 'english',
    lastModified: '2 days ago',
    sharedBy: 'John Teacher'
  },
  {
    id: 'shared-2', 
    title: 'বাংলা মধ্যবর্ষীয় পরীক্ষা',
    subject: 'বাংলা',
    className: 'অষ্টম শ্রেণী',
    language: 'bangla',
    lastModified: '1 week ago',
    sharedBy: 'রহিম স্যার'
  }
];