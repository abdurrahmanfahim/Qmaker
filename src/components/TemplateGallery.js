import React, { useState, useMemo } from 'react';
import { MagnifyingGlassIcon, HeartIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const TemplateGallery = ({ onSelectTemplate, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState(new Set());

  const templates = [
    {
      id: 'translation',
      name: 'Translation Exercise',
      category: 'language',
      description: 'Translate text between languages',
      preview: 'Translate the following sentences...',
      difficulty: 'Easy',
      estimatedTime: '15 min',
      tags: ['translation', 'language', 'multilingual']
    },
    {
      id: 'fill-blanks',
      name: 'Fill in the Blanks',
      category: 'quiz',
      description: 'Complete sentences with missing words',
      preview: 'The capital of France is ____.',
      difficulty: 'Medium',
      estimatedTime: '10 min',
      tags: ['quiz', 'vocabulary', 'grammar']
    },
    {
      id: 'vocabulary',
      name: 'Vocabulary Test',
      category: 'language',
      description: 'Define terms and concepts',
      preview: 'Define the following terms...',
      difficulty: 'Easy',
      estimatedTime: '20 min',
      tags: ['vocabulary', 'definitions', 'language']
    },
    {
      id: 'essay',
      name: 'Essay Question',
      category: 'writing',
      description: 'Long-form writing prompts',
      preview: 'Write an essay about...',
      difficulty: 'Hard',
      estimatedTime: '45 min',
      tags: ['essay', 'writing', 'analysis']
    },
    {
      id: 'matching',
      name: 'Matching Exercise',
      category: 'quiz',
      description: 'Connect items between columns',
      preview: 'Match the following items...',
      difficulty: 'Medium',
      estimatedTime: '12 min',
      tags: ['matching', 'connections', 'quiz']
    },
    {
      id: 'grammar',
      name: 'Grammar Correction',
      category: 'language',
      description: 'Fix grammatical errors',
      preview: 'Correct the errors in these sentences...',
      difficulty: 'Medium',
      estimatedTime: '18 min',
      tags: ['grammar', 'correction', 'language']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', icon: SparklesIcon },
    { id: 'quiz', name: 'Quiz & Tests', icon: '🧠' },
    { id: 'language', name: 'Language', icon: '🌐' },
    { id: 'writing', name: 'Writing', icon: '✍️' }
  ];

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const recentTemplates = templates.slice(0, 3);
  const favoriteTemplates = templates.filter(t => favorites.has(t.id));

  const toggleFavorite = (templateId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId);
    } else {
      newFavorites.add(templateId);
    }
    setFavorites(newFavorites);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const TemplateCard = ({ template }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
        <button
          onClick={() => toggleFavorite(template.id)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          {favorites.has(template.id) ? (
            <HeartSolidIcon className="w-4 h-4 text-red-500" />
          ) : (
            <HeartIcon className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
      
      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{template.description}</p>
      
      <div className="bg-gray-50 rounded-lg p-2 mb-3">
        <p className="text-xs text-gray-700 italic">"{template.preview}"</p>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
          {template.difficulty}
        </span>
        <span className="text-xs text-gray-500 flex items-center">
          <ClockIcon className="w-3 h-3 mr-1" />
          {template.estimatedTime}
        </span>
      </div>
      
      <button
        onClick={() => onSelectTemplate(template.id)}
        className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Use Template
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:w-full sm:max-w-4xl sm:rounded-t-xl sm:rounded-b-xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Template Gallery</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <span className="sr-only">Close</span>
              ✕
            </button>
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {typeof category.icon === 'string' ? (
                  <span>{category.icon}</span>
                ) : (
                  <category.icon className="w-4 h-4" />
                )}
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto">
          {/* Recently Used */}
          {recentTemplates.length > 0 && selectedCategory === 'all' && !searchQuery && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <ClockIcon className="w-4 h-4 mr-2" />
                Recently Used
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {recentTemplates.map(template => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </div>
          )}

          {/* Favorites */}
          {favoriteTemplates.length > 0 && selectedCategory === 'all' && !searchQuery && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <HeartIcon className="w-4 h-4 mr-2" />
                Favorites
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {favoriteTemplates.map(template => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </div>
          )}

          {/* All Templates */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {searchQuery ? `Search Results (${filteredTemplates.length})` : 'All Templates'}
            </h3>
            {filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredTemplates.map(template => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">🔍</div>
                <p className="text-gray-500">No templates found</p>
                <p className="text-sm text-gray-400">Try adjusting your search or category filter</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;