import React from 'react';
import usePaperStore from '../store/paperStore';

const PreviewPanel = () => {
  const { metadata, sections } = usePaperStore();

  const getFontFamily = (language) => {
    switch (language) {
      case 'arabic': return 'Amiri, serif';
      case 'bangla': return 'SolaimanLipi, sans-serif';
      case 'urdu': return 'Jameel Noori Nastaleeq, serif';
      default: return 'Roboto, sans-serif';
    }
  };

  const getDirection = (language) => {
    return ['arabic', 'urdu'].includes(language) ? 'rtl' : 'ltr';
  };

  const processContent = (htmlContent) => {
    if (!htmlContent) return '';
    
    // Batch all replacements for better performance
    const replacements = [
      [/<ol[^>]*>/g, '<div class="ordered-list">'],
      [/<\/ol>/g, '</div>'],
      [/<li[^>]*>/g, '<div class="list-item">'],
      [/<\/li>/g, '</div>'],
      [/<ul[^>]*>/g, '<div class="unordered-list">'],
      [/<\/ul>/g, '</div>'],
      [/<hr[^>]*>/g, '<hr style="border: 1px solid #000; margin: 10px 0;">'],
      [/<s>/g, '<span style="text-decoration: line-through;">'],
      [/<\/s>/g, '</span>'],
      [/<strike>/g, '<span style="text-decoration: line-through;">'],
      [/<\/strike>/g, '</span>']
    ];
    
    return replacements.reduce((content, [pattern, replacement]) => 
      content.replace(pattern, replacement), htmlContent
    );
  };

  const styles = {
    container: {
      width: '100%',
      overflow: 'auto',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    },
    paper: {
      fontFamily: getFontFamily(metadata.language),
      fontSize: '12px',
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
      margin: '10px 0',
      border: '1px solid #000'
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

  return (
    <div style={styles.container}>
      <div style={styles.paper}>
        <style>{`
          * {
            list-style: none !important;
          }
          ::marker {
            display: none !important;
            content: none !important;
          }
          ol, ul {
            list-style: none !important;
            list-style-type: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          li {
            list-style: none !important;
            list-style-type: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          ol::before, ul::before, li::before {
            display: none !important;
          }
          .ordered-list .list-item {
            counter-increment: list-counter;
            margin-bottom: 5px;
            position: relative;
            padding-left: ${getDirection(metadata.language) === 'rtl' ? '0' : '16px'};
            padding-right: ${getDirection(metadata.language) === 'rtl' ? '16px' : '0'};
          }
          .ordered-list .list-item:before {
            content: counter(list-counter) ". ";
            position: absolute;
            ${getDirection(metadata.language) === 'rtl' ? 'right: 0;' : 'left: 0;'}
            top: 0;
          }
          .ordered-list {
            counter-reset: list-counter;
          }
          .unordered-list .list-item {
            margin-bottom: 5px;
            position: relative;
            padding-left: ${getDirection(metadata.language) === 'rtl' ? '0' : '16px'};
            padding-right: ${getDirection(metadata.language) === 'rtl' ? '16px' : '0'};
          }
          .unordered-list .list-item:before {
            content: "• ";
            position: absolute;
            ${getDirection(metadata.language) === 'rtl' ? 'right: 0;' : 'left: 0;'}
            top: 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
          }
          table, th, td {
            border: none;
          }
          th, td {
            padding: 8px;
            text-align: ${getDirection(metadata.language) === 'rtl' ? 'right' : 'left'};
          }
          th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          hr {
            border: 1px solid #000;
            margin: 10px 0;
          }
          strong, b {
            font-weight: bold;
          }
          em, i {
            font-style: italic;
          }
          u {
            text-decoration: underline;
          }
          .text-left {
            text-align: left;
          }
          .text-center {
            text-align: center;
          }
          .text-right {
            text-align: right;
          }
          @media print {
            .preview-container {
              padding: 0;
              background: white;
            }
            .preview-paper {
              box-shadow: none;
              margin: 0;
              width: 210mm;
              font-size: 12px;
              padding: 40px;
            }
          }

        `}</style>
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
            {metadata.language === 'bangla' ? 'কিতাব:' : metadata.language === 'arabic' ? 'الكتاب:' : 'Book:'} {metadata.bookName || ''}{metadata.bookName && metadata.language === 'bangla' ? '।' : ''}
          </div>
          <div style={styles.metadataItem}>
            {metadata.language === 'bangla' ? 'বিষয়:' : metadata.language === 'arabic' ? 'المادة:' : 'Subject:'} {metadata.subject || ''}
          </div>
          <div style={styles.metadataItem}>
            {metadata.language === 'bangla' ? 'জামাআত:' : metadata.language === 'arabic' ? 'الصف:' : 'Class:'} {metadata.className || ''}{metadata.className && metadata.language === 'bangla' ? '।' : ''}
          </div>
        </div>

        <div style={styles.metadataRow}>
          <div style={styles.metadataItem}>
            {metadata.language === 'bangla' ? 'সময়ঃ' : metadata.language === 'arabic' ? 'الوقت:' : 'Time:'} {metadata.duration || ''}{metadata.duration && metadata.language === 'bangla' ? '।' : ''}
          </div>
          <div style={styles.metadataItem}>
            {metadata.handwritingMarks || ''}
          </div>
          <div style={styles.metadataItem}>
            {metadata.language === 'bangla' ? 'পূর্ণমানঃ' : metadata.language === 'arabic' ? 'الدرجة الكاملة:' : 'Full Marks:'} {metadata.fullMarks || ''}
          </div>
        </div>

        <hr style={styles.hr} />

        {/* Instructions */}
        <div style={styles.instructions}>
          ({metadata.generalInstructions || ''})
        </div>

        {/* Sections and Questions */}
        {sections.map((section, sectionIndex) => (
          <div key={section.id}>
            {/* Section Title */}
            {section.title && (
              <div style={styles.sectionTitle}>
                {section.title}{metadata.language === 'bangla' ? ':' : ''}
              </div>
            )}

            {/* Sub-questions */}
            {section.subQuestions.map((subQuestion, index) => (
              <div key={subQuestion.id} style={styles.subQuestion}>
                <div style={styles.subQuestionHeader}>
                  <div style={styles.subQuestionLabel}>
                    <div style={{ fontWeight: 'bold' }}>{subQuestion.label}</div>
                    <div style={{ fontWeight: 'bold' }}>{subQuestion.heading || 'Question heading'}</div>
                  </div>
                  <div>{subQuestion.marks || '0'}</div>
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