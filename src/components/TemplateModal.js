import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import TemplateSelector from './TemplateSelector';

const TemplateModal = ({ isOpen, onClose, onSelect, language }) => {
  if (!isOpen) return null;

  const getModalText = (language) => {
    switch (language) {
      case 'arabic':
        return {
          title: 'اختر نموذج السؤال',
          subtitle: 'اختر نوع السؤال الذي تريد إضافته',
          close: 'إغلاق'
        };
      case 'bangla':
        return {
          title: 'প্রশ্নের টেমপ্লেট নির্বাচন করুন',
          subtitle: 'আপনি যে ধরনের প্রশ্ন যোগ করতে চান তা নির্বাচন করুন',
          close: 'বন্ধ করুন'
        };
      case 'urdu':
        return {
          title: 'سوال کا نمونہ منتخب کریں',
          subtitle: 'آپ جو قسم کا سوال شامل کرنا چاہتے ہیں اسے منتخب کریں',
          close: 'بند کریں'
        };
      default:
        return {
          title: 'Select Question Template',
          subtitle: 'Choose the type of question you want to add',
          close: 'Close'
        };
    }
  };

  const text = getModalText(language);
  const isRTL = ['arabic', 'urdu'].includes(language);

  const handleSelect = (template) => {
    onSelect(template);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 ${isRTL ? 'rtl' : 'ltr'}`}>
          <div>
            <h2 className={`text-lg font-semibold text-gray-900 dark:text-white ${isRTL ? 'font-arabic' : ''}`}>
              {text.title}
            </h2>
            <p className={`text-sm text-gray-600 dark:text-gray-400 mt-1 ${isRTL ? 'font-arabic' : ''}`}>
              {text.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <TemplateSelector onSelect={handleSelect} language={language} />
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;