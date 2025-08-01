/**
 * Welcome screen for first-time users with language selection and onboarding
 */

import React, { useState } from 'react';
import { 
  AcademicCapIcon,
  DocumentTextIcon,
  ShareIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const WelcomeScreen = ({ onComplete }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  const languages = [
    { code: 'english', name: 'English', flag: '🇬🇧', sample: 'Create professional question papers' },
    { code: 'bangla', name: 'বাংলা', flag: '🇧🇩', sample: 'পেশাদার প্রশ্নপত্র তৈরি করুন' },
    { code: 'arabic', name: 'العربية', flag: '🇸🇦', sample: 'إنشاء أوراق أسئلة احترافية' },
    { code: 'urdu', name: 'اردو', flag: '🇵🇰', sample: 'پیشہ ورانہ سوالی کاغذات بنائیں' }
  ];

  const features = [
    {
      icon: <DocumentTextIcon className="w-8 h-8" />,
      title: 'Easy Question Creation',
      description: 'Add questions with rich text, tables, and math equations'
    },
    {
      icon: <AcademicCapIcon className="w-8 h-8" />,
      title: 'Multiple Languages',
      description: 'Support for Arabic, Bangla, Urdu, and English'
    },
    {
      icon: <ShareIcon className="w-8 h-8" />,
      title: 'Export & Share',
      description: 'Generate PDF papers ready for printing and distribution'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Header */}
      <div className="text-center pt-8 pb-6 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
          <DocumentTextIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to Qmaker
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Create professional question papers in minutes
        </p>
      </div>

      {/* Language Selection */}
      <div className="px-4 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Choose Your Language
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedLanguage === lang.code
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lang.flag}</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {lang.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {lang.sample}
                  </div>
                </div>
                {selectedLanguage === lang.code && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="px-4 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
          What You Can Do
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl mb-3">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Preview */}
      <div className="px-4 mb-8">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Sample Question Paper</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Mathematics • Class 10</p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Full Marks:</span>
              <span className="font-medium">100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Duration:</span>
              <span className="font-medium">3 hours</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <div className="font-medium mb-2">Section A</div>
              <div className="text-gray-600 dark:text-gray-400">
                (a) Solve: 2x + 5 = 15
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Get Started Button */}
      <div className="px-4 pb-8 mt-auto">
        <button
          onClick={() => onComplete(selectedLanguage)}
          className="w-full max-w-md mx-auto flex items-center justify-center gap-3 bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Get Started
          <ChevronRightIcon className="w-5 h-5" />
        </button>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
          No account required • Start creating immediately
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;