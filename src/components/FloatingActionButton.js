import React, { useState } from 'react';
import { PlusIcon, DocumentTextIcon, RectangleStackIcon, PhotoIcon, EyeIcon, UserGroupIcon, ArrowDownTrayIcon, SparklesIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useLongPress } from '../hooks/useSwipeGestures';

const FloatingActionButton = ({ onAddSection, onAddQuestion, onAddImage, onOpenTemplates, onShowPreview, onShowCollaboration, onShowAdvancedExport, onShowAIAssistant, onShowAnalytics }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const longPressProps = useLongPress(() => {
    setIsExpanded(true);
  }, 300);

  const actions = [
    {
      id: 'section',
      label: 'Add Section',
      icon: DocumentTextIcon,
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: onAddSection
    },
    {
      id: 'question',
      label: 'Add Question',
      icon: PlusIcon,
      color: 'bg-green-600 hover:bg-green-700',
      onClick: onAddQuestion
    },
    {
      id: 'template',
      label: 'Templates',
      icon: RectangleStackIcon,
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: onOpenTemplates
    },
    {
      id: 'preview',
      label: 'Preview',
      icon: EyeIcon,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      onClick: onShowPreview
    },
    {
      id: 'collaborate',
      label: 'Collaborate',
      icon: UserGroupIcon,
      color: 'bg-pink-600 hover:bg-pink-700',
      onClick: onShowCollaboration
    },
    {
      id: 'export',
      label: 'Export',
      icon: ArrowDownTrayIcon,
      color: 'bg-teal-600 hover:bg-teal-700',
      onClick: onShowAdvancedExport
    },
    {
      id: 'ai',
      label: 'AI Assistant',
      icon: SparklesIcon,
      color: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
      onClick: onShowAIAssistant
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: ChartBarIcon,
      color: 'bg-emerald-600 hover:bg-emerald-700',
      onClick: onShowAnalytics
    },
    {
      id: 'image',
      label: 'Add Image',
      icon: PhotoIcon,
      color: 'bg-orange-600 hover:bg-orange-700',
      onClick: onAddImage
    }
  ];

  const handleMainClick = () => {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      onAddQuestion();
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Action buttons */}
      {isExpanded && (
        <div className="fixed bottom-24 right-4 z-50 flex flex-col-reverse gap-3">
          {actions.map((action, index) => (
            <div
              key={action.id}
              className="flex items-center gap-3 animate-in slide-in-from-bottom-2 duration-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="bg-gray-900 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap">
                {action.label}
              </span>
              <button
                onClick={() => {
                  action.onClick();
                  setIsExpanded(false);
                }}
                className={`w-12 h-12 rounded-full ${action.color} text-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95`}
              >
                <action.icon className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        {...longPressProps}
        onClick={handleMainClick}
        className={`fixed bottom-20 right-4 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-all duration-200 hover:scale-110 active:scale-95 md:hidden ${
          isExpanded ? 'rotate-45' : ''
        }`}
      >
        <PlusIcon className="w-7 h-7" />
      </button>
    </>
  );
};

export default FloatingActionButton;