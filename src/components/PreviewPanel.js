import React from 'react';
import usePaperStore from '../store/paperStore';
import { PrinterIcon, XMarkIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import PaperMetadataModal from './modals/PaperMetadataModal';

const PreviewPanel = () => {
  const { metadata, sections } = usePaperStore();
  const [showMetadataModal, setShowMetadataModal] = React.useState(false);

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
    
    let processed = htmlContent
      .replace(/<s>/g, '<span style="text-decoration: line-through;">')
      .replace(/<\/s>/g, '</span>')
      .replace(/<strike>/g, '<span style="text-decoration: line-through;">')
      .replace(/<\/strike>/g, '</span>')
      .replace(/<hr[^>]*>/g, '<hr style="border: no-border; margin: 10px 0;">');
    
    return processed;
  };

  const styles = {
    container: {
      width: '100%',
      overflow: 'auto',
      backgroundColor: '#f5f5f5',
      padding: '20px 20px 20px 5px',
      position: 'relative',
      zIndex: 9998
    },
    paper: {
      fontFamily: metadata.language === 'arabic' ? 'Scheherazade New, serif' : metadata.language === 'urdu' ? 'Noto Nastaliq Urdu, serif' : metadata.language === 'bangla' ? 'SolaimanLipi, Noto Sans Bengali, sans-serif' : 'Roboto, Arial, sans-serif',
      fontSize: '14px',
      padding: `${(metadata.margins?.top || 0.5) * 96}px ${(metadata.margins?.right || 0.5) * 96}px ${(metadata.margins?.bottom || 0.5) * 96}px ${(metadata.margins?.left || 0.5) * 96}px`,
      width: '210mm',
      minHeight: 'auto',
      boxSizing: 'border-box',
      direction: getDirection(metadata.language),
      backgroundColor: 'white',
      color: 'black',
      margin: '20px auto',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      position: 'relative',
      pageBreakAfter: 'auto',
      pageBreakInside: 'auto'
    },
    header: {
      textAlign: 'center',
      fontSize: '40px !important',
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
      textAlign: 'center',
      marginTop: '40px',
      color: '#666',
      fontSize: '10px'
    }
  };

  const [zoom, setZoom] = React.useState(window.innerWidth <= 768 ? 0.45 : 1);
  const [touchZoom, setTouchZoom] = React.useState(1);
  const [lastTouchDistance, setLastTouchDistance] = React.useState(0);

  React.useEffect(() => {
    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        const distance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        setLastTouchDistance(distance);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const distance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        
        if (lastTouchDistance > 0) {
          const scale = distance / lastTouchDistance;
          setTouchZoom(prev => Math.max(0.5, Math.min(3, prev * scale)));
        }
        setLastTouchDistance(distance);
      }
    };

    const previewContainer = document.getElementById('preview-container');
    if (previewContainer) {
      previewContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
      previewContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      if (previewContainer) {
        previewContainer.removeEventListener('touchstart', handleTouchStart);
        previewContainer.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [lastTouchDistance]);

  const handleExportPDF = () => {
    const originalTitle = document.title;
    document.title = `${metadata.examName || 'Question Paper'}`;
    
    window.print();
    
    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };


  return (
    <>
      {/* Preview Header - Completely Fixed */}
      <div className="fixed top-0 left-0 right-0 z-[10001] bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-2 sm:px-4 py-2 flex items-center justify-between">
          <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Preview</div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setShowMetadataModal(true)}
              className="p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none flex items-center justify-center"
              style={{ minWidth: '36px', minHeight: '36px' }}
              title="Edit Metadata"
            >
              <img src="/icon/title.png" alt="Edit" className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none flex items-center justify-center"
              style={{ minWidth: '36px', minHeight: '36px' }}
              title="Zoom Out"
            >
              <MagnifyingGlassMinusIcon className="w-4 h-4" />
            </button>
            <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium text-gray-700 dark:text-gray-300 min-w-[45px] text-center">
              {Math.round(zoom * 100)}%
            </div>
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none flex items-center justify-center"
              style={{ minWidth: '36px', minHeight: '36px' }}
              title="Zoom In"
            >
              <MagnifyingGlassPlusIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setZoom(window.innerWidth <= 768 ? 0.45 : 1);
                setTouchZoom(1);
              }}
              className="p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none flex items-center justify-center"
              style={{ minWidth: '36px', minHeight: '36px' }}
              title="Reset Zoom"
            >
              <span className="text-xs font-medium">1:1</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1 px-3 py-2 bg-[#09302f] hover:bg-[#072625] dark:bg-[#4ade80] dark:hover:bg-[#22c55e] text-white dark:text-gray-900 rounded-lg font-medium text-xs sm:text-sm transition-colors shadow-sm ml-2"
              style={{ minHeight: '36px' }}
              title="Export to PDF"
            >
              <PrinterIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Preview Container */}
      <div id="preview-container" style={{...styles.container, padding: '80px 20px 20px 5px', touchAction: 'pan-x pan-y pinch-zoom', position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100vw', height: '100vh', zIndex: 9999, overflow: 'auto'}}>
        <div style={{...styles.paper, transform: `scale(${zoom * touchZoom})`, transformOrigin: window.innerWidth <= 768 ? 'top left' : 'top center'}} id="printable-content" className="preview-content" data-lang={metadata.language}>
        {/* Header */}
        <div style={{...styles.header, fontSize: '40px'}} className="paper-header">
          {metadata.schoolName || 'School Name'}
        </div>
        
        {metadata.schoolAddress && (
          <div style={{...styles.examName, fontSize: '12px', marginBottom: '5px'}}>
            {metadata.schoolAddress}
          </div>
        )}

        {metadata.examName && (
          <div style={styles.examName}>
            {metadata.examName}
          </div>
        )}

        {/* Metadata Table */}
        <div style={styles.metadataRow}>
          <div style={styles.metadataItem}>
            {metadata.language === 'bangla' ? 'জামাত:' : metadata.language === 'arabic' ? 'الصف:' : metadata.language === 'urdu' ? 'جماعت:' : 'Class:'} {metadata.className ? metadata.className : '------------'}
          </div>
          <div style={styles.metadataItem}>
            {metadata.language === 'bangla' ? 'বিষয়:' : metadata.language === 'arabic' ? 'المادة:' : metadata.language === 'urdu' ? 'مضمون:' : 'Subject:'} {metadata.subject ? metadata.subject : '------------'}
          </div>
          <div style={styles.metadataItem}>
            {metadata.language === 'bangla' ? 'কিতাব:' : metadata.language === 'arabic' ? 'الكتاب:' : metadata.language === 'urdu' ? 'کتاب:' : 'Book:'} {metadata.book || metadata.bookName || '--------------'}
          </div>
        </div>

        <div style={styles.metadataRow}>
          <div style={styles.metadataItem}>
            {metadata.language === 'bangla' ? 'পূর্ণমানঃ' : metadata.language === 'arabic' ? 'الدرجة الكاملة:' : metadata.language === 'urdu' ? 'مکمل نمبر:' : 'Full Marks:'} {convertNumbers(metadata.fullMarks || '100', metadata.language)}
          </div>
          <div style={styles.metadataItem}>
            {metadata.handwriting ? `(${metadata.handwriting})` : getHandwritingText(metadata.language)}
          </div>
          <div style={styles.metadataItem}>
            {metadata.language === 'bangla' ? 'সময়ঃ' : metadata.language === 'arabic' ? 'الوقت:' : metadata.language === 'urdu' ? 'وقت:' : 'Time:'} {metadata.duration ? metadata.duration : (metadata.language === 'bangla' ? '৩ ঘণ্টা।' : '3 hours')}
          </div>
        </div>

        <hr style={styles.hr} />

        {/* Instructions */}
        <div style={styles.instructions}>
          ({metadata.instructions || metadata.generalInstructions || ''})
        </div>

        {/* Sections and Questions */}
        {sections.map((section, sectionIndex) => (
          <div key={section.id} className="print-avoid-break section">
            {/* Section Title */}
            {section.title && (
              <div style={styles.sectionTitle}>
                {section.title}
              </div>
            )}

            {/* Sub-questions */}
            {section.subQuestions.map((subQuestion, index) => (
              <div key={subQuestion.id} style={styles.subQuestion} className="sub-question">
                {subQuestion.headerFirst === false ? (
                  <>
                    {/* Body First */}
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
                    {/* Header After */}
                    {subQuestion.heading && (
                      <div style={styles.subQuestionHeader}>
                        <div style={styles.subQuestionLabel}>
                          {subQuestion.label && (
                            <div style={{ fontWeight: 'bold' }}>{subQuestion.label}</div>
                          )}
                          <div style={{ fontWeight: 'bold' }}>{subQuestion.heading}</div>
                        </div>
                        <div>{(subQuestion.marks === 0 || subQuestion.marks === '') ? '' : convertNumbers(subQuestion.marks.toString(), metadata.language)}</div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Header First */}
                    {subQuestion.heading && (
                      <div style={styles.subQuestionHeader}>
                        <div style={styles.subQuestionLabel}>
                          {subQuestion.label && (
                            <div style={{ fontWeight: 'bold' }}>{subQuestion.label}</div>
                          )}
                          <div style={{ fontWeight: 'bold' }}>{subQuestion.heading}</div>
                        </div>
                        <div>{(subQuestion.marks === 0 || subQuestion.marks === '') ? '' : convertNumbers(subQuestion.marks.toString(), metadata.language)}</div>
                      </div>
                    )}
                    {/* Body After */}
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
                  </>
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
      
      {showMetadataModal && (
        <PaperMetadataModal
          isOpen={showMetadataModal}
          onClose={() => setShowMetadataModal(false)}
          onCreatePaper={(newMetadata) => {
            const { setMetadata } = usePaperStore.getState();
            setMetadata(newMetadata);
            setShowMetadataModal(false);
          }}
          initialData={metadata}
        />
      )}
    </>
  );
};

export default PreviewPanel;