/**
 * Test Runner Component - UI for running comprehensive tests
 */

import React, { useState } from 'react';
import TestRunner from '../utils/testRunner';
import mobileOptimizer from '../utils/mobileOptimizer';
import I18nTester from '../utils/i18nTester';

const TestRunnerComponent = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const runTests = async (testType = 'all') => {
    setIsRunning(true);
    setResults(null);

    try {
      let testResults = {};

      if (testType === 'all' || testType === 'functional') {
        const runner = new TestRunner();
        testResults.functional = await runner.runAllTests();
      }

      if (testType === 'all' || testType === 'mobile') {
        testResults.mobile = mobileOptimizer.runMobileTests();
      }

      if (testType === 'all' || testType === 'i18n') {
        const i18nTester = new I18nTester();
        testResults.i18n = await i18nTester.runAllTests();
      }

      setResults(testResults);
    } catch (error) {
      console.error('Test execution failed:', error);
      setResults({ error: error.message });
    } finally {
      setIsRunning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            🧪 Test Runner
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Test Type Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {[
              { id: 'all', label: 'All Tests', icon: '🧪' },
              { id: 'functional', label: 'Functional', icon: '⚙️' },
              { id: 'mobile', label: 'Mobile', icon: '📱' },
              { id: 'i18n', label: 'I18n', icon: '🌐' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Run Tests Button */}
          <div className="mb-6">
            <button
              onClick={() => runTests(activeTab)}
              disabled={isRunning}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              {isRunning ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running Tests...
                </>
              ) : (
                `Run ${activeTab === 'all' ? 'All' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Tests`
              )}
            </button>
          </div>

          {/* Test Results */}
          {results && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
              {results.error ? (
                <div className="text-red-600 dark:text-red-400">
                  <h3 className="font-semibold mb-2">❌ Test Execution Failed</h3>
                  <p>{results.error}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(results).map(([testType, result]) => (
                    <TestResultSection key={testType} type={testType} result={result} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Test Information */}
          <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            <h3 className="font-semibold mb-2">Test Categories:</h3>
            <ul className="space-y-1">
              <li><strong>Functional:</strong> Core app functionality, components, and user interactions</li>
              <li><strong>Mobile:</strong> Touch targets, responsive design, and mobile-specific features</li>
              <li><strong>I18n:</strong> Multilingual support, RTL layout, and font rendering</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestResultSection = ({ type, result }) => {
  const getTypeIcon = (type) => {
    const icons = {
      functional: '⚙️',
      mobile: '📱',
      i18n: '🌐'
    };
    return icons[type] || '🧪';
  };

  const getSuccessRate = (result) => {
    if (result.passed !== undefined && result.failed !== undefined) {
      const total = result.passed + result.failed;
      return total > 0 ? ((result.passed / total) * 100).toFixed(1) : 0;
    }
    return 'N/A';
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
          <span className="mr-2">{getTypeIcon(type)}</span>
          {type.charAt(0).toUpperCase() + type.slice(1)} Tests
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Success Rate: {getSuccessRate(result)}%
        </div>
      </div>

      {result.passed !== undefined && result.failed !== undefined && (
        <div className="flex space-x-4 mb-3 text-sm">
          <span className="text-green-600 dark:text-green-400">
            ✅ Passed: {result.passed}
          </span>
          <span className="text-red-600 dark:text-red-400">
            ❌ Failed: {result.failed}
          </span>
          {result.warnings > 0 && (
            <span className="text-yellow-600 dark:text-yellow-400">
              ⚠️ Warnings: {result.warnings}
            </span>
          )}
        </div>
      )}

      {result.tests && result.tests.length > 0 && (
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {result.tests.slice(0, 10).map((test, index) => (
            <div key={index} className="flex items-center text-sm">
              <span className="mr-2">{test.passed ? '✅' : '❌'}</span>
              <span className="text-gray-700 dark:text-gray-300">{test.name}</span>
              {test.error && (
                <span className="ml-2 text-red-500 text-xs">({test.error})</span>
              )}
            </div>
          ))}
          {result.tests.length > 10 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              ... and {result.tests.length - 10} more tests
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestRunnerComponent;