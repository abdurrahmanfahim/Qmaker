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
    <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-2 sm:p-4">
      <div className={`max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none preview-content ${getFontClass(metadata.language)} ${getDirectionClass(metadata.language)}`} data-export="pdf-content">
        {/* Header */}
        <div className="bg-white p-8 border-b-2 border-black print:border-black">
          <div className={`text-center ${getDirectionClass(metadata.language)}`}>
            {/* School Name - Centered, Large */}
            {metadata.schoolName && (
              <h1 className={`text-3xl font-bold text-black mb-4 leading-tight ${getFontClass(metadata.language)}`}>
                {metadata.schoolName}
              </h1>
            )}
            
            {/* Exam Name - Centered, Medium */}
            {metadata.examName && (
              <h2 className={`text-xl font-semibold text-black mb-6 ${getFontClass(metadata.language)}`}>
                {metadata.examName}
              </h2>
            )}
            
            {/* Subject and Class - Centered */}
            {metadata.subject && metadata.className && (
              <div className={`text-lg font-medium text-black mb-2 ${getFontClass(metadata.language)}`}>
                {metadata.subject} - {metadata.className}
              </div>
            )}
            
            {/* Book - Centered, Smaller */}
            {metadata.book && (
              <div className={`text-base text-black mb-6 ${getFontClass(metadata.language)}`}>
                {metadata.language === 'arabic' ? 'الكتاب:' : 
                 metadata.language === 'bangla' ? 'কিতাব:' :
                 metadata.language === 'urdu' ? 'کتاب:' : 'Book:'} {metadata.book}
              </div>
            )}
            
            {/* Exam Details - Three Column Layout */}
            <div className="border-t border-black pt-4 mt-6">
              <div className={`grid grid-cols-3 gap-4 text-sm text-black ${getFontClass(metadata.language)}`}>
                {/* Left: Date */}
                <div className={`${getDirectionClass(metadata.language) === 'rtl' ? 'text-right' : 'text-left'}`}>
                  {metadata.examDate && (
                    <div>
                      <div className="font-medium mb-1">
                        {metadata.language === 'arabic' ? 'التاريخ' : 
                         metadata.language === 'bangla' ? 'তারিখ' :
                         metadata.language === 'urdu' ? 'تاریخ' : 'Date'}
                      </div>
                      <div>{formatDate(metadata.examDate)}</div>
                    </div>
                  )}
                </div>
                
                {/* Center: Duration */}
                <div className="text-center">
                  {metadata.duration && (
                    <div>
                      <div className="font-medium mb-1">
                        {metadata.language === 'arabic' ? 'الوقت' : 
                         metadata.language === 'bangla' ? 'সময়' :
                         metadata.language === 'urdu' ? 'وقت' : 'Time'}
                      </div>
                      <div>{metadata.duration}</div>
                    </div>
                  )}
                </div>
                
                {/* Right: Full Marks */}
                <div className={`${getDirectionClass(metadata.language) === 'rtl' ? 'text-left' : 'text-right'}`}>
                  <div>
                    <div className="font-medium mb-1">
                      {metadata.language === 'arabic' ? 'الدرجة الكاملة' : 
                       metadata.language === 'bangla' ? 'পূর্ণমান' :
                       metadata.language === 'urdu' ? 'مکمل نمبر' : 'Full Marks'}
                    </div>
                    <div>{metadata.fullMarks || getTotalMarks()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        {metadata.instructions && (
          <div className={`p-6 bg-white print:bg-white ${getDirectionClass(metadata.language)}`}>
            <h3 className={`font-semibold text-black mb-3 text-base ${getFontClass(metadata.language)}`}>
              {metadata.language === 'arabic' ? 'التعليمات:' : 
               metadata.language === 'bangla' ? 'নির্দেশনা:' :
               metadata.language === 'urdu' ? 'ہدایات:' : 'Instructions:'}
            </h3>
            <div className={`text-black whitespace-pre-wrap text-sm leading-relaxed ${getFontClass(metadata.language)}`}>
              {metadata.instructions}
            </div>
          </div>
        )}

        {/* Sections */}
        <div className="p-6 space-y-8">
          {sections.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No questions added yet</p>
              <p className="text-sm">Add sections and questions to see the preview</p>
            </div>
          ) : (
            sections.map((section, sectionIndex) => (
              <div key={section.id} className="print-page-break">
                {/* Section Header */}
                <div className={`mb-6 ${getDirectionClass(metadata.language)}`}>
                  <h2 className={`text-lg font-bold text-black mb-3 ${getFontClass(metadata.language)}`}>
                    {section.title}
                  </h2>
                  {section.instructions && (
                    <div className={`text-black italic text-sm mb-4 ${getFontClass(metadata.language)}`}>
                      {section.instructions}
                    </div>
                  )}
                </div>

                {/* Sub-Questions */}
                <div className={`space-y-5 ${getDirectionClass(metadata.language)}`}>
                  {section.subQuestions.map((subQuestion, index) => (
                    <div key={subQuestion.id} className="space-y-3">
                      <div className={`flex items-center justify-between gap-2 ${['arabic', 'urdu'].includes(metadata.language) ? 'flex-row-reverse' : ''}`}>
                        
                          <span className="text-black text-sm font-medium flex-shrink-0">
                            {subQuestion.label}
                          </span>
                          {subQuestion.heading && (
                            <div className={`flex-1 min-w-0 font-medium text-black ${getFontClass(metadata.language)} ${getDirectionClass(metadata.language)}`}>
                              {subQuestion.heading}
                            </div>
                          )}
                        
                        <div className={`flex items-center gap-1 flex-shrink-0 ${['arabic', 'urdu'].includes(metadata.language) ? '' : ''}`}>
                          <span className="text-sm text-black font-normal">
                            [{subQuestion.marks || 0}]
                          </span>
                          <span className="text-xs text-black hidden sm:inline">
                            {metadata.language === 'arabic' ? 'درجة' : 
                             metadata.language === 'bangla' ? 'নম্বর' :
                             metadata.language === 'urdu' ? 'نمবر' : 'marks'}
                          </span>
                          <span className="text-xs text-black opacity-50">•</span>
                        </div>
                      </div>
                      
                      <div 
                        className={`prose prose-sm max-w-none text-black leading-relaxed print:text-black ${getFontClass(metadata.language)} ${getDirectionClass(metadata.language)} ml-6`}
                        dangerouslySetInnerHTML={{ __html: subQuestion.content }}
                      />
                      
                      {subQuestion.showAnswer && subQuestion.answer && (
                        <div className={`mt-3 p-3 bg-white border border-black print:bg-white print:border-black ml-6 ${getDirectionClass(metadata.language)}`}>
                          <h4 className={`text-sm font-medium text-black mb-2 ${getFontClass(metadata.language)}`}>
                            {metadata.language === 'arabic' ? 'الإجابة:' : 
                             metadata.language === 'bangla' ? 'উত্তর:' :
                             metadata.language === 'urdu' ? 'جواب:' : 'Answer:'}
                          </h4>
                          <div className={`text-sm text-black whitespace-pre-wrap print:text-black ${getFontClass(metadata.language)}`}>
                            {subQuestion.answer}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {sections.length > 0 && (
          <div className={`p-6 border-t border-black bg-white print:bg-white text-center text-sm text-black ${getFontClass(metadata.language)} ${getDirectionClass(metadata.language)}`}>
            <p>
              {metadata.language === 'arabic' ? '--- نهاية ورقة الأسئلة ---' : 
               metadata.language === 'bangla' ? '--- প্রশ্নপত্রের সমাপ্তি ---' :
               metadata.language === 'urdu' ? '--- سوالی کاغذ کا اختتام ---' : '--- End of Question Paper ---'}
            </p>

          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;