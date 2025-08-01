import React, { useState, useEffect } from 'react';
import { 
  BookOpenIcon, 
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  TagIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import usePaperStore from '../store/paperStore';

const QuestionBank = ({ isOpen, onClose }) => {
  const { addSubQuestion } = usePaperStore();
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

  const addToBank = (question) => {
    const newQuestion = {
      id: Date.now(),
      heading: question.heading,
      content: question.content,
      marks: question.marks,
      category: 'general',
      createdAt: new Date().toISOString()
    };
    saveQuestions([...questions, newQuestion]);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <BookOpenIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Question Bank</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
        <div className="flex-1 overflow-auto p-4">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <BookOpenIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No questions found</p>
              <p className="text-sm">Add questions to your bank to reuse them later</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map(question => (
                <div key={question.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        {question.heading}
                      </h3>
                      <div 
                        className="text-sm text-gray-600 dark:text-gray-300 mb-2"
                        dangerouslySetInnerHTML={{ __html: question.content }}
                      />
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <TagIcon className="w-3 h-3" />
                          {question.category}
                        </span>
                        <span>[{question.marks} marks]</span>
                        <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          // Add to current section (implement this)
                          console.log('Add to section:', question);
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Use
                      </button>
                      <button
                        onClick={() => deleteFromBank(question.id)}
                        className="p-1 text-red-500 hover:text-red-700"
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