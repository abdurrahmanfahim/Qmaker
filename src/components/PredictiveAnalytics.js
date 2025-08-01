import React, { useState, useEffect } from 'react';
import { ChartBarIcon, TrendingUpIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const PredictiveAnalytics = ({ isOpen, onClose }) => {
  const [analytics, setAnalytics] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('performance');

  useEffect(() => {
    if (isOpen) {
      loadPredictiveData();
    }
  }, [isOpen]);

  const loadPredictiveData = () => {
    // Simulate AI-powered predictive analytics
    setAnalytics({
      studentPerformance: {
        predicted: 78.5,
        confidence: 92,
        trend: 'improving',
        factors: ['Study time increased', 'Better question quality', 'Improved feedback']
      },
      learningOutcomes: {
        completionRate: 85,
        masteryLevel: 72,
        retentionRate: 68,
        engagementScore: 81
      },
      curriculumGaps: [
        { topic: 'Advanced Algebra', gap: 35, priority: 'high' },
        { topic: 'Essay Writing', gap: 28, priority: 'medium' },
        { topic: 'Critical Thinking', gap: 22, priority: 'low' }
      ],
      teacherEffectiveness: {
        questionQuality: 88,
        feedbackTimeliness: 76,
        studentEngagement: 82,
        learningImpact: 79
      },
      institutionalMetrics: {
        overallPerformance: 83,
        teacherSatisfaction: 91,
        studentRetention: 94,
        parentSatisfaction: 87
      }
    });
  };

  const getMetricData = () => {
    switch (selectedMetric) {
      case 'performance':
        return analytics?.studentPerformance;
      case 'outcomes':
        return analytics?.learningOutcomes;
      case 'gaps':
        return analytics?.curriculumGaps;
      case 'teacher':
        return analytics?.teacherEffectiveness;
      case 'institutional':
        return analytics?.institutionalMetrics;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <ChartBarIcon className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold">Predictive Analytics Dashboard</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { key: 'performance', label: 'Student Performance' },
              { key: 'outcomes', label: 'Learning Outcomes' },
              { key: 'gaps', label: 'Curriculum Gaps' },
              { key: 'teacher', label: 'Teacher Effectiveness' },
              { key: 'institutional', label: 'Institutional Metrics' }
            ].map(metric => (
              <button
                key={metric.key}
                onClick={() => setSelectedMetric(metric.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === metric.key
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>

          {analytics && (
            <div className="space-y-6">
              {selectedMetric === 'performance' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUpIcon className="w-8 h-8 text-green-600" />
                      <div>
                        <h3 className="text-lg font-semibold">Predicted Performance</h3>
                        <p className="text-sm text-gray-600">Next assessment cycle</p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {analytics.studentPerformance.predicted}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {analytics.studentPerformance.confidence}% confidence
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Key Factors</h4>
                    {analytics.studentPerformance.factors.map((factor, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedMetric === 'outcomes' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(analytics.learningOutcomes).map(([key, value]) => (
                    <div key={key} className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{value}%</div>
                      <div className="text-sm text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedMetric === 'gaps' && (
                <div className="space-y-3">
                  <h4 className="font-medium">Curriculum Gap Analysis</h4>
                  {analytics.curriculumGaps.map((gap, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          gap.priority === 'high' ? 'bg-red-500' :
                          gap.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <span className="font-medium">{gap.topic}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-medium">{gap.gap}% gap</div>
                          <div className="text-xs text-gray-500 capitalize">{gap.priority} priority</div>
                        </div>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                          Address
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedMetric === 'teacher' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(analytics.teacherEffectiveness).map(([key, value]) => (
                    <div key={key} className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{value}%</div>
                      <div className="text-sm text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedMetric === 'institutional' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(analytics.institutionalMetrics).map(([key, value]) => (
                    <div key={key} className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{value}%</div>
                      <div className="text-sm text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3 pt-6 border-t">
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Generate Report
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Schedule Analysis
                </button>
                <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Export Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;