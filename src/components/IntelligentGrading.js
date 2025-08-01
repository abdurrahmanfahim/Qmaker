import React, { useState } from 'react';
import { AcademicCapIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const IntelligentGrading = ({ isOpen, onClose, submissions }) => {
  const [gradingResults, setGradingResults] = useState([]);
  const [isGrading, setIsGrading] = useState(false);

  const startGrading = async () => {
    setIsGrading(true);
    
    // Simulate AI grading process
    const results = await Promise.all(
      submissions.map(async (submission, index) => {
        await new Promise(resolve => setTimeout(resolve, 1000 * (index + 1)));
        
        return {
          id: submission.id,
          studentName: submission.studentName,
          score: Math.floor(Math.random() * 40) + 60, // 60-100
          feedback: "AI-generated feedback based on answer analysis",
          strengths: ["Good understanding of concepts", "Clear explanation"],
          improvements: ["Could provide more examples", "Check calculations"],
          plagiarismScore: Math.floor(Math.random() * 20), // 0-20%
          timeSpent: `${Math.floor(Math.random() * 30) + 15} minutes`
        };
      })
    );
    
    setGradingResults(results);
    setIsGrading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <AcademicCapIcon className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold">Intelligent Grading System</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="p-6">
          {!isGrading && gradingResults.length === 0 && (
            <div className="text-center py-8">
              <AcademicCapIcon className="w-16 h-16 mx-auto text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ready to Grade Submissions</h3>
              <p className="text-gray-600 mb-6">
                AI will analyze {submissions.length} submissions and provide detailed feedback
              </p>
              <button
                onClick={startGrading}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                Start AI Grading
              </button>
            </div>
          )}

          {isGrading && (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">AI Grading in Progress</h3>
              <p className="text-gray-600">Analyzing submissions and generating feedback...</p>
            </div>
          )}

          {gradingResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Grading Results</h3>
                <div className="text-sm text-gray-500">
                  Average Score: {Math.round(gradingResults.reduce((sum, r) => sum + r.score, 0) / gradingResults.length)}%
                </div>
              </div>

              {gradingResults.map(result => (
                <div key={result.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        result.score >= 80 ? 'bg-green-500' : 
                        result.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <h4 className="font-medium">{result.studentName}</h4>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        Plagiarism: {result.plagiarismScore}%
                      </span>
                      <span className="text-lg font-bold text-purple-600">
                        {result.score}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium text-green-600 mb-1 flex items-center gap-1">
                        <CheckCircleIcon className="w-4 h-4" />
                        Strengths
                      </h5>
                      <ul className="text-gray-600 space-y-1">
                        {result.strengths.map((strength, i) => (
                          <li key={i}>• {strength}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-orange-600 mb-1 flex items-center gap-1">
                        <XCircleIcon className="w-4 h-4" />
                        Areas for Improvement
                      </h5>
                      <ul className="text-gray-600 space-y-1">
                        {result.improvements.map((improvement, i) => (
                          <li key={i}>• {improvement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>AI Feedback:</strong> {result.feedback}
                    </p>
                  </div>
                </div>
              ))}

              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Export Results
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Send Feedback to Students
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntelligentGrading;