import React from 'react';
import usePaperStore from '../store/paperStore';

const PreviewPanel = () => {
  const { metadata, sections } = usePaperStore();

  const getFontClass = (language) => {
    switch (language) {
      case 'arabic': return 'font-arabic';
      case 'urdu': return 'font-urdu';
      case 'bangla': return 'font-bangla';
      default: return 'font-english';
    }
  };

  const getDirectionClass = (language) => {
    return ['arabic', 'urdu'].includes(language) ? 'rtl' : 'ltr';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const getTotalMarks = () => {
    return sections.reduce((total, section) => {
      return total + section.subQuestions.reduce((sectionTotal, sq) => sectionTotal + (sq.marks || 0), 0);
    }, 0);
  };

  return (
    <div className="flex-1 overflow-auto bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none">
        {/* Header */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 border-b border-gray-200 dark:border-gray-600 print:bg-white">
          <div className="text-center space-y-2">
            {metadata.schoolName && (
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {metadata.schoolName}
              </h1>
            )}
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {metadata.subject || 'Subject'} - {metadata.className || 'Class'}
            </h2>
            
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="space-y-1">
                {metadata.examDate && (
                  <p><strong>Date:</strong> {formatDate(metadata.examDate)}</p>
                )}
                {metadata.duration && (
                  <p><strong>Time:</strong> {metadata.duration}</p>
                )}
              </div>
              <div className="space-y-1 text-right">
                <p><strong>Full Marks:</strong> {metadata.fullMarks || getTotalMarks()}</p>
                {metadata.teacherName && (
                  <p><strong>Teacher:</strong> {metadata.teacherName}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        {metadata.instructions && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-600 bg-blue-50 dark:bg-blue-900/20">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Instructions:</h3>
            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {metadata.instructions}
            </div>
          </div>
        )}

        {/* Sections */}
        <div className="p-6 space-y-8">
          {sections.map((section, sectionIndex) => (
            <div key={section.id} className="print-page-break">
              {/* Section Header */}
              <div className="mb-6">
                <h2 className={`text-xl font-bold text-gray-900 dark:text-white mb-2 ${getFontClass(section.language)} ${getDirectionClass(section.language)}`}>
                  {section.title}
                </h2>
                {section.instructions && (
                  <div className={`text-gray-600 dark:text-gray-400 italic ${getFontClass(section.language)} ${getDirectionClass(section.language)}`}>
                    {section.instructions}
                  </div>
                )}
              </div>

              {/* Sub-Questions */}
              <div className="space-y-6">
                {section.subQuestions.map((subQuestion, index) => (
                  <div key={subQuestion.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                        {subQuestion.label}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      {subQuestion.heading && (
                        <h3 className={`font-semibold text-gray-900 dark:text-white mb-2 ${getFontClass(section.language)} ${getDirectionClass(section.language)}`}>
                          {subQuestion.heading}
                          {subQuestion.marks > 0 && (
                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 font-normal">
                              [{subQuestion.marks} marks]
                            </span>
                          )}
                        </h3>
                      )}
                      
                      <div 
                        className={`prose prose-sm max-w-none text-gray-700 dark:text-gray-300 ${getFontClass(section.language)} ${getDirectionClass(section.language)}`}
                        dangerouslySetInnerHTML={{ __html: subQuestion.content }}
                      />
                      
                      {subQuestion.showAnswer && subQuestion.answer && (
                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                          <h4 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
                            Answer:
                          </h4>
                          <div className={`text-sm text-green-700 dark:text-green-200 whitespace-pre-wrap ${getFontClass(section.language)} ${getDirectionClass(section.language)}`}>
                            {subQuestion.answer}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-center text-sm text-gray-600 dark:text-gray-400 print:bg-white">
          <p>--- End of Question Paper ---</p>
          {metadata.teacherName && (
            <p className="mt-2">Prepared by: {metadata.teacherName}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;