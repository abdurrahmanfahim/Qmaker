import React from 'react';
import usePaperStore from '../store/paperStore';
import { PrinterIcon } from '@heroicons/react/24/outline';

const PreviewPanel = () => {
  const { metadata, sections } = usePaperStore();

  const getFontFamily = (language) => {
    return 'SolaimanLipi, Scheherazade New, Arial, sans-serif';
  };

  const getDirection = (language) => {
    return ['arabic', 'urdu'].includes(language) ? 'rtl' : 'ltr';
  };

  const convertNumbers = (text, language) => {
    if (!text) return text;
    
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const banglaNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    
    if (language === 'arabic' || language === 'urdu') {
      return text.replace(/[0-9]/g, (digit) => arabicNumerals[parseInt(digit)]);
    } else if (language === 'bangla') {
      return text.replace(/[0-9]/g, (digit) => banglaNumerals[parseInt(digit)]);
    }
    return text;
  };

  const getHandwritingText = (language) => {
    if (language === 'bangla') return '(সুন্দর হস্তাক্ষরের জন্য চার নম্বর নির্ধারিত)';
    if (language === 'arabic') return '(أربع درجات للخط الجميل)';
    if (language === 'urdu') return '(خوش خطی کے لیے چار نمبر)';
    return '(4 marks for handwriting)';
  };

  const processContent = (htmlContent) => {
    if (!htmlContent) return '';
    
    const replacementMap = {
      'ol': 'div class="ordered-list"',
      '/ol': '/div',
      'li': 'div class="list-item"',
      '/li': '/div',
      'ul': 'div class="unordered-list"',
      '/ul': '/div',
      's': 'span style="text-decoration: line-through;"',
      '/s': '/span',
      'strike': 'span style="text-decoration: line-through;"',
      '/strike': '/span'
    };
    
    let processed = htmlContent
      .replace(/<(\/?(?:ol|li|ul|s|strike))(?:[^>]*)>/g, (match, tag) => 
        replacementMap[tag] ? `<${replacementMap[tag]}>` : match
      )
      .replace(/<hr[^>]*>/g, '<hr style="border: no-border; margin: 10px 0;">');
    
    // Keep consistent 14px font size for all scripts
    processed = processed.replace(/([\u0980-\u09FF]+)/g, (match) => {
      return `<span style="font-size: 14px">${match}</span>`;
    });
    
    processed = processed.replace(/([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+)/g, (match) => {
      return `<span style="font-size: 14px">${match}</span>`;
    });
    
    return processed;
  };

  const styles = {
    container: {
      width: '100%',
      overflow: 'auto',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    },
    paper: {
      fontFamily: metadata.language === 'arabic' ? 'Scheherazade New, serif' : metadata.language === 'urdu' ? 'Noto Nastaliq Urdu, serif' : metadata.language === 'bangla' ? 'SolaimanLipi, Noto Sans Bengali, sans-serif' : 'Roboto, Arial, sans-serif',
      fontSize: '14px',
      padding: '40px',
      width: '210mm',
      minHeight: '297mm',
      boxSizing: 'border-box',
      direction: getDirection(metadata.language),
      backgroundColor: 'white',
      color: 'black',
      margin: '0 auto',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      position: 'relative'
    },
    header: {
      textAlign: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '10px'
    },
    examName: {
      textAlign: 'center',
      marginBottom: '10px'
    },
    metadataRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '5px',
      gap: '5px'
    },
    metadataItem: {
      padding: '2px 5px'
    },
    hr: {
      margin: '4px 0',
      border: 'none',
      borderTop: '1px solid #333',
      height: '1px'
    },
    instructions: {
      textAlign: 'center',
      margin: '5px 0'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      margin: '10px 0px',
      textAlign: 'start'
    },
    subQuestion: {
      marginBottom: '15px'
    },
    subQuestionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '13px',
      padding: '2px',
      marginBottom: '2px',
      marginLeft: '20px'
    },
    subQuestionLabel: {
      display: 'flex',
      gap: '5px'
    },
    subQuestionContent: {
      textAlign: 'start',
      margin: '5px 0px 10px 0px'
    },
    footer: {
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      color: '#666',
      fontSize: '10px'
    }
  };

  const [zoom, setZoom] = React.useState(window.innerWidth <= 768 ? 0.45 : 1);

  const handleExportPDF = () => {
    // Reset zoom to 100% for PDF export on all devices
    const element = document.getElementById('printable-content');
    const originalTransform = element.style.transform;
    const originalTransformOrigin = element.style.transformOrigin;
    
    element.style.transform = 'scale(1)';
    element.style.transformOrigin = 'top center';
    
    // Trigger print
    window.print();
    
    // Restore original zoom after print dialog
    setTimeout(() => {
      element.style.transform = originalTransform;
      element.style.transformOrigin = originalTransformOrigin;
    }, 100);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };


  return (
    <div style={styles.container}>
      {/* Zoom and Export Controls */}
      <div style={{ position: 'fixed', bottom: '80px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={handleZoomIn}
          className="flex items-center justify-center w-10 h-10 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors shadow-lg"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="flex items-center justify-center w-10 h-10 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors shadow-lg"
          title="Zoom Out"
        >
          -
        </button>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 bg-[#09302f] hover:bg-[#072625] text-white rounded-lg font-semibold text-xs transition-colors shadow-lg"
          style={{ minHeight: '44px', minWidth: '44px' }}
          title="Export to PDF using browser's print dialog"
        >
          <PrinterIcon style={{ width: '16px', height: '16px' }} />
          Export PDF
        </button>
      </div>
      
      <div style={{...styles.paper, transform: `scale(${zoom})`, transformOrigin: window.innerWidth <= 768 ? 'top left' : 'top center'}} id="printable-content" className="preview-content" data-lang={metadata.language}>
        {/* Header */}
        <div style={styles.header}>
          {metadata.schoolName || 'School Name'}
        </div>

        <div style={styles.examName}>
          {metadata.examName || 'Exam Name'}
        </div>

        {/* Metadata Table */}
        <div style={styles.metadataRow}>
          <div style={styles.metadataItem}>
            {metadata.language === 'bangla' ? 'জামাত:' : metadata.language === 'arabic' ? 'الصف:' : metadata.language === 'urdu' ? 'جماعت:' : 'Class:'} {metadata.className ? metadata.className : '------------'}
          </div>
          <div style={styles.metadataItem}>
            {metadata.language === 'bangla' ? 'বিষয়:' : metadata.language === 'arabic' ? 'المادة:' : metadata.language === 'urdu' ? 'مضمون:' : 'Subject:'} {metadata.subject ? metadata.subject : '------------'}
          </div>
          <div style={styles.metadataItem}>
            {metadata.language === 'bangla' ? 'কিতাব:' : metadata.language === 'arabic' ? 'الكتاب:' : metadata.language === 'urdu' ? 'کتاب:' : 'Book:'} {metadata.bookName ? metadata.bookName : '--------------'}
          </div>
        </div>

        <div style={styles.metadataRow}>
          <div style={styles.metadataItem}>
            {metadata.language === 'bangla' ? 'পূর্ণমানঃ' : metadata.language === 'arabic' ? 'الدرجة الكاملة:' : metadata.language === 'urdu' ? 'مکمل نمبر:' : 'Full Marks:'} {convertNumbers(metadata.fullMarks || '100', metadata.language)}
          </div>
          <div style={styles.metadataItem}>
            {metadata.handwritingMarks || getHandwritingText(metadata.language)}
          </div>
          <div style={styles.metadataItem}>
            {metadata.language === 'bangla' ? 'সময়ঃ' : metadata.language === 'arabic' ? 'الوقت:' : metadata.language === 'urdu' ? 'وقت:' : 'Time:'} {metadata.duration ? metadata.duration : (metadata.language === 'bangla' ? '৩ ঘণ্টা।' : '3 hours')}
          </div>
        </div>

        <hr style={styles.hr} />

        {/* Instructions */}
        <div style={styles.instructions}>
          ({metadata.generalInstructions || ''})
        </div>

        {/* Sections and Questions */}
        {sections.map((section, sectionIndex) => (
          <div key={section.id} className="print-avoid-break section">
            {/* Section Title */}
            {section.title && (
              <div style={styles.sectionTitle}>
                {section.title}{metadata.language === 'bangla' ? ':' : ''}
              </div>
            )}

            {/* Sub-questions */}
            {section.subQuestions.map((subQuestion, index) => (
              <div key={subQuestion.id} style={styles.subQuestion} className="sub-question">
                <div style={styles.subQuestionHeader}>
                  <div style={styles.subQuestionLabel}>
                    <div style={{ fontWeight: 'bold' }}>{subQuestion.label}</div>
                    <div style={{ fontWeight: 'bold' }}>{subQuestion.heading || 'Question heading'}</div>
                  </div>
                  <div>{(subQuestion.marks === 0 || subQuestion.marks === '') ? '' : convertNumbers(subQuestion.marks.toString(), metadata.language)}</div>
                </div>
                
                {subQuestion.content && (
                  <div 
                    style={{ 
                      ...styles.subQuestionContent,
                      paddingLeft: getDirection(metadata.language) === 'rtl' ? '0px' : '50px',
                      paddingRight: getDirection(metadata.language) === 'rtl' ? '25px' : '0px'
                    }}
                    dangerouslySetInnerHTML={{ __html: processContent(subQuestion.content) }}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
        
        {/* Footer with date */}
        <div style={styles.footer}>
          {metadata.date || new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;