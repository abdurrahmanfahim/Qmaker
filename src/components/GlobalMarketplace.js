import React, { useState, useEffect } from 'react';
import { GlobeAltIcon, StarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const GlobalMarketplace = ({ isOpen, onClose }) => {
  const [templates, setTemplates] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadMarketplaceTemplates();
    }
  }, [isOpen]);

  const loadMarketplaceTemplates = () => {
    // Simulate global marketplace data
    setTemplates([
      {
        id: 1,
        title: "Advanced Mathematics Quiz",
        author: "Dr. Ahmed Hassan",
        country: "Egypt",
        language: "Arabic",
        subject: "Mathematics",
        rating: 4.8,
        downloads: 1250,
        price: 2.99,
        aiGenerated: true,
        culturalContext: "Middle Eastern",
        preview: "Comprehensive calculus questions with cultural examples"
      },
      {
        id: 2,
        title: "Bengali Literature Exam",
        author: "Prof. Rashida Begum",
        country: "Bangladesh",
        language: "Bengali",
        subject: "Literature",
        rating: 4.9,
        downloads: 890,
        price: 1.99,
        aiGenerated: false,
        culturalContext: "South Asian",
        preview: "Classical Bengali poetry and prose analysis"
      },
      {
        id: 3,
        title: "Islamic Studies Assessment",
        author: "Maulana Tariq Ali",
        country: "Pakistan",
        language: "Urdu",
        subject: "Islamic Studies",
        rating: 4.7,
        downloads: 2100,
        price: 3.49,
        aiGenerated: true,
        culturalContext: "Islamic",
        preview: "Comprehensive Islamic jurisprudence questions"
      },
      {
        id: 4,
        title: "Science Practical Exam",
        author: "Ms. Sarah Johnson",
        country: "UK",
        language: "English",
        subject: "Science",
        rating: 4.6,
        downloads: 1800,
        price: 4.99,
        aiGenerated: false,
        culturalContext: "Western",
        preview: "Laboratory-based science assessment"
      }
    ]);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesFilter = filter === 'all' || template.subject.toLowerCase() === filter;
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const purchaseTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    const confirmed = window.confirm(`Purchase "${template.title}" for $${template.price}?`);
    if (confirmed) {
      alert('Template purchased successfully!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <GlobeAltIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Global Template Marketplace</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search templates, authors, subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Subjects</option>
              <option value="mathematics">Mathematics</option>
              <option value="literature">Literature</option>
              <option value="islamic studies">Islamic Studies</option>
              <option value="science">Science</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <div key={template.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{template.title}</h3>
                    <p className="text-sm text-gray-600">by {template.author}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{template.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {template.language}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    {template.country}
                  </span>
                  {template.aiGenerated && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                      AI Enhanced
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {template.preview}
                </p>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {template.downloads.toLocaleString()} downloads
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg flex items-center gap-1">
                      <CurrencyDollarIcon className="w-4 h-4" />
                      {template.price}
                    </span>
                    <button
                      onClick={() => purchaseTemplate(template.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                    >
                      Purchase
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <GlobeAltIcon className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Become a Content Creator</p>
                <p className="text-sm text-gray-600">Share your templates and earn revenue</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                Start Selling
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalMarketplace;