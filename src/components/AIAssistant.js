import React, { useState, useRef, useEffect } from 'react';
import { 
  SparklesIcon, 
  MicrophoneIcon, 
  PaperAirplaneIcon,
  XMarkIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import aiQuestionGenerator from '../utils/aiQuestionGenerator';
import analytics from '../utils/analytics';

const AIAssistant = ({ onClose, onQuestionGenerated, currentSubject, currentLanguage }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hi! I can help you generate questions, improve existing ones, or suggest content. What would you like to do?',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions] = useState([
    'Generate 5 math questions',
    'Create English grammar questions',
    'Suggest science topics',
    'Improve my question'
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    analytics.trackFeatureUsage('ai_assistant', { query: input });

    // Simulate AI processing
    setTimeout(() => {
      const response = processAIRequest(input);
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response.content,
        actions: response.actions,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const processAIRequest = (query) => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('generate') && lowerQuery.includes('question')) {
      const count = extractNumber(query) || 3;
      const subject = extractSubject(query) || currentSubject || 'math';
      const difficulty = extractDifficulty(query) || 'medium';
      
      const questions = aiQuestionGenerator.generateBulkQuestions(
        subject, count, difficulty, currentLanguage
      );

      return {
        content: `I've generated ${questions.length} ${subject} questions for you:`,
        actions: [
          {
            type: 'questions',
            data: questions,
            label: 'Add to Paper'
          }
        ]
      };
    }

    if (lowerQuery.includes('improve') || lowerQuery.includes('better')) {
      return {
        content: 'To improve your questions, consider:\n• Adding specific context\n• Using clear, concise language\n• Including appropriate difficulty level\n• Adding visual elements if needed',
        actions: [
          {
            type: 'tips',
            data: [
              'Use active voice',
              'Avoid ambiguous terms',
              'Include examples',
              'Set clear expectations'
            ]
          }
        ]
      };
    }

    if (lowerQuery.includes('topic') || lowerQuery.includes('subject')) {
      const subject = extractSubject(query) || currentSubject || 'general';
      const topics = getTopicSuggestions(subject);
      
      return {
        content: `Here are some popular ${subject} topics you could create questions about:`,
        actions: [
          {
            type: 'topics',
            data: topics,
            label: 'Generate Questions'
          }
        ]
      };
    }

    // Default response
    return {
      content: 'I can help you with:\n• Generating questions by subject\n• Improving existing questions\n• Suggesting topics\n• Creating different question types\n\nWhat would you like to try?'
    };
  };

  const extractNumber = (text) => {
    const match = text.match(/\d+/);
    return match ? parseInt(match[0]) : null;
  };

  const extractSubject = (text) => {
    const subjects = ['math', 'english', 'science', 'history', 'geography'];
    return subjects.find(subject => text.toLowerCase().includes(subject));
  };

  const extractDifficulty = (text) => {
    const difficulties = ['easy', 'medium', 'hard'];
    return difficulties.find(diff => text.toLowerCase().includes(diff));
  };

  const getTopicSuggestions = (subject) => {
    const topics = {
      math: ['Algebra', 'Geometry', 'Statistics', 'Calculus', 'Trigonometry'],
      english: ['Grammar', 'Vocabulary', 'Reading Comprehension', 'Writing', 'Literature'],
      science: ['Physics', 'Chemistry', 'Biology', 'Earth Science', 'Astronomy'],
      history: ['Ancient History', 'Modern History', 'World Wars', 'Civilizations', 'Geography']
    };
    return topics[subject] || topics.math;
  };

  const handleActionClick = (action) => {
    if (action.type === 'questions') {
      action.data.forEach(question => {
        onQuestionGenerated(question);
      });
      analytics.trackFeatureUsage('ai_questions_added', { count: action.data.length });
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white dark:bg-gray-800 w-full h-full sm:h-[600px] sm:w-full sm:max-w-md sm:rounded-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5" />
            <h3 className="font-semibold">AI Assistant</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                
                {message.actions && (
                  <div className="mt-3 space-y-2">
                    {message.actions.map((action, index) => (
                      <div key={index}>
                        {action.type === 'questions' && (
                          <div className="space-y-2">
                            {action.data.slice(0, 3).map((question, qIndex) => (
                              <div key={qIndex} className="bg-white dark:bg-gray-600 p-2 rounded text-xs">
                                <p className="font-medium">{question.question}</p>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">
                                  {question.difficulty} • {question.marks} marks
                                </p>
                              </div>
                            ))}
                            <button
                              onClick={() => handleActionClick(action)}
                              className="w-full mt-2 py-2 px-3 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                            >
                              {action.label}
                            </button>
                          </div>
                        )}
                        
                        {action.type === 'topics' && (
                          <div className="grid grid-cols-2 gap-1 mt-2">
                            {action.data.map((topic, tIndex) => (
                              <button
                                key={tIndex}
                                onClick={() => setInput(`Generate questions about ${topic}`)}
                                className="p-2 bg-white dark:bg-gray-600 rounded text-xs hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                              >
                                {topic}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <div className="flex items-center gap-1 mb-2">
              <LightBulbIcon className="w-4 h-4 text-yellow-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Try these:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;