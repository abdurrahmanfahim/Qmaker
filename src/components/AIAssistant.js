import React, { useState } from 'react';
import { SparklesIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

const AIAssistant = ({ onSuggestion, language = 'english' }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestions = {
    english: [
      'Generate 5 multiple choice questions about photosynthesis',
      'Create fill-in-the-blank questions for basic algebra',
      'Write essay questions about World War II'
    ],
    bangla: [
      'সালোকসংশ্লেষণ সম্পর্কে ৫টি বহুনির্বাচনী প্রশ্ন তৈরি করুন',
      'বীজগণিতের জন্য শূন্যস্থান পূরণের প্রশ্ন তৈরি করুন'
    ],
    arabic: [
      'أنشئ 5 أسئلة اختيار متعدد حول التمثيل الضوئي',
      'اكتب أسئلة مقالية عن الحرب العالمية الثانية'
    ]
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI generation (replace with actual AI API)
    setTimeout(() => {
      const mockQuestion = {
        heading: prompt,
        content: `<p>Generated question based on: "${prompt}"</p>`,
        type: 'ai-generated'
      };
      
      onSuggestion(mockQuestion);
      setPrompt('');
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
      <div className="flex items-center gap-2 mb-3">
        <SparklesIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h3 className="font-semibold text-purple-900 dark:text-purple-100">AI Assistant</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the question you want to generate..."
            className="flex-1 px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-800 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <PaperAirplaneIcon className="w-4 h-4" />
            )}
            Generate
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {suggestions[language]?.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setPrompt(suggestion)}
              className="px-3 py-1 bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 rounded-full text-xs hover:bg-purple-200 dark:hover:bg-purple-700 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;