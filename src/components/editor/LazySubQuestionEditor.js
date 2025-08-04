import React, { lazy, Suspense } from 'react';

const SubQuestionEditor = lazy(() => import('./SubQuestionEditor'));

const LazySubQuestionEditor = (props) => {
  return (
    <Suspense fallback={
      <div className="loading-skeleton question-editor bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 p-4 h-32">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
          <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
          <div className="w-16 h-8 bg-gray-200 dark:bg-gray-600 rounded"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
        <div className="h-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
      </div>
    }>
      <SubQuestionEditor {...props} />
    </Suspense>
  );
};

export default LazySubQuestionEditor;