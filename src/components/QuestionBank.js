import React, { useState, useEffect } from 'react';
import { 
  BookOpenIcon, 
  MagnifyingGlassIcon,
  TrashIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import usePaperStore from '../store/paperStore';

const QuestionBank = ({ isOpen, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories] = useState(['all', 'grammar', 'vocabulary', 'translation', 'essay', 'mcq']);

  useEffect(() => {
    // Load questions from localStorage
    const savedQuestions = localStorage.getItem('questionBank');
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
  }, []);

  const saveQuestions = (newQuestions) => {
    setQuestions(newQuestions);
    localStorage.setItem('questionBank', JSON.stringify(newQuestions));
  };



  const deleteFromBank = (questionId) => {
    saveQuestions(questions.filter(q => q.id !== questionId));
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-2">
            <BookOpenIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <h2 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white">Question Bank</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 touch-manipulation"
          >
            ✕
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-gray-500">
              <BookOpenIcon className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
              <p className="text-base sm:text-lg mb-1 sm:mb-2">No questions found</p>
              <p className="text-xs sm:text-sm">Add questions to reuse later</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {filteredQuestions.map(question => (
                <div key={question.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-start justify-between gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base truncate">
                        {question.heading}
                      </h3>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                        {question.content.replace(/<[^>]*>/g, '').substring(0, 80)}...
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <TagIcon className="w-3 h-3" />
                          {question.category}
                        </span>
                        <span>{question.marks}m</span>
                        <span className="hidden sm:inline">{new Date(question.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          // Add to current section (implement this)
                          console.log('Add to section:', question);
                        }}
                        className="px-2 sm:px-3 py-1 bg-blue-600 text-white rounded text-xs sm:text-sm hover:bg-blue-700 touch-manipulation min-w-[44px] sm:min-w-0"
                      >
                        Use
                      </button>
                      <button
                        onClick={() => deleteFromBank(question.id)}
                        className="p-1 text-red-500 hover:text-red-700 touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;