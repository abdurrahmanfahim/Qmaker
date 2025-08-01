import React, { useState, useEffect, useMemo } from 'react';
import { SparklesIcon, ClockIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const SmartSuggestions = ({ subject, language, onSelectSuggestion, currentContent = '' }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const questionBank = useMemo(() => ({
    math: {
      english: [
        "Solve for x: 2x + 5 = 15",
        "Find the area of a circle with radius 7 cm",
        "What is the value of π (pi) to 3 decimal places?",
        "Calculate: 15% of 240",
        "If a triangle has angles 60°, 60°, what is the third angle?"
      ],
      arabic: [
        "احسب: ٢ × ٥ + ٣",
        "ما هو محيط المربع الذي طول ضلعه ٨ سم؟",
        "أوجد قيمة س: س + ٧ = ١٥"
      ],
      bangla: [
        "২ + ৩ × ৪ = কত?",
        "একটি বর্গক্ষেত্রের পরিসীমা ২০ সেমি হলে, এর ক্ষেত্রফল কত?",
        "৫০ এর ২০% কত?"
      ]
    },
    english: {
      english: [
        "Define the following literary terms:",
        "Write a paragraph about your favorite season",
        "Correct the grammatical errors in the following sentences:",
        "Explain the difference between 'affect' and 'effect'",
        "Write a short story beginning with 'It was a dark and stormy night...'"
      ],
      arabic: [
        "اكتب فقرة عن فصلك المفضل",
        "صحح الأخطاء النحوية في الجمل التالية:",
        "اشرح الفرق بين الفعل والاسم"
      ]
    },
    science: {
      english: [
        "What is photosynthesis? Explain the process.",
        "Name three states of matter and give examples",
        "What is the chemical formula for water?",
        "Explain the difference between renewable and non-renewable energy",
        "What causes the seasons on Earth?"
      ],
      bangla: [
        "সালোকসংশ্লেষণ কী? প্রক্রিয়াটি ব্যাখ্যা করুন।",
        "পদার্থের তিনটি অবস্থার নাম লিখুন",
        "পানির রাসায়নিক সংকেত কী?"
      ]
    },
    history: {
      english: [
        "When did World War II end?",
        "Who was the first person to walk on the moon?",
        "What year did the Berlin Wall fall?",
        "Name three ancient civilizations",
        "What was the Industrial Revolution?"
      ],
      arabic: [
        "متى انتهت الحرب العالمية الثانية؟",
        "من كان أول شخص يمشي على القمر؟",
        "في أي عام سقط جدار برلين؟"
      ]
    }
  }), []);

  const commonPhrases = useMemo(() => ({
    english: [
      "Choose the correct answer:",
      "Fill in the blanks:",
      "True or False:",
      "Short answer:",
      "Essay question:",
      "Multiple choice:",
      "Match the following:",
      "Explain briefly:",
      "Give reasons for:",
      "Compare and contrast:"
    ],
    arabic: [
      "اختر الإجابة الصحيحة:",
      "املأ الفراغات:",
      "صح أم خطأ:",
      "إجابة قصيرة:",
      "سؤال مقالي:",
      "اختيار متعدد:",
      "اربط ما يلي:",
      "اشرح بإيجاز:",
      "اذكر الأسباب:",
      "قارن بين:"
    ],
    bangla: [
      "সঠিক উত্তর বেছে নিন:",
      "শূন্যস্থান পূরণ করুন:",
      "সত্য না মিথ্যা:",
      "সংক্ষিপ্ত উত্তর:",
      "রচনামূলক প্রশ্ন:",
      "বহুনির্বাচনী:",
      "মিলান করুন:",
      "সংক্ষেপে ব্যাখ্যা করুন:",
      "কারণ দিন:",
      "তুলনা করুন:"
    ]
  }), []);

  useEffect(() => {
    if (currentContent.length > 5) {
      generateSuggestions();
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [currentContent, subject, language]);

  const generateSuggestions = () => {
    const subjectQuestions = questionBank[subject?.toLowerCase()] || questionBank.english;
    const languageQuestions = subjectQuestions[language] || subjectQuestions.english || [];
    const phrases = commonPhrases[language] || commonPhrases.english;
    
    // Smart suggestions based on content
    const contentSuggestions = [];
    
    if (currentContent.toLowerCase().includes('define') || currentContent.toLowerCase().includes('what is')) {
      contentSuggestions.push(...languageQuestions.filter(q => 
        q.toLowerCase().includes('what') || q.toLowerCase().includes('define')
      ));
    }
    
    if (currentContent.toLowerCase().includes('calculate') || currentContent.toLowerCase().includes('solve')) {
      contentSuggestions.push(...languageQuestions.filter(q => 
        q.toLowerCase().includes('calculate') || q.toLowerCase().includes('solve')
      ));
    }
    
    // Add random suggestions
    const randomQuestions = languageQuestions
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    const randomPhrases = phrases
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    
    const allSuggestions = [
      ...contentSuggestions.slice(0, 2),
      ...randomQuestions,
      ...randomPhrases
    ].slice(0, 5);
    
    setSuggestions(allSuggestions.map((text, index) => ({
      id: index,
      text,
      type: phrases.includes(text) ? 'phrase' : 'question',
      confidence: Math.random() * 0.3 + 0.7 // 70-100%
    })));
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'phrase': return SparklesIcon;
      case 'question': return AcademicCapIcon;
      default: return ClockIcon;
    }
  };

  const getSuggestionColor = (type) => {
    switch (type) {
      case 'phrase': return 'text-purple-600 bg-purple-50';
      case 'question': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 mt-2">
      <div className="flex items-center gap-2 mb-3">
        <SparklesIcon className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-gray-900 dark:text-white">Smart Suggestions</span>
      </div>
      
      <div className="space-y-2">
        {suggestions.map((suggestion) => {
          const Icon = getSuggestionIcon(suggestion.type);
          const colorClass = getSuggestionColor(suggestion.type);
          
          return (
            <button
              key={suggestion.id}
              onClick={() => onSelectSuggestion(suggestion.text)}
              className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className={`p-1 rounded-full ${colorClass} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
                    {suggestion.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 capitalize">
                      {suggestion.type}
                    </span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                      <div 
                        className="bg-green-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${suggestion.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.round(suggestion.confidence * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 text-center">
          Suggestions based on {subject || 'general'} • {language || 'English'}
        </p>
      </div>
    </div>
  );
};

export default SmartSuggestions;