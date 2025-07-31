import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon, DocumentTextIcon, XMarkIcon } from '@heroicons/react/24/outline';
import usePaperStore from '../store/paperStore';

const MetadataPanel = () => {
  const { metadata, setMetadata, setLanguage } = usePaperStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showModal, setShowModal] = useState(false);
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

  useEffect(() => {
    if (isMobile && !metadata.className && !metadata.subject) {
      setShowModal(true);
    }
  }, [isMobile, metadata]);

  const handleChange = (field, value) => {
    setMetadata({ ...metadata, [field]: value });
  };

  return (
    <>
      {/* Mobile Modal */}
      {isMobile && showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Paper Information
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
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
              <button
                onClick={() => setShowModal(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop View */}
      {!isMobile && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between w-full text-left p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Paper Information
              </h2>
              {isExpanded ? (
                <ChevronUpIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {isExpanded && (
              <div className="mt-4 grid grid-cols-2 gap-4">
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
                
                <div className="col-span-2">
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
            )}
          </div>
        </div>
      )}

      {/* Mobile Edit Button */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={() => setShowModal(true)}
            className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            title="Edit Paper Information"
          >
            <DocumentTextIcon className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  );
};

export default MetadataPanel;