import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import usePaperStore from '../store/paperStore';

const MetadataPanel = () => {
  const { metadata, setMetadata, setLanguage } = usePaperStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [userInteracting, setUserInteracting] = useState(false);
  
  // Check if essential fields are filled
  const isComplete = metadata.className && metadata.subject && metadata.examName;
  const completionPercentage = Math.round([
    metadata.language, metadata.schoolName, metadata.examName, 
    metadata.className, metadata.subject, metadata.book, 
    metadata.fullMarks, metadata.duration
  ].filter(Boolean).length / 8 * 100);

  const [isMobile, setIsMobile] = useState(false);

  const getLabels = (lang) => {
    const labels = {
      english: {
        schoolName: 'School/Institution',
        examName: 'Exam Name & Year',
        className: 'Class',
        subject: 'Subject',
        book: 'Book',
        fullMarks: 'Full Marks',
        duration: 'Duration',
        instructions: 'Instructions',
        language: 'Language'
      },
      bangla: {
        schoolName: 'মাদরাসার নাম',
        examName: 'পরীক্ষার নাম ও সাল',
        className: 'জামাত',
        subject: 'বিষয়',
        book: 'কিতাব',
        fullMarks: 'পূর্ণমান',
        duration: 'সময়',
        instructions: 'নির্দেশনা',
        language: 'ভাষা'
      },
      arabic: {
        schoolName: 'اسم المدرسة',
        examName: 'اسم الامتحان والسنة',
        className: 'الصف',
        subject: 'المادة',
        book: 'الكتاب',
        fullMarks: 'الدرجة الكاملة',
        duration: 'المدة',
        instructions: 'التعليمات',
        language: 'اللغة'
      },
      urdu: {
        schoolName: 'مدرسے کا نام',
        examName: 'امتحان کا نام اور سال',
        className: 'جماعت',
        subject: 'مضمون',
        book: 'کتاب',
        fullMarks: 'مکمل نمبر',
        duration: 'وقت',
        instructions: 'ہدایات',
        language: 'زبان'
      }
    };
    return labels[lang] || labels.english;
  };

  const getPlaceholders = (lang) => {
    const placeholders = {
      english: {
        schoolName: 'Institution name',
        examName: 'First Term Exam | 2024',
        className: 'Class 10',
        subject: 'Mathematics',
        book: 'Textbook Name',
        fullMarks: '100',
        duration: '3 hours',
        instructions: 'Answer all questions.'
      },
      bangla: {
        schoolName: 'ফিকরুল উম্মাহ দারুল আবরার আল কাবীর মাদরাসা',
        examName: 'প্রথম সাময়িক পরীক্ষা | ১৪৪৬-৪৭ হি:',
        className: 'দশম',
        subject: 'আরবি',
        book: 'নাহু মীর',
        fullMarks: '১০০',
        duration: '৩ ঘণ্টা',
        instructions: 'সবগুলো প্রশ্নের উত্তর দাও।'
      },
      arabic: {
        schoolName: 'مدرسة فكر الأمة دار الأبرار الكبير',
        examName: 'الامتحان الأول | ١٤٤٦-٤٧ هـ',
        className: 'العاشر',
        subject: 'العربية',
        book: 'النحو الميسر',
        fullMarks: '١٠٠',
        duration: '٣ ساعات',
        instructions: 'أجب عن جميع الأسئلة.'
      },
      urdu: {
        schoolName: 'فکر الامہ دارالابرار الکبیر مدرسہ',
        examName: 'پہلا سہ ماہی امتحان | ١٤٤٦-٤٧ ھ',
        className: 'دسویں',
        subject: 'عربی',
        book: 'نحو میر',
        fullMarks: '١٠٠',
        duration: '٣ گھنٹے',
        instructions: 'تمام سوالات کے جواب دیں۔'
      }
    };
    return placeholders[lang] || placeholders.english;
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-collapse when essential fields are completed (mobile only) - but not while user is interacting
  useEffect(() => {
    if (isMobile && isComplete && isExpanded && !userInteracting) {
      const timer = setTimeout(() => setIsExpanded(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isComplete, isMobile, isExpanded, userInteracting]);

  // Reset interaction state after user stops interacting
  useEffect(() => {
    if (userInteracting) {
      const timer = setTimeout(() => setUserInteracting(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [userInteracting]);



  const handleChange = (field, value) => {
    setMetadata({ ...metadata, [field]: value });
  };

  return (
    <>
      {/* Mobile Collapsible Header */}
      {isMobile && (
        <div className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 ${isComplete ? 'bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20' : ''}`}>
          <div className="px-4 py-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between w-full text-left p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 active:scale-[0.98] group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative">
                  <DocumentTextIcon className={`w-5 h-5 transition-colors ${isComplete ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`} />
                  {isComplete && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                      Paper Information
                    </h2>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                      isComplete 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                    }`}>
                      {completionPercentage}%
                    </div>
                  </div>
                  {!isExpanded && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {metadata.examName || 'Tap to add exam details'} • {metadata.className || 'Class'} • {metadata.subject || 'Subject'}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors hidden sm:inline">
                  {isExpanded ? 'Hide' : 'Show'}
                </span>
                <ChevronDownIcon className={`w-5 h-5 text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
              </div>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
              <div className="px-3 pb-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {getLabels(metadata.language).language}
                </label>
                <select
                  value={metadata.language}
                  onChange={(e) => setLanguage(e.target.value)}
                  onFocus={() => setUserInteracting(true)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                >
                  <option value="english">English</option>
                  <option value="bangla">বাংলা</option>
                  <option value="arabic">العربية</option>
                  <option value="urdu">اردو</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {getLabels(metadata.language).schoolName}
                </label>
                <input
                  type="text"
                  value={metadata.schoolName}
                  onChange={(e) => handleChange('schoolName', e.target.value)}
                  onFocus={() => setUserInteracting(true)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  placeholder={getPlaceholders(metadata.language).schoolName}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {getLabels(metadata.language).examName}
                </label>
                <input
                  type="text"
                  value={metadata.examName}
                  onChange={(e) => handleChange('examName', e.target.value)}
                  onFocus={() => setUserInteracting(true)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  placeholder={getPlaceholders(metadata.language).examName}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {getLabels(metadata.language).book}
                </label>
                <input
                  type="text"
                  value={metadata.book}
                  onChange={(e) => handleChange('book', e.target.value)}
                  onFocus={() => setUserInteracting(true)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  placeholder={getPlaceholders(metadata.language).book}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {getLabels(metadata.language).className}
                  </label>
                  <input
                    type="text"
                    value={metadata.className}
                    onChange={(e) => handleChange('className', e.target.value)}
                    onFocus={() => setUserInteracting(true)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    placeholder={getPlaceholders(metadata.language).className}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {getLabels(metadata.language).subject}
                  </label>
                  <input
                    type="text"
                    value={metadata.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    onFocus={() => setUserInteracting(true)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    placeholder={getPlaceholders(metadata.language).subject}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {getLabels(metadata.language).fullMarks}
                  </label>
                  <input
                    type="text"
                    value={metadata.fullMarks}
                    onChange={(e) => handleChange('fullMarks', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    placeholder={getPlaceholders(metadata.language).fullMarks}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {getLabels(metadata.language).duration}
                  </label>
                  <input
                    type="text"
                    value={metadata.duration}
                    onChange={(e) => handleChange('duration', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    placeholder={getPlaceholders(metadata.language).duration}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {getLabels(metadata.language).instructions}
                </label>
                <textarea
                  value={metadata.instructions}
                  onChange={(e) => handleChange('instructions', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
                  placeholder={getPlaceholders(metadata.language).instructions}
                />
              </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop View */}
      {!isMobile && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-4 py-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between w-full text-left p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 group"
            >
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                  Paper Information
                </h2>
                <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {isExpanded ? 'Click to collapse' : 'Click to expand'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors hidden sm:inline">
                  {isExpanded ? 'Hide' : 'Show'}
                </span>
                <ChevronDownIcon className={`w-5 h-5 text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
              </div>
            </button>
            
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {getLabels(metadata.language).language}
                    </label>
                    <select
                      value={metadata.language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    >
                      <option value="english">English</option>
                      <option value="bangla">বাংলা</option>
                      <option value="arabic">العربية</option>
                      <option value="urdu">اردو</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {getLabels(metadata.language).schoolName}
                    </label>
                    <input
                      type="text"
                      value={metadata.schoolName}
                      onChange={(e) => handleChange('schoolName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      placeholder={getPlaceholders(metadata.language).schoolName}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {getLabels(metadata.language).examName}
                    </label>
                    <input
                      type="text"
                      value={metadata.examName}
                      onChange={(e) => handleChange('examName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      placeholder={getPlaceholders(metadata.language).examName}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {getLabels(metadata.language).book}
                    </label>
                    <input
                      type="text"
                      value={metadata.book}
                      onChange={(e) => handleChange('book', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      placeholder={getPlaceholders(metadata.language).book}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {getLabels(metadata.language).className}
                    </label>
                    <input
                      type="text"
                      value={metadata.className}
                      onChange={(e) => handleChange('className', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      placeholder={getPlaceholders(metadata.language).className}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {getLabels(metadata.language).subject}
                    </label>
                    <input
                      type="text"
                      value={metadata.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      placeholder={getPlaceholders(metadata.language).subject}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {getLabels(metadata.language).fullMarks}
                    </label>
                    <input
                      type="text"
                      value={metadata.fullMarks}
                      onChange={(e) => handleChange('fullMarks', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      placeholder={getPlaceholders(metadata.language).fullMarks}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {getLabels(metadata.language).duration}
                    </label>
                    <input
                      type="text"
                      value={metadata.duration}
                      onChange={(e) => handleChange('duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      placeholder={getPlaceholders(metadata.language).duration}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {getLabels(metadata.language).instructions}
                  </label>
                  <textarea
                    value={metadata.instructions}
                    onChange={(e) => handleChange('instructions', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
                    placeholder={getPlaceholders(metadata.language).instructions}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


    </>
  );
};

export default MetadataPanel;