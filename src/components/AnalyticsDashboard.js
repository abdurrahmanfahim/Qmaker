import React, { useState, useEffect } from 'react';
import { ChartBarIcon, DocumentTextIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';

const AnalyticsDashboard = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState({
    totalPapers: 0,
    totalQuestions: 0,
    totalExports: 0,
    avgTimeSpent: 0,
    recentActivity: []
  });

  useEffect(() => {
    // Load analytics from localStorage
    const papers = JSON.parse(localStorage.getItem('paperLibrary') || '[]');
    const exports = JSON.parse(localStorage.getItem('exportHistory') || '[]');
    
    setStats({
      totalPapers: papers.length,
      totalQuestions: papers.reduce((sum, paper) => sum + (paper.sections?.length || 0), 0),
      totalExports: exports.length,
      avgTimeSpent: 45, // minutes
      recentActivity: [
        { action: 'Paper Created', time: '2 hours ago', details: 'Mathematics Quiz' },
        { action: 'PDF Exported', time: '1 day ago', details: 'Science Test' },
        { action: 'Template Used', time: '2 days ago', details: 'MCQ Template' }
      ]
    });
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <ChartBarIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <DocumentTextIcon className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalPapers}</p>
                  <p className="text-sm text-gray-600">Total Papers</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <UserGroupIcon className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.totalQuestions}</p>
                  <p className="text-sm text-gray-600">Questions Created</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <ChartBarIcon className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalExports}</p>
                  <p className="text-sm text-gray-600">PDF Exports</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <ClockIcon className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-600">{stats.avgTimeSpent}m</p>
                  <p className="text-sm text-gray-600">Avg. Time Spent</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.details}</p>
                  </div>
                  <span className="text-sm text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;