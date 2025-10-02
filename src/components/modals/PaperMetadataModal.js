import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import usePaperStore from '../../store/paperStore';
import { useI18n } from '../../hooks/useI18n';

const PaperMetadataModal = ({ isOpen, onClose, onCreatePaper, initialData }) => {
  const { metadata, uiLanguage } = usePaperStore();
  const { t } = useI18n();
  const isRTL = uiLanguage === 'arabic' || uiLanguage === 'urdu';
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolAddress: '',
    examName: '',
    className: '',
    subject: '',
    bookName: '',
    fullMarks: '',
    handwriting: '',
    duration: '',
    instructions: '',
    language: 'bangla'
  });

  React.useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        schoolName: initialData.schoolName || '',
        schoolAddress: initialData.schoolAddress || '',
        examName: initialData.examName || '',
        className: initialData.className || '',
        subject: initialData.subject || '',
        bookName: initialData.book || initialData.bookName || '',
        fullMarks: initialData.fullMarks || '',
        handwriting: initialData.handwriting || '',
        duration: initialData.duration || '',
        instructions: initialData.instructions || '',
        language: initialData.language || 'bangla'
      });
    }
  }, [initialData, isOpen]);

  const languages = [
    { code: 'bangla', name: 'বাংলা' },
    { code: 'english', name: 'English' },
    { code: 'arabic', name: 'العربية' },
    { code: 'urdu', name: 'اردو' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreatePaper(formData);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10005] p-4">
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 ${isRTL ? 'text-right' : ''}`} dir="ltr">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('Paper Information')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('Fill in the details for your question paper')}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <label className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 ${isRTL ? 'text-right' : ''}`}>
              {t('Language')}
            </label>
            <div className="flex gap-2">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleChange('language', lang.code)}
                  className={`flex-1 px-3 py-2.5 text-sm font-medium rounded-lg border transition-colors text-center ${
                    formData.language === lang.code
                      ? 'bg-[#09302f] dark:bg-[#4ade80] text-white border-[#09302f] dark:border-[#4ade80]'
                      : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? 'text-right' : ''}`}>
              {t('School/Institution Name')}
            </label>
            <input
              type="text"
              value={formData.schoolName}
              onChange={(e) => handleChange('schoolName', e.target.value)}
              className={`w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-[#09302f] focus:ring-1 focus:ring-[#09302f] transition-colors ${isRTL ? 'text-right' : ''}`}
              placeholder="স্কুল/প্রতিষ্ঠানের নাম লিখুন"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${isRTL ? 'text-right' : ''}`}>
              {t('School Address (Optional)')}
            </label>
            <input
              type="text"
              value={formData.schoolAddress}
              onChange={(e) => handleChange('schoolAddress', e.target.value)}
              className={`w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${isRTL ? 'text-right' : ''}`}
              placeholder="স্কুলের ঠিকানা লিখুন"
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? 'text-right' : ''}`}>
              {t('Exam Name')}
            </label>
            <input
              type="text"
              value={formData.examName}
              onChange={(e) => handleChange('examName', e.target.value)}
              className={`w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-[#09302f] focus:ring-1 focus:ring-[#09302f] transition-colors ${isRTL ? 'text-right' : ''}`}
              placeholder="যেমন: বার্ষিক পরীক্ষা ২০২৪"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${isRTL ? 'text-right' : ''}`}>
                {t('Class')}
              </label>
              <input
                type="text"
                value={formData.className}
                onChange={(e) => handleChange('className', e.target.value)}
                className={`w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${isRTL ? 'text-right' : ''}`}
                placeholder="যেমন: অষ্টম শ্রেণি"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${isRTL ? 'text-right' : ''}`}>
                {t('Subject')}
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                className={`w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${isRTL ? 'text-right' : ''}`}
                placeholder="যেমন: গণিত"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${isRTL ? 'text-right' : ''}`}>
              {t('Book Name')}
            </label>
            <input
              type="text"
              value={formData.bookName}
              onChange={(e) => handleChange('bookName', e.target.value)}
              className={`w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${isRTL ? 'text-right' : ''}`}
              placeholder="বইয়ের নাম লিখুন"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${isRTL ? 'text-right' : ''}`}>
              {t('Additional Marks')}
            </label>
            <input
              type="text"
              value={formData.handwriting || ''}
              onChange={(e) => handleChange('handwriting', e.target.value)}
              className={`w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${isRTL ? 'text-right' : ''}`}
              placeholder="(সুন্দর হস্তাক্ষরের জন্য চার নম্বর নির্ধারিত)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${isRTL ? 'text-right' : ''}`}>
                {t('Full Marks')}
              </label>
              <input
                type="number"
                value={formData.fullMarks}
                onChange={(e) => handleChange('fullMarks', e.target.value)}
                className={`w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${isRTL ? 'text-right' : ''}`}
                placeholder="১০০"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${isRTL ? 'text-right' : ''}`}>
                {t('Duration')}
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                className={`w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${isRTL ? 'text-right' : ''}`}
                placeholder="৩ ঘন্টা"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${isRTL ? 'text-right' : ''}`}>
              {t('Exam Instructions')}
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => handleChange('instructions', e.target.value)}
              rows={3}
              className={`w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${isRTL ? 'text-right' : ''}`}
              placeholder="সবগুলো প্রশ্নের উত্তর দাও"
            />
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              {t('Cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#09302f] text-white rounded-lg hover:bg-[#072625] transition-colors font-medium"
            >
              {t('Create Paper')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaperMetadataModal;