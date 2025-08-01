/**
 * @fileoverview Paper metadata panel with responsive design and form validation
 * Handles exam information input, language-specific placeholders, and auto-collapse behavior
 * @author Qmaker Team
 * @version 1.0.0
 * @since 2024
 */

import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import usePaperStore from '../store/paperStore';

/**
 * Paper metadata panel component with collapsible interface
 * Handles exam information, validation, and responsive behavior
 * @returns {JSX.Element} Rendered metadata panel
 */
const MetadataPanel = () => {
  const { metadata, setMetadata } = usePaperStore();
  
  // Panel expansion state with localStorage persistence
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('qmaker-metadata-expanded');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [userInteracting, setUserInteracting] = useState(false); // Track user interaction for auto-collapse
  const [countdown, setCountdown] = useState(0); // Auto-collapse countdown timer
  
  // Form validation state
  const [errors, setErrors] = useState({}); // Field-specific error messages
  
  /**
   * Validate individual form fields with specific rules
   * @param {string} field - Field name to validate
   * @param {string} value - Field value to validate
   * @returns {boolean} Whether validation passed
   */
  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'examName':
        if (!value || value.trim().length < 3) {
          newErrors.examName = 'Exam name must be at least 3 characters';
        } else {
          delete newErrors.examName;
        }
        break;
      case 'className':
        if (!value || value.trim().length < 1) {
          newErrors.className = 'Class is required';
        } else {
          delete newErrors.className;
        }
        break;
      case 'subject':
        if (!value || value.trim().length < 2) {
          newErrors.subject = 'Subject must be at least 2 characters';
        } else {
          delete newErrors.subject;
        }
        break;
      case 'fullMarks':
        if (value && (isNaN(value) || parseInt(value) <= 0)) {
          newErrors.fullMarks = 'Full marks must be a positive number';
        } else {
          delete newErrors.fullMarks;
        }
        break;
      case 'duration':
        if (value && value.trim().length > 0 && value.trim().length < 2) {
          newErrors.duration = 'Duration must be at least 2 characters';
        } else {
          delete newErrors.duration;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Calculate form completion status
  const isComplete = metadata.className && metadata.subject && metadata.examName && Object.keys(errors).length === 0;
  const completionPercentage = Math.round([
    metadata.language, metadata.schoolName, metadata.examName, 
    metadata.className, metadata.subject, metadata.book, 
    metadata.fullMarks, metadata.duration
  ].filter(Boolean).length / 8 * 100); // Percentage of filled fields

  const [isMobile, setIsMobile] = useState(false);

  /**
   * Get localized field labels based on current language
   * @param {string} lang - Language code
   * @returns {Object} Object containing localized labels
   */
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
        numberingStyle: 'Question Numbering'
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
        numberingStyle: 'প্রশ্ন নম্বরিং'
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
        numberingStyle: 'ترقيم الأسئلة'
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
        numberingStyle: 'سوال نمبرنگ'
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

  // Auto-collapse panel when form is complete (mobile only)
  useEffect(() => {
    if (isMobile && isComplete && isExpanded && !userInteracting) {
      setCountdown(8); // Start 8-second countdown
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setIsExpanded(false); // Auto-collapse when countdown reaches 0
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => {
        clearInterval(countdownInterval);
        setCountdown(0);
      };
    } else {
      setCountdown(0);
    }
  }, [isComplete, isMobile, isExpanded, userInteracting]);

  // Reset interaction state after user stops interacting
  useEffect(() => {
    if (userInteracting) {
      const timer = setTimeout(() => setUserInteracting(false), 8000); // 8-second interaction window
      return () => clearTimeout(timer);
    }
  }, [userInteracting]);



  /**
   * Handle form field changes with validation
   * @param {string} field - Field name
   * @param {string} value - New field value
   */
  const handleChange = (field, value) => {
    setMetadata({ ...metadata, [field]: value });
    validateField(field, value);
  };
  
  /**
   * Get error message for specific field
   * @param {string} field - Field name
   * @returns {string|undefined} Error message if exists
   */
  const getFieldError = (field) => {
    return errors[field];
  };
  
  /**
   * Get CSS classes for form fields with error styling
   * @param {string} field - Field name
   * @param {string} baseClassName - Base CSS classes
   * @returns {string} Complete CSS class string
   */
  const getFieldClassName = (field, baseClassName) => {
    const hasError = errors[field];
    return `${baseClassName} ${
      hasError 
        ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
    }`;
  };

  return (
    <>
      {/* Mobile Collapsible Header */}
      {isMobile && (
        <div className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 ${isComplete ? 'bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20' : ''}`}>
          <div className="px-4 py-3">
            <button
              onClick={() => {
                const newExpanded = !isExpanded;
                setIsExpanded(newExpanded);
                localStorage.setItem('qmaker-metadata-expanded', JSON.stringify(newExpanded));
              }}
              className="flex items-center justify-between w-full text-left p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 active:scale-[0.98] group"
              aria-expanded={isExpanded}
              aria-controls="metadata-form"
              aria-label={isExpanded ? 'Collapse paper information form' : 'Expand paper information form'}
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
                      countdown > 0
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : isComplete 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                    }`}>
                      {countdown > 0 ? `${countdown}s` : `${completionPercentage}%`}
                    </div>
                  </div>
                  {!isExpanded && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {countdown > 0 
                        ? `Auto-closing in ${countdown}s - Tap to keep open`
                        : `${metadata.examName || 'Tap to add exam details'} • ${metadata.className || 'Class'} • ${metadata.subject || 'Subject'}`
                      }
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
            <div 
              id="metadata-form"
              className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}
              aria-hidden={!isExpanded}
            >
              <div className="px-3 pb-4 space-y-4" role="form" aria-label="Paper information form">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {getLabels(metadata.language).numberingStyle}
                </label>
                <select
                  value={metadata.numberingStyle}
                  onChange={(e) => handleChange('numberingStyle', e.target.value)}
                  onFocus={() => setUserInteracting(true)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                >
                  <option value="letters">(a), (b), (c)</option>
                  <option value="numbers">(1), (2), (3)</option>
                  <option value="roman">(i), (ii), (iii)</option>
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
                  className={getFieldClassName('examName', 'w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent text-base')}
                  placeholder={getPlaceholders(metadata.language).examName}
                  aria-required="true"
                  aria-invalid={!!getFieldError('examName')}
                  aria-describedby={getFieldError('examName') ? 'examName-error' : undefined}
                />
                {getFieldError('examName') && (
                  <p id="examName-error" className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{getFieldError('examName')}</p>
                )}
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
                    className={getFieldClassName('className', 'w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent text-base')}
                    placeholder={getPlaceholders(metadata.language).className}
                  />
                  {getFieldError('className') && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{getFieldError('className')}</p>
                  )}
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
                    className={getFieldClassName('subject', 'w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent text-base')}
                    placeholder={getPlaceholders(metadata.language).subject}
                  />
                  {getFieldError('subject') && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{getFieldError('subject')}</p>
                  )}
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
                    className={getFieldClassName('fullMarks', 'w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent text-base')}
                    placeholder={getPlaceholders(metadata.language).fullMarks}
                  />
                  {getFieldError('fullMarks') && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{getFieldError('fullMarks')}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {getLabels(metadata.language).duration}
                  </label>
                  <input
                    type="text"
                    value={metadata.duration}
                    onChange={(e) => handleChange('duration', e.target.value)}
                    className={getFieldClassName('duration', 'w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent text-base')}
                    placeholder={getPlaceholders(metadata.language).duration}
                  />
                  {getFieldError('duration') && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{getFieldError('duration')}</p>
                  )}
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
              onClick={() => {
                const newExpanded = !isExpanded;
                setIsExpanded(newExpanded);
                localStorage.setItem('qmaker-metadata-expanded', JSON.stringify(newExpanded));
              }}
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
                <div className="grid grid-cols-1 gap-4">
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